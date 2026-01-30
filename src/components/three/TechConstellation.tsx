import { useRef, useMemo, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useMousePosition } from '@/hooks/useMousePosition';
import * as THREE from 'three';

interface TechItem {
  name: string;
  color: string;
  icon: string;
  orbit: number;
  angle: number;
  speed: number;
}

const techData: TechItem[] = [
  { name: 'React', color: '#61DAFB', icon: '⚛️', orbit: 0, angle: 0, speed: 0.3 },
  { name: 'Node.js', color: '#339933', icon: '🟢', orbit: 0, angle: 60, speed: 0.3 },
  { name: 'TypeScript', color: '#3178C6', icon: '🔷', orbit: 0, angle: 120, speed: 0.3 },
  { name: 'MongoDB', color: '#47A248', icon: '🍃', orbit: 0, angle: 180, speed: 0.3 },
  { name: 'Next.js', color: '#FFFFFF', icon: '▲', orbit: 0, angle: 240, speed: 0.3 },
  { name: 'Tailwind', color: '#06B6D4', icon: '🌊', orbit: 0, angle: 300, speed: 0.3 },
  { name: 'Python', color: '#3776AB', icon: '🐍', orbit: 1, angle: 30, speed: 0.2 },
  { name: 'Git', color: '#F05032', icon: '📦', orbit: 1, angle: 90, speed: 0.2 },
  { name: 'AWS', color: '#FF9900', icon: '☁️', orbit: 1, angle: 150, speed: 0.2 },
  { name: 'Docker', color: '#2496ED', icon: '🐳', orbit: 1, angle: 210, speed: 0.2 },
  { name: 'TensorFlow', color: '#FF6F00', icon: '🧠', orbit: 1, angle: 270, speed: 0.2 },
  { name: 'Three.js', color: '#FFFFFF', icon: '3D', orbit: 1, angle: 330, speed: 0.2 },
];

const orbitRadii = [2.5, 4, 5.5];
const orbitTilts = [0.3, -0.4, 0.2];

interface TechCardProps {
  tech: TechItem;
  position: THREE.Vector3;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}

function TechCard({ tech, position, isHovered, onHover, onLeave }: TechCardProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();

  useFrame(() => {
    if (meshRef.current) {
      // Smooth scale on hover
      const targetScale = isHovered ? 1.3 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

      // Move toward camera on hover
      const targetZ = isHovered ? position.z + 1.5 : position.z;
      meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, 0.1);

      // Always face camera
      meshRef.current.lookAt(camera.position);
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={onHover}
        onPointerOut={onLeave}
      >
        {/* Card backing */}
        <boxGeometry args={[0.8, 0.8, 0.1]} />
        <meshStandardMaterial
          color={0x1a1a2e}
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>

      {/* Glow effect on hover */}
      {isHovered && (
        <mesh scale={1.5}>
          <boxGeometry args={[0.8, 0.8, 0.1]} />
          <meshBasicMaterial
            color={tech.color}
            transparent
            opacity={0.15}
          />
        </mesh>
      )}

      {/* HTML Label */}
      <Html
        distanceFactor={8}
        style={{
          pointerEvents: 'none',
          transition: 'all 0.3s ease',
        }}
      >
        <div className="flex flex-col items-center">
          <span
            className="text-3xl transition-transform duration-300"
            style={{ transform: isHovered ? 'scale(1.2)' : 'scale(1)' }}
          >
            {tech.icon}
          </span>
          <span
            className="mt-1 px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap transition-all duration-300"
            style={{
              backgroundColor: isHovered ? `${tech.color}30` : 'transparent',
              color: tech.color,
              opacity: isHovered ? 1 : 0.7,
            }}
          >
            {tech.name}
          </span>
        </div>
      </Html>
    </group>
  );
}

export default function TechConstellation() {
  const groupRef = useRef<THREE.Group>(null);
  const orbitRefs = useRef<THREE.Group[]>([]);
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);
  const mouse = useMousePosition();

  // Calculate positions for each tech
  const techPositions = useMemo(() => {
    return techData.map((tech) => {
      const radius = orbitRadii[tech.orbit];
      const tilt = orbitTilts[tech.orbit];
      const angleRad = (tech.angle * Math.PI) / 180;

      const x = Math.cos(angleRad) * radius;
      const y = Math.sin(angleRad) * radius * Math.cos(tilt);
      const z = Math.sin(angleRad) * radius * Math.sin(tilt);

      return new THREE.Vector3(x, y, z);
    });
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    // Rotate entire group based on mouse for parallax effect
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      mouse.normalizedX * 0.2,
      0.05
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      -mouse.normalizedY * 0.1,
      0.05
    );

    // Rotate each orbit ring at different speeds
    orbitRefs.current.forEach((orbit, i) => {
      if (orbit) {
        const speed = i === 0 ? 0.15 : i === 1 ? 0.1 : 0.05;
        orbit.rotation.y += speed * 0.01;
      }
    });

    // Pulse the center sun
    const time = clock.getElapsedTime();
    const sunScale = 1 + Math.sin(time * 2) * 0.05;
    const sun = groupRef.current.children[0] as THREE.Mesh;
    if (sun) {
      sun.scale.setScalar(sunScale);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Center Sun */}
      <mesh>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial
          color={0xf59e0b}
          emissive={0xf59e0b}
          emissiveIntensity={0.5}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Sun glow */}
      <mesh scale={1.5}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshBasicMaterial
          color={0xf59e0b}
          transparent
          opacity={0.2}
        />
      </mesh>

      {/* Orbit rings */}
      {orbitRadii.map((radius, i) => (
        <group
          key={i}
          ref={(el) => {
            if (el) orbitRefs.current[i] = el;
          }}
          rotation={[orbitTilts[i], 0, 0]}
        >
          {/* Orbit ring visualization */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[radius - 0.02, radius + 0.02, 64]} />
            <meshBasicMaterial
              color={0xffffff}
              transparent
              opacity={0.05}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      ))}

      {/* Tech Cards */}
      {techData.map((tech, i) => (
        <TechCard
          key={tech.name}
          tech={tech}
          position={techPositions[i]}
          isHovered={hoveredTech === tech.name}
          onHover={() => setHoveredTech(tech.name)}
          onLeave={() => setHoveredTech(null)}
        />
      ))}

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={0.5} color={0xa855f7} />
      <pointLight position={[-5, -5, 5]} intensity={0.3} color={0x06b6d4} />
    </group>
  );
}
