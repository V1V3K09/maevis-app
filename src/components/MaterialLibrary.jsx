import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 3D Sphere Component inside each card
function MaterialSphere({ type, isHovered }) {
  const meshRef = useRef();
  const lightRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();

    // Constant rotation that gets slightly faster on hover
    const speed = isHovered ? 0.6 : 0.2;
    meshRef.current.rotation.y = time * speed;
    meshRef.current.rotation.x = Math.sin(time * 0.5) * 0.1;

    // Camera interaction based on pointer
    const { x, y } = state.pointer;
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, x * 0.5, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, y * 0.5 + 0.2, 0.05);
    state.camera.lookAt(0, 0, 0);

    // Interpolate point light intensity based on hover
    if (lightRef.current) {
      lightRef.current.intensity = THREE.MathUtils.lerp(
        lightRef.current.intensity,
        isHovered ? 30.0 : 8.0,
        0.1
      );
      // Move point light slightly with mouse
      lightRef.current.position.x = x * 1.5;
      lightRef.current.position.y = y * 1.5 + 1.0;
    }
  });

  // Render different material properties based on material type
  const getMaterial = () => {
    switch (type) {
      case 'PLA':
        return (
          <meshStandardMaterial
            color="#CCCCCC"
            roughness={isHovered ? 0.3 : 0.65}
            metalness={isHovered ? 0.5 : 0.1}
          />
        );
      case 'PETG':
        return (
          <meshPhysicalMaterial
            color="#DDF0FF"
            roughness={isHovered ? 0.05 : 0.15}
            metalness={0.1}
            transparent
            opacity={0.7}
            transmission={isHovered ? 0.8 : 0.5}
            thickness={1.0}
          />
        );
      case 'ABS':
        return (
          <meshStandardMaterial
            color="#222222"
            roughness={isHovered ? 0.45 : 0.85}
            metalness={isHovered ? 0.4 : 0.05}
          />
        );
      case 'RESIN':
        return (
          <meshPhysicalMaterial
            color="#E67E22"
            roughness={isHovered ? 0.02 : 0.08}
            metalness={0.0}
            transparent
            opacity={0.8}
            transmission={isHovered ? 0.95 : 0.75}
            thickness={1.5}
          />
        );
      default:
        return <meshStandardMaterial color="#888888" />;
    }
  };

  return (
    <group>
      {/* Dynamic Lighting inside sphere space */}
      <pointLight ref={lightRef} position={[1, 1, 1]} intensity={8.0} color="#4ADE80" />
      <directionalLight position={[-2, 2, -1]} intensity={0.5} color="#ffffff" />
      
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.9, 64, 64]} />
        {getMaterial()}
      </mesh>
    </group>
  );
}

export default function MaterialLibrary() {
  const [hoveredCard, setHoveredCard] = useState(null);

  const materials = [
    {
      id: 'PLA',
      name: 'PLA [POLYLACTIC ACID]',
      desc: 'Plant-derived organic bioplastic. Offers exceptional tensile strength, zero warp, and clean geometric resolution.',
      specs: { density: '1.24 g/cm³', temp: '210°C', flex: 'High', surface: 'Matte/Satin' }
    },
    {
      id: 'PETG',
      name: 'PETG [CO-POLYESTER]',
      desc: 'Glycol-modified high-strength polymer. Bridging the gap between PLA ease and ABS structural toughness.',
      specs: { density: '1.27 g/cm³', temp: '240°C', flex: 'Medium', surface: 'Glossy/Translucent' }
    },
    {
      id: 'ABS',
      name: 'ABS [ACRYLONITRILE]',
      desc: 'Industrial-grade impact polymer. Chemical, heat, and shock-resistant. Perfect for mechanical end-use casings.',
      specs: { density: '1.04 g/cm³', temp: '255°C', flex: 'Low', surface: 'Deep Matte' }
    },
    {
      id: 'RESIN',
      name: 'RESIN [PHOTOPOLYMER]',
      desc: 'UV-cured liquid photopolymer. Offers molecular-level detail, flat micro-surfaces, and high isotropic strength.',
      specs: { density: '1.15 g/cm³', temp: '80°C', flex: 'Brittle', surface: 'Glass-like/Glossy' }
    }
  ];

  return (
    <section className="w-full bg-black py-20 px-4 md:px-8 max-w-[1280px] mx-auto select-none border-t border-[#1C1C1C] relative">
      {/* Grid design decoration */}
      <div className="absolute top-0 left-1/4 w-[1px] h-full bg-[#1C1C1C] pointer-events-none hidden lg:block"></div>
      <div className="absolute top-0 left-2/4 w-[1px] h-full bg-[#1C1C1C] pointer-events-none hidden lg:block"></div>
      <div className="absolute top-0 left-3/4 w-[1px] h-full bg-[#1C1C1C] pointer-events-none hidden lg:block"></div>

      <div className="flex items-center gap-2 font-mono text-[10px] sm:text-xs text-[#BEBEBE] tracking-[0.15em] mb-8">
        <span className="text-[#4ADE80] text-[8px] animate-pulse">●</span>
        <span>[ SECTION_03 // MATERIAL LIBRARY ]</span>
      </div>

      <div className="flex flex-col gap-2 mb-12">
        <span className="font-mono text-xs text-[#4ADE80] tracking-widest">[ SPEC_INDEX v2.0 ]</span>
        <h2 className="font-display font-extrabold text-[8vw] sm:text-[6vw] lg:text-[4.5rem] leading-[0.95] text-white tracking-[0.02em] uppercase">
          PREMIUM POLYMERS
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {materials.map((mat) => {
          const isHovered = hoveredCard === mat.id;
          return (
            <div
              key={mat.id}
              onMouseEnter={() => setHoveredCard(mat.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => setHoveredCard(hoveredCard === mat.id ? null : mat.id)}
              className="group border border-[#2C2C2C] hover:border-[#4ADE80] bg-[#070707] flex flex-col justify-between p-4 transition-all duration-300 relative cursor-pointer"
            >
              {/* Corner crosshairs on hover */}
              {isHovered && (
                <>
                  <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#4ADE80]"></div>
                  <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#4ADE80]"></div>
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#4ADE80]"></div>
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#4ADE80]"></div>
                </>
              )}

              {/* R3F Canvas showing Sphere */}
              <div className="w-full aspect-square border border-[#1C1C1C] group-hover:border-[#4ADE80]/30 bg-black mb-4 relative overflow-hidden flex items-center justify-center">
                {/* Tech grid mesh backdrop */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                
                <div className="absolute inset-0 pointer-events-none sm:pointer-events-auto">
                  <Canvas camera={{ position: [0, 0.2, 2.2], fov: 45 }} dpr={[1, 1.5]}>
                    <ambientLight intensity={0.4} />
                    <MaterialSphere type={mat.id} isHovered={isHovered} />
                  </Canvas>
                </div>
              </div>

              {/* Material Info Text */}
              <div className="flex flex-col gap-3 font-mono">
                <span className={`text-sm font-bold tracking-widest transition-colors duration-200 ${isHovered ? 'text-[#4ADE80]' : 'text-white'}`}>
                  {mat.name}
                </span>
                
                <p className="text-[10px] text-white/50 leading-relaxed min-h-[50px]">
                  {mat.desc}
                </p>

                {/* Specs Block */}
                <div className="border-t border-[#1C1C1C] pt-3 mt-2 flex flex-col gap-1.5 text-[9px] text-[#6B6B6B] leading-none">
                  <div className="flex justify-between">
                    <span>DENSITY:</span>
                    <span className="text-white/60">{mat.specs.density}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>TEMP_RESIST:</span>
                    <span className="text-white/60">{mat.specs.temp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>FLEXIBILITY:</span>
                    <span className="text-white/60">{mat.specs.flex}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SURFACE:</span>
                    <span className="text-white/60">{mat.specs.surface}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
