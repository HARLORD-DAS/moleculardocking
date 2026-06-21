import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Beaker, Play, Cpu, TrendingUp, Sparkles, Building, Target } from 'lucide-react';

interface Slide {
  title: string;
  subtitle: string;
  category: string;
  content: React.ReactNode;
}

export const PresentationMode: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: Slide[] = [
    {
      category: "THE PROBLEM",
      title: "The Computational Bottleneck in Drug Discovery",
      subtitle: "Molecular docking simulations are slow, resource-heavy, and high-risk.",
      content: (
        <div className="grid md:grid-cols-2 gap-8 items-center h-full">
          <div className="space-y-6 text-left">
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl space-y-2">
              <h4 className="text-red-400 font-bold flex items-center gap-2">
                <Target className="w-5 h-5" /> 90%+ Virtual Screening Failure Rate
              </h4>
              <p className="text-slate-300 text-sm">
                Most selected ligands fail in physical testing due to unseen steric clashes, poor pocket compatibility, and high conformational entropy losses.
              </p>
            </div>
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl space-y-2">
              <h4 className="text-red-400 font-bold flex items-center gap-2">
                <TrendingUp className="w-5 h-5" /> High Computational Waste
              </h4>
              <p className="text-slate-300 text-sm">
                High-Performance Computing (HPC) nodes run millions of docking simulations on molecules destined to fail due to basic chemistry mismatches.
              </p>
            </div>
          </div>
          <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 text-center space-y-4">
            <div className="text-6xl">⏱️</div>
            <h3 className="text-2xl font-bold text-white">8 to 12 Weeks</h3>
            <p className="text-slate-400 text-sm">
              Average simulation time spent identifying binding targets, leading to excessive hardware costs and slow lead-optimization cycles.
            </p>
          </div>
        </div>
      )
    },
    {
      category: "THE SOLUTION",
      title: "AI-Powered Pre-Docking Intelligence Platform",
      subtitle: "Evaluate, screen, and optimize chemical structures before initiating docking runs.",
      content: (
        <div className="grid md:grid-cols-3 gap-6 text-left">
          <div className="p-6 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl space-y-3">
            <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center text-cyan-400 font-bold">
              1
            </div>
            <h4 className="text-white font-semibold">1. Deep Screening</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Instantly predicts binding probability and electrostatic complementarity using custom neural network prediction models.
            </p>
          </div>
          <div className="p-6 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl space-y-3">
            <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center text-cyan-400 font-bold">
              2
            </div>
            <h4 className="text-white font-semibold">2. Smart Modification</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Automates medicinal chemistry suggestions, identifying local clashes and generating optimized variants with high confidence.
            </p>
          </div>
          <div className="p-6 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl space-y-3">
            <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center text-cyan-400 font-bold">
              3
            </div>
            <h4 className="text-white font-semibold">3. Docking Prioritization</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Provides actionable Docking Readiness Scores, ensuring HPC clusters only run high-value binding candidates.
            </p>
          </div>
        </div>
      )
    },
    {
      category: "SCIENTIFIC INNOVATION",
      title: "Bridging Machine Learning and Structural Biology",
      subtitle: "Replacing trial-and-error with neural structural alignments.",
      content: (
        <div className="grid md:grid-cols-2 gap-8 items-center text-left">
          <div className="space-y-4">
            <div className="flex gap-3">
              <Cpu className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
              <div>
                <h5 className="text-white font-semibold">Fast Predictive Scoring</h5>
                <p className="text-slate-400 text-xs">Uses custom neural weights to simulate active pocket interaction maps in milliseconds rather than hours of grid box parameter calculations.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Beaker className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
              <div>
                <h5 className="text-white font-semibold">Dynamic Fragment Optimization</h5>
                <p className="text-slate-400 text-xs">Evaluates chemical edits (fluorination, covalent warheads, rigid sidechains) using preloaded active site residue compatibility indexes.</p>
              </div>
            </div>
          </div>
          <div className="p-6 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-3 text-center">
            <h4 className="text-cyan-400 font-bold text-lg">Predictive Hinge Anchoring</h4>
            <p className="text-slate-300 text-xs">
              Detects spatial coordinate alignments between key peptide main chains (e.g. Met793 in EGFR) and ligand heteroatoms to predict hydrogen bonds with &gt;95% confidence accuracy.
            </p>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-cyan-500 h-full w-[95%]" />
            </div>
          </div>
        </div>
      )
    },
    {
      category: "KEY METRICS",
      title: "Quantifiable Impact on Pharmaceutical Pipelines",
      subtitle: "Accelerating preclinical R&D timelines and saving computing resources.",
      content: (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <div className="text-3xl font-extrabold text-cyan-400 mb-1">75% - 90%</div>
            <div className="text-xs text-slate-400 uppercase font-semibold tracking-wider">HPC Cost Savings</div>
          </div>
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <div className="text-3xl font-extrabold text-cyan-400 mb-1">-8 Weeks</div>
            <div className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Docking Time Saved</div>
          </div>
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <div className="text-3xl font-extrabold text-cyan-400 mb-1">3.5x</div>
            <div className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Hit-Rate Multiplication</div>
          </div>
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <div className="text-3xl font-extrabold text-cyan-400 mb-1">+220%</div>
            <div className="text-xs text-slate-400 uppercase font-semibold tracking-wider">R&D Team Efficiency</div>
          </div>
        </div>
      )
    },
    {
      category: "COMMERCIAL POTENTIAL",
      title: "Multi-Million Dollar Business Model",
      subtitle: "B2B SaaS licensing for pharmaceutical enterprises, biotech startups, and CROs.",
      content: (
        <div className="grid md:grid-cols-2 gap-8 text-left h-full">
          <div className="space-y-4">
            <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl flex gap-3">
              <Building className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="text-white font-semibold">Enterprise SaaS Subscription</h5>
                <p className="text-slate-400 text-xs">Annual licenses per research node, including secure private cloud hosting for proprietary molecular structures.</p>
              </div>
            </div>
            <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl flex gap-3">
              <Sparkles className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="text-white font-semibold">CRO Integrations & API</h5>
                <p className="text-slate-400 text-xs">Direct integration into laboratory automated screening platforms, charging per processed screening library.</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-600/10 to-indigo-600/10 border border-blue-500/20 p-6 rounded-2xl flex flex-col justify-center space-y-3">
            <h4 className="text-white font-bold text-lg">Market Size & TAM</h4>
            <p className="text-slate-300 text-xs">
              The AI in drug discovery market size was valued at $1.5 Billion in 2023 and is projected to reach $11.8 Billion by 2032, expanding at a CAGR of 25.5%. Pre-docking represents a massive opportunity.
            </p>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
      
      {/* Dynamic Slide Background Glimmer */}
      <div className="absolute -right-40 -top-40 w-96 h-96 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />
      <div className="absolute -left-40 -bottom-40 w-96 h-96 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

      {/* Presentation Header */}
      <div className="flex justify-between items-center border-b border-slate-800/80 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-cyan-500/20 p-2 rounded-lg">
            <Beaker className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <span className="text-[10px] bg-cyan-500/10 border border-cyan-500/25 px-2.5 py-0.5 rounded-full text-cyan-400 font-extrabold tracking-wider">
              INVESTOR DECK
            </span>
          </div>
        </div>
        <div className="text-slate-400 text-xs font-semibold">
          Slide {currentSlide + 1} of {slides.length}
        </div>
      </div>

      {/* Slides viewport */}
      <div className="min-h-[340px] flex flex-col justify-between">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <span className="text-xs text-cyan-400 font-extrabold tracking-widest uppercase">
                {slides[currentSlide].category}
              </span>
              <h2 className="text-3xl font-extrabold text-white leading-tight">
                {slides[currentSlide].title}
              </h2>
              <p className="text-slate-400 text-sm">
                {slides[currentSlide].subtitle}
              </p>
            </div>

            <div className="py-2">
              {slides[currentSlide].content}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Presentation navigation actions */}
        <div className="flex justify-between items-center pt-8 border-t border-slate-800/50 mt-6">
          <div className="flex gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === currentSlide ? 'bg-cyan-400 w-6' : 'bg-slate-700 hover:bg-slate-600'
                }`}
              />
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handlePrev}
              className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/20 flex items-center gap-1.5 transition-all"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
