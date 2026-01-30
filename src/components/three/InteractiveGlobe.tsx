import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useMousePosition } from '@/hooks/useMousePosition';
import * as THREE from 'three';

// Arc component for connection lines
function Arc({ start, end, delay }: { start: THREE.Vector3; end: THREE.Vector3; delay: number }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const curve = useMemo(() => {
    const mid = start.clone().add(end).multiplyScalar(0.5);
    mid.normalize().multiplyScalar(3.5);
    return new THREE.QuadraticBezierCurve3(start, mid, end);
  }, [start, end]);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      const time = clock.getElapsedTime() - delay;
      materialRef.current.uniforms.uTime.value = time;
    }
  });

  const shaderData = useMemo(
    () => ({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('#06b6d4') },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor;
        varying vec2 vUv;
        
        void main() {
          float progress = fract(uTime * 0.3);
          float dist = abs(vUv.x - progress);
          float alpha = smoothstep(0.15, 0.0, dist);
          gl_FragColor = vec4(uColor, alpha * 0.6);
        }
      `,
      transparent: true,
    }),
    []
  );

  return (
    <mesh>
      <tubeGeometry args={[curve, 64, 0.015, 8, false]} />
      <shaderMaterial ref={materialRef} {...shaderData} />
    </mesh>
  );
}

export default function InteractiveGlobe() {
  const globeRef = useRef<THREE.Group>(null);
  const dotsRef = useRef<THREE.Points>(null);
  const mouse = useMousePosition();
  const lastMouseMoveRef = useRef(Date.now());

  const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });

  useEffect(() => {
    lastMouseMoveRef.current = Date.now();
  }, [mouse.x, mouse.y]);

  useFrame(() => {
    if (!globeRef.current || !dotsRef.current) return;

    const timeSinceMove = Date.now() - lastMouseMoveRef.current;
    const isIdle = timeSinceMove > 2000;

    targetRotation.current.y = mouse.normalizedX * Math.PI;
    targetRotation.current.x = mouse.normalizedY * 0.5;

    currentRotation.current.y = lerp(currentRotation.current.y, targetRotation.current.y, 0.05);
    currentRotation.current.x = lerp(currentRotation.current.x, targetRotation.current.x, 0.05);

    globeRef.current.rotation.y = currentRotation.current.y;
    globeRef.current.rotation.x = currentRotation.current.x;

    if (isIdle) {
      globeRef.current.rotation.y += 0.002;
      dotsRef.current.rotation.y += 0.002;
    }
  });

  const dotPositions = useMemo(() => {
    const positions: number[] = [];
    const count = 150;
    const radius = 2;

    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;

      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);

      positions.push(x, y, z);
    }

    return new Float32Array(positions);
  }, []);

  const arcs = useMemo(() => {
    const arcData: { start: THREE.Vector3; end: THREE.Vector3; delay: number }[] = [];
    const count = 12;
    const radius = 2.05;

    for (let i = 0; i < count; i++) {
      const phi1 = Math.random() * Math.PI;
      const theta1 = Math.random() * Math.PI * 2;
      const phi2 = Math.random() * Math.PI;
      const theta2 = Math.random() * Math.PI * 2;

      const start = new THREE.Vector3(
        Math.sin(phi1) * Math.cos(theta1) * radius,
        Math.sin(phi1) * Math.sin(theta1) * radius,
        Math.cos(phi1) * radius
      );

      const end = new THREE.Vector3(
        Math.sin(phi2) * Math.cos(theta2) * radius,
        Math.sin(phi2) * Math.sin(theta2) * radius,
        Math.cos(phi2) * radius
      );

      arcData.push({ start, end, delay: i * 0.5 });
    }

    return arcData;
  }, []);

  return (
    <group ref={globeRef}>
      {/* Inner glow sphere */}
      <mesh>
        <sphereGeometry args={[1.9, 32, 32]} />
        <meshBasicMaterial
          color={0x0a0a12}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Wireframe sphere */}
      <mesh>
        <sphereGeometry args={[2, 64, 64]} />
        <meshBasicMaterial
          color={0x06b6d4}
          wireframe
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* Dots */}
      <points ref={dotsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[dotPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color={0x06b6d4}
          size={0.06}
          transparent
          opacity={0.8}
          sizeAttenuation
        />
      </points>

      {/* Connection arcs */}
      {arcs.map((arc, i) => (
        <Arc key={i} start={arc.start} end={arc.end} delay={arc.delay} />
      ))}

      {/* Ambient lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={0.5} color={0xa855f7} />
      <pointLight position={[-5, -3, 3]} intensity={0.3} color={0x06b6d4} />
    </group>
  );
}
