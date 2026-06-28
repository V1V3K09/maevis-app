import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motion } from 'framer-motion';

// 3D Preview Component representing different stages
function ProcessPreview({ stage }) {
  const meshRef = useRef();
  const nozzleRef = useRef();
  const groupRef = useRef();

  // Custom shader for SLICE (horizontal rings look)
  const sliceMaterial = useRef(
    new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color('#4ADE80') }
      },
      vertexShader: `
        varying vec3 vPosition;
        void main() {
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying vec3 vPosition;
        void main() {
          // Stripe slice pattern
          float stripes = step(0.85, fract(vPosition.y * 24.0));
          if (stripes < 0.1) discard;
          gl_FragColor = vec4(uColor, 1.0);
        }
      `,
      side: THREE.DoubleSide
    })
  );

  // Custom shader for PRINT (clipping/grow look)
  const printMaterial = useRef(
    new THREE.ShaderMaterial({
      uniforms: {
        uPrintHeight: { value: 0.0 },
        uColor: { value: new THREE.Color('#bebebe') },
        uGlowColor: { value: new THREE.Color('#4ADE80') }
      },
      vertexShader: `
        varying vec3 vPosition;
        void main() {
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uPrintHeight;
        uniform vec3 uColor;
        uniform vec3 uGlowColor;
        varying vec3 vPosition;
        void main() {
          if (vPosition.y > uPrintHeight) {
            discard;
          }
          float edge = smoothstep(uPrintHeight - 0.05, uPrintHeight, vPosition.y);
          vec3 finalColor = mix(uColor, uGlowColor, edge);
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
      side: THREE.DoubleSide
    })
  );

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Constant rotation of main group
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.2;
    }

    // Camera mouse movement interpolation
    const { x, y } = state.pointer;
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, x * 1.0, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, y * 1.0 + 0.8, 0.05);
    state.camera.lookAt(0, 0, 0);

    // Print animation behavior
    if (stage === 2) {
      // Oscillate print progress
      const printProgress = Math.sin(time * 1.5) * 0.7 + 0.1; // Range approx -0.6 to 0.8
      printMaterial.current.uniforms.uPrintHeight.value = printProgress;
      
      if (nozzleRef.current) {
        nozzleRef.current.position.y = printProgress;
        nozzleRef.current.position.x = Math.sin(time * 15) * 0.2;
        nozzleRef.current.position.z = Math.cos(time * 12) * 0.2;
      }
    }
  });

  // Geometry: a stylized mechanical bolt/cylinder shape
  const geometry = new THREE.CylinderGeometry(0.4, 0.6, 1.4, 6);

  return (
    <group ref={groupRef}>
      {/* 0. UPLOAD Stage (Point cloud) */}
      {stage === 0 && (
        <points>
          <cylinderGeometry args={[0.5, 0.7, 1.5, 12, 12]} />
          <pointsMaterial color="#ffffff" size={0.03} />
        </points>
      )}

      {/* 1. SLICE Stage (Horizontal rings) */}
      {stage === 1 && (
        <mesh geometry={geometry}>
          <primitive object={sliceMaterial.current} attach="material" />
        </mesh>
      )}

      {/* 2. PRINT Stage (Growing print preview with nozzle) */}
      {stage === 2 && (
        <group>
          <mesh geometry={geometry}>
            <primitive object={printMaterial.current} attach="material" />
          </mesh>
          {/* Virtual Nozzle */}
          <group ref={nozzleRef} position={[0, 0, 0]}>
            <mesh position={[0, 0.1, 0]}>
              <coneGeometry args={[0.08, 0.2, 6]} />
              <meshStandardMaterial color="#4ADE80" emissive="#4ADE80" emissiveIntensity={0.5} />
            </mesh>
          </group>
        </group>
      )}

      {/* 3. FINISH Stage (Clean Solid mesh) */}
      {stage === 3 && (
        <mesh geometry={geometry}>
          <meshStandardMaterial color="#BEBEBE" roughness={0.35} metalness={0.7} />
        </mesh>
      )}

      {/* 4. SHIP Stage (Spinning mesh in transparent protective crate) */}
      {stage === 4 && (
        <group>
          {/* Finished Product */}
          <mesh geometry={geometry}>
            <meshStandardMaterial color="#6B6B6B" roughness={0.4} metalness={0.6} />
          </mesh>
          {/* Crate Box */}
          <mesh scale={[1.4, 1.4, 1.4]}>
            <boxGeometry args={[1.2, 1.2, 1.2]} />
            <meshStandardMaterial 
              color="#4ADE80" 
              wireframe 
              transparent 
              opacity={0.4} 
            />
          </mesh>
          <mesh scale={[1.41, 1.41, 1.41]}>
            <boxGeometry args={[1.2, 1.2, 1.2]} />
            <meshPhysicalMaterial 
              color="#ffffff" 
              transparent 
              opacity={0.12} 
              roughness={0.1}
              metalness={0.1}
              transmission={0.8}
              thickness={0.5}
            />
          </mesh>
        </group>
      )}
    </group>
  );
}

export default function ProcessSection() {
  const [activeStage, setActiveStage] = useState(0);

  const stages = [
    {
      title: "UPLOAD",
      desc: "Ingest vector or mesh telemetry. Automated shell and mass diagnostics calculate optimal mechanical distribution.",
      tag: "INJ_SYS"
    },
    {
      title: "SLICE",
      desc: "Convert spatial bounds to horizontal layers. Toolpath nodes generate layer coordinates at 100-micron depth.",
      tag: "SLC_SYS"
    },
    {
      title: "PRINT",
      desc: "High-temperature extrusion. Filament deposited along toolpaths on a heat-stabilized mechanical plate.",
      tag: "PRN_SYS"
    },
    {
      title: "FINISH",
      desc: "Support lattices chemical dissolution. Surface processing removes layer lines for uniform micro-satin feel.",
      tag: "FNS_SYS"
    },
    {
      title: "SHIP",
      desc: "Vacuum containment packaging. Hand-numbered certification label and immediate freight deployment.",
      tag: "SHP_SYS"
    }
  ];

  return (
    <section className="w-full bg-black py-20 px-4 md:px-8 max-w-[1280px] mx-auto select-none border-t border-[#1C1C1C] relative">
      {/* Target decoration */}
      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-white/20"></div>
      <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-white/20"></div>

      <div className="flex items-center gap-2 font-mono text-[10px] sm:text-xs text-[#BEBEBE] tracking-[0.15em] mb-8">
        <span className="text-[#4ADE80] text-[8px] animate-pulse">●</span>
        <span>[ SECTION_02 // PRINTING PROCESS ]</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-12 items-center">
        
        {/* Left Side: Large Horizontal Timeline */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs text-[#4ADE80] tracking-widest">[ TIMELINE v1.2 ]</span>
            <h2 className="font-display font-extrabold text-[8vw] sm:text-[6vw] lg:text-[4.5rem] leading-[0.95] text-white tracking-[0.02em] uppercase">
              FABRICATION PATHWAY
            </h2>
          </div>

          {/* Timeline Nodes */}
          <div className="flex flex-col gap-4 border-t border-b border-[#2C2C2C] py-6">
            {stages.map((stage, idx) => {
              const isActive = activeStage === idx;
              return (
                <div
                  key={idx}
                  onMouseEnter={() => setActiveStage(idx)}
                  onClick={() => setActiveStage(idx)}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-transparent hover:border-[#2C2C2C] hover:bg-[#070707] transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center gap-6">
                    <span className={`font-mono text-xs transition-colors duration-200 ${isActive ? 'text-[#4ADE80]' : 'text-white/30'}`}>
                      [0{idx + 1}]
                    </span>
                    <span className={`font-display font-bold text-2xl sm:text-3xl tracking-wider transition-colors duration-200 ${isActive ? 'text-[#4ADE80]' : 'text-white group-hover:text-[#4ADE80]'}`}>
                      {stage.title}
                    </span>
                  </div>

                  <div className="mt-2 sm:mt-0 max-w-sm sm:text-right">
                    <p className={`font-mono text-[11px] leading-relaxed transition-colors duration-200 ${isActive ? 'text-white/80' : 'text-white/40'}`}>
                      {stage.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: 3D Preview Panel */}
        <div className="border border-[#2C2C2C] aspect-square w-full max-w-[450px] mx-auto bg-[#070707] relative overflow-hidden flex flex-col justify-between p-4">
          {/* Target Corners */}
          <div className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-white/20"></div>
          <div className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-white/20"></div>
          <div className="absolute bottom-2 left-2 w-1.5 h-1.5 border-b border-l border-white/20"></div>
          <div className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-white/20"></div>

          {/* Top Info Header */}
          <div className="flex justify-between font-mono text-[9px] text-[#6B6B6B] tracking-wider relative z-10 pointer-events-none">
            <span>[ SYSTEM_3D_NODE: 0{activeStage + 1} ]</span>
            <span className="text-[#4ADE80] font-bold">[ {stages[activeStage].tag} ]</span>
          </div>

          {/* Canvas Viewport */}
          <div className="absolute inset-0 pointer-events-none lg:pointer-events-auto">
            <Canvas camera={{ position: [0, 0.4, 2.5], fov: 45 }} dpr={[1, 1.5]}>
              <ambientLight intensity={0.6} />
              <directionalLight position={[5, 10, 5]} intensity={2.0} color="#ffffff" />
              <spotLight position={[0, 4, 0]} intensity={15} color="#4ADE80" angle={0.6} />
              <ProcessPreview stage={activeStage} />
            </Canvas>
          </div>

          {/* Bottom Diagnostics Footer */}
          <div className="flex justify-between font-mono text-[8px] text-[#6B6B6B] tracking-widest relative z-10 pointer-events-none">
            <span>LATCH: READY</span>
            <span>FEED_ACTIVE: TRUE</span>
          </div>
        </div>

      </div>
    </section>
  );
}
