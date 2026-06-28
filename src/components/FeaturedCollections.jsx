import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 3D Product Mesh representing Gaming collection
function GamingProduct() {
  return (
    <group>
      {/* Console Base */}
      <mesh castShadow position={[0, 0.1, 0]}>
        <boxGeometry args={[0.9, 0.45, 0.15]} />
        <meshStandardMaterial color="#4A4A4A" roughness={0.3} metalness={0.7} />
      </mesh>
      {/* D-Pad */}
      <mesh position={[-0.25, 0.1, 0.09]}>
        <boxGeometry args={[0.12, 0.12, 0.05]} />
        <meshStandardMaterial color="#222" roughness={0.5} />
      </mesh>
      {/* Buttons */}
      <mesh position={[0.25, 0.15, 0.09]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#4ADE80" emissive="#4ADE80" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[0.25, 0.05, 0.09]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#4ADE80" emissive="#4ADE80" emissiveIntensity={0.2} />
      </mesh>
      {/* Screen */}
      <mesh position={[0, 0.1, 0.08]}>
        <planeGeometry args={[0.35, 0.35]} />
        <meshStandardMaterial color="#111" roughness={0.1} />
      </mesh>
    </group>
  );
}

// 3D Product Mesh representing Anime collection (Sword/Robotic Blade)
function AnimeProduct() {
  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      {/* Blade */}
      <mesh castShadow position={[0, 0.4, 0]}>
        <boxGeometry args={[0.06, 1.0, 0.02]} />
        <meshStandardMaterial color="#BEBEBE" roughness={0.1} metalness={0.9} />
      </mesh>
      {/* Guard */}
      <mesh position={[0, -0.12, 0]}>
        <boxGeometry args={[0.16, 0.04, 0.06]} />
        <meshStandardMaterial color="#4ADE80" roughness={0.4} />
      </mesh>
      {/* Hilt */}
      <mesh position={[0, -0.25, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.22, 8]} />
        <meshStandardMaterial color="#222" roughness={0.6} />
      </mesh>
    </group>
  );
}

// 3D Product Mesh representing Desk Setup (Headphone Stand)
function DeskSetupProduct() {
  return (
    <group>
      {/* Stand Base */}
      <mesh castShadow position={[0, -0.4, 0]}>
        <boxGeometry args={[0.6, 0.05, 0.6]} />
        <meshStandardMaterial color="#222" roughness={0.7} metalness={0.4} />
      </mesh>
      {/* Stand Pillar */}
      <mesh castShadow position={[-0.2, 0.05, 0]}>
        <boxGeometry args={[0.05, 0.9, 0.05]} />
        <meshStandardMaterial color="#BEBEBE" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Stand Hanger */}
      <mesh castShadow position={[-0.05, 0.48, 0]}>
        <boxGeometry args={[0.3, 0.04, 0.08]} />
        <meshStandardMaterial color="#BEBEBE" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Headphone Earcups */}
      <group position={[0.05, 0.2, 0]}>
        <mesh position={[-0.15, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} rotation={[0, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#444" roughness={0.5} />
        </mesh>
        <mesh position={[0.15, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} rotation={[0, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#444" roughness={0.5} />
        </mesh>
        {/* Headband */}
        <mesh position={[0, 0.18, 0]}>
          <torusGeometry args={[0.18, 0.02, 8, 24, Math.PI]} rotation={[0, 0, Math.PI]} />
          <meshStandardMaterial color="#4ADE80" />
        </mesh>
      </group>
    </group>
  );
}

// 3D Product Mesh representing Utility (Mechanical Gear Assembly)
function UtilityProduct() {
  return (
    <group>
      {/* Gear Base */}
      <mesh castShadow position={[0, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.2, 12]} />
        <meshStandardMaterial color="#BEBEBE" roughness={0.2} metalness={0.8} />
      </mesh>
      {/* Central Hub */}
      <mesh position={[0, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.24, 8]} />
        <meshStandardMaterial color="#4ADE80" roughness={0.4} />
      </mesh>
      {/* Inner shaft hole */}
      <mesh position={[0, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.26, 8]} />
        <meshBasicMaterial color="#111" />
      </mesh>
      {/* Gear Teeth */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 0.44, 0.1, Math.sin(angle) * 0.44]}
            rotation={[0, -angle, 0]}
          >
            <boxGeometry args={[0.1, 0.14, 0.1]} />
            <meshStandardMaterial color="#BEBEBE" roughness={0.2} metalness={0.8} />
          </mesh>
        );
      })}
    </group>
  );
}

// Shelf Canvas controller
function ShelfItem({ type, isHovered }) {
  const modelRef = useRef();

  useFrame((state) => {
    if (!modelRef.current) return;
    const time = state.clock.getElapsedTime();

    // Constant slow float/bobbing
    modelRef.current.position.y = Math.sin(time * 1.5) * 0.08;

    // Slow rotation that accelerates/rotates further on hover
    const baseRotationY = time * 0.25;
    
    // Subtle cursor movement effect
    const { x, y } = state.pointer;
    
    modelRef.current.rotation.y = THREE.MathUtils.lerp(
      modelRef.current.rotation.y,
      baseRotationY + (isHovered ? x * 1.2 : x * 0.3),
      0.08
    );
    
    modelRef.current.rotation.x = THREE.MathUtils.lerp(
      modelRef.current.rotation.x,
      isHovered ? -y * 0.6 : -y * 0.15,
      0.08
    );

    // Camera follow cursor
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, x * 0.8, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, y * 0.6 + 0.3, 0.05);
    state.camera.lookAt(0, 0.1, 0);
  });

  const getProductModel = () => {
    switch (type) {
      case 'Gaming': return <GamingProduct />;
      case 'Anime': return <AnimeProduct />;
      case 'Desk Setup': return <DeskSetupProduct />;
      case 'Utility': return <UtilityProduct />;
      default: return null;
    }
  };

  return (
    <group>
      {/* Metal Shelf Plate Grid */}
      <mesh position={[0, -0.45, 0]}>
        <boxGeometry args={[2.5, 0.06, 1.2]} />
        <meshStandardMaterial color="#1C1C1C" roughness={0.4} metalness={0.8} />
      </mesh>
      {/* Light coming from bottom of the shelf */}
      <pointLight position={[0, -0.3, 0.2]} intensity={3.0} color="#4ADE80" distance={2.0} />

      {/* Floating Product Group */}
      <group ref={modelRef}>
        {getProductModel()}
      </group>
    </group>
  );
}

export default function FeaturedCollections() {
  const [hoveredShelf, setHoveredShelf] = useState(null);

  const collections = [
    {
      id: 'Gaming',
      title: 'GAMING ASSEMBLIES',
      sub: '[ SEC_04_GMG ]',
      details: 'Intricate controller stands, artisan keycaps, custom console faceplates, and tactile gaming modules.',
      itemsCount: '14 BATCHES ACTIVE'
    },
    {
      id: 'Anime',
      title: 'ANIME ARTIFACTS',
      sub: '[ SEC_04_ANM ]',
      details: 'High-poly weapon replicas, stylized mechanical character plates, and concrete-feel desk figures.',
      itemsCount: '08 BATCHES ACTIVE'
    },
    {
      id: 'Desk Setup',
      title: 'DESK SYSTEM MODULES',
      sub: '[ SEC_04_DSK ]',
      details: 'Cable guides, headphone stands, modular accessory trays, and mechanical keyboard bases.',
      itemsCount: '19 BATCHES ACTIVE'
    },
    {
      id: 'Utility',
      title: 'UTILITY & GEARS',
      sub: '[ SEC_04_UTL ]',
      details: 'Robust mechanical clips, compound gears, custom functional carabiners, and storage units.',
      itemsCount: '22 BATCHES ACTIVE'
    }
  ];

  return (
    <section className="w-full bg-black py-20 px-4 md:px-8 max-w-[1280px] mx-auto select-none border-t border-[#1C1C1C] relative">
      <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-white/20"></div>
      <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-white/20"></div>

      <div className="flex items-center gap-2 font-mono text-[10px] sm:text-xs text-[#BEBEBE] tracking-[0.15em] mb-8">
        <span className="text-[#4ADE80] text-[8px] animate-pulse">●</span>
        <span>[ SECTION_04 // FEATURED COLLECTIONS ]</span>
      </div>

      <div className="flex flex-col gap-2 mb-12">
        <span className="font-mono text-xs text-[#4ADE80] tracking-widest">[ RACK_SYSTEM v3.8 ]</span>
        <h2 className="font-display font-extrabold text-[8vw] sm:text-[6vw] lg:text-[4.5rem] leading-[0.95] text-white tracking-[0.02em] uppercase">
          SHELVING CATALOG
        </h2>
      </div>

      {/* Shelves Layout */}
      <div className="flex flex-col gap-8">
        {collections.map((col) => {
          const isHovered = hoveredShelf === col.id;
          return (
            <div
              key={col.id}
              onMouseEnter={() => setHoveredShelf(col.id)}
              onMouseLeave={() => setHoveredShelf(null)}
              onClick={() => setHoveredShelf(hoveredShelf === col.id ? null : col.id)}
              className="group border border-[#2C2C2C] hover:border-[#4ADE80] bg-[#070707] grid grid-cols-1 md:grid-cols-[1.5fr_1fr] items-center p-6 transition-all duration-300 relative cursor-pointer"
            >
              {/* Corner indicators */}
              <div className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-white/10 group-hover:border-[#4ADE80] transition-colors"></div>
              <div className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-white/10 group-hover:border-[#4ADE80] transition-colors"></div>
              <div className="absolute bottom-2 left-2 w-1.5 h-1.5 border-b border-l border-white/10 group-hover:border-[#4ADE80] transition-colors"></div>
              <div className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-white/10 group-hover:border-[#4ADE80] transition-colors"></div>

              {/* Left Column: Shelf Info */}
              <div className="flex flex-col gap-4 font-mono">
                <div className="flex items-center gap-4">
                  <span className={`text-[10px] tracking-widest transition-colors duration-200 ${isHovered ? 'text-[#4ADE80]' : 'text-white/40'}`}>
                    {col.sub}
                  </span>
                  <span className="text-[10px] text-white/20">|</span>
                  <span className="text-[10px] text-[#4ADE80] tracking-widest">{col.itemsCount}</span>
                </div>
                <h3 className="font-display font-black text-3xl sm:text-4xl tracking-wider text-white group-hover:text-[#4ADE80] transition-colors">
                  {col.title}
                </h3>
                <p className="text-[11px] text-white/50 leading-relaxed max-w-lg">
                  {col.details}
                </p>
              </div>

              {/* Right Column: 3D Shelf Preview */}
              <div className="w-full aspect-[2/1] md:aspect-[2.3/1] border border-[#1C1C1C] group-hover:border-[#4ADE80]/30 bg-black mt-6 md:mt-0 relative overflow-hidden flex items-center justify-center">
                {/* Backplate industrial grid pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
                
                <div className="absolute inset-0 pointer-events-none md:pointer-events-auto">
                  <Canvas camera={{ position: [0, 0.3, 2.2], fov: 45 }} dpr={[1, 1.5]}>
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[2, 4, 3]} intensity={1.5} />
                    <ShelfItem type={col.id} isHovered={isHovered} />
                  </Canvas>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
