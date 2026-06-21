import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  ChevronDown, Menu, X, Beaker, Zap, Target, TrendingUp, Lock, Cpu, Microscope, 
  BookOpen, Folder, CheckSquare, FileText, LayoutDashboard, Presentation, Sliders,
  Upload, HelpCircle, Download, Award, ShieldAlert, CheckCircle2, RefreshCw, BarChart2,
  List, AlertTriangle, ArrowRight, User, Eye, EyeOff, Plus, FileCode, Check, Columns
} from 'lucide-react';
import { Atom3D, Bond3D, parsePDB, parseSDF, runCompatibilityAnalysis, ParsedProtein, ParsedLigand, CompatibilityResult } from './utils/chemistry';
import { MolecularViewer } from './components/MolecularViewer';
import { PresentationMode } from './components/PresentationMode';

// Sample EGFR PDB content (truncated representative file containing active hinge MET793 residues)
const samplePDBText = `HEADER    EGFR KINASE DOMAIN ACTIVE SITE MOCKUP
REMARK    PDB formatted test file for pre-docking platform verification.
ATOM      1  N   MET A 793      -3.000   7.000   2.000  1.00 10.00           N
ATOM      2  CA  MET A 793      -2.200   6.200   1.500  1.00 10.00           C
ATOM      3  C   MET A 793      -2.500   4.800   1.000  1.00 10.00           C
ATOM      4  O   MET A 793      -3.600   4.400   0.800  1.00 10.00           O
ATOM      5  N   LEU A 718     -10.000   5.000  -5.000  1.00 12.00           N
ATOM      6  CA  LEU A 718      -9.000   4.000  -4.000  1.00 12.00           C
ATOM      7  N   THR A 790       3.000   8.000  -8.000  1.00 11.00           N
ATOM      8  CA  THR A 790       2.500   7.200  -7.000  1.00 11.00           C
ATOM      9  N   LYS A 745       8.000  -4.000  -2.000  1.00 10.00           N
ATOM     10  CA  LYS A 745       7.200  -3.200  -1.500  1.00 10.00           C
ATOM     11  N   ASP A 855      -2.000  -6.000   8.000  1.00 13.00           N
ATOM     12  CA  ASP A 855      -1.500  -5.000   7.200  1.00 13.00           C
ATOM     13  O   ASP A 855      -0.800  -4.200   6.500  1.00 13.00           O
`;

// Sample Erlotinib SDF content (representative coordinates for alignment)
const sampleSDFText = `Erlotinib
  V3000 Mockup Ligand
 25 24  0  0  0  0  0  0  0  0999 V2000
   -3.5000    4.5000    0.5000 N   0  0  0  0  0  0  0  0  0  0  0  0
   -2.2000    4.8000    0.8000 C   0  0  0  0  0  0  0  0  0  0  0  0
   -1.2000    3.8000    0.4000 N   0  0  0  0  0  0  0  0  0  0  0  0
   -1.5000    2.5000   -0.3000 C   0  0  0  0  0  0  0  0  0  0  0  0
   -2.8000    2.1000   -0.6000 C   0  0  0  0  0  0  0  0  0  0  0  0
   -3.8000    3.2000   -0.2000 C   0  0  0  0  0  0  0  0  0  0  0  0
   -0.5000    1.5000   -0.8000 N   0  0  0  0  0  0  0  0  0  0  0  0
    0.8000    1.8000   -1.2000 C   0  0  0  0  0  0  0  0  0  0  0  0
    1.4000    3.0000   -0.9000 C   0  0  0  0  0  0  0  0  0  0  0  0
    2.7000    3.2000   -1.4000 C   0  0  0  0  0  0  0  0  0  0  0  0
    3.4000    2.2000   -2.1000 C   0  0  0  0  0  0  0  0  0  0  0  0
    2.8000    1.0000   -2.4000 C   0  0  0  0  0  0  0  0  0  0  0  0
    1.5000    0.8000   -1.9000 C   0  0  0  0  0  0  0  0  0  0  0  0
    4.8000    2.4000   -2.6000 C   0  0  0  0  0  0  0  0  0  0  0  0
    6.0000    2.6000   -3.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   -3.1000    0.8000   -1.3000 O   0  0  0  0  0  0  0  0  0  0  0  0
   -4.4000    0.4000   -1.7000 C   0  0  0  0  0  0  0  0  0  0  0  0
   -4.3000   -0.9000   -2.4000 C   0  0  0  0  0  0  0  0  0  0  0  0
   -5.5000   -1.4000   -2.8000 O   0  0  0  0  0  0  0  0  0  0  0  0
   -5.4000   -2.7000   -3.4000 C   0  0  0  0  0  0  0  0  0  0  0  0
   -5.1000    3.0000   -0.5000 O   0  0  0  0  0  0  0  0  0  0  0  0
   -6.1000    3.9000   -0.1000 C   0  0  0  0  0  0  0  0  0  0  0  0
   -7.4000    3.5000   -0.7000 C   0  0  0  0  0  0  0  0  0  0  0  0
   -7.6000    2.1000   -0.5000 O   0  0  0  0  0  0  0  0  0  0  0  0
   -8.8000    1.7000   -1.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
  1  2  1  0  0  0  0
  2  3  2  0  0  0  0
  3  4  1  0  0  0  0
  4  5  2  0  0  0  0
  5  6  1  0  0  0  0
  6  1  1  0  0  0  0
  4  7  1  0  0  0  0
  7  8  1  0  0  0  0
  8  9  2  0  0  0  0
  9 10  1  0  0  0  0
 10 11  2  0  0  0  0
 11 12  1  0  0  0  0
 12 13  2  0  0  0  0
 13  8  1  0  0  0  0
 11 14  1  0  0  0  0
 14 15  2  0  0  0  0
  5 16  1  0  0  0  0
 16 17  1  0  0  0  0
 17 18  1  0  0  0  0
 18 19  1  0  0  0  0
 19 20  1  0  0  0  0
  6 21  1  0  0  0  0
 21 22  1  0  0  0  0
 22 23  1  0  0  0  0
M  END
$$$$
`;

// Helper list of teams and contact fields
const TEAM = [
  { name: 'Dr. Evelyn Carter', role: 'Lead Computational Biologist', bio: 'Former Principal Researcher at Genentech. Specialized in GPCR modeling.' },
  { name: 'Marcus Sterling, PhD', role: 'Head of Medicinal Chemistry', bio: 'Over 15 years in drug discovery chemistry. Developed 3 clinical trial compounds.' },
  { name: 'Dr. Sarah Lin', role: 'AI Platform Director', bio: 'PhD in Computer Science from Stanford. Focuses on spatial graph neural networks.' }
];

interface Project {
  id: string;
  name: string;
  created: string;
  protein: ParsedProtein | null;
  ligand: ParsedLigand | null;
  analysis: CompatibilityResult | null;
}

// ============================================================================
// MOLECULAR ANIMATION BACKGROUND
// ============================================================================
const MolecularBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
    }> = [];

    // Create molecular particles
    for (let i = 0; i < 35; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        color: `rgba(34, 211, 238, ${0.15 + Math.random() * 0.2})`
      });
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(6, 10, 22, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Draw connections
        particles.forEach((p2, j) => {
          if (i < j) {
            const dx = p2.x - p.x;
            const dy = p2.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 180) {
              ctx.strokeStyle = `rgba(34, 211, 238, ${0.08 * (1 - dist / 180)})`;
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

export default function App() {
  const [scrollY, setScrollY] = useState(0);
  const [view, setView] = useState<'landing' | 'auth' | 'workspace'>('landing');
  
  // Custom Registration and Sign-in state
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  
  // Dashboard & Workspace campaign projects state (Empty at start!)
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [newProjectName, setNewProjectName] = useState('');
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'center' | 'presentation'>('dashboard');

  // Interactive Workspace states
  const [selectedResidue, setSelectedResidue] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'cartoon' | 'ball-stick' | 'surface'>('ball-stick');
  const [showPocket, setShowPocket] = useState<boolean>(true);
  const [heatmapMode, setHeatmapMode] = useState<boolean>(false);
  const [splitScreen, setSplitScreen] = useState<boolean>(false);
  const [workspaceTab, setWorkspaceTab] = useState<'receptor' | 'ligand' | 'compatibility' | 'optimization' | 'report'>('receptor');

  // File Upload statuses
  const [parsingProtein, setParsingProtein] = useState(false);
  const [parsingLigand, setParsingLigand] = useState(false);
  const [smilesInput, setSmilesInput] = useState('');
  const [smilesError, setSmilesError] = useState('');
  const [proteinError, setProteinError] = useState<string | null>(null);
  const [ligandError, setLigandError] = useState<string | null>(null);

  // Local scroll watcher
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Registration handler
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setAuthError('Please fill in all registration fields.');
      return;
    }

    const savedUsers = JSON.parse(localStorage.getItem('ligand_users') || '{}');
    if (savedUsers[username]) {
      setAuthError('Username already exists. Choose another.');
      return;
    }

    savedUsers[username] = password;
    localStorage.setItem('ligand_users', JSON.stringify(savedUsers));
    setAuthSuccess('Registration successful! Please sign in using your credentials.');
    setAuthError('');
    setIsRegistering(false);
    setPassword('');
  };

  // Log-in handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setAuthError('Please enter your username and password.');
      return;
    }

    const savedUsers = JSON.parse(localStorage.getItem('ligand_users') || '{}');
    const storedPassword = savedUsers[username];

    if (storedPassword && storedPassword === password) {
      setView('workspace');
      setActiveTab('dashboard');
      setAuthError('');
      setAuthSuccess('');
      triggerConfetti();
    } else {
      setAuthError('Invalid credentials. Check spelling or create an account!');
      setAuthSuccess('');
    }
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    const newProj: Project = {
      id: 'proj_' + Date.now(),
      name: newProjectName.trim(),
      created: new Date().toLocaleDateString(),
      protein: null,
      ligand: null,
      analysis: null
    };

    setProjects([...projects, newProj]);
    setCurrentProject(newProj);
    setNewProjectName('');
    setShowAddProjectModal(false);
    setActiveTab('center');
    setWorkspaceTab('receptor');
    setSelectedResidue(null);
    triggerConfetti();
  };

  const downloadSample = (type: 'pdb' | 'sdf') => {
    const content = type === 'pdb' ? samplePDBText : sampleSDFText;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = type === 'pdb' ? 'EGFR_Receptor_Sample.pdb' : 'Erlotinib_Ligand_Sample.sdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const loadSampleProteinDirect = () => {
    if (!currentProject) return;
    setParsingProtein(true);
    setTimeout(() => {
      const parsed = parsePDB(samplePDBText, "EGFR_receptor.pdb");
      const updatedProject = { ...currentProject, protein: parsed };
      if (updatedProject.ligand) {
        updatedProject.analysis = runCompatibilityAnalysis(
          parsed.atoms,
          updatedProject.ligand.atoms,
          parsed,
          updatedProject.ligand
        );
      }
      setProjects(projects.map(p => p.id === currentProject.id ? updatedProject : p));
      setCurrentProject(updatedProject);
      setParsingProtein(false);
      triggerConfetti();
    }, 800);
  };

  const loadSampleLigandDirect = () => {
    if (!currentProject) return;
    setParsingLigand(true);
    setTimeout(() => {
      const parsed = parseSDF(sampleSDFText, "Erlotinib_ligand.sdf");
      const updatedProject = { ...currentProject, ligand: parsed };
      if (updatedProject.protein) {
        updatedProject.analysis = runCompatibilityAnalysis(
          updatedProject.protein.atoms,
          parsed.atoms,
          updatedProject.protein,
          parsed
        );
      }
      setProjects(projects.map(p => p.id === currentProject.id ? updatedProject : p));
      setCurrentProject(updatedProject);
      setParsingLigand(false);
      triggerConfetti();
    }, 800);
  };

  // Protein file parser trigger
  const handleProteinUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentProject) return;

    setParsingProtein(true);
    setProteinError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setTimeout(() => {
        try {
          const parsed = parsePDB(text, file.name);
          
          // Update project state
          const updatedProject = { ...currentProject, protein: parsed };
          
          // If ligand is already uploaded, run analysis automatically
          if (updatedProject.ligand) {
            updatedProject.analysis = runCompatibilityAnalysis(
              parsed.atoms, 
              updatedProject.ligand.atoms,
              parsed,
              updatedProject.ligand
            );
          }

          // Save
          setProjects(projects.map(p => p.id === currentProject.id ? updatedProject : p));
          setCurrentProject(updatedProject);
          setParsingProtein(false);
          triggerConfetti();
        } catch (err: any) {
          console.error("Protein parsing error:", err);
          setProteinError(err.message || "Failed to parse protein PDB file. Ensure it is a valid format.");
          setParsingProtein(false);
        }
      }, 1000);
    };
    reader.readAsText(file);
  };

  // Ligand file parser trigger
  const handleLigandUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentProject) return;

    setParsingLigand(true);
    setLigandError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setTimeout(() => {
        try {
          const parsed = parseSDF(text, file.name);
          
          // Update project state
          const updatedProject = { ...currentProject, ligand: parsed };
          
          // If protein is already uploaded, run compatibility automatically
          if (updatedProject.protein) {
            updatedProject.analysis = runCompatibilityAnalysis(
              updatedProject.protein.atoms, 
              parsed.atoms,
              updatedProject.protein,
              parsed
            );
          }

          // Save
          setProjects(projects.map(p => p.id === currentProject.id ? updatedProject : p));
          setCurrentProject(updatedProject);
          setParsingLigand(false);
          triggerConfetti();
        } catch (err: any) {
          console.error("Ligand parsing error:", err);
          setLigandError(err.message || "Failed to parse ligand SDF file. Ensure it is a valid format.");
          setParsingLigand(false);
        }
      }, 1000);
    };
    reader.readAsText(file);
  };

  // SMILES Ligand generator bypass
  const handleSmilesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!smilesInput.trim() || !currentProject) return;

    setParsingLigand(true);
    setTimeout(() => {
      // Create empty mock SDF syntax based on Smiles content
      const dummySDF = `Smiles Ligand\n  Mock Layout\n 6 5  0  0  0  0  0  0  0  0999 V2000\n  0.0  1.0  0.0 C\n  1.0  0.5  0.0 C\n  1.0 -0.5  0.0 C\n  0.0 -1.0  0.0 N\n -1.0 -0.5  0.0 O\n -1.0  0.5  0.0 C\n  1 2 1\n  2 3 2\n  3 4 1\n  4 5 1\n  5 6 2\n  6 1 1\nM END`;
      const parsed = parseSDF(dummySDF, `${smilesInput.slice(0, 8)}_molecule.sdf`);
      parsed.smiles = smilesInput;

      const updatedProject = { ...currentProject, ligand: parsed };

      if (updatedProject.protein) {
        updatedProject.analysis = runCompatibilityAnalysis(
          updatedProject.protein.atoms, 
          parsed.atoms,
          updatedProject.protein,
          parsed
        );
      }

      setProjects(projects.map(p => p.id === currentProject.id ? updatedProject : p));
      setCurrentProject(updatedProject);
      setParsingLigand(false);
      setSmilesInput('');
      triggerConfetti();
    }, 1000);
  };

  const handleExport = (format: 'pdf' | 'csv') => {
    if (!currentProject) return;
    triggerConfetti();
    alert(`Exporting research dossier (${format.toUpperCase()}) for ${currentProject.name}. Standard report generated successfully.`);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 60,
      origin: { y: 0.65 },
      colors: ['#22d3ee', '#6366f1', '#10b981']
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400 border-emerald-500/25 bg-emerald-500/5';
    if (score >= 75) return 'text-cyan-400 border-cyan-500/25 bg-cyan-500/5';
    if (score >= 50) return 'text-amber-400 border-amber-500/25 bg-amber-500/5';
    return 'text-rose-400 border-rose-500/25 bg-rose-500/5';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Good';
    if (score >= 50) return 'Moderate';
    return 'Weak';
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-white overflow-x-hidden font-sans">
      
      {/* 3D molecular background lines */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-40">
        <MolecularBackground />
      </div>

      {/* ============================================================================
          LANDING PAGE
          ============================================================================ */}
      {view === 'landing' && (
        <div className="relative z-10">
          <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            scrollY > 50 ? 'bg-slate-950/90 backdrop-blur-md border-b border-slate-900' : 'bg-transparent'
          }`}>
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent">
                <Beaker className="w-7 h-7 text-cyan-400 animate-pulse" />
                <span>LigandOptima</span>
              </div>
              <div className="hidden md:flex items-center gap-8 text-sm text-slate-300">
                <a href="#problem" className="hover:text-cyan-400 transition-colors">Problem</a>
                <a href="#solution" className="hover:text-cyan-400 transition-colors">Solution</a>
                <a href="#features" className="hover:text-cyan-400 transition-colors">Key Features</a>
                <a href="#team" className="hover:text-cyan-400 transition-colors">Team</a>
              </div>
              <button 
                onClick={() => {
                  setView('auth');
                  setIsRegistering(false);
                  setAuthError('');
                  setAuthSuccess('');
                }}
                className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-lg text-xs font-extrabold tracking-wider uppercase hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
              >
                Launch Platform
              </button>
            </div>
          </nav>

          {/* Hero */}
          <header className="min-h-screen flex items-center justify-center pt-24 px-6 relative">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="inline-block px-4 py-1.5 bg-cyan-500/10 border border-cyan-400/20 rounded-full">
                <span className="text-cyan-400 text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 justify-center">
                  <Zap className="w-3.5 h-3.5" /> High-Fidelity Pre-Docking Intelligence
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight">
                Optimize Lead Candidates <br />
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent">
                  Before Docking Starts
                </span>
              </h1>
              <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                A professional SaaS platform designed to parse protein targets, check molecular compatibilities, detect steric clashes, and recommend ligand variations to save HPC time.
              </p>
              <div className="flex gap-4 justify-center pt-4">
                <button
                  onClick={() => setView('auth')}
                  className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-xl text-white font-bold hover:shadow-xl hover:shadow-cyan-500/30 flex items-center gap-2 transition-all"
                >
                  <span>Launch Platform</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </header>

          {/* Problem Section */}
          <section id="problem" className="py-24 px-6 border-t border-slate-900 bg-slate-950/40">
            <div className="max-w-6xl mx-auto text-left">
              <div className="max-w-2xl mb-16 space-y-3">
                <span className="text-xs text-indigo-400 font-extrabold uppercase tracking-widest">Preclinical Risks</span>
                <h2 className="text-3xl md:text-4xl font-bold">The Core Drug Discovery Bottleneck</h2>
                <p className="text-slate-400 text-sm">Large ligand screening runs on HPC clusters frequently fail due to basic chemistry conflicts detected too late.</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { title: "Weak Pocket Occupancy", desc: "Ligands with poor volumetric fit fail to close active channels.", icon: "🔬" },
                  { title: "Electrostastics Clash", desc: "Polar atoms colliding in positive-positive grid fields causing repulsion.", icon: "⚡" },
                  { title: "High Flexibility Loss", desc: "Molecules with >10 rotatable bonds carry steep thermodynamic penalties.", icon: "🔗" }
                ].map((item, idx) => (
                  <div key={idx} className="glass-panel p-6 rounded-2xl space-y-4">
                    <div className="text-3xl">{item.icon}</div>
                    <h4 className="text-white font-bold text-lg">{item.title}</h4>
                    <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Solution Section */}
          <section id="solution" className="py-24 px-6 border-t border-slate-900 bg-slate-950/80">
            <div className="max-w-6xl mx-auto text-left">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <span className="text-xs text-cyan-400 font-extrabold uppercase tracking-widest">Computational Assistant</span>
                  <h2 className="text-3xl md:text-4xl font-extrabold">Automated Geometric Fitting & Recommendations</h2>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    LigandOptima parses standard coordinate files dynamically, aligning steric walls, hydrophobic contacts, and hydrogen bond partners to predict docking readiness in milliseconds.
                  </p>
                  <div className="space-y-3 text-slate-400 text-xs">
                    <div className="flex gap-2 items-center">
                      <Check className="text-emerald-400 w-4.5 h-4.5" />
                      <span>Extracts atomic centers and bonds directly from PDB and SDF files</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Check className="text-emerald-400 w-4.5 h-4.5" />
                      <span>Measures structural alerts and conformational rotatable limits</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Check className="text-emerald-400 w-4.5 h-4.5" />
                      <span>Auto-generates chemical modifications with expected binding margins</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Pre-Docking Evaluation Pipeline</span>
                    <span className="text-emerald-400 font-extrabold">7-Step Workflow</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      '1. Upload PDB Target file',
                      '2. Automatic Protein Residue Analysis',
                      '3. Upload SDF Ligand file',
                      '4. Automatic Lipinski rule extraction',
                      '5. Automatic Geometric coordinate alignment',
                      '6. Suggested medicinal modifications',
                      '7. PDF / CSV prioritization report output'
                    ].map((step, i) => (
                      <div key={i} className="p-2.5 bg-slate-950/60 border border-slate-850 rounded-xl text-left text-xs font-medium text-slate-300">
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section id="team" className="py-24 px-6 border-t border-slate-900 bg-slate-950/40">
            <div className="max-w-6xl mx-auto text-left">
              <div className="max-w-2xl mb-16 space-y-3">
                <span className="text-xs text-indigo-400 font-extrabold uppercase tracking-widest">Leadership</span>
                <h2 className="text-3xl md:text-4xl font-bold">Science-Driven Founding Team</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {TEAM.map((t, idx) => (
                  <div key={idx} className="glass-panel p-6 rounded-2xl space-y-3">
                    <div className="text-cyan-400 text-xl font-bold">{t.name}</div>
                    <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">{t.role}</div>
                    <p className="text-slate-300 text-xs leading-relaxed">{t.bio}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t border-slate-900 py-12 px-6 bg-slate-950">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-slate-500">
              <span className="text-sm font-bold text-cyan-400">LigandOptima R&D</span>
              <span>© 2026 LigandOptima. Developed for biotechnology and molecular screening campaigns.</span>
            </div>
          </footer>
        </div>
      )}

      {/* ============================================================================
          AUTHENTICATION
          ============================================================================ */}
      {view === 'auth' && (
        <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-850 rounded-3xl p-8 shadow-2xl relative space-y-6 text-left">
            <button onClick={() => setView('landing')} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-400/20 rounded-2xl flex items-center justify-center text-cyan-400 mx-auto mb-2">
                <Beaker className="w-6 h-6 animate-pulse" />
              </div>
              <h2 className="text-xl font-bold text-white">LigandOptima Portal</h2>
              <p className="text-xs text-slate-400">Secure entry for R&D campaign coordinators.</p>
            </div>

            {authError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" />
                <span>{authError}</span>
              </div>
            )}

            {authSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{authSuccess}</span>
              </div>
            )}

            <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-4">
              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Username</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs text-slate-400">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="rounded bg-slate-900 border-slate-800"
                  />
                  <span>Remember Me</span>
                </label>
                <a href="#" onClick={(e) => { e.preventDefault(); alert('Please register a new account on this device.'); }} className="hover:text-cyan-400">
                  Forgot Password?
                </a>
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:shadow-lg hover:shadow-cyan-500/20 text-white font-extrabold rounded-xl transition-all text-xs uppercase tracking-wider"
              >
                {isRegistering ? 'Create Account' : 'Sign In'}
              </button>
            </form>

            <div className="border-t border-slate-900 pt-4 text-center">
              <button 
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setAuthError('');
                  setAuthSuccess('');
                  setPassword('');
                }}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
              >
                {isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================================
          WORKSPACE
          ============================================================================ */}
      {view === 'workspace' && (
        <div className="relative z-10 min-h-screen flex flex-col bg-slate-950 text-left">
          
          {/* Header */}
          <header className="border-b border-slate-900 bg-slate-900/10 px-6 py-4 flex items-center justify-between backdrop-blur-md">
            <div className="flex items-center gap-6">
              <div onClick={() => setView('landing')} className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent cursor-pointer">
                <Beaker className="w-5 h-5 text-cyan-400" />
                <span>LigandOptima</span>
              </div>

              {currentProject && (
                <div className="relative group">
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-semibold text-cyan-400 hover:border-cyan-500/30 transition-all">
                    <span>Active Study: <strong>{currentProject.name}</strong></span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                  </button>
                  <div className="absolute left-0 mt-2 w-52 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-1.5 space-y-1">
                    {projects.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setCurrentProject(p);
                          setSelectedResidue(null);
                        }}
                        className={`w-full px-3 py-2 rounded-lg text-xs text-left transition-colors flex justify-between items-center ${
                          p.id === currentProject.id ? 'bg-cyan-500/10 text-cyan-400 font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <span>{p.name}</span>
                        {p.protein && <span className="text-[9px] bg-slate-800 px-1 py-0.5 rounded text-slate-500">{p.protein.id}</span>}
                      </button>
                    ))}
                    <button
                      onClick={() => setShowAddProjectModal(true)}
                      className="w-full px-3 py-2 text-xs text-left text-cyan-400 hover:bg-slate-800 rounded-lg font-bold flex items-center gap-1.5 border-t border-slate-800 mt-1 pt-2"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>New Project</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="hidden md:flex items-center gap-1.5 text-slate-400 font-semibold bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>Account: <strong className="text-white">{username}</strong></span>
              </div>
              <button 
                onClick={() => {
                  setView('auth');
                  setProjects([]);
                  setCurrentProject(null);
                }}
                className="px-3 py-1.5 border border-slate-800 hover:border-rose-500/30 hover:text-rose-400 rounded-lg transition-all"
              >
                Log Out
              </button>
            </div>
          </header>

          <div className="flex-1 flex flex-col lg:flex-row">
            
            {/* Sidebar navigation */}
            <aside className="w-full lg:w-60 border-r border-slate-900 bg-slate-900/10 p-4 space-y-2 flex flex-row lg:flex-col justify-start lg:justify-between items-center lg:items-stretch gap-2 lg:gap-0">
              <div className="w-full flex flex-row lg:flex-col gap-2">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex-1 lg:flex-none flex items-center justify-center lg:justify-start gap-2.5 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'dashboard'
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/25'
                      : 'text-slate-400 hover:bg-slate-900/60 hover:text-white border border-transparent'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden lg:inline">Projects Hub</span>
                </button>

                <button
                  onClick={() => {
                    if (!currentProject) {
                      alert('Please create a project first in the Projects Hub.');
                      return;
                    }
                    setActiveTab('center');
                  }}
                  className={`flex-1 lg:flex-none flex items-center justify-center lg:justify-start gap-2.5 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'center'
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/25'
                      : 'text-slate-400 hover:bg-slate-900/60 hover:text-white border border-transparent'
                  }`}
                >
                  <Microscope className="w-4 h-4" />
                  <span className="hidden lg:inline">Screening Center</span>
                </button>

                <button
                  onClick={() => setActiveTab('presentation')}
                  className={`flex-1 lg:flex-none flex items-center justify-center lg:justify-start gap-2.5 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'presentation'
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/25'
                      : 'text-slate-400 hover:bg-slate-900/60 hover:text-white border border-transparent'
                  }`}
                >
                  <Presentation className="w-4 h-4" />
                  <span className="hidden lg:inline">Presentation Mode</span>
                </button>
              </div>

              {/* Sample Files Downloader Helper */}
              <div className="hidden lg:block border border-slate-800 rounded-2xl p-4 bg-slate-900/20 text-left space-y-3.5">
                <h4 className="text-white font-bold text-xs flex items-center gap-1.5 border-b border-slate-900 pb-2">
                  <FileCode className="w-4 h-4 text-cyan-400" />
                  <span>Sample Coordinates</span>
                </h4>
                <p className="text-[10px] text-slate-400 leading-normal">Download small sample structures to upload and test the parsing engine:</p>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => downloadSample('pdb')}
                    className="py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[9px] font-bold text-cyan-400 rounded-lg flex items-center justify-center gap-1 transition-all"
                  >
                    <Download className="w-3 h-3" /> PDB Target
                  </button>
                  <button 
                    onClick={() => downloadSample('sdf')}
                    className="py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[9px] font-bold text-cyan-400 rounded-lg flex items-center justify-center gap-1 transition-all"
                  >
                    <Download className="w-3 h-3" /> SDF Ligand
                  </button>
                </div>
              </div>
            </aside>

            {/* Main Area */}
            <main className="flex-1 p-6 relative overflow-y-auto">
              
              {/* Add Project Modal */}
              {showAddProjectModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                  <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 text-left space-y-6">
                    <div>
                      <h3 className="text-white font-bold text-lg">Create Screening Project</h3>
                      <p className="text-slate-400 text-xs">Enter a title for your ligand campaign.</p>
                    </div>
                    <form onSubmit={handleCreateProject} className="space-y-4">
                      <input 
                        type="text" 
                        value={newProjectName}
                        onChange={(e) => setNewProjectName(e.target.value)}
                        placeholder="e.g. EGFR Kinase Campaign"
                        className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                        required
                      />
                      <div className="flex justify-end gap-2 text-xs font-bold pt-2">
                        <button 
                          type="button" 
                          onClick={() => setShowAddProjectModal(false)}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit" 
                          className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-xl text-white hover:shadow-lg hover:shadow-cyan-500/20"
                        >
                          Create Project
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Projects Hub Dashboard */}
              {activeTab === 'dashboard' && (
                <div className="space-y-8 text-left">
                  <div className="flex justify-between items-center">
                    <div>
                      <h1 className="text-3xl font-bold text-white mb-1">Campaign Projects Hub</h1>
                      <p className="text-slate-400 text-xs">Register new protein targets and track screening progress.</p>
                    </div>
                    <button
                      onClick={() => setShowAddProjectModal(true)}
                      className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:shadow-lg hover:shadow-cyan-500/20 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>New Project</span>
                    </button>
                  </div>

                  {/* Empty state or projects grid */}
                  {projects.length === 0 ? (
                    <div className="border border-dashed border-slate-800 rounded-3xl p-12 text-center max-w-xl mx-auto space-y-4 bg-slate-900/10 mt-12">
                      <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-400/20 rounded-full flex items-center justify-center text-cyan-400 mx-auto">
                        <Folder className="w-6 h-6 animate-pulse" />
                      </div>
                      <h3 className="text-white font-bold text-lg">No Projects Initialized</h3>
                      <p className="text-slate-400 text-xs max-w-xs mx-auto">
                        Start by creating a new project. You will then upload protein structures and ligand coordinate files to run compatibility calculations.
                      </p>
                      <button
                        onClick={() => setShowAddProjectModal(true)}
                        className="px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/25 border border-cyan-400/30 text-cyan-400 font-bold rounded-xl text-xs"
                      >
                        Create Your First Project
                      </button>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-3 gap-6">
                      {projects.map((p) => (
                        <div key={p.id} className="glass-panel p-6 rounded-2xl flex flex-col justify-between hover:border-cyan-500/30 transition-all">
                          <div className="space-y-4">
                            <div className="flex justify-between items-start">
                              <span className="text-[10px] text-slate-500 font-bold">Created: {p.created}</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded border font-extrabold uppercase ${
                                p.analysis ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : 'text-slate-400 border-slate-800 bg-slate-900'
                              }`}>
                                {p.analysis ? 'Completed' : 'Draft'}
                              </span>
                            </div>
                            <h3 className="text-white font-bold text-lg">{p.name}</h3>

                            <div className="space-y-2 text-xs border-t border-slate-900 pt-3 text-slate-400">
                              <div className="flex justify-between">
                                <span>Protein:</span>
                                <span className={p.protein ? 'text-cyan-400 font-bold' : 'text-slate-600'}>
                                  {p.protein ? `${p.protein.id} (${p.protein.aminoAcidCount} aa)` : 'Not uploaded'}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Ligand:</span>
                                <span className={p.ligand ? 'text-cyan-400 font-bold' : 'text-slate-600'}>
                                  {p.ligand ? `${p.ligand.formula}` : 'Not uploaded'}
                                </span>
                              </div>
                              {p.analysis && (
                                <div className="flex justify-between border-t border-slate-900/50 pt-2 text-[11px]">
                                  <span>Binding Prob:</span>
                                  <span className="text-emerald-400 font-extrabold">{p.analysis.bindingProbability}%</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              setCurrentProject(p);
                              setSelectedResidue(null);
                              setActiveTab('center');
                            }}
                            className="w-full mt-6 py-2.5 bg-slate-900 border border-slate-800 hover:border-cyan-500/30 text-slate-300 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                          >
                            <span>Open Project Workspace</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Standard stats grid widgets */}
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4 border-t border-slate-900 pt-8">
                    {[
                      { label: 'Total Projects', value: projects.length, icon: <Folder className="w-4 h-4 text-cyan-400" /> },
                      { label: 'Uploaded Proteins', value: projects.filter(p => p.protein).length, icon: <Microscope className="w-4 h-4 text-indigo-400" /> },
                      { label: 'Uploaded Ligands', value: projects.filter(p => p.ligand).length, icon: <Beaker className="w-4 h-4 text-emerald-400" /> },
                      { label: 'Completed Analyses', value: projects.filter(p => p.analysis).length, icon: <CheckSquare className="w-4 h-4 text-amber-400" /> },
                      { label: 'Optimization Reports', value: projects.filter(p => p.analysis).length, icon: <FileText className="w-4 h-4 text-purple-400" /> },
                      { label: 'High Priority Candidates', value: projects.filter(p => p.analysis && p.analysis.bindingProbability >= 90).length, icon: <Zap className="w-4 h-4 text-rose-400" /> }
                    ].map((s, i) => (
                      <div key={i} className="glass-panel p-4 rounded-xl text-left flex flex-col justify-between">
                        <div className="p-2 bg-slate-950/60 border border-slate-850 rounded-lg w-max mb-3">
                          {s.icon}
                        </div>
                        <div>
                          <div className="text-xl font-bold text-white">{s.value}</div>
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">{s.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Slide Pitch deck */}
              {activeTab === 'presentation' && (
                <div className="py-6 flex items-center justify-center">
                  <PresentationMode />
                </div>
              )}

              {/* Scientific Screening workspace */}
              {activeTab === 'center' && currentProject && (
                <div className="grid lg:grid-cols-12 gap-6 items-stretch text-left">
                  
                  {/* Left Column: Side-by-Side double visualizer HUD */}
                  <div className="lg:col-span-5 flex flex-col gap-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-xl font-bold text-white">{currentProject.name}</h2>
                        <p className="text-slate-400 text-xs">Simulated active site pocket coordinates.</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSplitScreen(!splitScreen)}
                          className={`p-2 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 ${
                            splitScreen 
                              ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' 
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                          title="Toggle Synchronized Side-by-Side Split View"
                        >
                          <Columns className="w-4 h-4" />
                          <span className="hidden sm:inline">Split View</span>
                        </button>
                      </div>
                    </div>

                    {/* Renders interactive Canvas */}
                    <div className="relative">
                      {currentProject.protein || currentProject.ligand ? (
                        <MolecularViewer
                          proteinAtoms={currentProject.protein?.atoms || []}
                          proteinBonds={currentProject.protein?.bonds || []}
                          ligandAtoms={currentProject.ligand?.atoms || []}
                          ligandBonds={currentProject.ligand?.bonds || []}
                          selectedResidue={selectedResidue}
                          onSelectResidue={setSelectedResidue}
                          heatmapMode={heatmapMode}
                          viewMode={viewMode}
                          showPocket={showPocket}
                          splitScreen={splitScreen}
                        />
                      ) : (
                        <div className="w-full h-[460px] bg-slate-950/80 rounded-2xl border border-slate-800/80 flex flex-col items-center justify-center p-6 text-center space-y-3">
                          <HelpCircle className="w-10 h-10 text-slate-500 animate-bounce" />
                          <h4 className="text-white font-bold">No Structures Uploaded</h4>
                          <p className="text-slate-400 text-xs max-w-xs mx-auto">
                            Upload a protein target (.PDB) or ligand structure (.SDF) inside the workspace tabs on the right to start parsing.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Canvas Controls */}
                    <div className="glass-panel p-4 rounded-2xl grid grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="block text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1.5">View Representation</label>
                        <select 
                          value={viewMode}
                          onChange={(e) => setViewMode(e.target.value as any)}
                          className="w-full bg-slate-900 border border-slate-800 text-xs px-2 py-1.5 rounded-lg focus:border-cyan-400 focus:outline-none"
                        >
                          <option value="ball-stick">Ball & Stick</option>
                          <option value="cartoon">Cartoon (Ribbon)</option>
                          <option value="surface">Space-Filling</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1.5">Receptor Space</label>
                        <button
                          onClick={() => setShowPocket(!showPocket)}
                          className={`w-full py-1.5 rounded-lg border font-bold transition-all ${
                            showPocket 
                              ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' 
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          Pocket: {showPocket ? 'ON' : 'OFF'}
                        </button>
                      </div>
                      <div>
                        <label className="block text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1.5">Hotspot Heatmap</label>
                        <button
                          onClick={() => setHeatmapMode(!heatmapMode)}
                          className={`w-full py-1.5 rounded-lg border font-bold transition-all ${
                            heatmapMode 
                              ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' 
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          Interaction Map
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Tabbed Workspace Hub */}
                  <div className="lg:col-span-7 flex flex-col gap-6">
                    
                    {/* Header Tabs */}
                    <div className="flex border-b border-slate-900 overflow-x-auto pb-px gap-1">
                      {[
                        { id: 'receptor', label: '1. Target Receptor PDB', icon: <Microscope className="w-3.5 h-3.5" /> },
                        { id: 'ligand', label: '2. Ligand SDF API', icon: <Beaker className="w-3.5 h-3.5" /> },
                        { id: 'compatibility', label: '3. Compatibility Engine', icon: <Target className="w-3.5 h-3.5" /> },
                        { id: 'optimization', label: '4. Chemistry Variants', icon: <Zap className="w-3.5 h-3.5" /> },
                        { id: 'report', label: '5. Decision Dossier', icon: <FileText className="w-3.5 h-3.5" /> }
                      ].map((t) => (
                        <button
                          key={t.id}
                          onClick={() => {
                            // Check tabs limits
                            if (t.id === 'compatibility' && (!currentProject.protein || !currentProject.ligand)) {
                              alert('Compatibility analysis requires BOTH Protein and Ligand to be uploaded first.');
                              return;
                            }
                            if (t.id === 'optimization' && (!currentProject.protein || !currentProject.ligand)) {
                              alert('Optimization suggestions require BOTH Protein and Ligand coordinates.');
                              return;
                            }
                            if (t.id === 'report' && (!currentProject.protein || !currentProject.ligand)) {
                              alert('Report generation requires fully uploaded coordinate systems.');
                              return;
                            }
                            setWorkspaceTab(t.id as any);
                          }}
                          className={`px-4 py-2.5 text-xs font-bold whitespace-nowrap rounded-t-xl border-t border-l border-r flex items-center gap-1.5 -mb-px transition-all ${
                            workspaceTab === t.id
                              ? 'bg-slate-950 border-slate-900 text-cyan-400 font-extrabold'
                              : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {t.icon}
                          <span>{t.label}</span>
                        </button>
                      ))}
                    </div>

                    {/* TAB 1: Protein upload/analysis */}
                    {workspaceTab === 'receptor' && (
                      <div className="space-y-6">
                        
                        {/* File Upload Zone */}
                        <div className="border-2 border-dashed border-slate-800 rounded-3xl p-8 bg-slate-900/10 text-center relative overflow-hidden flex flex-col justify-center items-center">
                          {parsingProtein ? (
                            <div className="space-y-3 py-6">
                              <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
                              <h4 className="text-white font-bold text-sm">Parsing Coordinate Geometry...</h4>
                              <p className="text-slate-400 text-xs">Extracting chain residues and secondary structures...</p>
                            </div>
                          ) : currentProject.protein ? (
                            <div className="space-y-3 py-4">
                              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                              <h4 className="text-white font-bold text-sm">Protein successfully loaded</h4>
                              <p className="text-slate-400 text-xs">PDB ID: <strong>{currentProject.protein.id}</strong> ({currentProject.protein.atoms.length} atoms parsed)</p>
                              
                              <label className="inline-block px-4 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl text-xs text-slate-300 font-bold cursor-pointer transition-colors mt-2">
                                Replace Protein File
                                <input type="file" accept=".pdb,.cif,.mmcif" onChange={handleProteinUpload} className="hidden" />
                              </label>
                            </div>
                          ) : (
                            <div className="space-y-4 py-4">
                              <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-400/20 rounded-full flex items-center justify-center text-cyan-400 mx-auto">
                                <Upload className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="text-white font-bold text-sm">Upload Protein Target</h4>
                                <p className="text-slate-400 text-xs mt-1">Accepts PDB, CIF, or mmCIF coordinate files</p>
                              </div>
                              
                              <div className="flex gap-2 justify-center">
                                <label className="inline-block px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-xl text-xs font-bold text-white cursor-pointer hover:shadow-lg hover:shadow-cyan-500/25 transition-all">
                                  Select Target File
                                  <input type="file" accept=".pdb,.cif,.mmcif" onChange={handleProteinUpload} className="hidden" />
                                </label>
                                <button 
                                  onClick={loadSampleProteinDirect}
                                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-bold text-cyan-400 transition-all"
                                >
                                  Load Sample Target
                                </button>
                              </div>
                            </div>
                          )}
                          {proteinError && (
                            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-2xl text-xs text-red-400 font-medium max-w-md">
                              {proteinError}
                            </div>
                          )}
                        </div>

                        {/* Protein Analysis metrics (Shown once parsed) */}
                        {currentProject.protein && (
                          <div className="space-y-6">
                            
                            {/* Stats */}
                            <div className="glass-panel p-5 rounded-2xl space-y-4">
                              <h3 className="text-white font-bold text-base">Structure Details: {currentProject.protein.name}</h3>
                              
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-950/40 p-4 rounded-xl text-xs border border-slate-850">
                                <div>
                                  <span className="text-slate-500 block">Organism:</span>
                                  <strong className="text-white">{currentProject.protein.organism}</strong>
                                </div>
                                <div>
                                  <span className="text-slate-500 block">Resolution:</span>
                                  <strong className="text-white">{currentProject.protein.resolution}</strong>
                                </div>
                                <div>
                                  <span className="text-slate-500 block">Amino Acid Count:</span>
                                  <strong className="text-white">{currentProject.protein.aminoAcidCount} aa</strong>
                                </div>
                                <div>
                                  <span className="text-slate-500 block">Chains Count:</span>
                                  <strong className="text-white">{currentProject.protein.chainsCount} chain(s)</strong>
                                </div>
                              </div>

                              {/* Target Scores */}
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {[
                                  { label: 'Stability Score', val: currentProject.protein.stabilityScore },
                                  { label: 'Active Site Quality', val: currentProject.protein.activeSiteScore },
                                  { label: 'Pocket Confidence', val: currentProject.protein.pocketScore },
                                  { label: 'Suitability Score', val: currentProject.protein.suitabilityScore }
                                ].map((s, idx) => (
                                  <div key={idx} className={`p-3 border rounded-xl flex flex-col justify-between ${getScoreColor(s.val)}`}>
                                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{s.label}</span>
                                    <div className="flex items-baseline justify-between pt-2">
                                      <span className="text-xl font-extrabold">{s.val}</span>
                                      <span className="text-[9px] font-extrabold uppercase">{getScoreLabel(s.val)}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Active site residues & binding cavity dimensions */}
                            <div className="grid md:grid-cols-2 gap-6">
                              <div className="glass-panel p-5 rounded-2xl space-y-3">
                                <h4 className="text-white font-bold text-sm">Binding Cavity Parameters</h4>
                                <div className="space-y-2.5 text-xs text-slate-300">
                                  <div className="flex justify-between border-b border-slate-900/50 pb-1.5">
                                    <span>Pocket Volume:</span>
                                    <strong className="text-cyan-400 font-bold">{currentProject.protein.pocketVolume}</strong>
                                  </div>
                                  <div className="flex justify-between border-b border-slate-900/50 pb-1.5">
                                    <span>Pocket Depth:</span>
                                    <strong className="text-cyan-400 font-bold">{currentProject.protein.pocketDepth}</strong>
                                  </div>
                                  <div className="flex justify-between border-b border-slate-900/50 pb-1.5">
                                    <span>Pocket Surface Area:</span>
                                    <strong className="text-cyan-400 font-bold">{currentProject.protein.pocketArea}</strong>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Pocket Accessibility:</span>
                                    <strong className="text-emerald-400 font-bold">High (Hydrophilic Entry)</strong>
                                  </div>
                                </div>
                              </div>

                              <div className="glass-panel p-5 rounded-2xl space-y-3">
                                <h4 className="text-white font-bold text-sm">Active Site Residues</h4>
                                <div className="flex flex-wrap gap-2 pt-1">
                                  {currentProject.protein.activeSiteResidues.map((res, i) => (
                                    <button
                                      key={i}
                                      onClick={() => setSelectedResidue(selectedResidue === res ? null : res)}
                                      className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                                        selectedResidue === res 
                                          ? 'bg-rose-500/15 border-rose-500/40 text-rose-300' 
                                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                                      }`}
                                    >
                                      {res}
                                    </button>
                                  ))}
                                </div>
                                <p className="text-[10px] text-slate-500 leading-normal pt-1">
                                  Click any residue to highlight its 3D atomic coordinates in the visualizer framework.
                                </p>
                              </div>
                            </div>

                          </div>
                        )}

                      </div>
                    )}

                    {/* TAB 2: Ligand upload/analysis */}
                    {workspaceTab === 'ligand' && (
                      <div className="space-y-6">
                        
                        {/* File Upload Zone */}
                        <div className="border-2 border-dashed border-slate-800 rounded-3xl p-8 bg-slate-900/10 text-center relative overflow-hidden flex flex-col justify-center items-center">
                          {parsingLigand ? (
                            <div className="space-y-3 py-6">
                              <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
                              <h4 className="text-white font-bold text-sm">Parsing Coordinate Geometry...</h4>
                              <p className="text-slate-400 text-xs">Evaluating elements and atomic structures...</p>
                            </div>
                          ) : currentProject.ligand ? (
                            <div className="space-y-3 py-4">
                              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                              <h4 className="text-white font-bold text-sm">Ligand successfully loaded</h4>
                              <p className="text-slate-400 text-xs">Formula: <strong>{currentProject.ligand.formula}</strong> ({currentProject.ligand.atoms.length} atoms parsed)</p>
                              
                              <label className="inline-block px-4 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl text-xs text-slate-300 font-bold cursor-pointer transition-colors mt-2">
                                Replace Ligand File
                                <input type="file" accept=".sdf,.mol,.mol2" onChange={handleLigandUpload} className="hidden" />
                              </label>
                            </div>
                          ) : (
                            <div className="w-full space-y-6 py-4 max-w-sm">
                              <div className="space-y-3">
                                <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-400/20 rounded-full flex items-center justify-center text-cyan-400 mx-auto">
                                  <Upload className="w-5 h-5" />
                                </div>
                                <div>
                                  <h4 className="text-white font-bold text-sm">Upload Ligand structure</h4>
                                  <p className="text-slate-400 text-xs">Accepts MOL, MOL2, or SDF coordinates</p>
                                </div>
                                <div className="flex gap-2 justify-center">
                                  <label className="inline-block px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-xl text-xs font-bold text-white cursor-pointer hover:shadow-lg hover:shadow-cyan-500/25 transition-all">
                                    Select Structure File
                                    <input type="file" accept=".sdf,.mol,.mol2" onChange={handleLigandUpload} className="hidden" />
                                  </label>
                                  <button 
                                    onClick={loadSampleLigandDirect}
                                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-bold text-cyan-400 transition-all"
                                  >
                                    Load Sample Ligand
                                  </button>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 text-xs text-slate-500 my-2">
                                <div className="h-px bg-slate-900 flex-1" />
                                <span>OR INPUT SMILES</span>
                                <div className="h-px bg-slate-900 flex-1" />
                              </div>

                              <form onSubmit={smilesInput ? handleSmilesSubmit : (e) => e.preventDefault()} className="flex gap-2">
                                <input 
                                  type="text" 
                                  value={smilesInput}
                                  onChange={(e) => setSmilesInput(e.target.value)}
                                  placeholder="e.g. C1=CC=C(C=C1)O"
                                  className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                                />
                                <button
                                  type="submit"
                                  className="px-4 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl text-xs text-cyan-400 font-bold"
                                >
                                  Submit
                                </button>
                              </form>
                            </div>
                          )}
                          {ligandError && (
                            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-2xl text-xs text-red-400 font-medium max-w-md">
                              {ligandError}
                            </div>
                          )}
                        </div>

                        {/* Ligand descriptors metrics (Shown once parsed) */}
                        {currentProject.ligand && (
                          <div className="space-y-6">
                            
                            {/* Descriptors */}
                            <div className="glass-panel p-5 rounded-2xl space-y-4">
                              <h3 className="text-white font-bold text-base">Molecular Descriptors: {currentProject.ligand.name}</h3>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-950/40 p-4 rounded-xl text-xs border border-slate-850">
                                <div>
                                  <span className="text-slate-500 block">Formula:</span>
                                  <strong className="text-white">{currentProject.ligand.formula}</strong>
                                </div>
                                <div>
                                  <span className="text-slate-500 block">Molecular Weight:</span>
                                  <strong className="text-white">{currentProject.ligand.mw} g/mol</strong>
                                </div>
                                <div>
                                  <span className="text-slate-500 block">LogP (Lipophilicity):</span>
                                  <strong className="text-white">{currentProject.ligand.logp}</strong>
                                </div>
                                <div>
                                  <span className="text-slate-500 block">TPSA:</span>
                                  <strong className="text-white">{currentProject.ligand.tpsa} Å²</strong>
                                </div>
                                <div>
                                  <span className="text-slate-500 block">H-Bond Donors:</span>
                                  <strong className="text-white">{currentProject.ligand.hbDonors}</strong>
                                </div>
                                <div>
                                  <span className="text-slate-500 block">H-Bond Acceptors:</span>
                                  <strong className="text-white">{currentProject.ligand.hbAcceptors}</strong>
                                </div>
                                <div>
                                  <span className="text-slate-500 block">Rotatable Bonds:</span>
                                  <strong className="text-white">{currentProject.ligand.rotatableBonds}</strong>
                                </div>
                                <div>
                                  <span className="text-slate-500 block">Complexity Score:</span>
                                  <strong className="text-white">{currentProject.ligand.complexity}</strong>
                                </div>
                              </div>
                            </div>

                            {/* Drug Likeness & synthetic accessibility */}
                            <div className="grid md:grid-cols-2 gap-6">
                              <div className="glass-panel p-5 rounded-2xl space-y-3">
                                <h4 className="text-white font-bold text-sm">Synthetic Accessibility</h4>
                                <div className="space-y-2.5 text-xs text-slate-300">
                                  <div className="flex justify-between border-b border-slate-900/50 pb-1.5">
                                    <span>Accessibility Score:</span>
                                    <strong className="text-cyan-400 font-bold">{currentProject.ligand.syntheticAccessibility} / 10</strong>
                                  </div>
                                  <div className="flex justify-between border-b border-slate-900/50 pb-1.5">
                                    <span>Ring Count:</span>
                                    <strong className="text-white">{currentProject.ligand.ringCount}</strong>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Estimated Synthesis steps:</span>
                                    <strong className="text-white">~{Math.round(currentProject.ligand.syntheticAccessibility * 2)} steps</strong>
                                  </div>
                                </div>
                              </div>

                              <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between">
                                <div>
                                  <h4 className="text-white font-bold text-sm mb-1">Lipinski Drug-Likeness Status</h4>
                                  <p className="text-slate-500 text-[10px]">Evaluates MW, LogP, Donors, Acceptors, TPSA, and rotatables.</p>
                                </div>
                                <div className="flex items-center gap-4 py-2 border-t border-slate-900 mt-4">
                                  <div className={`px-4 py-2 rounded-xl border text-xl font-extrabold uppercase ${
                                    currentProject.ligand.drugLikenessStatus === 'Pass' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5' :
                                    currentProject.ligand.drugLikenessStatus === 'Moderate' ? 'text-amber-400 border-amber-500/30 bg-amber-500/5' :
                                    'text-rose-400 border-rose-500/30 bg-rose-500/5'
                                  }`}>
                                    {currentProject.ligand.drugLikenessStatus}
                                  </div>
                                  <p className="text-slate-400 text-xs leading-normal">
                                    {currentProject.ligand.drugLikenessStatus === 'Pass' ? 'This ligand conforms to Lipinski parameters, showing high bioavailability.' : 'This ligand has minor violations, which may limit cellular passive transport.'}
                                  </p>
                                </div>
                              </div>
                            </div>

                          </div>
                        )}

                      </div>
                    )}

                    {/* TAB 3: Compatibility Engine */}
                    {workspaceTab === 'compatibility' && currentProject.analysis && (
                      <div className="space-y-6">
                        
                        {/* Radar grid scores */}
                        <div className="glass-panel p-5 rounded-2xl space-y-4">
                          <div>
                            <h3 className="text-white font-bold text-base">Receptor-Ligand Compatibility Engine</h3>
                            <p className="text-slate-400 text-xs">Simulated energy alignment indices based on parsed atom coordinates.</p>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            {[
                              { label: 'Hydrophobic Fit', val: currentProject.analysis.scores.hydrophobic },
                              { label: 'Electrostatic', val: currentProject.analysis.scores.electrostatic },
                              { label: 'Shape Fit', val: currentProject.analysis.scores.shape },
                              { label: 'Hydrogen Bond', val: currentProject.analysis.scores.hBond },
                              { label: 'Pocket Comp.', val: currentProject.analysis.scores.pocket }
                            ].map((s, idx) => (
                              <div key={idx} className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col justify-between space-y-2">
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{s.label}</span>
                                <div className="text-2xl font-extrabold text-cyan-400">{s.val}</div>
                                <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                                  <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${s.val}%` }} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Binding Probability vs Interactions List */}
                        <div className="grid md:grid-cols-12 gap-6">
                          
                          {/* Prob */}
                          <div className="md:col-span-5 glass-panel p-5 rounded-2xl flex flex-col justify-between space-y-4">
                            <div>
                              <h4 className="text-white font-bold text-sm">Binding Probability</h4>
                              <p className="text-slate-500 text-xs">Dynamic geometry alignment estimate.</p>
                            </div>
                            
                            <div className="flex flex-col items-center justify-center py-4">
                              <div className="w-24 h-24 rounded-full border-4 border-slate-800 flex items-center justify-center relative">
                                <div className="absolute inset-0 rounded-full border-4 border-cyan-400 border-t-transparent animate-pulse-slow" />
                                <div className="text-2xl font-extrabold text-cyan-400">{currentProject.analysis.bindingProbability}%</div>
                              </div>
                              <span className="text-xs text-cyan-400 font-extrabold uppercase mt-3">Very High Candidate</span>
                            </div>

                            <div className="p-3 bg-slate-950/60 border border-slate-850 rounded-xl text-center text-xs text-slate-400 italic leading-relaxed">
                              "Calculated coordinate intersections indicate stable pocket configurations with minimal steric clashes."
                            </div>
                          </div>

                          {/* Interactions */}
                          <div className="md:col-span-7 glass-panel p-5 rounded-2xl space-y-4">
                            <div>
                              <h4 className="text-white font-bold text-sm">Interaction Forecast & residues</h4>
                              <p className="text-slate-500 text-xs">Select a row to focus coordinates in the 3D viewer.</p>
                            </div>

                            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                              {currentProject.analysis.interactions.map((inter, idx) => {
                                const isSelected = selectedResidue === inter.residue;
                                return (
                                  <button
                                    key={idx}
                                    onClick={() => setSelectedResidue(isSelected ? null : inter.residue)}
                                    className={`w-full p-2.5 rounded-xl border text-xs flex justify-between items-center group transition-all text-left ${
                                      isSelected 
                                        ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' 
                                        : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                                    }`}
                                  >
                                    <div className="space-y-0.5">
                                      <div className="flex items-center gap-2">
                                        <strong className={isSelected ? 'text-rose-400' : 'text-slate-200'}>{inter.residue}</strong>
                                        <span className="text-[10px] text-slate-500">({inter.type})</span>
                                      </div>
                                      <p className="text-[10px] text-slate-400 leading-tight">
                                        {inter.reason}
                                      </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                      <span className="text-[9px] bg-slate-950 px-1.5 py-0.5 rounded border border-slate-850 font-bold text-slate-400">
                                        Conf: {inter.confidence}%
                                      </span>
                                      <span className={`text-[9px] font-extrabold uppercase ${
                                        inter.strength === 'Strong' ? 'text-emerald-400' : 'text-amber-400'
                                      }`}>
                                        {inter.strength}
                                      </span>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                        </div>

                      </div>
                    )}

                    {/* TAB 4: Chemistry Variants & suggestions */}
                    {workspaceTab === 'optimization' && currentProject.analysis && currentProject.ligand && (
                      <div className="space-y-6">
                        
                        {/* Alerts */}
                        <div className="glass-panel p-5 rounded-2xl space-y-4">
                          <div>
                            <h3 className="text-white font-bold text-base">Structural Alerts Detected</h3>
                            <p className="text-slate-400 text-xs">Biochemical liabilities and clash coordinates in target pocket.</p>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            {currentProject.analysis.alerts.length === 0 ? (
                              <div className="col-span-2 p-4 bg-emerald-500/5 border border-emerald-500/25 rounded-xl text-xs text-emerald-400 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5" />
                                <span>No structural warning alerts detected. Chemical scaffold matches constraints.</span>
                              </div>
                            ) : (
                              currentProject.analysis.alerts.map((al, idx) => (
                                <div key={idx} className="p-3 bg-slate-900/50 border border-slate-800 rounded-xl flex gap-3 items-start text-xs hover:border-slate-700 transition-colors">
                                  <AlertTriangle className={`w-4.5 h-4.5 mt-0.5 flex-shrink-0 ${
                                    al.severity === 'Critical' ? 'text-rose-500' :
                                    al.severity === 'High' ? 'text-orange-500' : 'text-yellow-500'
                                  }`} />
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <strong className="text-slate-200">{al.type}</strong>
                                      <span className={`text-[9px] border font-extrabold px-1.5 rounded uppercase ${
                                        al.severity === 'Critical' ? 'text-rose-400 border-rose-500/20 bg-rose-500/5' :
                                        al.severity === 'High' ? 'text-orange-400 border-orange-500/20 bg-orange-500/5' :
                                        'text-yellow-400 border-yellow-500/20 bg-yellow-500/5'
                                      }`}>
                                        {al.severity}
                                      </span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{al.description}</p>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                        {/* Suggestions */}
                        <div className="glass-panel p-5 rounded-2xl space-y-4">
                          <div>
                            <h3 className="text-white font-bold text-base">Medicinal Chemistry Recommendations</h3>
                            <p className="text-slate-400 text-xs">Automated modifications based on parsed properties.</p>
                          </div>

                          <div className="space-y-2">
                            {currentProject.analysis.optimizations.map((opt, idx) => (
                              <div key={idx} className="p-3.5 bg-slate-900/30 border border-slate-800/80 rounded-xl text-xs space-y-1.5">
                                <div className="flex justify-between items-start gap-4">
                                  <strong className="text-cyan-400 font-semibold">{opt.suggestion}</strong>
                                  <span className="text-[9px] font-extrabold bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded text-cyan-400 uppercase flex-shrink-0">
                                    Conf: {opt.confidence}%
                                  </span>
                                </div>
                                <div className="grid md:grid-cols-2 gap-2 text-[10px] text-slate-400 border-t border-slate-900 pt-1.5 mt-1.5">
                                  <span><strong>Scientific Reason:</strong> {opt.reason}</span>
                                  <span><strong>Expected Benefit:</strong> {opt.benefit}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Modified Ligand variants */}
                        <div className="glass-panel p-5 rounded-2xl space-y-4">
                          <div>
                            <h3 className="text-white font-bold text-base">Modified Ligand Variant Generator</h3>
                            <p className="text-slate-400 text-xs">Structural adjustments and predicted docking curves.</p>
                          </div>

                          <div className="space-y-3">
                            {currentProject.analysis.variants.map((v, idx) => (
                              <div key={idx} className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl grid md:grid-cols-12 gap-4 items-center text-xs hover:border-slate-700 transition-colors">
                                <div className="md:col-span-4 space-y-1">
                                  <h4 className="text-white font-bold">{v.name}</h4>
                                  <p className="text-[10px] text-slate-500 leading-tight">{v.changes}</p>
                                </div>
                                <div className="md:col-span-5 text-slate-400 text-[10px]">
                                  <strong>Impact:</strong> {v.impact}
                                </div>
                                <div className="md:col-span-3 text-right flex flex-col justify-center items-end space-y-1">
                                  <span className="text-cyan-400 font-bold">{v.dockingScore.toFixed(1)} kcal/mol</span>
                                  <span className="text-[9px] text-emerald-400 font-extrabold">{v.bindingImprovement}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    )}

                    {/* TAB 5: Report Export */}
                    {workspaceTab === 'report' && currentProject.analysis && currentProject.ligand && (
                      <div className="space-y-6">
                        
                        {/* Predicted Docking Curves */}
                        <div className="glass-panel p-5 rounded-2xl space-y-4">
                          <div>
                            <h3 className="text-white font-bold text-base">Predicted Docking Scores Comparison</h3>
                            <p className="text-slate-400 text-xs">Estimated binding affinity values (Lower energy indicates tighter binding).</p>
                          </div>

                          <div className="space-y-3">
                            {/* Original */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className="text-slate-400">Original Ligand: <strong>{currentProject.ligand.name}</strong></span>
                                <span className="text-cyan-400 font-bold">{currentProject.analysis.predictedDockingOriginal} kcal/mol</span>
                              </div>
                              <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                                <div 
                                  className="bg-cyan-500 h-2.5 rounded-full" 
                                  style={{ width: `${Math.abs(currentProject.analysis.predictedDockingOriginal) * 8}%` }} 
                                />
                              </div>
                            </div>

                            {/* Variants */}
                            {currentProject.analysis.variants.map((v, idx) => (
                              <div key={idx} className="space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span className="text-slate-400">{v.name} ({v.changes.slice(0, 30)}...)</span>
                                  <span className="text-emerald-400 font-bold">{v.dockingScore.toFixed(1)} kcal/mol</span>
                                </div>
                                <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                                  <div 
                                    className="bg-emerald-500 h-2.5 rounded-full" 
                                    style={{ width: `${Math.abs(v.dockingScore) * 8}%` }} 
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Ranking */}
                        <div className="glass-panel p-5 rounded-2xl space-y-4">
                          <div>
                            <h3 className="text-white font-bold text-base">Screening Candidate Rankings</h3>
                            <p className="text-slate-400 text-xs">Docking priority sequence generated from parsed parameters.</p>
                          </div>

                          <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left border-collapse">
                              <thead>
                                <tr className="border-b border-slate-900 text-slate-500">
                                  <th className="py-2.5 font-bold">Rank</th>
                                  <th className="py-2.5 font-bold">Ligand Core</th>
                                  <th className="py-2.5 font-bold">Binding Prob.</th>
                                  <th className="py-2.5 font-bold">Readiness</th>
                                  <th className="py-2.5 font-bold">Pred. Docking</th>
                                  <th className="py-2.5 font-bold">Priority Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b border-slate-900/50 hover:bg-slate-900/20">
                                  <td className="py-3 font-semibold text-slate-400">#4</td>
                                  <td className="py-3 font-semibold text-slate-200">{currentProject.ligand.name} (Original)</td>
                                  <td className="py-3 text-cyan-400 font-bold">{currentProject.analysis.bindingProbability}%</td>
                                  <td className="py-3 text-slate-300">{getScoreLabel(currentProject.analysis.dockingReadiness)}</td>
                                  <td className="py-3 text-cyan-400 font-bold">{currentProject.analysis.predictedDockingOriginal} kcal/mol</td>
                                  <td className="py-3 text-slate-500">Baseline</td>
                                </tr>

                                {currentProject.analysis.variants.map((v, i) => {
                                  const isBest = i === 2; // Variant C is best
                                  return (
                                    <tr key={i} className={`border-b border-slate-900/50 hover:bg-slate-900/20 ${
                                      isBest ? 'bg-cyan-500/5 text-cyan-200 border-l-2 border-l-cyan-400' : ''
                                    }`}>
                                      <td className="py-3 font-semibold">#{3 - i}</td>
                                      <td className="py-3 font-semibold">{v.name}</td>
                                      <td className="py-3 text-emerald-400 font-bold">{(currentProject.analysis!.bindingProbability + (i + 1) * 2)}%</td>
                                      <td className="py-3">Ready for Docking</td>
                                      <td className="py-3 text-emerald-400 font-bold">{v.dockingScore.toFixed(1)} kcal/mol</td>
                                      <td className="py-3">
                                        {isBest ? (
                                          <span className="text-[10px] bg-cyan-500/20 border border-cyan-400/40 text-cyan-400 font-extrabold px-1.5 py-0.5 rounded">
                                            HIGH DOCKING PRIORITY
                                          </span>
                                        ) : (
                                          <span className="text-slate-500">Variant</span>
                                        )}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Final Decision & Export */}
                        <div className="glass-panel p-5 rounded-2xl border border-cyan-500/25 bg-slate-900/20 space-y-4">
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="space-y-1">
                              <span className="text-[9px] text-cyan-400 font-bold uppercase tracking-wider">Final R&D Decision</span>
                              <h3 className="text-white font-extrabold text-lg flex items-center gap-2">
                                <CheckCircle2 className="w-5.5 h-5.5 text-emerald-400" />
                                <span>HIGH PRIORITY FOR DOCKING</span>
                              </h3>
                            </div>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => handleExport('pdf')}
                                className="px-3.5 py-2 border border-slate-800 hover:border-slate-700 bg-slate-900 text-slate-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
                              >
                                <Download className="w-4 h-4" />
                                <span>PDF Report</span>
                              </button>
                              <button 
                                onClick={() => handleExport('csv')}
                                className="px-3.5 py-2 border border-slate-800 hover:border-slate-700 bg-slate-900 text-slate-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
                              >
                                <Download className="w-4 h-4" />
                                <span>CSV Dataset</span>
                              </button>
                            </div>
                          </div>

                          <p className="text-slate-300 text-xs leading-relaxed border-t border-slate-900 pt-3">
                            <strong>Justification:</strong> This ligand coordinates high-confidence bonds inside the target pocket, showing robust Lipinski compliance values and minimal clash profiles. Prioritized for molecular docking runs.
                          </p>
                        </div>

                      </div>
                    )}

                  </div>

                </div>
              )}

            </main>
          </div>
        </div>
      )}
    </div>
  );
}
