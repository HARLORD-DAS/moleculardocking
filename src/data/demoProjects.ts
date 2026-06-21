export interface Atom3D {
  x: number;
  y: number;
  z: number;
  element: 'C' | 'N' | 'O' | 'H' | 'F' | 'Cl' | 'S' | 'P';
  isLigand: boolean;
  residueName?: string;
  residueNumber?: number;
  heatmapValue?: 'green' | 'yellow' | 'red'; // interaction type
}

export interface Bond3D {
  from: number;
  to: number;
  isLigand: boolean;
  type?: 'single' | 'double' | 'aromatic' | 'hydrogen';
}

export interface ProteinDetails {
  name: string;
  id: string;
  organism: string;
  resolution: string;
  chains: string;
  aminoAcids: number;
  mw: string;
  stabilityScore: number;
  activeSiteScore: number;
  pocketScore: number;
  pocketVolume: string;
  pocketDepth: string;
  activeSiteResidues: string[];
}

export interface LigandDetails {
  name: string;
  formula: string;
  mw: number;
  logp: number;
  tpsa: number;
  hbDonors: number;
  hbAcceptors: number;
  rotatableBonds: number;
  aromaticRings: number;
  ringCount: number;
  complexity: number;
  syntheticAccessibility: number;
  smiles: string;
}

export interface DrugLikenessMetric {
  metric: string;
  value: string;
  status: 'Pass' | 'Moderate' | 'Fail';
  explanation: string;
  drugImpact: string;
  dockingImpact: string;
}

export interface CompatibilityScores {
  hydrophobic: number;
  electrostatic: number;
  shapeFit: number;
  hBond: number;
  pocketComp: number;
  hydrophobicExplain: string;
  electrostaticExplain: string;
  shapeFitExplain: string;
  hBondExplain: string;
  pocketCompExplain: string;
}

export interface Interaction {
  type: string;
  residue: string;
  strength: 'Strong' | 'Medium' | 'Weak';
  confidence: number;
  reason: string;
}

export interface StructuralAlert {
  type: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
}

export interface OptimizationSuggestion {
  suggestion: string;
  reason: string;
  benefit: string;
  confidence: number;
}

export interface LigandVariant {
  name: string;
  changes: string;
  impact: string;
  bindingImprovement: string;
  dockingImprovement: string;
  dockingScore: number; // in kcal/mol
  confidence: number;
}

export interface DemoProject {
  id: string;
  name: string;
  protein: ProteinDetails;
  ligand: LigandDetails;
  drugLikeness: DrugLikenessMetric[];
  compatibility: CompatibilityScores;
  bindingProbability: number;
  bindingProbabilityReason: string;
  interactions: Interaction[];
  alerts: StructuralAlert[];
  optimizations: OptimizationSuggestion[];
  variants: LigandVariant[];
  dockingReadinessScore: number;
  predictedDockingOriginal: number; // in kcal/mol
  finalDecision: 'HIGH PRIORITY FOR DOCKING' | 'MODERATE PRIORITY' | 'LOW PRIORITY' | 'NOT RECOMMENDED';
  finalDecisionJustification: string;
  atoms3d: Atom3D[];
  bonds3d: Bond3D[];
}

export const demoProjects: DemoProject[] = [
  {
    id: 'egfr-erlotinib',
    name: 'EGFR + Erlotinib',
    protein: {
      name: 'Epidermal Growth Factor Receptor',
      id: '1M17',
      organism: 'Homo sapiens (Human)',
      resolution: '2.60 Å',
      chains: 'Chain A (Kinase Domain)',
      aminoAcids: 322,
      mw: '36.8 kDa',
      stabilityScore: 92,
      activeSiteScore: 94,
      pocketScore: 95,
      pocketVolume: '890 Å³',
      pocketDepth: '17.4 Å',
      activeSiteResidues: ['MET793', 'LEU718', 'VAL726', 'ALA743', 'LYS745', 'THR790', 'GLU762', 'LEU844']
    },
    ligand: {
      name: 'Erlotinib (Tarceva)',
      formula: 'C22H23N3O4',
      mw: 393.44,
      logp: 2.75,
      tpsa: 74.3,
      hbDonors: 1,
      hbAcceptors: 7,
      rotatableBonds: 8,
      aromaticRings: 3,
      ringCount: 3,
      complexity: 495,
      syntheticAccessibility: 2.8,
      smiles: 'COCCOC1=C(C=C2C(=C1)C(=NC=N2)NC3=CC=CC(=C3)C#C)OCCOC'
    },
    drugLikeness: [
      {
        metric: 'Molecular Weight',
        value: '393.44 g/mol (< 500)',
        status: 'Pass',
        explanation: 'Ideal size for cell membrane permeability and gastrointestinal absorption.',
        drugImpact: 'Ensures optimal biodistribution and decreases clearance rates.',
        dockingImpact: 'Provides high pocket occupancy without causing steric clashes inside the kinase hinge area.'
      },
      {
        metric: 'LogP (Lipophilicity)',
        value: '2.75 (0 - 5)',
        status: 'Pass',
        explanation: 'Optimal balance between aqueous solubility and membrane permeability.',
        drugImpact: 'Supports crossing the blood-brain barrier which is useful in metastatic lung cancers.',
        dockingImpact: 'Drives strong hydrophobic interactions in the deep greasy pocket of the EGFR kinase domain.'
      },
      {
        metric: 'HB Donors',
        value: '1 (<= 5)',
        status: 'Pass',
        explanation: 'Favorable value representing low polar surface desolvation penalty.',
        drugImpact: 'Low hydrogen-bond donor count correlates with high intestinal permeability.',
        dockingImpact: 'Enables targeted hydrogen bonding with the MET793 backbone amide without excessive rigid anchoring requirements.'
      },
      {
        metric: 'HB Acceptors',
        value: '7 (<= 10)',
        status: 'Pass',
        explanation: 'Favorable number of electronegative nitrogen/oxygen atoms available for donor interaction.',
        drugImpact: 'Keeps total polar surface area below threshold limits for cell penetration.',
        dockingImpact: 'Provides multiple opportunities to coordinate with surrounding water molecules and pocket side chains.'
      },
      {
        metric: 'TPSA',
        value: '74.3 Å² (< 140)',
        status: 'Pass',
        explanation: 'Indicates good cell permeability, conforming to Veber and Lipinski rules.',
        drugImpact: 'Ensures oral bioavailability and high cellular accumulation.',
        dockingImpact: 'Minimizes thermodynamic penalty when shifting from solvent to the hydrophobic binding pocket.'
      },
      {
        metric: 'Rotatable Bonds',
        value: '8 (<= 10)',
        status: 'Pass',
        explanation: 'Indicates moderate conformational flexibility, preserving stability.',
        drugImpact: 'Restricts excessive conformational changes, maintaining target specificity.',
        dockingImpact: 'Lowers conformational entropy penalty upon binding, ensuring stable predicted docking configurations.'
      }
    ],
    compatibility: {
      hydrophobic: 91,
      electrostatic: 85,
      shapeFit: 94,
      hBond: 93,
      pocketComp: 92,
      hydrophobicExplain: 'The aniline ring and quinazoline core align precisely with the hydrophobic pocket containing Leu718, Val726, and Leu844.',
      electrostaticExplain: 'Positive electrostatic fields in the kinase domain complement the electronegative nitrogen atoms of the quinazoline ring.',
      shapeFitExplain: 'The flat quinazoline ring system slides directly into the narrow ATP-binding cleft of the EGFR kinase domain with near-zero clashes.',
      hBondExplain: 'N3 of quinazoline creates an ideal, short-distance (2.9Å) hydrogen bond with the MET793 main chain amide nitrogen.',
      pocketCompExplain: 'Superb volumetric fit within the ATP binding cleft, leaving sufficient space for flexible side chains while blocking ATP entry.'
    },
    bindingProbability: 94,
    bindingProbabilityReason: 'Highly optimized shape complementarity to the EGFR kinase hinge region, anchored by a key hydrogen bond to MET793 and reinforced by strong hydrophobic interactions with surrounding residues.',
    interactions: [
      {
        type: 'Hydrogen Bond',
        residue: 'MET793',
        strength: 'Strong',
        confidence: 98,
        reason: 'Hinge region backbone nitrogen interaction with quinazoline N3 nitrogen. Distance predicted at 2.85Å.'
      },
      {
        type: 'Hydrophobic Contact',
        residue: 'LEU718',
        strength: 'Strong',
        confidence: 92,
        reason: 'Aromatic pi-alkyl stack with the quinazoline core structure.'
      },
      {
        type: 'Hydrophobic Contact',
        residue: 'LEU844',
        strength: 'Strong',
        confidence: 90,
        reason: 'Van der Waals contacts with the terminal alkyne group on the aniline ring.'
      },
      {
        type: 'Weak Hydrogen Bond',
        residue: 'THR790',
        strength: 'Medium',
        confidence: 81,
        reason: 'Gatekeeper residue sidechain oxygen coordinating with the ether chain oxygen of the ligand.'
      },
      {
        type: 'Electrostatic Inter.',
        residue: 'ASP855',
        strength: 'Medium',
        confidence: 76,
        reason: 'Coordination between the negatively charged aspartate carboxylate and polarized C-H bounds near quinazoline.'
      }
    ],
    alerts: [
      {
        type: 'Flexible Terminal Chain',
        severity: 'Medium',
        description: 'The bis-methoxyethoxy side chains contain 8 rotatable bonds, which increases conformational entropy loss.'
      },
      {
        type: 'Reactive Alkyne Group',
        severity: 'Low',
        description: 'Terminal alkyne group has minor metabolic liability but is critical for shape complementarity here.'
      }
    ],
    optimizations: [
      {
        suggestion: 'Introduce a fluorine substituent on the aniline ring.',
        reason: 'To fill a small hydrophobic sub-pocket and increase metabolic stability.',
        benefit: 'Improves hydrophobic fit and increases half-life.',
        confidence: 88
      },
      {
        suggestion: 'Replace one methoxyethoxy group with a smaller morpholine ring.',
        reason: 'To reduce the number of rotatable bonds and decrease entropy loss, mimicking Gefitinib structural features.',
        benefit: 'Reduces rotatable bonds from 8 to 5 and enhances solubility.',
        confidence: 92
      },
      {
        suggestion: 'Add an acrylamide warhead (for covalent binding target versions).',
        reason: 'To target CYS797 covalently, transforming the reversible inhibitor into an irreversible EGFR blocker.',
        benefit: 'Increases affinity by orders of magnitude and overcomes THR790M resistance.',
        confidence: 95
      }
    ],
    variants: [
      {
        name: 'Variant A (Fluorinated)',
        changes: 'Added fluorine at C4 of the aniline ring.',
        impact: 'Fills hydrophobic pocket near Phe856 and increases metabolic stability.',
        bindingImprovement: '+12% Binding Affinity',
        dockingImprovement: '-0.8 kcal/mol',
        dockingScore: -10.0,
        confidence: 91
      },
      {
        name: 'Variant B (Gefitinib-Hybrid)',
        changes: 'Replaced C6 methoxyethoxy with morpholinopropoxy.',
        impact: 'Reduces flexibility, locks ligand shape, and targets Lys745 via morpholine nitrogen coordinate interactions.',
        bindingImprovement: '+18% Binding Affinity',
        dockingImprovement: '-1.3 kcal/mol',
        dockingScore: -10.5,
        confidence: 94
      },
      {
        name: 'Variant C (Covalent Acrylamide)',
        changes: 'Replaced aniline alkyne with a reactive acrylamide group targeting Cys797.',
        impact: 'Enables irreversible covalent adduct formation, completely shutting down kinase activity.',
        bindingImprovement: '+45% Effective Potency',
        dockingImprovement: '-3.1 kcal/mol (Covalent mode)',
        dockingScore: -12.3,
        confidence: 96
      }
    ],
    dockingReadinessScore: 95,
    predictedDockingOriginal: -9.2,
    finalDecision: 'HIGH PRIORITY FOR DOCKING',
    finalDecisionJustification: 'Erlotinib exhibits ideal Lipinski parameters, exceptional electrostatic/shape fit in the ATP-binding pocket, and forms a key hinge hydrogen bond with MET793. Highly recommended for standard or covalent docking protocols.',
    atoms3d: [
      // Simulated 3D coordinates for Visualizer (x, y, z, element, isLigand, residue, number, heatmap)
      // Protein Active Site nodes (Ribbon backbone + sidechain tips)
      { x: -5, y: 10, z: -2, element: 'N', isLigand: false, residueName: 'MET', residueNumber: 793 },
      { x: -4, y: 9, z: -1, element: 'C', isLigand: false, residueName: 'MET', residueNumber: 793 },
      { x: -4.5, y: 8, z: 0, element: 'O', isLigand: false, residueName: 'MET', residueNumber: 793 },
      { x: -3.5, y: 8.5, z: 1.5, element: 'S', isLigand: false, residueName: 'MET', residueNumber: 793, heatmapValue: 'green' }, // interaction point

      { x: -10, y: 5, z: -5, element: 'C', isLigand: false, residueName: 'LEU', residueNumber: 718 },
      { x: -9, y: 4, z: -4, element: 'C', isLigand: false, residueName: 'LEU', residueNumber: 718, heatmapValue: 'green' },
      { x: 3, y: 8, z: -8, element: 'O', isLigand: false, residueName: 'THR', residueNumber: 790 },
      { x: 2.5, y: 7.2, z: -7, element: 'C', isLigand: false, residueName: 'THR', residueNumber: 790, heatmapValue: 'yellow' },
      { x: 8, y: -4, z: -2, element: 'N', isLigand: false, residueName: 'LYS', residueNumber: 745 },
      { x: -2, y: -6, z: 8, element: 'O', isLigand: false, residueName: 'ASP', residueNumber: 855, heatmapValue: 'red' }, // clash/charge mismatch risk

      // Ligand Atoms (Erlotinib quinazoline core + wings)
      { x: -3.5, y: 4.5, z: 0.5, element: 'N', isLigand: true, heatmapValue: 'green' }, // N3 coordinates with Met793
      { x: -2.2, y: 4.8, z: 0.8, element: 'C', isLigand: true },
      { x: -1.2, y: 3.8, z: 0.4, element: 'N', isLigand: true },
      { x: -1.5, y: 2.5, z: -0.3, element: 'C', isLigand: true },
      { x: -2.8, y: 2.1, z: -0.6, element: 'C', isLigand: true },
      { x: -3.8, y: 3.2, z: -0.2, element: 'C', isLigand: true },
      
      // Aniline Ring
      { x: -0.5, y: 1.5, z: -0.8, element: 'N', isLigand: true },
      { x: 0.8, y: 1.8, z: -1.2, element: 'C', isLigand: true },
      { x: 1.4, y: 3.0, z: -0.9, element: 'C', isLigand: true },
      { x: 2.7, y: 3.2, z: -1.4, element: 'C', isLigand: true },
      { x: 3.4, y: 2.2, z: -2.1, element: 'C', isLigand: true, heatmapValue: 'green' }, // near Leu844
      { x: 2.8, y: 1.0, z: -2.4, element: 'C', isLigand: true },
      { x: 1.5, y: 0.8, z: -1.9, element: 'C', isLigand: true },
      // Alkyne
      { x: 4.8, y: 2.4, z: -2.6, element: 'C', isLigand: true },
      { x: 6.0, y: 2.6, z: -3.0, element: 'C', isLigand: true },

      // Alkoxy chains
      { x: -3.1, y: 0.8, z: -1.3, element: 'O', isLigand: true },
      { x: -4.4, y: 0.4, z: -1.7, element: 'C', isLigand: true },
      { x: -4.3, y: -0.9, z: -2.4, element: 'C', isLigand: true },
      { x: -5.5, y: -1.4, z: -2.8, element: 'O', isLigand: true },
      { x: -5.4, y: -2.7, z: -3.4, element: 'C', isLigand: true },

      { x: -5.1, y: 3.0, z: -0.5, element: 'O', isLigand: true },
      { x: -6.1, y: 3.9, z: -0.1, element: 'C', isLigand: true },
      { x: -7.4, y: 3.5, z: -0.7, element: 'C', isLigand: true },
      { x: -7.6, y: 2.1, z: -0.5, element: 'O', isLigand: true },
      { x: -8.8, y: 1.7, z: -1.0, element: 'C', isLigand: true }
    ],
    bonds3d: [
      // Hinge hydrogen bond
      { from: 3, to: 10, isLigand: false, type: 'hydrogen' }, // Met793 N to Quinazoline N3
      
      // Ligand bonds
      { from: 10, to: 11, isLigand: true },
      { from: 11, to: 12, isLigand: true, type: 'double' },
      { from: 12, to: 13, isLigand: true },
      { from: 13, to: 14, isLigand: true, type: 'double' },
      { from: 14, to: 15, isLigand: true },
      { from: 15, to: 10, isLigand: true },
      { from: 13, to: 16, isLigand: true }, // N linker
      { from: 16, to: 17, isLigand: true }, // to Aniline
      { from: 17, to: 18, isLigand: true, type: 'aromatic' },
      { from: 18, to: 19, isLigand: true, type: 'aromatic' },
      { from: 19, to: 20, isLigand: true, type: 'aromatic' },
      { from: 20, to: 21, isLigand: true, type: 'aromatic' },
      { from: 21, to: 22, isLigand: true, type: 'aromatic' },
      { from: 22, to: 17, isLigand: true, type: 'aromatic' },
      { from: 20, to: 23, isLigand: true }, // alkyne link
      { from: 23, to: 24, isLigand: true, type: 'double' }, // triple bond simulated as double

      // Side chains
      { from: 14, to: 25, isLigand: true },
      { from: 25, to: 26, isLigand: true },
      { from: 26, to: 27, isLigand: true },
      { from: 27, to: 28, isLigand: true },
      { from: 28, to: 29, isLigand: true },

      { from: 15, to: 30, isLigand: true },
      { from: 30, to: 31, isLigand: true },
      { from: 31, to: 32, isLigand: true },
      { from: 32, to: 33, isLigand: true },
      { from: 33, to: 34, isLigand: true }
    ]
  },
  {
    id: 'cox2-celecoxib',
    name: 'COX-2 + Celecoxib',
    protein: {
      name: 'Cyclooxygenase-2',
      id: '3LN1',
      organism: 'Homo sapiens (Human)',
      resolution: '2.40 Å',
      chains: 'Chain A / Chain B dimers',
      aminoAcids: 587,
      mw: '68.7 kDa',
      stabilityScore: 89,
      activeSiteScore: 91,
      pocketScore: 93,
      pocketVolume: '1040 Å³',
      pocketDepth: '21.2 Å',
      activeSiteResidues: ['ARG120', 'TYR355', 'VAL349', 'ALA527', 'VAL523', 'ARG513', 'HIS90', 'LEU359']
    },
    ligand: {
      name: 'Celecoxib (Celebrex)',
      formula: 'C17H14F3N3O2S',
      mw: 381.37,
      logp: 3.53,
      tpsa: 86.4,
      hbDonors: 1,
      hbAcceptors: 5,
      rotatableBonds: 4,
      aromaticRings: 3,
      ringCount: 3,
      complexity: 412,
      syntheticAccessibility: 2.1,
      smiles: 'CC1=CC=C(C=C1)C2=CC(=NN2C3=CC=C(C=C3)S(=O)(=O)N)C(F)(F)F'
    },
    drugLikeness: [
      {
        metric: 'Molecular Weight',
        value: '381.37 g/mol (< 500)',
        status: 'Pass',
        explanation: 'Favorable molecular weight providing good bioavailability.',
        drugImpact: 'Supports target selectivity and limits non-specific toxicity.',
        dockingImpact: 'Sufficiently compact to fit into the specific hydrophilic side pocket of COX-2.'
      },
      {
        metric: 'LogP (Lipophilicity)',
        value: '3.53 (0 - 5)',
        status: 'Pass',
        explanation: 'Moderately hydrophobic, which allows crossing lipid membranes while remaining soluble.',
        drugImpact: 'Ensures efficient tissue distribution to inflammatory sites.',
        dockingImpact: 'Anchors the central pyrazole and tolyl rings in the hydrophobic main channel of the enzyme.'
      },
      {
        metric: 'HB Donors',
        value: '1 (<= 5)',
        status: 'Pass',
        explanation: 'Enables targeted hydrogen bonding via the primary sulfonamide group.',
        drugImpact: 'Low hydrogen-bond donor count ensures cell permeability.',
        dockingImpact: 'Crucial for coordinating with ARG513 and HIS90 inside the selective COX-2 pocket.'
      },
      {
        metric: 'HB Acceptors',
        value: '5 (<= 10)',
        status: 'Pass',
        explanation: 'Optimal amount of nitrogen, oxygen, and fluorine atoms to coordinate bonds.',
        drugImpact: 'Minimizes solvation drag during membrane transport.',
        dockingImpact: 'Sulfonamide oxygens interact strongly with positive charge pockets.'
      },
      {
        metric: 'TPSA',
        value: '86.4 Å² (< 140)',
        status: 'Pass',
        explanation: 'Polar surface area is well within the limits for active oral absorption.',
        drugImpact: 'Correlates with high fractional absorption in patients.',
        dockingImpact: 'Reflects balanced hydrophilicity/lipophilicity profile inside the active site cleft.'
      },
      {
        metric: 'Rotatable Bonds',
        value: '4 (<= 10)',
        status: 'Pass',
        explanation: 'Rigid scaffold with minimal free-rotating groups.',
        drugImpact: 'Maintains strict conformation reducing binding to off-target receptors (e.g., COX-1).',
        dockingImpact: 'Very low conformational search space, leading to highly reproducible docking scores.'
      }
    ],
    compatibility: {
      hydrophobic: 88,
      electrostatic: 92,
      shapeFit: 89,
      hBond: 94,
      pocketComp: 91,
      hydrophobicExplain: 'The phenyl and trifluoromethyl groups coordinate well with Ala527 and Val349 hydrophobic walls.',
      electrostaticExplain: 'The primary sulfonamide group matches the highly polar positive charges near Arg513.',
      shapeFitExplain: 'Fits neatly into the selective side pocket of COX-2, which is larger than COX-1 due to an Ile-to-Val substitution at position 523.',
      hBondExplain: 'Sulfonamide NH2 acts as a powerful hydrogen-bond donor to the carboxylate of ARG513 and PHE518 backbone.',
      pocketCompExplain: 'Achieves high isoform selectivity by occupying the secondary hydrophobic pocket exclusive to COX-2.'
    },
    bindingProbability: 87,
    bindingProbabilityReason: 'The primary sulfonamide group fits perfectly into the selective side-pocket of COX-2, forming essential hydrogen bonds with ARG513, while the trifluoromethyl group fits into the hydrophobic pocket.',
    interactions: [
      {
        type: 'Hydrogen Bond',
        residue: 'ARG513',
        strength: 'Strong',
        confidence: 96,
        reason: 'Sulfonamide oxygen coordinated with Arg513 guanidinium group. Distance is 2.76Å.'
      },
      {
        type: 'Salt Bridge',
        residue: 'HIS90',
        strength: 'Medium',
        confidence: 85,
        reason: 'Sulfonamide nitrogen anion coordinating with histidine imidazole ring.'
      },
      {
        type: 'Hydrophobic Contact',
        residue: 'VAL523',
        strength: 'Strong',
        confidence: 91,
        reason: 'Trifluoromethyl group fitting in the channel made accessible by the Val523 gatekeeper residue.'
      },
      {
        type: 'Pi-Pi Interaction',
        residue: 'TYR355',
        strength: 'Medium',
        confidence: 79,
        reason: 'Tolyl ring pi-stacking with tyrosine phenol ring.'
      }
    ],
    alerts: [
      {
        type: 'Sulfonamide Alert',
        severity: 'Medium',
        description: 'Sulfonamide moiety is a known pharmacological alert for drug allergies in a subset of patients.'
      }
    ],
    optimizations: [
      {
        suggestion: 'Modify the methyl group on the tolyl ring to a methoxy group.',
        reason: 'To explore potential hydrogen bonding with Tyr355 and enhance pocket fit.',
        benefit: 'Slightly improves solubility and opens new polar contacts.',
        confidence: 74
      },
      {
        suggestion: 'Replace the trifluoromethyl group with a cyclopropyl ring.',
        reason: 'To reduce fluorine accumulation in tissues while preserving pocket occupancy and hydrophobic contacts.',
        benefit: 'Reduces metabolic toxicity risks with comparable binding scores.',
        confidence: 80
      }
    ],
    variants: [
      {
        name: 'Variant A (Methoxy derivative)',
        changes: 'Replaced 4-methylphenyl with 4-methoxyphenyl.',
        impact: 'Introduces a polar oxygen atom which coordinate bonds with surrounding hydration shell.',
        bindingImprovement: '+4% Binding Affinity',
        dockingImprovement: '-0.2 kcal/mol',
        dockingScore: -8.8,
        confidence: 78
      },
      {
        name: 'Variant B (Cyclopropyl bioisostere)',
        changes: 'Replaced trifluoromethyl with a cyclopropyl ring.',
        impact: 'Maintains shape complement but eliminates fluorinated metabolites.',
        bindingImprovement: '+2% Binding Affinity',
        dockingImprovement: '-0.1 kcal/mol',
        dockingScore: -8.7,
        confidence: 82
      }
    ],
    dockingReadinessScore: 92,
    predictedDockingOriginal: -8.6,
    finalDecision: 'HIGH PRIORITY FOR DOCKING',
    finalDecisionJustification: 'Excellent selectivity profile due to Val523 side-pocket interaction. Strong polar network formed by the primary sulfonamide group. Fits directly into standard COX-2 screening panels.',
    atoms3d: [
      { x: -2, y: 8, z: 1, element: 'N', isLigand: false, residueName: 'ARG', residueNumber: 513 },
      { x: -1.2, y: 7.2, z: 0, element: 'C', isLigand: false, residueName: 'ARG', residueNumber: 513 },
      { x: -0.5, y: 6.5, z: -1, element: 'N', isLigand: false, residueName: 'ARG', residueNumber: 513, heatmapValue: 'green' },

      { x: 5, y: 6, z: -3, element: 'C', isLigand: false, residueName: 'VAL', residueNumber: 523 },
      { x: 4.2, y: 5.1, z: -2, element: 'C', isLigand: false, residueName: 'VAL', residueNumber: 523, heatmapValue: 'green' },

      { x: -6, y: 2, z: 4, element: 'N', isLigand: false, residueName: 'HIS', residueNumber: 90 },
      { x: -5, y: 1.2, z: 3.5, element: 'C', isLigand: false, residueName: 'HIS', residueNumber: 90, heatmapValue: 'yellow' },

      // Celecoxib Ligand
      // Sulfonamide phenyl ring
      { x: -1.5, y: 3.2, z: 0.2, element: 'S', isLigand: true, heatmapValue: 'green' }, // coordinates with Arg513
      { x: -2.1, y: 2.1, z: -0.8, element: 'O', isLigand: true },
      { x: -0.9, y: 4.1, z: 1.1, element: 'O', isLigand: true },
      { x: -2.8, y: 4.0, z: -0.6, element: 'N', isLigand: true }, // sulfonamide NH2

      { x: -0.2, y: 2.2, z: -0.5, element: 'C', isLigand: true },
      { x: 0.9, y: 2.7, z: -1.1, element: 'C', isLigand: true },
      { x: 1.9, y: 1.9, z: -1.6, element: 'C', isLigand: true },
      { x: 1.7, y: 0.5, z: -1.5, element: 'C', isLigand: true },
      { x: 0.6, y: 0.0, z: -0.9, element: 'C', isLigand: true },
      { x: -0.4, y: 0.8, z: -0.4, element: 'C', isLigand: true },

      // Central pyrazole
      { x: 2.7, y: -0.4, z: -2.0, element: 'N', isLigand: true },
      { x: 3.9, y: 0.1, z: -2.4, element: 'N', isLigand: true },
      { x: 4.6, y: -1.0, z: -2.7, element: 'C', isLigand: true },
      { x: 3.8, y: -2.1, z: -2.5, element: 'C', isLigand: true },
      { x: 2.6, y: -1.7, z: -2.0, element: 'C', isLigand: true },

      // Tolyl ring (attached to pyrazole)
      { x: 1.4, y: -2.6, z: -1.7, element: 'C', isLigand: true },
      { x: 1.5, y: -4.0, z: -1.5, element: 'C', isLigand: true },
      { x: 0.4, y: -4.8, z: -1.2, element: 'C', isLigand: true },
      { x: -0.8, y: -4.3, z: -1.1, element: 'C', isLigand: true },
      { x: -0.9, y: -2.9, z: -1.3, element: 'C', isLigand: true },
      { x: 0.2, y: -2.1, z: -1.6, element: 'C', isLigand: true },
      // methyl on tolyl
      { x: -2.1, y: -5.1, z: -0.7, element: 'C', isLigand: true },

      // CF3 (attached to pyrazole)
      { x: 5.9, y: -1.0, z: -3.2, element: 'C', isLigand: true },
      { x: 6.7, y: -2.0, z: -2.8, element: 'F', isLigand: true, heatmapValue: 'green' }, // fits near Val523
      { x: 6.4, y: -0.0, z: -2.9, element: 'F', isLigand: true },
      { x: 5.8, y: -1.1, z: -4.5, element: 'F', isLigand: true }
    ],
    bonds3d: [
      { from: 2, to: 10, isLigand: false, type: 'hydrogen' }, // Arg513 to Sulfonamide
      { from: 10, to: 7, isLigand: true }, // S to phenyl ring
      { from: 7, to: 8, isLigand: true, type: 'double' },
      { from: 7, to: 9, isLigand: true, type: 'double' },
      { from: 7, to: 10, isLigand: true },

      { from: 11, to: 12, isLigand: true },
      { from: 12, to: 13, isLigand: true, type: 'double' },
      { from: 13, to: 14, isLigand: true },
      { from: 14, to: 15, isLigand: true, type: 'double' },
      { from: 15, to: 16, isLigand: true },
      { from: 16, to: 11, isLigand: true, type: 'double' },
      { from: 14, to: 17, isLigand: true }, // phenyl to pyrazole N

      { from: 17, to: 18, isLigand: true },
      { from: 18, to: 19, isLigand: true, type: 'double' },
      { from: 19, to: 20, isLigand: true },
      { from: 20, to: 21, isLigand: true, type: 'double' },
      { from: 21, to: 17, isLigand: true },

      // tolyl
      { from: 21, to: 22, isLigand: true },
      { from: 22, to: 23, isLigand: true, type: 'double' },
      { from: 23, to: 24, isLigand: true },
      { from: 24, to: 25, isLigand: true, type: 'double' },
      { from: 25, to: 26, isLigand: true },
      { from: 26, to: 27, isLigand: true, type: 'double' },
      { from: 27, to: 22, isLigand: true },
      { from: 25, to: 28, isLigand: true }, // tolyl methyl

      // CF3
      { from: 19, to: 29, isLigand: true },
      { from: 29, to: 30, isLigand: true },
      { from: 29, to: 31, isLigand: true },
      { from: 29, to: 32, isLigand: true }
    ]
  },
  {
    id: 'hiv-ritonavir',
    name: 'HIV Protease + Ritonavir',
    protein: {
      name: 'HIV-1 Protease',
      id: '1HXW',
      organism: 'Human immunodeficiency virus 1',
      resolution: '1.80 Å',
      chains: 'Chain A, Chain B (Homodimer)',
      aminoAcids: 198,
      mw: '21.5 kDa',
      stabilityScore: 94,
      activeSiteScore: 96,
      pocketScore: 97,
      pocketVolume: '1450 Å³',
      pocketDepth: '28.6 Å',
      activeSiteResidues: ['ASP25', 'ASP25\'', 'GLY27', 'ILE50', 'ILE50\'', 'VAL82', 'ASP29', 'ASP30']
    },
    ligand: {
      name: 'Ritonavir (Norvir)',
      formula: 'C37H48N6O5S2',
      mw: 720.94,
      logp: 5.4,
      tpsa: 147.2,
      hbDonors: 4,
      hbAcceptors: 11,
      rotatableBonds: 18,
      aromaticRings: 4,
      ringCount: 4,
      complexity: 928,
      syntheticAccessibility: 4.8,
      smiles: 'CC(C)C1=NC(=CS1)CN(C)C(=O)NC(C(C)C)C(=O)NC(CC2=CC=CC=C2)CC(C(CC3=CC=CC=C3)NC(=O)OCC4=CN=CS4)O'
    },
    drugLikeness: [
      {
        metric: 'Molecular Weight',
        value: '720.94 g/mol (> 500)',
        status: 'Fail',
        explanation: 'Exceeds standard Lipinski limit of 500 g/mol, typical of peptidomimetic protease inhibitors.',
        drugImpact: 'Leads to poor passive membrane absorption and high dependence on active transport or formulation.',
        dockingImpact: 'Large structural footprint which fills the C2-symmetrical active site cavity but carries significant risk of boundary steric clashes.'
      },
      {
        metric: 'LogP (Lipophilicity)',
        value: '5.40 (> 5.0)',
        status: 'Fail',
        explanation: 'Highly lipophilic, exceeding Lipinski threshold. Promotes strong plasma protein binding.',
        drugImpact: 'High risk of off-target toxicity and rapid hepatic clearance via cytochrome P450 pathway.',
        dockingImpact: 'Drives non-specific hydrophobic clustering, making true binding conformation scoring challenging.'
      },
      {
        metric: 'HB Donors',
        value: '4 (<= 5)',
        status: 'Pass',
        explanation: 'Meets criteria. Enables peptidomimetic hydrogen bonding to the protease flaps.',
        drugImpact: 'Retains sufficient cell permeability despite high molecular weight.',
        dockingImpact: 'Coordinates vital structural water molecule (the structural water bridge) that connects the ligand to the Ile50/Ile50\' residues.'
      },
      {
        metric: 'HB Acceptors',
        value: '11 (> 10)',
        status: 'Fail',
        explanation: 'Slightly exceeds standard donor threshold due to multiple peptide bonds and thiazole rings.',
        drugImpact: 'Increases desolvation penalty, lowering cell absorption rates.',
        dockingImpact: 'Provides rich hydrogen bonding capacity across the long symmetric binding channel.'
      },
      {
        metric: 'TPSA',
        value: '147.2 Å² (> 140)',
        status: 'Moderate',
        explanation: 'Slightly exceeds the 140Å² ceiling, leading to reduced cell penetration.',
        drugImpact: 'Lowers oral absorption rate, requiring formulation as soft gel capsules.',
        dockingImpact: 'Correlates with high surface electrostatic complement within the core pocket.'
      },
      {
        metric: 'Rotatable Bonds',
        value: '18 (> 10)',
        status: 'Fail',
        explanation: 'Extremely flexible molecule, carrying substantial entropy penalty.',
        drugImpact: 'Subject to swift metabolic degradation and conformational flexibility effects.',
        dockingImpact: 'Creates a vast conformational search space. Standard docking runs may fail to converge without rigid ligand constraints.'
      }
    ],
    compatibility: {
      hydrophobic: 94,
      electrostatic: 81,
      shapeFit: 92,
      hBond: 95,
      pocketComp: 90,
      hydrophobicExplain: 'Symmetric benzyl groups fit snuggly into the hydrophobic S1 and S1\' subpockets of the protease.',
      electrostaticExplain: 'Carbonyl groups align to form strong hydrogen bonds, though the bulky thiazole groups can create local repulsion.',
      shapeFitExplain: 'Peptidomimetic backbone mimics the natural transition state peptide, laying flat along the active site cleft.',
      hBondExplain: 'Creates a direct hydrogen bond between the central secondary alcohol hydroxyl group and the catalytic Asp25/Asp25\' residues.',
      pocketCompExplain: 'Superbly fills the large homodimeric cavity, effectively locking the dynamic glycine-rich flaps in the closed state.'
    },
    bindingProbability: 91,
    bindingProbabilityReason: 'Highly potent because it directly coordinates with the catalytic ASP25/ASP25\' dyad and fills all S1-S2 subpockets. However, Lipinski violations suggest low drug-likeness, although its molecular binding probability remains very high.',
    interactions: [
      {
        type: 'Hydrogen Bond',
        residue: 'ASP25',
        strength: 'Strong',
        confidence: 99,
        reason: 'Central hydroxyl group acts as H-donor to the carboxylate of ASP25. Critical catalytic interaction.'
      },
      {
        type: 'Hydrogen Bond',
        residue: 'ASP25\'',
        strength: 'Strong',
        confidence: 99,
        reason: 'Central hydroxyl group acts as H-donor to the catalytic partner ASP25\' carboxylate.'
      },
      {
        type: 'Water Bridge',
        residue: 'ILE50',
        strength: 'Strong',
        confidence: 93,
        reason: 'Urea carbonyl oxygen coordinates with a conserved water molecule, which in turn hydrogen bonds to the amide backbones of ILE50 and ILE50\' in the flexible flaps.'
      },
      {
        type: 'Hydrophobic Contact',
        residue: 'VAL82',
        strength: 'Strong',
        confidence: 89,
        reason: 'Isopropyl-thiazole arm fits into the hydrophobic S2 subpocket.'
      }
    ],
    alerts: [
      {
        type: 'Lipinski Violation',
        severity: 'High',
        description: 'Violates MW (>500), LogP (>5.0), and HB Acceptors (>10). High risk of poor oral bioavailability.'
      },
      {
        type: 'Excessive Rotatable Bonds',
        severity: 'Critical',
        description: '18 rotatable bonds generate excessive conformational entropy loss upon binding and complicate docking runs.'
      }
    ],
    optimizations: [
      {
        suggestion: 'Introduce rigid cyclization along the core peptidomimetic backbone.',
        reason: 'To reduce the number of rotatable bonds and pre-organize the ligand into its active binding conformation, mimicking Lopinavir.',
        benefit: 'Lowers rotatable bonds from 18 to 12 and reduces entropy penalty by ~2.5 kcal/mol.',
        confidence: 94
      },
      {
        suggestion: 'Reduce the sizes of the terminal thiazole/isopropyl groups.',
        reason: 'To lower total molecular weight and TPSA, shifting the compound closer to Lipinski compliance.',
        benefit: 'Improves synthetic accessibility and intestinal absorption.',
        confidence: 81
      }
    ],
    variants: [
      {
        name: 'Variant A (Lopinavir-like core)',
        changes: 'Cyclized the central diamino-alcohol core with a cyclic urea/tetrahydro-pyrimidinone.',
        impact: 'Locks backbone conformation, maintaining perfect alignment with Asp25 while avoiding flap entropy penalties.',
        bindingImprovement: '+24% Binding Affinity',
        dockingImprovement: '-1.8 kcal/mol',
        dockingScore: -11.6,
        confidence: 95
      },
      {
        name: 'Variant B (Truncated Thiazole)',
        changes: 'Removed one terminal isopropyl-thiazole wing.',
        impact: 'Reduces molecular weight to 612 g/mol and rotatable bonds to 13. Improves cell permeability.',
        bindingImprovement: '-8% Binding Affinity (loss of S2 contact)',
        dockingImprovement: '+0.5 kcal/mol (worse score, but better drug profile)',
        dockingScore: -9.3,
        confidence: 87
      }
    ],
    dockingReadinessScore: 78,
    predictedDockingOriginal: -9.8,
    finalDecision: 'MODERATE PRIORITY',
    finalDecisionJustification: 'Strong binding capability and flap coordination. However, due to high flexibility (18 rotatable bonds) and large volume, standard docking requires long search runs (high exhaustiveness) and may fail to identify the exact water-mediated flap bridge without adding explicit water molecules.',
    atoms3d: [
      // HIV Protease Homodimer catalytic residues
      { x: -0.5, y: 1.2, z: 0, element: 'O', isLigand: false, residueName: 'ASP', residueNumber: 25 },
      { x: 0.5, y: 1.2, z: 0, element: 'O', isLigand: false, residueName: 'ASP', residueNumber: 25, heatmapValue: 'green' }, // ASP25'

      { x: -5, y: 10, z: 2, element: 'N', isLigand: false, residueName: 'ILE', residueNumber: 50 },
      { x: 5, y: 10, z: 2, element: 'N', isLigand: false, residueName: 'ILE', residueNumber: 50, heatmapValue: 'green' }, // Conserved water bridge area

      { x: -8, y: -6, z: -4, element: 'C', isLigand: false, residueName: 'VAL', residueNumber: 82 },
      { x: 8, y: -6, z: -4, element: 'C', isLigand: false, residueName: 'VAL', residueNumber: 82, heatmapValue: 'yellow' },

      // Ritonavir Ligand atoms
      { x: 0.0, y: -0.2, z: -0.2, element: 'O', isLigand: true, heatmapValue: 'green' }, // Central hydroxyl oxygen (H-bonds with ASP25)
      { x: -0.2, y: -1.4, z: 0.3, element: 'C', isLigand: true },
      
      // Benzyl groups
      { x: -1.5, y: -1.8, z: -0.4, element: 'C', isLigand: true },
      { x: -2.7, y: -1.0, z: 0.1, element: 'C', isLigand: true },
      { x: -3.8, y: -1.5, z: 0.8, element: 'C', isLigand: true },
      { x: -4.8, y: -0.7, z: 1.2, element: 'C', isLigand: true, heatmapValue: 'green' }, // pocket S1
      { x: -4.7, y: 0.6, z: 0.9, element: 'C', isLigand: true },
      { x: -3.6, y: 1.1, z: 0.2, element: 'C', isLigand: true },
      { x: -2.6, y: 0.3, z: -0.2, element: 'C', isLigand: true },

      { x: 1.2, y: -2.0, z: -0.1, element: 'C', isLigand: true },
      { x: 2.3, y: -1.2, z: 0.6, element: 'C', isLigand: true },
      { x: 3.5, y: -1.9, z: 1.1, element: 'C', isLigand: true },
      { x: 4.5, y: -1.1, z: 1.7, element: 'C', isLigand: true, heatmapValue: 'green' }, // pocket S1'
      { x: 4.4, y: 0.2, z: 1.8, element: 'C', isLigand: true },
      { x: 3.3, y: 0.9, z: 1.3, element: 'C', isLigand: true },
      { x: 2.3, y: 0.2, z: 0.7, element: 'C', isLigand: true },

      // Peptide bonds + flanking
      { x: -0.4, y: -2.8, z: 1.2, element: 'N', isLigand: true },
      { x: -1.3, y: -3.5, z: 1.8, element: 'C', isLigand: true },
      { x: -1.0, y: -4.6, z: 2.4, element: 'O', isLigand: true }, // Flap bridge coordinate point
      { x: 1.5, y: -3.4, z: -0.5, element: 'N', isLigand: true },
      { x: 2.7, y: -3.9, z: -1.1, element: 'C', isLigand: true },
      { x: 2.6, y: -5.1, z: -1.5, element: 'O', isLigand: true }
    ],
    bonds3d: [
      { from: 1, to: 6, isLigand: false, type: 'hydrogen' }, // ASP25' to OH
      
      // Ligand chain
      { from: 6, to: 7, isLigand: true },
      { from: 7, to: 8, isLigand: true },
      { from: 8, to: 9, isLigand: true },
      { from: 9, to: 10, isLigand: true, type: 'double' },
      { from: 10, to: 11, isLigand: true },
      { from: 11, to: 12, isLigand: true, type: 'double' },
      { from: 12, to: 13, isLigand: true },
      { from: 13, to: 14, isLigand: true, type: 'double' },
      { from: 14, to: 9, isLigand: true }, // loop

      { from: 7, to: 15, isLigand: true },
      { from: 15, to: 16, isLigand: true },
      { from: 16, to: 17, isLigand: true, type: 'double' },
      { from: 17, to: 18, isLigand: true },
      { from: 18, to: 19, isLigand: true, type: 'double' },
      { from: 19, to: 20, isLigand: true },
      { from: 20, to: 21, isLigand: true, type: 'double' },
      { from: 21, to: 16, isLigand: true }, // loop

      { from: 7, to: 22, isLigand: true },
      { from: 22, to: 23, isLigand: true },
      { from: 23, to: 24, isLigand: true, type: 'double' },
      { from: 7, to: 25, isLigand: true },
      { from: 25, to: 26, isLigand: true },
      { from: 26, to: 27, isLigand: true, type: 'double' }
    ]
  },
  {
    id: 'braf-vemurafenib',
    name: 'BRAF V600E + Vemurafenib',
    protein: {
      name: 'BRAF Kinase (V600E Mutant)',
      id: '3OG7',
      organism: 'Homo sapiens (Human)',
      resolution: '2.50 Å',
      chains: 'Chain A (Kinase Domain)',
      aminoAcids: 289,
      mw: '33.1 kDa',
      stabilityScore: 91,
      activeSiteScore: 95,
      pocketScore: 94,
      pocketVolume: '920 Å³',
      pocketDepth: '19.1 Å',
      activeSiteResidues: ['CYS532', 'GLU501', 'ASP594', 'PHE595', 'LYS483', 'ILE463', 'VAL471', 'LEU514']
    },
    ligand: {
      name: 'Vemurafenib (Zelboraf)',
      formula: 'C23H18ClF2N3O3S',
      mw: 489.92,
      logp: 3.82,
      tpsa: 98.4,
      hbDonors: 2,
      hbAcceptors: 6,
      rotatableBonds: 6,
      aromaticRings: 4,
      ringCount: 4,
      complexity: 615,
      syntheticAccessibility: 3.4,
      smiles: 'CCCS(=O)(=O)NC1=C(C(=C(C=C1)F)F)C(=O)C2=CN=C(N=C2)NC3=CC=C(C=C3)Cl'
    },
    drugLikeness: [
      {
        metric: 'Molecular Weight',
        value: '489.92 g/mol (< 500)',
        status: 'Pass',
        explanation: 'Very close to the 500 g/mol limit, but maintains standard compliance.',
        drugImpact: 'Ensures oral dosing is viable but requires monitoring for solubility trends.',
        dockingImpact: 'Fills the deep ATP cleft while extending into the activation loop mutant pocket.'
      },
      {
        metric: 'LogP (Lipophilicity)',
        value: '3.82 (0 - 5)',
        status: 'Pass',
        explanation: 'Favorable lipophilic index, ensures high binding affinity to greasy pockets.',
        drugImpact: 'High protein binding in plasma; target saturation requires specific dosing strategies.',
        dockingImpact: 'Enables targeted interactions with mutant specific hydrophobic clefts around the V600E cluster.'
      },
      {
        metric: 'HB Donors',
        value: '2 (<= 5)',
        status: 'Pass',
        explanation: 'Allows two key hydrogen-bonding anchors (sulfonamide amide and kinase hinge amine).',
        drugImpact: 'Facilitates cellular entry through passive transport.',
        dockingImpact: 'Anchors the ligand to CYS532 backbone amide and the ASP594/GLU501 loop.'
      },
      {
        metric: 'HB Acceptors',
        value: '6 (<= 10)',
        status: 'Pass',
        explanation: 'Provides sufficient electronegativity profile without polar burden.',
        drugImpact: 'Conforms to guidelines for good oral bioavailability.',
        dockingImpact: 'Matches hydrogen bond donor residues in the kinase hinge region.'
      },
      {
        metric: 'TPSA',
        value: '98.4 Å² (< 140)',
        status: 'Pass',
        explanation: 'Polar surface area is below threshold, indicating good drug-likeness.',
        drugImpact: 'Consistent with acceptable passive membrane absorption.',
        dockingImpact: 'Indicates minor desolvation energy penalty when transitioning from solvent to pocket.'
      },
      {
        metric: 'Rotatable Bonds',
        value: '6 (<= 10)',
        status: 'Pass',
        explanation: 'Exhibits moderate flexibility, particularly in the propyl-sulfonamide chain.',
        drugImpact: 'Low probability of major conformational changes upon absorption.',
        dockingImpact: 'Acceptable conformational search space during flexible docking.'
      }
    ],
    compatibility: {
      hydrophobic: 92,
      electrostatic: 95,
      shapeFit: 94,
      hBond: 96,
      pocketComp: 95,
      hydrophobicExplain: 'The chlorophenyl ring lies in the hydrophobic back pocket, surrounded by Ile463 and Leu514.',
      electrostaticExplain: 'The difluorophenyl core coordinates with positive electrostatic fields near Lys483.',
      shapeFitExplain: 'Specifically designed to fit the active V600E mutant kinase conformation, bypassing wild-type kinase blocks.',
      hBondExplain: 'Creates a double hydrogen bond network: one with CYS532 in the hinge region and another with ASP594 backbone in the DFG motif.',
      pocketCompExplain: 'Superb complementarity with the V600E activation loop conformation, locking it in an inactive state.'
    },
    bindingProbability: 91,
    bindingProbabilityReason: 'Vemurafenib is highly selective for mutant BRAF V600E. It forms essential hinge interactions with CYS532, and the sulfonamide group anchors into the DFG-out subpocket, interacting with the backbone of ASP594.',
    interactions: [
      {
        type: 'Hydrogen Bond',
        residue: 'CYS532',
        strength: 'Strong',
        confidence: 97,
        reason: 'Hinge region backbone nitrogen coordinates with the azaindole nitrogen/amine linker. Distance is 2.81Å.'
      },
      {
        type: 'Hydrogen Bond',
        residue: 'ASP594',
        strength: 'Strong',
        confidence: 94,
        reason: 'Sulfonamide N-H coordinates with the backbone carbonyl of Asp594 in the DFG motif.'
      },
      {
        type: 'Hydrophobic Contact',
        residue: 'ILE463',
        strength: 'Strong',
        confidence: 90,
        reason: 'Chlorophenyl ring interacts with isoleucine side chain in the hydrophobic back pocket.'
      },
      {
        type: 'Fluorine Interaction',
        residue: 'LYS483',
        strength: 'Medium',
        confidence: 82,
        reason: 'Polar coordinate interaction between lysine amine and fluorine substituents on the central benzene ring.'
      }
    ],
    alerts: [
      {
        type: 'Low Solubility',
        severity: 'Medium',
        description: 'Vemurafenib is highly hydrophobic and displays poor crystalline solubility, requiring formulation.'
      }
    ],
    optimizations: [
      {
        suggestion: 'Replace the propyl chain on the sulfonamide with an ethyl or methyl group.',
        reason: 'To reduce molecular weight and check for binding pocket alignment adjustments.',
        benefit: 'Reduces MW and potential steric friction in the DFG-in pockets.',
        confidence: 76
      },
      {
        suggestion: 'Introduce a hydrophilic tail on the chlorophenyl ring (e.g. morpholine).',
        reason: 'To enhance aqueous solubility without disrupting the core binding mode.',
        benefit: 'Significantly improves pharmacokinetic profiles.',
        confidence: 84
      }
    ],
    variants: [
      {
        name: 'Variant A (Methyl-sulfonamide)',
        changes: 'Replaced propyl-sulfonamide with methyl-sulfonamide.',
        impact: 'Reduces size and molecular weight. Slightly decreases binding affinity due to loss of hydrophobic contacts.',
        bindingImprovement: '-4% Binding Affinity',
        dockingImprovement: '+0.2 kcal/mol',
        dockingScore: -9.6,
        confidence: 89
      },
      {
        name: 'Variant B (Morpholinomethyl chlorophenyl)',
        changes: 'Added morpholinomethyl group to the chlorophenyl ring.',
        impact: 'Maintains hinge binding and pocket coverage while drastically increasing kinetic solubility.',
        bindingImprovement: '+8% Binding Affinity',
        dockingImprovement: '-0.5 kcal/mol',
        dockingScore: -10.3,
        confidence: 92
      }
    ],
    dockingReadinessScore: 94,
    predictedDockingOriginal: -9.8,
    finalDecision: 'HIGH PRIORITY FOR DOCKING',
    finalDecisionJustification: 'Selectively binds mutant BRAF V600E. Exceptional double hydrogen bond anchors with Cys532 and Asp594. Conforms well to Lipinski rules. Highly recommended for docking.',
    atoms3d: [
      // BRAF active residues
      { x: -3, y: 7, z: 2, element: 'N', isLigand: false, residueName: 'CYS', residueNumber: 532 },
      { x: -2.2, y: 6.2, z: 1.5, element: 'O', isLigand: false, residueName: 'CYS', residueNumber: 532, heatmapValue: 'green' },

      { x: 2, y: 5, z: -1, element: 'C', isLigand: false, residueName: 'ASP', residueNumber: 594 },
      { x: 1.2, y: 4.1, z: -0.5, element: 'O', isLigand: false, residueName: 'ASP', residueNumber: 594, heatmapValue: 'green' },

      { x: -7, y: -2, z: -4, element: 'C', isLigand: false, residueName: 'ILE', residueNumber: 463 },
      { x: -6.1, y: -2.8, z: -3.2, element: 'C', isLigand: false, residueName: 'ILE', residueNumber: 463, heatmapValue: 'green' },

      // Vemurafenib Ligand atoms
      // Chlorophenyl wing
      { x: -5.5, y: -0.2, z: -1.0, element: 'Cl', isLigand: true, heatmapValue: 'green' }, // coordinates with Ile463
      { x: -4.2, y: -0.5, z: -0.2, element: 'C', isLigand: true },
      { x: -3.8, y: -1.8, z: 0.3, element: 'C', isLigand: true },
      { x: -2.6, y: -2.1, z: 0.9, element: 'C', isLigand: true },
      { x: -1.7, y: -1.1, z: 0.8, element: 'C', isLigand: true }, // link nitrogen to azaindole
      { x: -2.1, y: 0.2, z: 0.3, element: 'C', isLigand: true },
      { x: -3.4, y: 0.5, z: -0.2, element: 'C', isLigand: true },

      // Azaindole core
      { x: -0.4, y: -1.4, z: 1.2, element: 'N', isLigand: true },
      { x: 0.6, y: -0.6, z: 1.0, element: 'C', isLigand: true },
      { x: 1.8, y: -1.2, z: 1.5, element: 'N', isLigand: true }, // H-bonds with Cys532
      { x: 1.7, y: -2.4, z: 2.1, element: 'C', isLigand: true },
      { x: 0.6, y: -3.2, z: 2.3, element: 'N', isLigand: true },
      { x: -0.5, y: -2.6, z: 1.8, element: 'C', isLigand: true },

      // Central difluorophenyl
      { x: 2.9, y: -0.4, z: 0.8, element: 'C', isLigand: true },
      { x: 4.1, y: -1.0, z: 1.3, element: 'C', isLigand: true },
      { x: 5.2, y: -0.2, z: 1.1, element: 'C', isLigand: true },
      { x: 5.1, y: 1.1, z: 0.5, element: 'C', isLigand: true },
      { x: 3.9, y: 1.6, z: 0.0, element: 'C', isLigand: true },
      { x: 2.8, y: 0.9, z: 0.2, element: 'C', isLigand: true },
      // fluorines
      { x: 4.2, y: -2.2, z: 1.9, element: 'F', isLigand: true },
      { x: 6.3, y: -0.7, z: 1.6, element: 'F', isLigand: true },

      // Sulfonamide and propyl chain
      { x: 6.4, y: 1.9, z: 0.2, element: 'S', isLigand: true, heatmapValue: 'green' }, // H-bonds with Asp594
      { x: 6.8, y: 3.0, z: 1.1, element: 'O', isLigand: true },
      { x: 6.1, y: 2.1, z: -1.2, element: 'O', isLigand: true },
      { x: 7.6, y: 0.8, z: 0.1, element: 'N', isLigand: true },
      { x: 8.9, y: 1.2, z: -0.4, element: 'C', isLigand: true },
      { x: 9.9, y: 0.1, z: -0.3, element: 'C', isLigand: true },
      { x: 11.2, y: 0.5, z: -0.8, element: 'C', isLigand: true }
    ],
    bonds3d: [
      { from: 1, to: 15, isLigand: false, type: 'hydrogen' }, // Cys532 to Azaindole N
      { from: 3, to: 26, isLigand: false, type: 'hydrogen' }, // Asp594 to Sulfonamide S

      // Ligand bonds
      { from: 7, to: 8, isLigand: true },
      { from: 8, to: 9, isLigand: true, type: 'double' },
      { from: 9, to: 10, isLigand: true },
      { from: 10, to: 11, isLigand: true, type: 'double' },
      { from: 11, to: 12, isLigand: true },
      { from: 12, to: 13, isLigand: true, type: 'double' },
      { from: 13, to: 8, isLigand: true },

      { from: 11, to: 14, isLigand: true }, // phenyl to azaindole
      { from: 14, to: 15, isLigand: true },
      { from: 15, to: 16, isLigand: true, type: 'double' },
      { from: 16, to: 17, isLigand: true },
      { from: 17, to: 18, isLigand: true, type: 'double' },
      { from: 18, to: 19, isLigand: true },
      { from: 19, to: 14, isLigand: true, type: 'double' },

      // difluorophenyl
      { from: 15, to: 20, isLigand: true },
      { from: 20, to: 21, isLigand: true, type: 'double' },
      { from: 21, to: 22, isLigand: true },
      { from: 22, to: 23, isLigand: true, type: 'double' },
      { from: 23, to: 24, isLigand: true },
      { from: 24, to: 25, isLigand: true, type: 'double' },
      { from: 25, to: 20, isLigand: true },
      { from: 21, to: 26, isLigand: true }, // F
      { from: 22, to: 27, isLigand: true }, // F

      // sulfonamide
      { from: 23, to: 28, isLigand: true },
      { from: 28, to: 29, isLigand: true, type: 'double' },
      { from: 28, to: 30, isLigand: true, type: 'double' },
      { from: 28, to: 31, isLigand: true },
      { from: 31, to: 32, isLigand: true },
      { from: 32, to: 33, isLigand: true },
      { from: 33, to: 34, isLigand: true }
    ]
  }
];
