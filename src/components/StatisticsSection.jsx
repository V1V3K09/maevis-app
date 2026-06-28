import React, { useState, useEffect, useRef } from 'react';

// Custom lightweight hook/component for counting animation when visible
function AnimatedNumber({ value, isFloat = false, duration = 1800 }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let startTime = null;
          const endValue = value;

          const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            // Ease out quad
            const ease = progress * (2 - progress);
            const current = Math.floor(ease * endValue);
            setCount(current);

            if (progress < 1) {
              window.requestAnimationFrame(step);
            } else {
              setCount(endValue);
            }
          };
          window.requestAnimationFrame(step);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
    return () => observer.disconnect();
  }, [value, duration, hasAnimated]);

  if (isFloat) {
    return <span ref={elementRef}>{(count / 10).toFixed(1)}</span>;
  }
  return <span ref={elementRef}>{count.toLocaleString()}</span>;
}

export default function StatisticsSection() {
  const stats = [
    {
      label: "LAYERS PRINTED",
      tag: "LYR_COUNT_GBL",
      targetValue: 14892104,
      isFloat: false,
      suffix: "",
      address: "0x8F923",
      status: "ONLINE",
      details: "Total cumulative additive layers deposited across all manufacturing nodes."
    },
    {
      label: "PRODUCTS FABRICATED",
      tag: "PRD_FAB_QTY",
      targetValue: 32490,
      isFloat: false,
      suffix: " UNIT",
      address: "0x2C40A",
      status: "OK",
      details: "Batch-numbered functional parts and design structures successfully shipped."
    },
    {
      label: "NODES SERVED",
      tag: "CUST_NODE_LNK",
      targetValue: 8912,
      isFloat: false,
      suffix: " CLIENTS",
      address: "0x0B891",
      status: "SECURE",
      details: "Distinct corporate and developer terminals requesting fabrication access."
    },
    {
      label: "FABRICATION SUCCESS",
      tag: "QC_PASS_RATIO",
      targetValue: 998, // will divide by 10 to get 99.8
      isFloat: true,
      suffix: "%",
      address: "0x7F10E",
      status: "NOMINAL",
      details: "Quality control pass rate based on structural and volumetric verification."
    }
  ];

  return (
    <section className="w-full bg-black py-20 px-4 md:px-8 max-w-[1280px] mx-auto select-none border-t border-[#1C1C1C] relative">
      <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-white/20"></div>
      <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-white/20"></div>

      <div className="flex items-center gap-2 font-mono text-[10px] sm:text-xs text-[#BEBEBE] tracking-[0.15em] mb-8">
        <span className="text-[#4ADE80] text-[8px] animate-pulse">●</span>
        <span>[ SECTION_06 // DIAGNOSTIC STATISTICS ]</span>
      </div>

      <div className="flex flex-col gap-2 mb-12">
        <span className="font-mono text-xs text-[#4ADE80] tracking-widest">[ DIAG_SYS_OUTPUT v2.1 ]</span>
        <h2 className="font-display font-extrabold text-[8vw] sm:text-[6vw] lg:text-[4.5rem] leading-[0.95] text-white tracking-[0.02em] uppercase">
          MACHINE LOGISTICS
        </h2>
      </div>

      {/* Grid of Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          return (
            <div
              key={idx}
              className="border border-[#2C2C2C] bg-[#070707] p-5 flex flex-col justify-between hover:border-[#4ADE80] transition-colors duration-300 relative group"
            >
              {/* Top Meta Details */}
              <div className="flex justify-between font-mono text-[9px] text-[#6B6B6B] tracking-wider border-b border-[#1C1C1C] pb-3 mb-4">
                <span>{stat.address} // {stat.tag}</span>
                <span className="text-[#4ADE80] flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-[#4ADE80] animate-ping"></span>
                  {stat.status}
                </span>
              </div>

              {/* Huge animated numbers */}
              <div className="my-6">
                <span className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-wider">
                  <AnimatedNumber value={stat.targetValue} isFloat={stat.isFloat} />
                  <span className="text-[#4ADE80] text-lg font-mono ml-1">{stat.suffix}</span>
                </span>
              </div>

              {/* Decorative mini grid representation */}
              <div className="w-full h-8 border border-[#1C1C1C] relative overflow-hidden bg-black mb-4 flex items-center px-2">
                {/* Horizontal progress representation */}
                <div 
                  className="h-1 bg-[#4ADE80]/30 group-hover:bg-[#4ADE80] transition-colors duration-300"
                  style={{ width: stat.isFloat ? `${stat.targetValue / 10}%` : '85%' }}
                ></div>
                {/* Horizontal scan line overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_4px]"></div>
              </div>

              {/* Bottom text */}
              <p className="font-mono text-[10px] text-white/40 leading-relaxed">
                {stat.details}
              </p>

              {/* Corner crosshairs on card hover */}
              <div className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-white/10 group-hover:border-[#4ADE80] transition-colors"></div>
              <div className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-white/10 group-hover:border-[#4ADE80] transition-colors"></div>
              <div className="absolute bottom-2 left-2 w-1.5 h-1.5 border-b border-l border-white/10 group-hover:border-[#4ADE80] transition-colors"></div>
              <div className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-white/10 group-hover:border-[#4ADE80] transition-colors"></div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
