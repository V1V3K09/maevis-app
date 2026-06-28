import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 3D Object Component that transitions between solid and wireframe
function InteractiveObject() {
  const groupRef = useRef();
  const solidRef = useRef();
  const wireRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    
    // Slow continuous rotation
    groupRef.current.rotation.y = time * 0.15;
    groupRef.current.rotation.z = time * 0.05;

    // Subtle cursor movement effect
    const { x, y } = state.pointer;
    groupRef.current.rotation.y += x * 0.2;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -y * 0.3, 0.05);

    // Subtle camera movement
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, x * 0.8, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, y * 0.8 + 0.5, 0.05);
    state.camera.lookAt(0, 0, 0);

    // Transition between wireframe and solid state over time (oscillating loop)
    const transitionCycle = Math.sin(time * 0.8) * 0.5 + 0.5; // Oscillates between 0 and 1
    
    if (solidRef.current && wireRef.current) {
      solidRef.current.material.opacity = transitionCycle;
      wireRef.current.material.opacity = 1.0 - transitionCycle;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Solid Object */}
      <mesh ref={solidRef}>
        <torusKnotGeometry args={[0.9, 0.3, 120, 16]} />
        <meshStandardMaterial 
          color="#BEBEBE" 
          roughness={0.2} 
          metalness={0.9} 
          transparent 
          depthWrite={true}
        />
      </mesh>
      
      {/* Wireframe Overlay */}
      <mesh ref={wireRef}>
        <torusKnotGeometry args={[0.9, 0.305, 120, 16]} />
        <meshBasicMaterial 
          color="#4ADE80" 
          wireframe 
          transparent 
        />
      </mesh>
    </group>
  );
}

export default function PhilosophySection() {
  return (
    <section className="w-full bg-black py-20 px-4 md:px-8 max-w-[1280px] mx-auto select-none border-t border-[#1C1C1C] relative">
      {/* Corner crosshairs */}
      <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-white/20"></div>
      <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-white/20"></div>
      
      <div className="flex items-center gap-2 font-mono text-[10px] sm:text-xs text-[#BEBEBE] tracking-[0.15em] mb-8">
        <span className="text-[#4ADE80] text-[8px] animate-pulse">●</span>
        <span>[ SECTION_01 // PHILOSOPHY ]</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side: Large Brutalist Typography */}
        <div className="flex flex-col gap-6">
          <span className="font-mono text-xs text-[#4ADE80] tracking-widest">[ MANIFESTO v1.0 ]</span>
          <h2 className="font-display font-extrabold text-[8vw] sm:text-[6vw] lg:text-[4.5rem] leading-[0.95] text-white tracking-[0.02em] uppercase">
            WE DON'T SELL PLASTIC.
            <br />
            <span className="text-white/40">WE MANUFACTURE IDEAS.</span>
          </h2>
          <p className="font-mono text-white/50 text-xs sm:text-sm max-w-lg leading-relaxed font-body">
            MAEVIS is a high-precision digital fabrication unit. We discard typical rapid-prototype standards in favor of slow-batch manufacturing, custom finishes, and mechanical integrity. Every layer printed is a coordinate in a larger design philosophy.
          </p>
        </div>

        {/* Right Side: R3F Canvas Container */}
        <div className="border border-[#2C2C2C] aspect-square w-full max-w-[500px] mx-auto bg-[#070707] relative overflow-hidden group">
          {/* Technical Grid background */}
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#4ADE80_1px,transparent_1px)] [background-size:24px_24px]"></div>
          
          {/* Target Corners */}
          <div className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-white/20 group-hover:border-[#4ADE80] transition-colors duration-300"></div>
          <div className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-white/20 group-hover:border-[#4ADE80] transition-colors duration-300"></div>
          <div className="absolute bottom-2 left-2 w-1.5 h-1.5 border-b border-l border-white/20 group-hover:border-[#4ADE80] transition-colors duration-300"></div>
          <div className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-white/20 group-hover:border-[#4ADE80] transition-colors duration-300"></div>

          {/* R3F Canvas */}
          <div className="absolute inset-0 pointer-events-none lg:pointer-events-auto">
            <Canvas camera={{ position: [0, 0, 3], fov: 45 }} dpr={[1, 1.5]}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" />
              <pointLight position={[-5, -5, -5]} intensity={0.5} color="#4ADE80" />
              <InteractiveObject />
            </Canvas>
          </div>

          {/* Overlay Status info */}
          <div className="absolute bottom-4 left-4 font-mono text-[8px] text-white/30 tracking-widest">
            [ OBJECT_D9_MORPH_CYCLE: ACTIVE ]
          </div>
        </div>
      </div>
    </section>
  );
}
