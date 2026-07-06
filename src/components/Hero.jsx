import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function Hero() {
  const containerRef = useRef(null);

  // Framer Motion values for the cursor position mapped to the SVG viewBox coordinates (1200x500)
  // Mapped initially to center (600, 250)
  const mouseX = useMotionValue(600);
  const mouseY = useMotionValue(250);

  // Snappier spring configuration to reduce lag while keeping smooth motion
  const springConfig = { damping: 25, stiffness: 160, mass: 0.5 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    // Map client coordinates (0 to rect.width/height) directly to SVG coordinates (1200x500)
    const x = ((e.clientX - rect.left) / rect.width) * 1200;
    const y = ((e.clientY - rect.top) / rect.height) * 500;
    
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    // Smoothly snap back to center when cursor leaves
    mouseX.set(600);
    mouseY.set(250);
  };

  // Map spring coordinate offsets relative to center for parallax shifting
  const textX = useTransform(springX, (val) => (val - 600) * 0.05);
  const textY = useTransform(springY, (val) => (val - 250) * 0.05);

  return (
    <section className="w-full bg-black py-4 px-4 md:px-8 max-w-[1280px] mx-auto select-none overflow-hidden">
      {/* Main Interactive Hero Screen Container - NOW COMPLETELY RESILIENT TO HEIGHT COLLAPSE */}
      <motion.div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover="hover"
        initial="initial"
        className="relative w-full bg-transparent group cursor-default"
      >
        {/* Load Teko font and keyframe animations */}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Teko:wght@700&display=swap');
          .font-teko {
            font-family: 'Teko', sans-serif;
          }
        `}</style>

        {/* Responsive Vector Layer - SET TO STATIC w-full h-auto TO PREVENT CONTAINER COLLAPSE */}
        <svg 
          viewBox="0 0 1200 500"
          className="w-full h-auto pointer-events-none select-none z-1"
        >
          <defs>
            {/* Liquid / Organic Distortion Filter (Displaces circle using fractal noise) */}
            <filter id="liquid-distortion">
              <feTurbulence 
                type="fractalNoise" 
                baseFrequency="0.035" 
                numOctaves="3" 
                result="noise" 
              />
              <feDisplacementMap 
                in="SourceGraphic" 
                in2="noise" 
                scale="32" 
                xChannelSelector="R" 
                yChannelSelector="G" 
                result="displaced" 
              />
              <feGaussianBlur in="displaced" stdDeviation="6" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
            </filter>
            
            {/* SVG Mask warping the cursor circle into a dynamic liquid paint blob */}
            <mask id="fluid-reveal-mask">
              <rect width="100%" height="100%" fill="black" />
              <g filter="url(#liquid-distortion)">
                {/* Dynamic Cursor Circle - Warped into a liquid droplet */}
                <motion.circle 
                  cx={springX} 
                  cy={springY} 
                  r="75" 
                  fill="white"
                />
              </g>
            </mask>
          </defs>

          {/* Layer 1: Default English (Massive Typography) */}
          <motion.g 
            style={{ x: textX, y: textY }}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <text
              x="600"
              y="250"
              fill="white"
              dominantBaseline="central"
              textAnchor="middle"
              className="font-display font-black text-[15vw] sm:text-[13vw] md:text-[11rem] lg:text-[13rem]"
              style={{ 
                letterSpacing: '0.08em',
                userSelect: 'none'
              }}
            >
              MAEVIS
            </text>
          </motion.g>

          {/* Layer 2: Clipped Neon Green Hindi Text (Revealed inside gooey metaball mask overlay) */}
          <motion.g 
            mask="url(#fluid-reveal-mask)"
            style={{ x: textX, y: textY }}
            animate={{ y: [0, -8, 0] }}
            variants={{
              initial: { opacity: 0 },
              hover: { opacity: 1 }
            }}
            transition={{ 
              y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 0.25 }
            }}
          >
            {/* Solid black backing to cover the English text inside the mask */}
            <rect width="100%" height="100%" fill="black" />

            <text
              x="600"
              y="250"
              fill="#4ADE80"
              dominantBaseline="central"
              textAnchor="middle"
              dy="0.55rem"
              className="font-teko font-bold text-[15vw] sm:text-[13vw] md:text-[11rem] lg:text-[13rem]"
              style={{ 
                letterSpacing: 'normal', // Normal letter spacing allows Devanagari ligatures to combine correctly
                userSelect: 'none',
                filter: 'drop-shadow(0px 0px 15px rgba(74,222,128,0.55))'
              }}
            >
              मैविस
            </text>
          </motion.g>
        </svg>
      </motion.div>
    </section>
  );
}
