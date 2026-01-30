import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

// RGB Light component
function RGBLight({ position }: { position: [number, number, number] }) {
  const lightRef = useRef<THREE.PointLight>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (lightRef.current && meshRef.current) {
      const time = clock.getElapsedTime();
      const r = Math.sin(time * 0.5) * 0.5 + 0.5;
      const g = Math.sin(time * 0.5 + 2) * 0.5 + 0.5;
      const b = Math.sin(time * 0.5 + 4) * 0.5 + 0.5;
      const color = new THREE.Color(r, g, b);
      lightRef.current.color = color;
      (meshRef.current.material as THREE.MeshBasicMaterial).color = color;
    }
  });

  return (
    <group position={position}>
      <pointLight ref={lightRef} intensity={2} distance={5} />
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial />
      </mesh>
    </group>
  );
}

// Monitor component
function Monitor({ position }: { position: [number, number, number] }) {
  const screenRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (screenRef.current) {
      const time = clock.getElapsedTime();
      const intensity = Math.sin(time * 0.3) * 0.1 + 0.15;
      (screenRef.current.material as THREE.MeshBasicMaterial).color.setRGB(
        intensity * 0.5,
        intensity * 0.3,
        intensity
      );
    }
  });

  return (
    <group position={position}>
      {/* Monitor stand */}
      <Box args={[0.3, 0.4, 0.1]} position={[0, -0.2, 0]}>
        <meshStandardMaterial color="#1a1a2e" />
      </Box>
      {/* Monitor frame */}
      <Box args={[1.6, 0.9, 0.05]} position={[0, 0.3, 0]}>
        <meshStandardMaterial color="#0f0f1a" />
      </Box>
      {/* Screen */}
      <Box ref={screenRef} args={[1.5, 0.8, 0.02]} position={[0, 0.3, 0.03]}>
        <meshBasicMaterial color="#1a0a3e" />
      </Box>
    </group>
  );
}

// Speaker component
function Speaker({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <Box args={[0.5, 0.8, 0.4]}>
        <meshStandardMaterial color="#2a2a3e" />
      </Box>
      {/* Speaker cone */}
      <Cylinder args={[0.15, 0.15, 0.05, 32]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.15, 0.21]}>
        <meshStandardMaterial color="#1a1a2e" />
      </Cylinder>
      <Cylinder args={[0.1, 0.1, 0.05, 32]} rotation={[Math.PI / 2, 0, 0]} position={[0, -0.15, 0.21]}>
        <meshStandardMaterial color="#1a1a2e" />
      </Cylinder>
    </group>
  );
}

// Desk component
function Desk() {
  return (
    <group>
      {/* Desktop */}
      <Box args={[6, 0.1, 2.5]} position={[0, -0.5, 0]}>
        <meshStandardMaterial color="#1a1a2e" roughness={0.3} metalness={0.5} />
      </Box>
      {/* Legs */}
      <Box args={[0.2, 1.5, 0.2]} position={[-2.5, -1.25, 1]}>
        <meshStandardMaterial color="#0f0f1a" />
      </Box>
      <Box args={[0.2, 1.5, 0.2]} position={[2.5, -1.25, 1]}>
        <meshStandardMaterial color="#0f0f1a" />
      </Box>
      <Box args={[0.2, 1.5, 0.2]} position={[-2.5, -1.25, -1]}>
        <meshStandardMaterial color="#0f0f1a" />
      </Box>
      <Box args={[0.2, 1.5, 0.2]} position={[2.5, -1.25, -1]}>
        <meshStandardMaterial color="#0f0f1a" />
      </Box>
    </group>
  );
}

// Keyboard component
function Keyboard() {
  return (
    <group position={[0, -0.42, 0.8]}>
      <Box args={[1.2, 0.05, 0.4]}>
        <meshStandardMaterial color="#2a2a3e" />
      </Box>
      {/* Keys */}
      {Array.from({ length: 5 }).map((_, i) => (
        Array.from({ length: 15 }).map((_, j) => (
          <Box
            key={`${i}-${j}`}
            args={[0.06, 0.02, 0.06]}
            position={[-0.55 + j * 0.08, 0.03, -0.15 + i * 0.08]}
          >
            <meshStandardMaterial color="#3a3a4e" />
          </Box>
        ))
      ))}
    </group>
  );
}

// Scene component
function Scene() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      const time = clock.getElapsedTime();
      groupRef.current.rotation.y = Math.sin(time * 0.1) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Desk */}
      <Desk />
      
      {/* Monitors */}
      <Monitor position={[-0.9, 0, -0.3]} />
      <Monitor position={[0.9, 0, -0.3]} />
      
      {/* Speakers */}
      <Speaker position={[-2.2, -0.1, -0.3]} />
      <Speaker position={[2.2, -0.1, -0.3]} />
      
      {/* Keyboard */}
      <Keyboard />
      
      {/* RGB Lights */}
      <RGBLight position={[-2.2, 0.3, -0.5]} />
      <RGBLight position={[2.2, 0.3, -0.5]} />
      <RGBLight position={[-1.5, 0.5, -0.8]} />
      <RGBLight position={[1.5, 0.5, -0.8]} />
      
      {/* Ambient lighting */}
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 3, 3]} intensity={0.5} color="#8b5cf6" />
      <pointLight position={[-3, 2, 2]} intensity={0.3} color="#ec4899" />
      <pointLight position={[3, 2, 2]} intensity={0.3} color="#3b82f6" />
    </group>
  );
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 1.5, 5], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#0a0a1a']} />
        <fog attach="fog" args={['#0a0a1a', 5, 15]} />
        <Scene />
      </Canvas>
    </div>
  );
}
