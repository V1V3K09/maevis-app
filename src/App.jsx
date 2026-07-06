import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductShowcase from './components/ProductShowcase';
import ThreeLoader from './components/ThreeLoader';
import Fabricate from './components/Fabricate';
import Shop from './components/Shop';

// Import newly created homepage sections
import PhilosophySection from './components/PhilosophySection';
import ProcessSection from './components/ProcessSection';
import MaterialLibrary from './components/MaterialLibrary';
import FeaturedCollections from './components/FeaturedCollections';
import MakingOf from './components/MakingOf';
import FabricateTeaser from './components/FabricateTeaser';

// Import GSAP and ScrollTrigger
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Import Product Images
import productSkibidi from './assets/product_skibidi.png';
import productKnife from './assets/product_knife.png';

function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  const [activeTab, setActiveTab] = useState(() => {
    const path = window.location.pathname.toUpperCase();
    if (path.includes('FABRICATE')) return 'FABRICATE';
    if (path.includes('SHOP')) return 'SHOP';
    if (path.includes('BLOGS')) return 'BLOGS';
    return 'HOME';
  });

  const featuredProducts = [
    { 
      name: "SKIBIDI TOILET", 
      image: productSkibidi,
      gif: "/Skibidi.gif"
    },
    { 
      name: "BUTTERFLY KNIFE", 
      image: productKnife,
      gif: "/Butterfly Knife Glow in Drak.gif"
    }
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    const newPath = tabId === 'HOME' ? '/' : `/${tabId.toLowerCase()}`;
    window.history.pushState(null, '', newPath);
    // Scroll to top on tab change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toUpperCase();
      if (path.includes('FABRICATE')) setActiveTab('FABRICATE');
      else if (path.includes('SHOP')) setActiveTab('SHOP');
      else if (path.includes('BLOGS')) setActiveTab('BLOGS');
      else setActiveTab('HOME');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // GSAP ScrollTrigger reveals for homepage sections
  useEffect(() => {
    if (!isLoaded || activeTab !== 'HOME') return;

    // Wait a tiny fraction of a second for DOM components to render fully
    const timer = setTimeout(() => {
      const sections = document.querySelectorAll('.reveal-section');
      
      sections.forEach((section) => {
        gsap.fromTo(section,
          { 
            opacity: 0, 
            y: 40 
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 88%", // Reveals when the top of the section enters 88% of the viewport height
              toggleActions: "play none none reverse",
              once: false
            }
          }
        );
      });
      
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [activeTab, isLoaded]);

  return (
    <>
      {/* 3D Cinematic Loader Gate & Canvas */}
      <AnimatePresence mode="wait">
        {!isLoaded && (
          <ThreeLoader key="loader" onComplete={() => setIsLoaded(true)} />
        )}
      </AnimatePresence>

      {/* Main Website Reveal */}
      {isLoaded && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="min-h-screen bg-black text-white flex flex-col"
        >
          {/* Subtle Persistent Film Grain Overlay */}
          <div className="film-grain" />

          {/* Recreated MAEVIS Header Navbar */}
          <Navbar activeTab={activeTab} onTabChange={handleTabChange} />
          
          {activeTab === 'HOME' && (
            <>
              {/* Recreated MAEVIS Hero Section */}
              <div className="reveal-section">
                <Hero />
              </div>

              {/* Recreated MAEVIS Product Showcase (Rack Section) */}
              <div className="reveal-section">
                <ProductShowcase products={featuredProducts} />
              </div>
              
              {/* Narrative Dividers & Redesigned Homepage Sections */}
              
              {/* 01. PHILOSOPHY [EXPLORE] */}
              <div className="reveal-section">
                <PhilosophySection />
              </div>

              <div className="flex flex-col items-center my-8 opacity-25 font-mono text-[9px] tracking-[0.3em] text-white">
                <span>[ BATCH_COORD: EXPLORE → UNDERSTAND ]</span>
                <span className="animate-bounce mt-1">↓</span>
              </div>

              {/* 02. PROCESS [UNDERSTAND] */}
              <div className="reveal-section">
                <ProcessSection />
              </div>

              <div className="flex flex-col items-center my-8 opacity-25 font-mono text-[9px] tracking-[0.3em] text-white">
                <span>[ BATCH_COORD: UNDERSTAND → PROPERTIES ]</span>
                <span className="animate-bounce mt-1">↓</span>
              </div>

              {/* 03. MATERIAL LIBRARY [UNDERSTAND] */}
              <div className="reveal-section">
                <MaterialLibrary />
              </div>

              <div className="flex flex-col items-center my-8 opacity-25 font-mono text-[9px] tracking-[0.3em] text-white">
                <span>[ BATCH_COORD: PROPERTIES → SHELVING ]</span>
                <span className="animate-bounce mt-1">↓</span>
              </div>

              {/* 04. FEATURED COLLECTIONS [TRUST] */}
              <div className="reveal-section">
                <FeaturedCollections />
              </div>

              <div className="flex flex-col items-center my-8 opacity-25 font-mono text-[9px] tracking-[0.3em] text-white">
                <span>[ BATCH_COORD: SHELVING → QUALITY_CONTROL ]</span>
                <span className="animate-bounce mt-1">↓</span>
              </div>

              {/* 05. MAKING OF [TRUST] */}
              <div className="reveal-section">
                <MakingOf />
              </div>

              <div className="flex flex-col items-center my-8 opacity-25 font-mono text-[9px] tracking-[0.3em] text-white">
                <span>[ BATCH_COORD: QUALITY_CONTROL → TERMINAL_CREATE ]</span>
                <span className="animate-bounce mt-1">↓</span>
              </div>

              {/* 07. FABRICATE PREVIEW [CREATE] */}
              <div className="reveal-section">
                <FabricateTeaser onEnterFabricate={() => handleTabChange('FABRICATE')} />
              </div>

              {/* Bottom Spacing Margin */}
              <div className="py-12 border-t border-[#1C1C1C]"></div>
            </>
          )}

          {activeTab === 'FABRICATE' && <Fabricate />}

          {activeTab === 'SHOP' && <Shop products={featuredProducts} />}

          {activeTab === 'BLOGS' && (
            <main className="flex-grow flex flex-col items-center justify-center p-8 font-mono">
              <div className="border border-[#2C2C2C] p-8 rounded bg-[#0A0A0A] max-w-md w-full text-center relative">
                {/* Target Corners */}
                <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-white/25"></div>
                <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-white/25"></div>
                <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-white/25"></div>
                <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-white/25"></div>

                <span className="text-[#4ADE80] font-bold text-xs tracking-widest">[ SYSTEM REDIRECT ]</span>
                <p className="text-white/60 text-xs mt-4 leading-relaxed">
                  The requested node [BLOGS] is currently offline or routed through external storefront.
                </p>
                <button 
                  onClick={() => handleTabChange('HOME')}
                  className="mt-6 border border-[#2C2C2C] hover:border-white px-4 py-2 text-[10px] tracking-widest uppercase text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  [ RETURN HOME ]
                </button>
              </div>
            </main>
          )}
        </motion.div>
      )}
    </>
  );
}

export default App;
