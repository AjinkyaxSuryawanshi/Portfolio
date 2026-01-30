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
      const r = Math.sin(time * 0.8) * 0.5 + 0.5;
      const g = Math.sin(time * 0.8 + 2) * 0.5 + 0.5;
      const b = Math.sin(time * 0.8 + 4) * 0.5 + 0.5;
      const color = new THREE.Color(r, g, b);
      lightRef.current.color = color;
      (meshRef.current.material as THREE.MeshBasicMaterial).color = color;
    }
  });

  return (
    <group position={position}>
      <pointLight ref={lightRef} intensity={1.5} distance={4} />
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.05, 16, 16]} />
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
      const intensity = Math.sin(time * 0.5) * 0.1 + 0.15;
      (screenRef.current.material as THREE.MeshBasicMaterial).color.setRGB(
        intensity * 0.3,
        intensity * 0.5,
        intensity
      );
    }
  });

  return (
    <group position={position}>
      {/* Monitor stand */}
      <Box args={[0.2, 0.3, 0.1]} position={[0, -0.15, 0]}>
        <meshStandardMaterial color="#1a1a2e" />
      </Box>
      {/* Monitor frame */}
      <Box args={[1.2, 0.7, 0.05]} position={[0, 0.2, 0]}>
        <meshStandardMaterial color="#0f0f1a" />
      </Box>
      {/* Screen */}
      <Box ref={screenRef} args={[1.1, 0.6, 0.02]} position={[0, 0.2, 0.03]}>
        <meshBasicMaterial color="#0a1a3e" />
      </Box>
    </group>
  );
}

// PC Case component
function PCCase({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Case */}
      <Box args={[0.4, 0.8, 0.8]}>
        <meshStandardMaterial color="#1a1a2e" transparent opacity={0.9} />
      </Box>
      {/* Glass panel */}
      <Box args={[0.35, 0.75, 0.75]} position={[0.03, 0, 0]}>
        <meshStandardMaterial
          color="#0a0a1a"
          transparent
          opacity={0.5}
          roughness={0.1}
          metalness={0.8}
        />
      </Box>
      {/* RGB strips */}
      <RGBLight position={[0, 0.2, 0.3]} />
      <RGBLight position={[0, -0.2, -0.3]} />
    </group>
  );
}

// Chair component
function Chair({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Seat */}
      <Cylinder args={[0.35, 0.35, 0.1, 32]} position={[0, 0.3, 0]}>
        <meshStandardMaterial color="#2a2a3e" />
      </Cylinder>
      {/* Back */}
      <Box args={[0.5, 0.6, 0.1]} position={[0, 0.7, -0.3]}>
        <meshStandardMaterial color="#2a2a3e" />
      </Box>
      {/* Base */}
      <Cylinder args={[0.05, 0.05, 0.3, 16]} position={[0, 0.15, 0]}>
        <meshStandardMaterial color="#1a1a2e" />
      </Cylinder>
      {/* Wheels base */}
      <Cylinder args={[0.25, 0.25, 0.05, 5]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#1a1a2e" />
      </Cylinder>
    </group>
  );
}

// Desk component
function Desk() {
  return (
    <group>
      {/* Desktop - Orange color as in reference */}
      <Box args={[3, 0.1, 1.5]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#e85d04" roughness={0.4} />
      </Box>
      {/* Legs */}
      <Box args={[0.1, 0.8, 0.1]} position={[-1.2, -0.45, 0.5]}>
        <meshStandardMaterial color="#1a1a2e" />
      </Box>
      <Box args={[0.1, 0.8, 0.1]} position={[1.2, -0.45, 0.5]}>
        <meshStandardMaterial color="#1a1a2e" />
      </Box>
      <Box args={[0.1, 0.8, 0.1]} position={[-1.2, -0.45, -0.5]}>
        <meshStandardMaterial color="#1a1a2e" />
      </Box>
      <Box args={[0.1, 0.8, 0.1]} position={[1.2, -0.45, -0.5]}>
        <meshStandardMaterial color="#1a1a2e" />
      </Box>
    </group>
  );
}

// Scene component
function Scene() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      const time = clock.getElapsedTime();
      groupRef.current.rotation.y = Math.sin(time * 0.05) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Desk */}
      <Desk />
      
      {/* Monitor */}
      <Monitor position={[0, 0.05, -0.4]} />
      
      {/* PC Case */}
      <PCCase position={[1, 0.4, -0.3]} />
      
      {/* Chair */}
      <Chair position={[0, 0, 0.8]} />
      
      {/* Keyboard */}
      <Box args={[0.6, 0.03, 0.2]} position={[0, 0.06, 0.3]}>
        <meshStandardMaterial color="#2a2a3e" />
      </Box>
      
      {/* Mouse */}
      <Box args={[0.08, 0.05, 0.12]} position={[0.5, 0.07, 0.3]}>
        <meshStandardMaterial color="#2a2a3e" />
      </Box>
      
      {/* Ambient lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[-2, 3, 2]} intensity={0.5} color="#8b5cf6" />
      <pointLight position={[2, 2, 2]} intensity={0.3} color="#e85d04" />
      <pointLight position={[0, 2, -2]} intensity={0.3} color="#3b82f6" />
    </group>
  );
}

export default function ContactDesk() {
  return (
    <div className="w-full h-full min-h-[350px]">
      <Canvas
        camera={{ position: [3, 2, 4], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['transparent']} />
        <Scene />
      </Canvas>
    </div>
  );
}
