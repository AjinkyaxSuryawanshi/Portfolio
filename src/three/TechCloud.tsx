import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

// Tech icons data
const techIcons = [
  { name: 'React', color: '#61DAFB', icon: '⚛️' },
  { name: 'Node.js', color: '#339933', icon: '🟢' },
  { name: 'TypeScript', color: '#3178C6', icon: '🔷' },
  { name: 'MongoDB', color: '#47A248', icon: '🍃' },
  { name: 'Python', color: '#3776AB', icon: '🐍' },
  { name: 'Git', color: '#F05032', icon: '📦' },
  { name: 'AWS', color: '#FF9900', icon: '☁️' },
  { name: 'Docker', color: '#2496ED', icon: '🐳' },
  { name: 'TensorFlow', color: '#FF6F00', icon: '🧠' },
  { name: 'Next.js', color: '#FFFFFF', icon: '▲' },
  { name: 'Tailwind', color: '#06B6D4', icon: '🌊' },
  { name: 'Three.js', color: '#FFFFFF', icon: '3D' },
];

// Icon sphere component
function IconSphere() {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);
  
  // Calculate positions on a sphere
  const iconPositions = useMemo(() => {
    const positions: { position: THREE.Vector3; tech: typeof techIcons[0] }[] = [];
    const count = techIcons.length;
    const radius = 2.5;
    
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      
      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);
      
      positions.push({
        position: new THREE.Vector3(x, y, z),
        tech: techIcons[i],
      });
    }
    
    return positions;
  }, []);

  // Mouse interaction
  const mouseRef = useRef({ x: 0, y: 0 });
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Auto rotation
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.1;
      
      // Mouse influence
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        mouseRef.current.y * 0.2,
        0.05
      );
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        -mouseRef.current.x * 0.2,
        0.05
      );
    }
  });

  return (
    <group ref={groupRef}>
      {/* Center glow */}
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial
          color="#8b5cf6"
          transparent
          opacity={0.2}
        />
      </mesh>
      
      {/* Icons */}
      {iconPositions.map(({ position, tech }) => (
        <Icon
          key={tech.name}
          position={position}
          tech={tech}
          isHovered={hoveredTech === tech.name}
          onHover={() => setHoveredTech(tech.name)}
          onLeave={() => setHoveredTech(null)}
        />
      ))}
      
      {/* Ambient lighting */}
      <ambientLight intensity={0.8} />
      <pointLight position={[5, 5, 5]} intensity={0.5} color="#8b5cf6" />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#ec4899" />
    </group>
  );
}

// Individual icon component
function Icon({
  position,
  tech,
  isHovered,
  onHover,
  onLeave,
}: {
  position: THREE.Vector3;
  tech: typeof techIcons[0];
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(
        THREE.MathUtils.lerp(
          meshRef.current.scale.x,
          isHovered ? 1.3 : 1,
          0.1
        )
      );
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={onHover}
        onPointerOut={onLeave}
      >
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial
          color={tech.color}
          emissive={tech.color}
          emissiveIntensity={isHovered ? 0.5 : 0.2}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
      
      {/* Icon label */}
      <Html
        distanceFactor={8}
        style={{
          pointerEvents: 'none',
          opacity: isHovered ? 1 : 0.7,
          transition: 'opacity 0.3s',
        }}
      >
        <div className="flex flex-col items-center">
          <span className="text-2xl">{tech.icon}</span>
          {isHovered && (
            <span
              className="mt-1 px-2 py-1 rounded bg-black/80 text-white text-xs whitespace-nowrap"
              style={{ color: tech.color }}
            >
              {tech.name}
            </span>
          )}
        </div>
      </Html>
      
      {/* Glow effect when hovered */}
      {isHovered && (
        <mesh scale={1.5}>
          <sphereGeometry args={[0.35, 32, 32]} />
          <meshBasicMaterial
            color={tech.color}
            transparent
            opacity={0.2}
          />
        </mesh>
      )}
    </group>
  );
}

export default function TechCloud() {
  return (
    <div className="w-full h-full min-h-[400px]">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <IconSphere />
      </Canvas>
    </div>
  );
}
