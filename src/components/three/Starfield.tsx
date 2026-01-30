import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface StarfieldProps {
  count?: number;
  parallaxFactor?: number;
}

export default function Starfield({ count = 300, parallaxFactor = 0.1 }: StarfieldProps) {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate star positions and properties
  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    const colorPalette = [
      new THREE.Color(0xffffff),
      new THREE.Color(0x60a5fa),
      new THREE.Color(0xc084fc),
      new THREE.Color(0x22d3ee),
    ];

    for (let i = 0; i < count; i++) {
      // Random position in a sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 15 + Math.random() * 25;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Random color from palette
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      // Random size
      sizes[i] = 0.5 + Math.random() * 1.5;
    }

    return { positions, colors, sizes };
  }, [count]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;

    const time = clock.getElapsedTime();

    // Subtle rotation
    pointsRef.current.rotation.y = time * 0.02 * parallaxFactor;
    pointsRef.current.rotation.x = Math.sin(time * 0.01) * 0.05 * parallaxFactor;

    // Twinkle effect by updating sizes
    const sizeAttribute = pointsRef.current.geometry.attributes.size;
    if (sizeAttribute) {
      for (let i = 0; i < count; i++) {
        const baseSize = sizes[i];
        const twinkle = Math.sin(time * 2 + i * 0.5) * 0.3 + 0.7;
        sizeAttribute.array[i] = baseSize * twinkle;
      }
      sizeAttribute.needsUpdate = true;
    }
  });

  // Custom shader for better-looking stars
  const shaderMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
        },
        vertexShader: `
          attribute float size;
          attribute vec3 color;
          varying vec3 vColor;
          
          void main() {
            vColor = color;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          
          void main() {
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist > 0.5) discard;
            
            float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
            gl_FragColor = vec4(vColor, alpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    []
  );

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <primitive object={shaderMaterial} attach="material" />
    </points>
  );
}

// Shooting star component
export function ShootingStar() {
  const meshRef = useRef<THREE.Mesh>(null);
  const trailRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current || !trailRef.current) return;

    const time = clock.getElapsedTime();
    // Trigger every ~8 seconds
    const cycle = (time % 8) / 8;

    if (cycle < 0.15) {
      // Active phase
      const progress = cycle / 0.15;
      const x = -15 + progress * 35;
      const y = 10 - progress * 20;

      meshRef.current.position.set(x, y, -5);
      trailRef.current.position.set(x - 2, y + 1, -5);

      const opacity = Math.sin(progress * Math.PI);
      (meshRef.current.material as THREE.MeshBasicMaterial).opacity = opacity;
      (trailRef.current.material as THREE.MeshBasicMaterial).opacity = opacity * 0.5;
    } else {
      // Hidden phase
      (meshRef.current.material as THREE.MeshBasicMaterial).opacity = 0;
      (trailRef.current.material as THREE.MeshBasicMaterial).opacity = 0;
    }
  });

  return (
    <group>
      {/* Star head */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshBasicMaterial color={0xffffff} transparent opacity={0} />
      </mesh>

      {/* Trail */}
      <mesh ref={trailRef} rotation={[0, 0, -Math.PI / 4]}>
        <planeGeometry args={[3, 0.05]} />
        <meshBasicMaterial
          color={0x60a5fa}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
