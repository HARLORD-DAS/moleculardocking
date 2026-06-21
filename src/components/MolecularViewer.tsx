import React, { useRef, useEffect, useState, useMemo } from 'react';
import { RotateCw, ZoomIn, ZoomOut } from 'lucide-react';
import { Atom3D, Bond3D } from '../utils/chemistry';

interface MolecularViewerProps {
  proteinAtoms: Atom3D[];
  proteinBonds: Bond3D[];
  ligandAtoms: Atom3D[];
  ligandBonds: Bond3D[];
  selectedResidue: string | null;
  onSelectResidue: (res: string | null) => void;
  heatmapMode: boolean;
  viewMode: 'cartoon' | 'ball-stick' | 'surface' | 'ribbon' | 'stick' | 'space-filling';
  showPocket: boolean;
  splitScreen: boolean; // Side-by-Side synchronized view
}

export const MolecularViewer: React.FC<MolecularViewerProps> = ({
  proteinAtoms,
  proteinBonds,
  ligandAtoms,
  ligandBonds,
  selectedResidue,
  onSelectResidue,
  heatmapMode,
  viewMode,
  showPocket,
  splitScreen
}) => {
  const leftCanvasRef = useRef<HTMLCanvasElement>(null);
  const rightCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Synchronized view state in refs to prevent React rendering overhead
  const zoomRef = useRef<number>(35);
  const rotationRef = useRef<{ x: number; y: number }>({ x: 0.3, y: 0.5 });
  const panRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const isDraggingRef = useRef<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragModeRef = useRef<'rotate' | 'pan'>('rotate');
  
  // React state for UI rendering only
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const autoRotateRef = useRef<boolean>(true);
  
  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  const [hoveredResidue, setHoveredResidue] = useState<string | null>(null);

  // Performance Constraint Check
  const isLargeProtein = proteinAtoms.length > 2500;

  // 1. Level of Detail (LOD) filter & index mapping for large protein files
  const { filteredProteinAtoms, filteredProteinBonds, originalToFilteredMap } = useMemo(() => {
    if (!isLargeProtein) {
      // Create identity mapping
      const identityMap: { [key: number]: number } = {};
      proteinAtoms.forEach((_, idx) => {
        identityMap[idx] = idx;
      });
      return { 
        filteredProteinAtoms: proteinAtoms, 
        filteredProteinBonds: proteinBonds, 
        originalToFilteredMap: identityMap 
      };
    }

    // Identify residues close to the ligand (within 10.0 Å)
    const closeResidues = new Set<string>();
    if (ligandAtoms.length > 0) {
      proteinAtoms.forEach(p => {
        if (!p.residueName || !p.residueNumber) return;
        const resKey = `${p.residueName}${p.residueNumber}`;
        const isClose = ligandAtoms.some(l => {
          const dx = p.x - l.x;
          const dy = p.y - l.y;
          const dz = p.z - l.z;
          return (dx*dx + dy*dy + dz*dz) <= 100.0; // 10 Å squared
        });
        if (isClose) {
          closeResidues.add(resKey);
        }
      });
    }

    const filteredAtoms: Atom3D[] = [];
    const indexMap: { [key: number]: number } = {};

    proteinAtoms.forEach((p, origIdx) => {
      const isCA = p.atomName === 'CA';
      const resKey = `${p.residueName}${p.residueNumber}`;
      const isSelected = selectedResidue === resKey;
      const isClose = closeResidues.has(resKey);

      // Keep atom if it is a backbone CA, selected residue, or close to the binding pocket
      if (isCA || isSelected || isClose) {
        filteredAtoms.push(p);
        indexMap[origIdx] = filteredAtoms.length - 1;
      }
    });

    const filteredBonds: Bond3D[] = [];
    proteinBonds.forEach(b => {
      const newFrom = indexMap[b.from];
      const newTo = indexMap[b.to];
      if (newFrom !== undefined && newTo !== undefined) {
        filteredBonds.push({
          ...b,
          from: newFrom,
          to: newTo
        });
      }
    });

    return { 
      filteredProteinAtoms: filteredAtoms, 
      filteredProteinBonds: filteredBonds, 
      originalToFilteredMap: indexMap 
    };
  }, [proteinAtoms, proteinBonds, ligandAtoms, selectedResidue, isLargeProtein]);

  // 2. Pre-calculate pocket hydrogen bonds once on upload (speeds up animation loop by O(N*M))
  const hbLinks = useMemo<Bond3D[]>(() => {
    const links: Bond3D[] = [];
    if (proteinAtoms.length > 0 && ligandAtoms.length > 0) {
      ligandAtoms.forEach((l, lIdx) => {
        proteinAtoms.forEach((p, pIdx) => {
          const dx = l.x - p.x;
          const dy = l.y - p.y;
          const dz = l.z - p.z;
          const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
          if (dist <= 3.2 && ['N','O'].includes(l.element) && ['N','O'].includes(p.element)) {
            links.push({
              from: pIdx,
              to: lIdx + proteinAtoms.length,
              isLigand: false,
              type: 'hydrogen'
            });
          }
        });
      });
    }
    return links;
  }, [proteinAtoms, ligandAtoms]);

  // Map hydrogen bonds to the filtered protein indices
  const filteredHbLinks = useMemo<Bond3D[]>(() => {
    const links: Bond3D[] = [];
    hbLinks.forEach(b => {
      const origPIdx = b.from;
      const origLIdx = b.to - proteinAtoms.length;
      const newPIdx = originalToFilteredMap[origPIdx];
      
      if (newPIdx !== undefined) {
        links.push({
          ...b,
          from: newPIdx,
          to: origLIdx + filteredProteinAtoms.length
        });
      }
    });
    return links;
  }, [hbLinks, filteredProteinAtoms.length, proteinAtoms.length, originalToFilteredMap]);

  // 3D Projection math using refs
  const project = (atom: Atom3D, width: number, height: number, rot: { x: number; y: number }, zm: number, pn: { x: number; y: number }) => {
    const cx = Math.cos(rot.x);
    const sx = Math.sin(rot.x);
    const cy = Math.cos(rot.y);
    const sy = Math.sin(rot.y);

    let x1 = atom.x * cy - atom.z * sy;
    let z1 = atom.x * sy + atom.z * cy;

    let y2 = atom.y * cx - z1 * sx;
    let z2 = atom.y * sx + z1 * cx;

    const d = 50; 
    const fov = d / (d + z2);

    const screenX = width / 2 + (x1 * zm * fov) + pn.x;
    const screenY = height / 2 - (y2 * zm * fov) + pn.y;

    return {
      x: screenX,
      y: screenY,
      zDepth: z2,
      fov,
      raw: atom
    };
  };

  // Drag interaction handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    setAutoRotate(false);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    if (e.button === 2 || e.ctrlKey) {
      dragModeRef.current = 'pan';
    } else {
      dragModeRef.current = 'rotate';
    }
  };

  const handleMouseMove = (e: React.MouseEvent, canvasType: 'protein' | 'ligand') => {
    if (!isDraggingRef.current) {
      detectHover(e, canvasType);
      return;
    }

    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;

    if (dragModeRef.current === 'rotate') {
      rotationRef.current = {
        x: rotationRef.current.x - dy * 0.007,
        y: rotationRef.current.y + dx * 0.007
      };
    } else {
      panRef.current = {
        x: panRef.current.x + dx * 0.5,
        y: panRef.current.y + dy * 0.5
      };
    }
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    zoomRef.current = Math.max(10, Math.min(100, zoomRef.current - e.deltaY * 0.03));
  };

  const detectHover = (e: React.MouseEvent, canvasType: 'protein' | 'ligand') => {
    const canvas = canvasType === 'protein' ? leftCanvasRef.current : (rightCanvasRef.current || leftCanvasRef.current);
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const targetAtoms = splitScreen 
      ? (canvasType === 'protein' ? filteredProteinAtoms : ligandAtoms) 
      : [...filteredProteinAtoms, ...ligandAtoms];

    const projected = targetAtoms.map(atom => project(atom, canvas.width, canvas.height, rotationRef.current, zoomRef.current, panRef.current));
    let closestAtom: any = null;
    let minDistance = 15;

    projected.forEach(p => {
      const dist = Math.sqrt((p.x - mouseX) ** 2 + (p.y - mouseY) ** 2);
      if (dist < minDistance) {
        minDistance = dist;
        closestAtom = p.raw;
      }
    });

    if (closestAtom && !closestAtom.isLigand && closestAtom.residueName) {
      setHoveredResidue(`${closestAtom.residueName}${closestAtom.residueNumber}`);
    } else {
      setHoveredResidue(null);
    }
  };

  const handleCanvasClick = (canvasType: 'protein' | 'ligand') => {
    if (hoveredResidue) {
      onSelectResidue(selectedResidue === hoveredResidue ? null : hoveredResidue);
    }
  };

  const getAtomColor = (atom: Atom3D) => {
    if (heatmapMode && atom.heatmapValue) {
      if (atom.heatmapValue === 'green') return '#10b981'; // Good binding
      if (atom.heatmapValue === 'red') return '#ef4444'; // Clash
      return '#eab308'; // Moderate contact
    }

    if (atom.isLigand) {
      switch (atom.element) {
        case 'N': return '#3b82f6'; // Blue nitrogen
        case 'O': return '#f87171'; // Red oxygen
        case 'S': return '#fbbf24'; // Yellow sulfur
        case 'F': return '#34d399'; // Mint fluorine
        case 'Cl': return '#10b981'; // Green chlorine
        default: return '#cbd5e1'; // Grey carbon
      }
    } else {
      const isSelected = selectedResidue === `${atom.residueName}${atom.residueNumber}`;
      if (isSelected) return '#f43f5e'; // Selected pink highlight
      return '#334155'; // Dark slate backbone
    }
  };

  // Rendering Loop
  useEffect(() => {
    let animationId: number;

    const renderCanvas = (
      canvas: HTMLCanvasElement, 
      atomsToDraw: Atom3D[], 
      bondsToDraw: Bond3D[], 
      drawPocketOverlay: boolean,
      drawBridges: boolean
    ) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Project all coordinates using active ref camera state
      const projected = atomsToDraw.map((atom, idx) => ({
        ...project(atom, width, height, rotationRef.current, zoomRef.current, panRef.current),
        originalIndex: idx
      }));

      // Sort by depth (Painter's algorithm)
      projected.sort((a, b) => b.zDepth - a.zDepth);

      const sortedIndexMap: { [key: number]: typeof projected[0] } = {};
      projected.forEach(p => {
        sortedIndexMap[p.originalIndex] = p;
      });

      // 1. Draw pocket outline mesh
      if (drawPocketOverlay && showPocket && atomsToDraw.length > 5) {
        const receptorAtoms = projected.filter(p => !p.raw.isLigand);
        ctx.fillStyle = 'rgba(34, 211, 238, 0.012)';
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.04)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        receptorAtoms.forEach((p, idx) => {
          if (idx === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        receptorAtoms.forEach(p => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.fov * zoomRef.current * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(34, 211, 238, 0.015)';
          ctx.fill();
        });
      }

      // 2. Draw Bonds
      bondsToDraw.forEach(bond => {
        const fromAtom = sortedIndexMap[bond.from];
        const toAtom = sortedIndexMap[bond.to];
        if (!fromAtom || !toAtom) return;

        if (bond.type === 'hydrogen') {
          if (!drawBridges) return;
          ctx.strokeStyle = '#22d3ee';
          ctx.lineWidth = 1.8;
          ctx.setLineDash([3, 3]);
        } else if (bond.isLigand) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.lineWidth = 3.5;
          ctx.setLineDash([]);
        } else {
          if (viewMode === 'cartoon' || viewMode === 'ribbon') {
            ctx.strokeStyle = 'rgba(100, 116, 139, 0.08)';
            ctx.lineWidth = 1;
          } else {
            ctx.strokeStyle = 'rgba(100, 116, 139, 0.3)';
            ctx.lineWidth = 1.8;
          }
          ctx.setLineDash([]);
        }

        ctx.beginPath();
        ctx.moveTo(fromAtom.x, fromAtom.y);
        ctx.lineTo(toAtom.x, toAtom.y);
        ctx.stroke();
      });
      ctx.setLineDash([]);

      // 3. Draw Ribbon backbone (Cartoon/Ribbon)
      if (viewMode === 'cartoon' || viewMode === 'ribbon') {
        const proteinBackbone = projected.filter(p => !p.raw.isLigand && p.raw.atomName === 'CA');
        if (proteinBackbone.length > 2) {
          const chain = [...proteinBackbone].sort((a, b) => 
            (a.raw.residueNumber || 0) - (b.raw.residueNumber || 0)
          );
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(99, 102, 241, 0.6)';
          ctx.lineWidth = 6;
          ctx.moveTo(chain[0].x, chain[0].y);
          for (let i = 1; i < chain.length; i++) {
            ctx.lineTo(chain[i].x, chain[i].y);
          }
          ctx.stroke();
        }
      }

      // 4. Draw Atoms
      projected.forEach(p => {
        // LOD Check: If cartoon/ribbon mode and it's a protein atom, hide it unless selected or hovered
        if ((viewMode === 'cartoon' || viewMode === 'ribbon') && !p.raw.isLigand) {
          const isSelected = selectedResidue === `${p.raw.residueName}${p.raw.residueNumber}`;
          const isHovered = hoveredResidue === `${p.raw.residueName}${p.raw.residueNumber}`;
          if (!isSelected && !isHovered) {
            return; // Skip rendering
          }
        }

        const isSelected = !p.raw.isLigand && selectedResidue === `${p.raw.residueName}${p.raw.residueNumber}`;
        const radiusFactor = (viewMode === 'surface' || viewMode === 'space-filling') ? 2.5 : 1.0;
        let size = (p.raw.isLigand ? 5.5 : 3.5) * p.fov * (zoomRef.current / 30) * radiusFactor;
        
        if (isSelected) size *= 1.4;

        const isHovered = hoveredResidue === `${p.raw.residueName}${p.raw.residueNumber}`;
        if (isSelected || isHovered) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, size + 4, 0, Math.PI * 2);
          ctx.fillStyle = isSelected ? 'rgba(244, 63, 94, 0.22)' : 'rgba(34, 211, 238, 0.22)';
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = getAtomColor(p.raw);
        ctx.fill();

        // High-Performance semi-transparent 3D lighting dot (replaces slow createRadialGradient)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.beginPath();
        ctx.arc(p.x - size / 3, p.y - size / 3, size / 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = p.raw.isLigand ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.2)';
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Render hover residue name
        if (isHovered && !p.raw.isLigand && p.raw.residueName) {
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 9px sans-serif';
          ctx.fillText(`${p.raw.residueName}${p.raw.residueNumber}`, p.x + size + 4, p.y - 2);
        }
      });
    };

    const runRender = () => {
      // Rotate camera coordinates slowly if Auto-Rotate is active
      if (autoRotateRef.current && !isDraggingRef.current) {
        rotationRef.current = {
          x: rotationRef.current.x,
          y: rotationRef.current.y + 0.0012
        };
      }

      if (splitScreen) {
        // Draw Protein (left canvas)
        if (leftCanvasRef.current) {
          renderCanvas(leftCanvasRef.current, filteredProteinAtoms, filteredProteinBonds, true, false);
        }
        // Draw Ligand (right canvas)
        if (rightCanvasRef.current) {
          renderCanvas(rightCanvasRef.current, ligandAtoms, ligandBonds, false, false);
        }
      } else {
        // Unified molecular complex view
        if (leftCanvasRef.current) {
          const complexAtoms = [...filteredProteinAtoms, ...ligandAtoms];
          const shiftedLigandBonds = ligandBonds.map(b => ({
            ...b,
            from: b.from + filteredProteinAtoms.length,
            to: b.to + filteredProteinAtoms.length
          }));

          renderCanvas(
            leftCanvasRef.current, 
            complexAtoms, 
            [...filteredProteinBonds, ...shiftedLigandBonds, ...filteredHbLinks], 
            true, 
            true
          );
        }
      }

      animationId = requestAnimationFrame(runRender);
    };

    runRender();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [
    filteredProteinAtoms, filteredProteinBonds, ligandAtoms, ligandBonds, filteredHbLinks,
    selectedResidue, heatmapMode, viewMode, showPocket, splitScreen, hoveredResidue
  ]);

  // Sync canvas dimensions
  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current;
      if (!container) return;

      if (leftCanvasRef.current) {
        leftCanvasRef.current.width = leftCanvasRef.current.parentElement?.clientWidth || 300;
        leftCanvasRef.current.height = leftCanvasRef.current.parentElement?.clientHeight || 450;
      }
      if (rightCanvasRef.current) {
        rightCanvasRef.current.width = rightCanvasRef.current.parentElement?.clientWidth || 300;
        rightCanvasRef.current.height = rightCanvasRef.current.parentElement?.clientHeight || 450;
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [splitScreen]);

  return (
    <div ref={containerRef} className="w-full flex flex-col gap-4">
      
      {/* 3D Viewer Container */}
      <div className={`grid ${splitScreen ? 'grid-cols-2 gap-4' : 'grid-cols-1'} h-[460px] bg-slate-950/80 rounded-2xl border border-slate-800/80 overflow-hidden relative`}>
        
        {/* Left / Main Canvas */}
        <div className="relative w-full h-full">
          {splitScreen && (
            <div className="absolute top-3 left-3 z-25 bg-slate-900/90 border border-slate-800/80 px-2.5 py-1 rounded-lg text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
              Protein Structure
            </div>
          )}
          <canvas
            ref={leftCanvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={(e) => handleMouseMove(e, 'protein')}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            onClick={() => handleCanvasClick('protein')}
            onContextMenu={(e) => e.preventDefault()}
            className="w-full h-full cursor-grab active:cursor-grabbing"
          />
        </div>

        {/* Right Canvas (Split View) */}
        {splitScreen && (
          <div className="relative w-full h-full border-l border-slate-900 bg-slate-950/20">
            <div className="absolute top-3 left-3 z-25 bg-slate-900/90 border border-slate-800/80 px-2.5 py-1 rounded-lg text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
              Ligand Structure
            </div>
            <canvas
              ref={rightCanvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={(e) => handleMouseMove(e, 'ligand')}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
              onClick={() => handleCanvasClick('ligand')}
              onContextMenu={(e) => e.preventDefault()}
              className="w-full h-full cursor-grab active:cursor-grabbing"
            />
          </div>
        )}

        {/* HUD Selected Residue Overlay */}
        {selectedResidue && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 bg-rose-500/20 border border-rose-500/40 px-3.5 py-1.5 rounded-xl flex items-center justify-between text-xs text-rose-200 gap-3 backdrop-blur-md">
            <span>Selected Active Site Node: <strong>{selectedResidue}</strong></span>
            <button 
              onClick={() => onSelectResidue(null)}
              className="hover:text-white underline text-rose-300 font-bold"
            >
              Clear
            </button>
          </div>
        )}

        {/* HUD Navigation Controls */}
        <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-2 py-1.5 rounded-xl shadow-xl">
          <button 
            onClick={() => { zoomRef.current = Math.min(100, zoomRef.current + 5); }}
            className="p-1.5 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => { zoomRef.current = Math.max(10, zoomRef.current - 5); }}
            className="p-1.5 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => {
              rotationRef.current = { x: 0.3, y: 0.5 };
              panRef.current = { x: 0, y: 0 };
              zoomRef.current = 35;
            }}
            className="px-2 py-1 text-[10px] hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors font-bold uppercase"
          >
            Reset
          </button>
        </div>

        {/* HUD Auto-Rotate Toggle */}
        <div className="absolute bottom-3 right-3 z-20 flex items-center gap-2">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-lg border transition-all ${
              autoRotate 
                ? 'bg-cyan-500/20 border-cyan-400/40 text-cyan-400' 
                : 'bg-slate-900 border-slate-700 text-slate-400'
            }`}
          >
            Auto-Rotate: {autoRotate ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>
    </div>
  );
};
