import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Globe sphere component
function GlobeSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const dotsRef = useRef<THREE.Points>(null);
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.1;
    }
    if (dotsRef.current) {
      dotsRef.current.rotation.y = clock.getElapsedTime() * 0.1;
    }
  });

  // Generate dot positions
  const dotPositions = useMemo(() => {
    const positions: number[] = [];
    const count = 150;
    
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      
      const x = Math.cos(theta) * Math.sin(phi) * 2;
      const y = Math.sin(theta) * Math.sin(phi) * 2;
      const z = Math.cos(phi) * 2;
      
      positions.push(x, y, z);
    }
    
    return new Float32Array(positions);
  }, []);

  // Generate arc positions
  const arcPositions = useMemo(() => {
    const arcs: { start: THREE.Vector3; end: THREE.Vector3 }[] = [];
    const count = 8;
    
    for (let i = 0; i < count; i++) {
      const phi1 = Math.random() * Math.PI;
      const theta1 = Math.random() * Math.PI * 2;
      const phi2 = Math.random() * Math.PI;
      const theta2 = Math.random() * Math.PI * 2;
      
      const start = new THREE.Vector3(
        Math.sin(phi1) * Math.cos(theta1) * 2.1,
        Math.sin(phi1) * Math.sin(theta1) * 2.1,
        Math.cos(phi1) * 2.1
      );
      
      const end = new THREE.Vector3(
        Math.sin(phi2) * Math.cos(theta2) * 2.1,
        Math.sin(phi2) * Math.sin(theta2) * 2.1,
        Math.cos(phi2) * 2.1
      );
      
      arcs.push({ start, end });
    }
    
    return arcs;
  }, []);

  return (
    <group>
      {/* Wireframe sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial
          color="#3b82f6"
          wireframe
          transparent
          opacity={0.15}
        />
      </mesh>
      
      {/* Inner sphere */}
      <mesh>
        <sphereGeometry args={[1.95, 32, 32]} />
        <meshBasicMaterial
          color="#0a0a1a"
          transparent
          opacity={0.8}
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
          color="#60a5fa"
          size={0.08}
          transparent
          opacity={0.8}
        />
      </points>
      
      {/* Arcs */}
      {arcPositions.map((arc, index) => (
        <ArcLine key={index} start={arc.start} end={arc.end} delay={index * 0.3} />
      ))}
      
      {/* Ambient light */}
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={0.5} color="#3b82f6" />
    </group>
  );
}

// Arc line component
function ArcLine({ start, end, delay }: { start: THREE.Vector3; end: THREE.Vector3; delay: number }) {
  const lineRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  // Create curved path
  const curve = useMemo(() => {
    const mid = start.clone().add(end).multiplyScalar(0.5);
    mid.normalize().multiplyScalar(3);
    return new THREE.QuadraticBezierCurve3(start, mid, end);
  }, [start, end]);
  
  useFrame(({ clock }) => {
    if (materialRef.current) {
      const time = clock.getElapsedTime() - delay;
      materialRef.current.uniforms.uTime.value = time;
    }
  });
  
  // Custom shader for animated arc
  const shaderData = useMemo(() => ({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color('#60a5fa') },
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
        float progress = fract(uTime * 0.5);
        float dist = abs(vUv.x - progress);
        float alpha = smoothstep(0.2, 0.0, dist);
        gl_FragColor = vec4(uColor, alpha * 0.8);
      }
    `,
    transparent: true,
  }), []);
  
  return (
    <mesh ref={lineRef}>
      <tubeGeometry args={[curve, 50, 0.02, 8, false]} />
      <shaderMaterial ref={materialRef} {...shaderData} />
    </mesh>
  );
}

export default function Globe() {
  return (
    <div className="w-full h-full min-h-[300px]">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <GlobeSphere />
      </Canvas>
    </div>
  );
}
