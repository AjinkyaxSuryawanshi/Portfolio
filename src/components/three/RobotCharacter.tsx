import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useMousePosition } from '@/hooks/useMousePosition';
import * as THREE from 'three';

export default function RobotCharacter() {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const visorRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const mouse = useMousePosition();

  const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });

  useFrame(({ clock }) => {
    if (!groupRef.current || !headRef.current) return;

    const time = clock.getElapsedTime();

    targetRotation.current.y = mouse.normalizedX * 0.8;
    targetRotation.current.x = mouse.normalizedY * 0.5;

    currentRotation.current.x = lerp(currentRotation.current.x, targetRotation.current.x, 0.08);
    currentRotation.current.y = lerp(currentRotation.current.y, targetRotation.current.y, 0.08);

    headRef.current.rotation.y = currentRotation.current.y * 1.5;
    headRef.current.rotation.x = currentRotation.current.x * 1.2;

    groupRef.current.rotation.y = currentRotation.current.y * 0.3;
    groupRef.current.rotation.x = currentRotation.current.x * 0.2;

    groupRef.current.position.y = Math.sin(time * 0.8) * 0.08;
    const breathScale = 1 + Math.sin(time * 1.5) * 0.015;
    groupRef.current.scale.setScalar(breathScale);

    if (visorRef.current) {
      const visorMaterial = visorRef.current.material as THREE.MeshStandardMaterial;
      const glowIntensity = 0.5 + Math.sin(time * 2) * 0.2;
      visorMaterial.emissiveIntensity = glowIntensity;
    }
  });

  const bodyMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        roughness: 0.3,
        metalness: 0.6,
      }),
    []
  );

  const goldMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        roughness: 0.2,
        metalness: 0.9,
      }),
    []
  );

  const visorMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x06b6d4,
        emissive: 0x06b6d4,
        emissiveIntensity: 0.5,
        roughness: 0.1,
        metalness: 0.9,
      }),
    []
  );

  const darkMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.7,
        metalness: 0.3,
      }),
    []
  );

  return (
    <group ref={groupRef} position={[2, 0, 0]}>
      {/* Head Group */}
      <group ref={headRef} position={[0, 1.2, 0]}>
        <mesh>
          <sphereGeometry args={[0.5, 32, 32]} />
          <primitive object={bodyMaterial} attach="material" />
        </mesh>

        <mesh ref={visorRef} position={[0, 0.05, 0.35]} rotation={[-0.2, 0, 0]}>
          <sphereGeometry args={[0.35, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.35]} />
          <primitive object={visorMaterial} attach="material" />
        </mesh>

        <mesh position={[0, 0.05, 0.32]} rotation={[-0.2, 0, 0]}>
          <torusGeometry args={[0.36, 0.03, 16, 32]} />
          <primitive object={goldMaterial} attach="material" />
        </mesh>

        <mesh position={[0, 0.55, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.3]} />
          <primitive object={darkMaterial} attach="material" />
        </mesh>
        <mesh position={[0, 0.75, 0]}>
          <sphereGeometry args={[0.06]} />
          <primitive object={goldMaterial} attach="material" />
        </mesh>

        <mesh position={[-0.45, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 0.15]} />
          <primitive object={darkMaterial} attach="material" />
        </mesh>
        <mesh position={[0.45, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 0.15]} />
          <primitive object={darkMaterial} attach="material" />
        </mesh>
      </group>

      {/* Body */}
      <mesh position={[0, 0.3, 0]}>
        <capsuleGeometry args={[0.4, 0.8, 8, 16]} />
        <primitive object={bodyMaterial} attach="material" />
      </mesh>

      <mesh position={[0, 0.4, 0.35]}>
        <boxGeometry args={[0.4, 0.3, 0.05]} />
        <primitive object={goldMaterial} attach="material" />
      </mesh>

      <mesh position={[0, 0.4, 0.38]}>
        <circleGeometry args={[0.08, 32]} />
        <meshBasicMaterial color={0x06b6d4} />
      </mesh>

      <mesh position={[0, 0.4, -0.35]}>
        <boxGeometry args={[0.5, 0.6, 0.2]} />
        <primitive object={darkMaterial} attach="material" />
      </mesh>

      {/* Arms with group rotation */}
      <group ref={leftArmRef} position={[-0.6, 0.3, 0]} rotation={[0, 0, 0.3]}>
        <mesh>
          <capsuleGeometry args={[0.12, 0.5, 8, 16]} />
          <primitive object={bodyMaterial} attach="material" />
        </mesh>
      </group>
      <group ref={rightArmRef} position={[0.6, 0.3, 0]} rotation={[0, 0, -0.3]}>
        <mesh>
          <capsuleGeometry args={[0.12, 0.5, 8, 16]} />
          <primitive object={bodyMaterial} attach="material" />
        </mesh>
      </group>

      <mesh position={[-0.5, 0.6, 0]}>
        <sphereGeometry args={[0.15]} />
        <primitive object={goldMaterial} attach="material" />
      </mesh>
      <mesh position={[0.5, 0.6, 0]}>
        <sphereGeometry args={[0.15]} />
        <primitive object={goldMaterial} attach="material" />
      </mesh>

      <mesh position={[-0.25, -0.6, 0]}>
        <capsuleGeometry args={[0.15, 0.5, 8, 16]} />
        <primitive object={bodyMaterial} attach="material" />
      </mesh>
      <mesh position={[0.25, -0.6, 0]}>
        <capsuleGeometry args={[0.15, 0.5, 8, 16]} />
        <primitive object={bodyMaterial} attach="material" />
      </mesh>

      <mesh position={[-0.25, -0.95, 0.1]}>
        <boxGeometry args={[0.25, 0.1, 0.35]} />
        <primitive object={darkMaterial} attach="material" />
      </mesh>
      <mesh position={[0.25, -0.95, 0.1]}>
        <boxGeometry args={[0.25, 0.1, 0.35]} />
        <primitive object={darkMaterial} attach="material" />
      </mesh>
    </group>
  );
}
