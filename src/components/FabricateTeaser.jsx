import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 3D Printing Chamber Scene
function FabricationChamber({ loopStateRef }) {
  const solidRef = useRef();
  const wireRef = useRef();
  const nozzleGroupRef = useRef();
  const gantryRef = useRef();

  // Custom clipping shaders
  const solidMaterial = useRef(
    new THREE.ShaderMaterial({
      uniforms: {
        uPrintHeight: { value: -1.0 },
        uColor: { value: new THREE.Color('#bebebe') },
        uGlowColor: { value: new THREE.Color('#4ADE80') }
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform float uPrintHeight;
        uniform vec3 uColor;
        uniform vec3 uGlowColor;
        varying vec3 vWorldPosition;
        void main() {
          // Clip anything above print height
          if (vWorldPosition.y > uPrintHeight) {
            discard;
          }
          // Edge glow at printing layer boundary
          float edge = smoothstep(uPrintHeight - 0.04, uPrintHeight, vWorldPosition.y);
          vec3 color = mix(uColor, uGlowColor, edge * 1.5);
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      side: THREE.DoubleSide
    })
  );

  const wireMaterial = useRef(
    new THREE.ShaderMaterial({
      uniforms: {
        uPrintHeight: { value: -1.0 },
        uColor: { value: new THREE.Color('#4ADE80') },
        uOpacity: { value: 0.3 }
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform float uPrintHeight;
        uniform vec3 uColor;
        uniform float uOpacity;
        varying vec3 vWorldPosition;
        void main() {
          // Show wireframe only ABOVE print height, or fade out
          gl_FragColor = vec4(uColor, uOpacity);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide
    })
  );

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Slow loop timeline
    // 0s to 5s: Grow (convert wireframe to solid bottom-to-top)
    // 5s to 7s: Hold solid finished product
    // 7s to 9s: Dissolve (fade solid back to wireframe)
    // 9s to 10s: Hold wireframe before starting again
    const cycleTime = time % 10;
    let height = -0.7; // Bottom Y boundary of model
    let solidOpacity = 1.0;
    let wireOpacity = 0.35;

    if (cycleTime < 5.0) {
      // Growing state: height goes from -0.7 to 0.7
      const progress = cycleTime / 5.0;
      height = -0.7 + progress * 1.45;
      solidOpacity = 1.0;
      wireOpacity = 0.35;
      loopStateRef.current = "MANUFACTURING";
    } else if (cycleTime >= 5.0 && cycleTime < 7.0) {
      // Hold solid state
      height = 0.85;
      solidOpacity = 1.0;
      wireOpacity = 0.0;
      loopStateRef.current = "COMPLETED";
    } else if (cycleTime >= 7.0 && cycleTime < 9.0) {
      // Dissolve state: fade out solid, fade in wireframe
      const progress = (cycleTime - 7.0) / 2.0; // 0 to 1
      height = 0.85;
      solidOpacity = 1.0 - progress;
      wireOpacity = 0.1 + progress * 0.25;
      loopStateRef.current = "DISSOLVING";
    } else {
      // Hold wireframe state
      height = -0.7;
      solidOpacity = 0.0;
      wireOpacity = 0.35;
      loopStateRef.current = "RESETTING";
    }

    // Apply values to shader uniforms
    solidMaterial.current.uniforms.uPrintHeight.value = height;
    wireMaterial.current.uniforms.uPrintHeight.value = height;
    wireMaterial.current.uniforms.uOpacity.value = wireOpacity;

    // Fade the solid mesh material opacity if dissolving
    if (solidRef.current) {
      solidRef.current.rotation.y = time * 0.25;
      // We can mix solidOpacity via material parameter or simple scale
      solidRef.current.visible = solidOpacity > 0.01;
    }
    if (wireRef.current) {
      wireRef.current.rotation.y = time * 0.25;
      wireRef.current.visible = wireOpacity > 0.01;
    }

    // Gantry height tracks print progress
    if (gantryRef.current) {
      gantryRef.current.position.y = height;
    }

    // Nozzle tip jigs back and forth at the print layer height during printing phase
    if (nozzleGroupRef.current) {
      if (cycleTime < 5.0) {
        nozzleGroupRef.current.position.x = Math.sin(time * 30) * 0.3;
        nozzleGroupRef.current.position.z = Math.cos(time * 25) * 0.3;
        nozzleGroupRef.current.visible = true;
      } else {
        nozzleGroupRef.current.position.x = THREE.MathUtils.lerp(nozzleGroupRef.current.position.x, 0, 0.1);
        nozzleGroupRef.current.position.z = THREE.MathUtils.lerp(nozzleGroupRef.current.position.z, 0, 0.1);
        nozzleGroupRef.current.visible = false;
      }
    }

    // Camera orbit interpolation based on mouse pointer
    const { x, y } = state.pointer;
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, x * 1.5 + 1.8, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, y * 1.2 + 1.2, 0.05);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 2.5, 0.05);
    state.camera.lookAt(0, 0.1, 0);
  });

  return (
    <group>
      {/* Lights inside chamber */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 5, 2]} intensity={1.5} />
      <pointLight position={[-3, -2, -3]} intensity={0.3} color="#4ADE80" />

      {/* Procedural object geometries */}
      <mesh ref={solidRef} castShadow>
        <torusKnotGeometry args={[0.55, 0.18, 150, 16]} />
        <primitive object={solidMaterial.current} attach="material" />
      </mesh>

      <mesh ref={wireRef}>
        <torusKnotGeometry args={[0.55, 0.182, 150, 16]} />
        <primitive object={wireMaterial.current} attach="material" wireframe />
      </mesh>

      {/* Printer Gantry Systems */}
      <group ref={gantryRef} position={[0, -0.7, 0]}>
        {/* Metal crossbar bar */}
        <mesh>
          <boxGeometry args={[2.0, 0.04, 0.04]} />
          <meshStandardMaterial color="#444444" roughness={0.4} metalness={0.8} />
        </mesh>
        
        {/* Nozzle carriage group */}
        <group ref={nozzleGroupRef}>
          {/* Extruder Block */}
          <mesh position={[0, 0.08, 0]}>
            <boxGeometry args={[0.2, 0.12, 0.2]} />
            <meshStandardMaterial color="#222222" roughness={0.5} />
          </mesh>
          {/* Nozzle Cone */}
          <mesh position={[0, -0.02, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.04, 0.08, 8]} />
            <meshStandardMaterial color="#888888" metalness={0.9} />
          </mesh>
          {/* Glowing print head pointer light */}
          <pointLight position={[0, -0.06, 0]} intensity={6.0} color="#4ADE80" distance={1.0} />
        </group>
      </group>

      {/* Chamber boundary outline box */}
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[1.8, 1.7, 1.8]} />
        <meshStandardMaterial color="#2C2C2C" wireframe transparent opacity={0.3} />
      </mesh>

      {/* Bottom Bed Grid */}
      <group position={[0, -0.78, 0]}>
        <gridHelper args={[2.0, 10, '#4ADE80', '#2C2C2C']} />
      </group>
    </group>
  );
}

export default function FabricateTeaser({ onEnterFabricate }) {
  const loopStateRef = useRef("MANUFACTURING");
  const [hudState, setHudState] = useState("MANUFACTURING");

  // Keep state updated in UI
  useEffect(() => {
    const interval = setInterval(() => {
      if (loopStateRef.current !== hudState) {
        setHudState(loopStateRef.current);
      }
    }, 150);
    return () => clearInterval(interval);
  }, [hudState]);

  return (
    <section className="w-full bg-black py-20 px-4 md:px-8 max-w-[1280px] mx-auto select-none border-t border-[#1C1C1C] relative">
      <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-white/20"></div>
      <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-white/20"></div>

      <div className="flex items-center gap-2 font-mono text-[10px] sm:text-xs text-[#BEBEBE] tracking-[0.15em] mb-8">
        <span className="text-[#4ADE80] text-[8px] animate-pulse">●</span>
        <span>[ SECTION_07 // FABRICATE PREVIEW ]</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1.5fr] gap-12 items-center">
        {/* Left Side: Teaser details and CTA */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs text-[#4ADE80] tracking-widest">[ FABRICATOR_MODULE v0.9 ]</span>
            <h2 className="font-display font-extrabold text-[8vw] sm:text-[6vw] lg:text-[4.5rem] leading-[0.95] text-white tracking-[0.02em] uppercase">
              YOUR DESIGN.
              <br />
              <span className="text-white/40">OUR MACHINES.</span>
            </h2>
            <p className="font-mono text-white/50 text-xs sm:text-sm mt-4 leading-relaxed max-w-md">
              Upload custom telemetry vectors directly to our manufacturing chamber. Watch the build cycle initiate in real-time. Complete access to physical plastic deposition is now online.
            </p>
          </div>

          <div>
            <button
              onClick={onEnterFabricate}
              className="border-2 border-[#4ADE80] text-[#4ADE80] bg-[#4ADE80]/5 hover:bg-[#4ADE80] hover:text-black font-mono font-bold text-xs sm:text-sm tracking-[0.25em] px-8 py-4 transition-all duration-300 cursor-pointer relative group"
            >
              [ ENTER FABRICATE ]
              {/* Subtle tech border outline */}
              <div className="absolute inset-[-4px] border border-[#2C2C2C] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </button>
          </div>
        </div>

        {/* Right Side: R3F Fabrication Chamber */}
        <div className="border border-[#2C2C2C] aspect-[4/3] w-full bg-[#070707] relative overflow-hidden flex flex-col justify-between p-4 group">
          {/* Target Corners */}
          <div className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-white/20 group-hover:border-[#4ADE80] transition-colors"></div>
          <div className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-white/20 group-hover:border-[#4ADE80] transition-colors"></div>
          <div className="absolute bottom-2 left-2 w-1.5 h-1.5 border-b border-l border-white/20 group-hover:border-[#4ADE80] transition-colors"></div>
          <div className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-white/20 group-hover:border-[#4ADE80] transition-colors"></div>

          {/* Top diagnostics */}
          <div className="flex justify-between font-mono text-[9px] text-[#6B6B6B] tracking-wider relative z-10 pointer-events-none">
            <span>[ SYSTEM: CHAMBER_D9 ]</span>
            <span className="text-[#4ADE80] font-bold">STATE: {hudState}</span>
          </div>

          {/* Canvas Viewport */}
          <div className="absolute inset-0 pointer-events-none lg:pointer-events-auto">
            <Canvas camera={{ position: [1.8, 1.2, 2.5], fov: 40 }} dpr={[1, 1.5]}>
              <FabricationChamber loopStateRef={loopStateRef} />
            </Canvas>
          </div>

          {/* Bottom diagnostics */}
          <div className="flex justify-between font-mono text-[8px] text-[#6B6B6B] tracking-widest relative z-10 pointer-events-none">
            <span>VOLUMETRIC_CLIP: OK</span>
            <span>CYCLE: CONTINUOUS_LOOP</span>
          </div>
        </div>
      </div>
    </section>
  );
}
