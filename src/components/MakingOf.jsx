import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Import images
import imgPrinting from '../assets/making_of_printing.jpg';
import imgSupports from '../assets/making_of_supports.jpg';
import imgFinishing from '../assets/making_of_finishing.jpg';
import imgPainting from '../assets/making_of_painting.jpg';
import imgPackaging from '../assets/making_of_packaging.jpg';

export default function MakingOf() {
  const [activeIndex, setActiveIndex] = useState(0);

  const steps = [
    {
      title: "PRINTING",
      tag: "[ STG_01 // ADDITIVE_DEPOSITION ]",
      desc: "Laying down raw coordinates of high-performance polymer under intense heat, binding molecular strands layer by layer.",
      img: imgPrinting,
      meta: { temp: "245°C", speed: "120mm/s", flow: "98.5%", nozzle: "0.4mm Hardened" }
    },
    {
      title: "SUPPORT REMOVAL",
      tag: "[ STG_02 // LATTICE_DEBRIS_PURGE ]",
      desc: "Delicate manual extraction of supporting structures. Lattice columns are clipped away to reveal pristine structural boundaries.",
      img: imgSupports,
      meta: { tolerance: "±0.05mm", tools: "Steel Scalpel/Tweezers", scrap: "12%", risk: "Critical" }
    },
    {
      title: "FINISHING",
      tag: "[ STG_03 // SURFACE_ABRASION ]",
      desc: "Progressive wet sanding and chemical etching to eliminate layer steps, leaving an ultra-smooth surface texture ready for lacquer.",
      img: imgFinishing,
      meta: { grit: "P400 → P1200", fluid: "H2O Bath", time: "45 mins", surface: "Satin" }
    },
    {
      title: "PAINTING",
      tag: "[ STG_04 // SUBSTRATE_COATING ]",
      desc: "Application of specialized primers and matte-black industrial finishes inside positive-pressure spray chambers.",
      img: imgPainting,
      meta: { layers: "3 Coats", cure: "UV Curing Box", brand: "Industrial Polycoat", opacity: "100%" }
    },
    {
      title: "PACKAGING",
      tag: "[ STG_05 // VACUUM_SEAL_CONTAIN ]",
      desc: "Hermetic sealing under high vacuum. The product is certified, hand-stamped, and safely packed in industrial crates.",
      img: imgPackaging,
      meta: { vacuum: "-0.95 Bar", seal: "Thermal Melt", label: "MV-739-B", freight: "Standard Air" }
    }
  ];

  const currentStep = steps[activeIndex];

  // Cinematic Shutter Wipe Animation Variants
  const wipeVariants = {
    enter: {
      clipPath: "inset(0 100% 0 0)",
      scale: 1.05,
      filter: "grayscale(100%) contrast(1.2) brightness(0.6)",
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    },
    center: {
      clipPath: "inset(0 0 0 0)",
      scale: 1,
      filter: "grayscale(100%) contrast(1.1) brightness(0.9)",
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    },
    exit: {
      clipPath: "inset(0 0 0 100%)",
      scale: 0.98,
      filter: "grayscale(100%) contrast(1.2) brightness(0.4)",
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section className="w-full bg-black py-20 px-4 md:px-8 max-w-[1280px] mx-auto select-none border-t border-[#1C1C1C] relative">
      <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-white/20"></div>
      <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-white/20"></div>

      <div className="flex items-center gap-2 font-mono text-[10px] sm:text-xs text-[#BEBEBE] tracking-[0.15em] mb-8">
        <span className="text-[#4ADE80] text-[8px] animate-pulse">●</span>
        <span>[ SECTION_05 // MAKING OF ]</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.8fr] gap-12 items-start">
        {/* Left Side: Step Selector List */}
        <div className="flex flex-col gap-8 h-full justify-between">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs text-[#4ADE80] tracking-widest">[ PROCESS_INDEX v1.0 ]</span>
            <h2 className="font-display font-extrabold text-[8vw] sm:text-[6vw] lg:text-[4.5rem] leading-[0.95] text-white tracking-[0.02em] uppercase">
              DOCUMENTARY
            </h2>
            <p className="font-mono text-white/40 text-xs mt-2 leading-relaxed max-w-sm">
              We document our raw manufacturing stages. Roll over each parameter file node to review the workshop operations camera.
            </p>
          </div>

          <div className="flex flex-row overflow-x-auto lg:flex-col gap-6 lg:gap-3 mt-6 pb-3 lg:pb-0 border-b lg:border-b-0 lg:border-l border-[#2C2C2C] lg:pl-4 scrollbar-none snap-x">
            {steps.map((step, idx) => {
              const isActive = activeIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className="flex flex-col text-left py-1 focus:outline-none group cursor-pointer shrink-0 snap-start"
                >
                  <span className={`font-mono text-[9px] sm:text-[10px] tracking-wider transition-colors duration-250 ${isActive ? 'text-[#4ADE80]' : 'text-[#6B6B6B]'}`}>
                    [ STEP_0{idx + 1} ]
                  </span>
                  <span className={`font-display font-bold text-lg sm:text-xl lg:text-2xl tracking-wider uppercase transition-colors duration-250 ${isActive ? 'text-white' : 'text-white/40 group-hover:text-white/80'}`}>
                    {step.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Cinematic Frame Viewport */}
        <div className="border border-[#2C2C2C] aspect-[16/10] w-full bg-[#070707] relative overflow-hidden flex flex-col justify-between p-4 group">
          {/* Target Corners */}
          <div className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-white/20 group-hover:border-[#4ADE80] transition-colors duration-300"></div>
          <div className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-white/20 group-hover:border-[#4ADE80] transition-colors duration-300"></div>
          <div className="absolute bottom-2 left-2 w-1.5 h-1.5 border-b border-l border-white/20 group-hover:border-[#4ADE80] transition-colors duration-300"></div>
          <div className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-white/20 group-hover:border-[#4ADE80] transition-colors duration-300"></div>

          {/* Top Camera Status Overlay */}
          <div className="flex justify-between font-mono text-[9px] text-white/30 tracking-wider relative z-10 pointer-events-none">
            <span className="flex items-center gap-1.5 text-red-500 font-bold animate-pulse">
              ● REC
            </span>
            <span>CAM_0{activeIndex + 1} // SECURE_FEED</span>
            <span>{currentStep.tag}</span>
          </div>

          {/* Cinematic Shutter Image Wrap */}
          <div className="absolute inset-0 z-0">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeIndex}
                src={currentStep.img}
                alt={currentStep.title}
                variants={wipeVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full h-full object-cover select-none pointer-events-none"
              />
            </AnimatePresence>
            
            {/* Dark contrast vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/45 pointer-events-none"></div>
            
            {/* Technical layout crosshair */}
            <div className="absolute inset-0 opacity-[0.08] pointer-events-none flex items-center justify-center">
              <svg className="w-16 h-16 text-white" viewBox="0 0 100 100" fill="none" stroke="currentColor">
                <circle cx="50" cy="50" r="40" strokeWidth="1" strokeDasharray="4 4" />
                <path d="M50 20v60M20 50h60" strokeWidth="1" />
              </svg>
            </div>
          </div>

          {/* Bottom Diagnostic Overlay */}
          <div className="relative z-10 w-full bg-black/60 backdrop-blur-xs p-4 border border-[#2C2C2C]/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-auto">
            <div className="flex flex-col gap-1 max-w-sm">
              <span className="font-mono text-[10px] text-[#4ADE80] tracking-widest font-bold">
                [ REPORT_LOG ]
              </span>
              <p className="font-mono text-[10px] text-white/70 leading-relaxed">
                {currentStep.desc}
              </p>
            </div>

            {/* Stage Specifications stamp */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 font-mono text-[8px] text-[#6B6B6B] border-t sm:border-t-0 sm:border-l border-[#2C2C2C] pt-2 sm:pt-0 sm:pl-4 min-w-[150px]">
              {Object.entries(currentStep.meta).map(([key, val]) => (
                <React.Fragment key={key}>
                  <span className="uppercase">{key}:</span>
                  <span className="text-white/60 text-right">{val}</span>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
