import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import gsap from 'gsap';

export default function Hero() {
  const containerRef = useRef(null);

  // Measure container dimensions dynamically for the swipe overlay slices
  const [dimensions, setDimensions] = useState({ width: 1200, height: 500 });
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Framer Motion coordinates for mouse pointer tracking
  const mouseX = useMotionValue(600);
  const mouseY = useMotionValue(250);

  // Snappy spring configs
  const springConfig = { damping: 25, stiffness: 160, mass: 0.5 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  // Parallax shifts for independent depth layers (max 10px shift)
  const contourX = useTransform(springX, (val) => (val - 600) * 0.008);
  const contourY = useTransform(springY, (val) => (val - 250) * 0.008);

  const blueprintX = useTransform(springX, (val) => (val - 600) * -0.015);
  const blueprintY = useTransform(springY, (val) => (val - 250) * -0.015);

  const logoX = useTransform(springX, (val) => (val - 600) * 0.012);
  const logoY = useTransform(springY, (val) => (val - 250) * 0.012);

  const greenX = useTransform(springX, (val) => (val - 600) * 0.018);
  const greenY = useTransform(springY, (val) => (val - 250) * 0.018);

  // Hover & Touch event handlers
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 1200;
    const y = ((e.clientY - rect.top) / rect.height) * 500;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleTouchMove = (e) => {
    if (!containerRef.current || e.touches.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = ((touch.clientX - rect.left) / rect.width) * 1200;
    const y = ((touch.clientY - rect.top) / rect.height) * 500;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(600);
    mouseY.set(250);
  };

  const handleTouchEnd = () => {
    mouseX.set(600);
    mouseY.set(250);
  };

  // State scheduler for Cinematic Swipe glass layers
  const [swipeConfig, setSwipeConfig] = useState(null);
  useEffect(() => {
    const triggerSwipe = () => {
      const height = Math.floor(Math.random() * 50) + 30; // 30px to 80px tall slice
      const top = Math.floor(Math.random() * 260) + 120;  // Random vertical placement
      const speed = (Math.random() * 1.4) + 1.2;          // 1.2s to 2.6s slide duration
      const direction = Math.random() > 0.5 ? 'ltr' : 'rtl';

      setSwipeConfig({
        id: Date.now(),
        height,
        top,
        speed,
        direction
      });

      // Clear layout configuration after slide completes
      setTimeout(() => {
        setSwipeConfig(null);
      }, speed * 1000 + 200);
    };

    // Trigger every 8 to 15 seconds
    const swipeTimer = setInterval(triggerSwipe, 11000);
    return () => clearInterval(swipeTimer);
  }, []);

  // GSAP Scheduler for Data Scan lines and reflective light sweeps
  useEffect(() => {
    const runScan = () => {
      const tl = gsap.timeline();
      
      // Initialize scanline
      tl.set("#data-scan-line", { yPercent: -20, opacity: 0.2 });
      
      // Sweep scanline vertically down the container
      tl.to("#data-scan-line", {
        yPercent: 520,
        duration: 0.8,
        ease: "power2.inOut"
      }, 0);
      
      // Blueprint momentarily flashes to 6% opacity
      tl.to("#blueprint-layer", {
        opacity: 0.08,
        duration: 0.4,
        yoyo: true,
        repeat: 1,
        ease: "sine.inOut"
      }, 0.1);
      
      // Background contour lines brighten slightly
      tl.to(".contour-line", {
        opacity: 0.09,
        duration: 0.4,
        yoyo: true,
        repeat: 1,
        ease: "sine.inOut"
      }, 0.15);

      // Reflective highlight sweep runs across logo
      gsap.fromTo("#light-sweep-grad", 
        { attr: { x1: "-100%", x2: "0%" } },
        { attr: { x1: "200%", x2: "300%" }, duration: 0.8, ease: "power1.out" }
      );
      
      // Fade scanline out
      tl.to("#data-scan-line", {
        opacity: 0,
        duration: 0.1
      }, 0.7);
    };

    const triggerLightSweep = () => {
      // Independent brushed aluminium light sweep
      gsap.fromTo("#light-sweep-grad", 
        { attr: { x1: "-100%", x2: "0%" } },
        { attr: { x1: "200%", x2: "300%" }, duration: 1.1, ease: "power2.out" }
      );
    };

    // Scan triggers once every 17 seconds
    const scanInterval = setInterval(runScan, 17000);
    // Light sweep triggers once every 14 seconds
    const sweepInterval = setInterval(triggerLightSweep, 14000);

    // Initial triggers
    setTimeout(runScan, 4000);
    setTimeout(triggerLightSweep, 2000);

    return () => {
      clearInterval(scanInterval);
      clearInterval(sweepInterval);
    };
  }, []);

  return (
    <section className="w-full bg-black py-4 px-4 md:px-8 max-w-[1280px] mx-auto select-none overflow-hidden relative">
      
      {/* Layer 1: Film Grain Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-50 opacity-[0.015]"
        style={{
          mixBlendMode: 'overlay',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          animation: 'noise-shift 0.25s steps(4) infinite'
        }}
      />

      {/* Layer 2: Contour Map Background Grid */}
      <motion.svg
        style={{ x: contourX, y: contourY }}
        viewBox="0 0 1200 500"
        className="absolute inset-0 w-full h-auto pointer-events-none opacity-3 z-0"
      >
        <path className="contour-line" d="M 0,80 Q 300,130 600,80 T 1200,100" stroke="#4cff87" strokeWidth="0.5" fill="none" opacity="0.04" />
        <path className="contour-line" d="M 0,180 Q 400,260 800,180 T 1200,230" stroke="#4cff87" strokeWidth="0.5" fill="none" opacity="0.04" />
        <path className="contour-line" d="M 0,320 Q 300,350 700,300 T 1200,370" stroke="#4cff87" strokeWidth="0.5" fill="none" opacity="0.04" />
        <path className="contour-line" d="M 0,440 Q 500,470 900,410 T 1200,460" stroke="#4cff87" strokeWidth="0.5" fill="none" opacity="0.04" />
      </motion.svg>

      {/* Layer 3: Enormous Hindi Blueprint Drafting Backdrop */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <motion.div
          id="blueprint-layer"
          style={{ x: blueprintX, y: blueprintY }}
          animate={{
            scale: [1.4, 1.414, 1.4],
            opacity: [0.02, 0.045, 0.02]
          }}
          transition={{
            duration: 7.5,
            ease: [0.4, 0, 0.2, 1], // Breathing curve
            repeat: Infinity
          }}
          className="w-[150vw] h-[150vw] flex items-center justify-center relative select-none"
        >
          <svg viewBox="0 0 1200 1200" className="w-full h-full text-[#4cff87] opacity-60" style={{ mixBlendMode: 'soft-light' }}>
            {/* Blueprint guidelines */}
            <circle cx="600" cy="600" r="320" stroke="#4cff87" strokeWidth="0.5" strokeDasharray="3 6" opacity="0.2" fill="none" />
            <circle cx="600" cy="600" r="440" stroke="#4cff87" strokeWidth="0.5" opacity="0.12" fill="none" />
            <circle cx="600" cy="600" r="540" stroke="#4cff87" strokeWidth="0.25" strokeDasharray="8 8" opacity="0.08" fill="none" />
            <line x1="100" y1="600" x2="1100" y2="600" stroke="#4cff87" strokeWidth="0.5" strokeDasharray="4 8" opacity="0.15" />
            <line x1="600" y1="100" x2="600" y2="1100" stroke="#4cff87" strokeWidth="0.5" strokeDasharray="4 8" opacity="0.15" />
            
            {/* Blueprint strokes word */}
            <text
              x="600"
              y="600"
              fill="none"
              stroke="#4cff87"
              strokeWidth="0.75"
              dominantBaseline="central"
              textAnchor="middle"
              className="font-teko font-bold"
              style={{ fontSize: '320px', letterSpacing: 'normal' }}
            >
              मैविस
            </text>
          </svg>
        </motion.div>
      </div>

      {/* Floating Technical Drafting Marks */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden font-mono text-[9px] text-[#4cff87]">
        {/* Top-Left Mark */}
        <motion.span
          animate={{ x: [0, 3, -1, 0], y: [0, -2, 2, 0], opacity: [0.05, 0.05, 0.01, 0.05] }}
          transition={{ duration: 22, repeat: Infinity }}
          style={{ position: 'absolute', top: '15%', left: '10%' }}
        >
          +
        </motion.span>
        {/* Bottom-Left Circle Tick */}
        <motion.span
          animate={{ x: [0, -2, 3, 0], y: [0, 2, -2, 0], opacity: [0.05, 0.01, 0.05, 0.05] }}
          transition={{ duration: 26, repeat: Infinity }}
          style={{ position: 'absolute', bottom: '20%', left: '18%' }}
        >
          ○
        </motion.span>
        {/* Top-Right Crossing Mark */}
        <motion.span
          animate={{ x: [0, 2, -2, 0], y: [0, -3, 3, 0], opacity: [0.01, 0.05, 0.05, 0.01] }}
          transition={{ duration: 20, repeat: Infinity }}
          style={{ position: 'absolute', top: '22%', right: '14%' }}
        >
          ×
        </motion.span>
        {/* Center-Right Target Reticle */}
        <motion.span
          animate={{ x: [0, -3, 2, 0], y: [0, 2, -3, 0], opacity: [0.05, 0.05, 0.01, 0.05] }}
          transition={{ duration: 28, repeat: Infinity }}
          style={{ position: 'absolute', top: '55%', right: '8%' }}
        >
          ⌖
        </motion.span>
        {/* Corner registration borders */}
        <div className="absolute top-8 left-8 w-2 h-2 border-t border-l border-[#4cff87]/15"></div>
        <div className="absolute bottom-8 right-8 w-2 h-2 border-b border-r border-[#4cff87]/15"></div>
      </div>

      {/* Thin Horizontal Data Scan Line */}
      <div
        id="data-scan-line"
        className="absolute left-0 w-full pointer-events-none z-35 opacity-0 bg-gradient-to-r from-transparent via-[#4cff87]/25 to-transparent"
        style={{
          height: '2px',
          boxShadow: '0 0 8px rgba(76,255,135,0.3)',
          top: 0
        }}
      />

      {/* Main Interactive Hero Screen Container */}
      <motion.div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        whileHover="hover"
        whileTap="hover"
        initial="initial"
        className="relative w-full bg-transparent group cursor-default z-20"
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Teko:wght@700&display=swap');
          .font-teko {
            font-family: 'Teko', sans-serif;
          }
          @keyframes noise-shift {
            0% { transform: translate(0, 0); }
            10% { transform: translate(-0.5%, -0.5%); }
            20% { transform: translate(-1%, 0.5%); }
            30% { transform: translate(0.5%, -1%); }
            40% { transform: translate(-0.5%, 1.5%); }
            50% { transform: translate(-1%, 0.5%); }
            60% { transform: translate(1.5%, -0.5%); }
            70% { transform: translate(1%, 0.5%); }
            80% { transform: translate(0.5%, -1%); }
            90% { transform: translate(-0.5%, 1.5%); }
            100% { transform: translate(0, 0); }
          }
        `}</style>

        {/* Responsive Vector Layer */}
        <svg 
          viewBox="0 0 1200 500"
          className="w-full h-auto pointer-events-none select-none z-1"
        >
          <defs>
            {/* Brushed aluminium catching specular highlight sweep */}
            <linearGradient id="light-sweep-grad" x1="-100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#4ADE80" stopOpacity="0" />
              <stop offset="42%" stopColor="#4ADE80" stopOpacity="0" />
              <stop offset="50%" stopColor="#e3ffd9" stopOpacity="0.08" />
              <stop offset="58%" stopColor="#4ADE80" stopOpacity="0" />
              <stop offset="100%" stopColor="#4ADE80" stopOpacity="0" />
            </linearGradient>

            {/* Liquid distortion filter */}
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
            
            {/* SVG Mask revealing text */}
            <mask id="fluid-reveal-mask">
              <rect width="100%" height="100%" fill="black" />
              <g filter="url(#liquid-distortion)">
                <motion.circle 
                  cx={springX} 
                  cy={springY} 
                  r="75" 
                  fill="white"
                />
              </g>
            </mask>
          </defs>

          {/* Layer 5: Default English (Massive Typography) */}
          <motion.g 
            style={{ x: logoX, y: logoY }}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Base White Text */}
            <text
              x="600"
              y="250"
              fill="white"
              dominantBaseline="central"
              textAnchor="middle"
              className="font-display font-black"
              style={{ 
                fontSize: '160px',
                letterSpacing: '0.08em',
                userSelect: 'none'
              }}
            >
              MAEVIS
            </text>

            {/* Brushed specular light sweep layer */}
            <text
              x="600"
              y="250"
              fill="url(#light-sweep-grad)"
              dominantBaseline="central"
              textAnchor="middle"
              className="font-display font-black"
              style={{ 
                fontSize: '160px',
                letterSpacing: '0.08em',
                userSelect: 'none'
              }}
            >
              MAEVIS
            </text>
          </motion.g>

          {/* Layer 6: Clipped Neon Green Hindi Text (Revealed inside gooey metaball mask overlay) */}
          <motion.g 
            mask="url(#fluid-reveal-mask)"
            style={{ x: greenX, y: greenY }}
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
              dy="0.75rem"
              className="font-teko font-bold"
              style={{ 
                fontSize: '250px',
                letterSpacing: 'normal',
                userSelect: 'none',
                filter: 'drop-shadow(0px 0px 15px rgba(74,222,128,0.55))'
              }}
            >
              मैविस
            </text>
          </motion.g>
        </svg>

        {/* Layer 4: Cinematic Swipe Glass Overlay Slices */}
        {swipeConfig && (
          <motion.div
            initial={{ clipPath: swipeConfig.direction === 'ltr' ? 'inset(0 100% 0 -35%)' : 'inset(0 -35% 0 100%)' }}
            animate={{ clipPath: swipeConfig.direction === 'ltr' ? 'inset(0 -35% 0 100%)' : 'inset(0 100% 0 -35%)' }}
            transition={{ duration: swipeConfig.speed, ease: [0.25, 1, 0.5, 1] }}
            style={{
              position: 'absolute',
              left: 0,
              top: swipeConfig.top,
              height: swipeConfig.height,
              width: '100%',
              overflow: 'hidden',
              borderTop: '1px solid rgba(76,255,135,0.08)',
              borderBottom: '1px solid rgba(76,255,135,0.08)',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0) 100%)',
              backdropFilter: 'blur(1.5px)',
              maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
              zIndex: 40,
              pointerEvents: 'none'
            }}
          >
            {/* Duplicated layout slice inside sliding frame */}
            <motion.div
              animate={{
                x: swipeConfig.direction === 'ltr' ? [24, 0] : [-24, 0]
              }}
              transition={{ duration: swipeConfig.speed, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'absolute',
                top: -swipeConfig.top,
                width: '100%',
                height: dimensions.height,
                left: 0
              }}
            >
              <svg 
                viewBox="0 0 1200 500"
                className="w-full h-auto pointer-events-none select-none"
              >
                {/* Duplicate English Logo */}
                <motion.g 
                  style={{ x: logoX, y: logoY }}
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                  <text
                    x="600"
                    y="250"
                    fill="white"
                    dominantBaseline="central"
                    textAnchor="middle"
                    className="font-display font-black"
                    style={{ 
                      fontSize: '160px',
                      letterSpacing: '0.08em',
                      userSelect: 'none'
                    }}
                  >
                    MAEVIS
                  </text>
                  <text
                    x="600"
                    y="250"
                    fill="url(#light-sweep-grad)"
                    dominantBaseline="central"
                    textAnchor="middle"
                    className="font-display font-black"
                    style={{ 
                      fontSize: '160px',
                      letterSpacing: '0.08em',
                      userSelect: 'none'
                    }}
                  >
                    MAEVIS
                  </text>
                </motion.g>

                {/* Duplicate Hindi reveal layer */}
                <motion.g 
                  mask="url(#fluid-reveal-mask)"
                  style={{ x: greenX, y: greenY }}
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
                  <rect width="100%" height="100%" fill="black" />
                  <text
                    x="600"
                    y="250"
                    fill="#4ADE80"
                    dominantBaseline="central"
                    textAnchor="middle"
                    dy="0.75rem"
                    className="font-teko font-bold"
                    style={{ 
                      fontSize: '250px',
                      letterSpacing: 'normal',
                      userSelect: 'none',
                      filter: 'drop-shadow(0px 0px 15px rgba(74,222,128,0.55))'
                    }}
                  >
                    मैविस
                  </text>
                </motion.g>
              </svg>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
