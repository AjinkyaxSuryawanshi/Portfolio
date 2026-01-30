import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Send,
  Github,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
} from 'lucide-react';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

/* ---------------- Satellite ---------------- */
function Satellite() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = clock.getElapsedTime() * 0.1;
    groupRef.current.rotation.x =
      Math.sin(clock.getElapsedTime() * 0.2) * 0.1;
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <boxGeometry args={[1, 0.8, 1.2]} />
        <meshStandardMaterial color={0xe2e8f0} roughness={0.3} metalness={0.7} />
      </mesh>

      <mesh position={[-1.5, 0, 0]}>
        <boxGeometry args={[2, 0.05, 1]} />
        <meshStandardMaterial color={0x1e40af} metalness={0.5} />
      </mesh>
      <mesh position={[1.5, 0, 0]}>
        <boxGeometry args={[2, 0.05, 1]} />
        <meshStandardMaterial color={0x1e40af} metalness={0.5} />
      </mesh>

      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.6]} />
        <meshStandardMaterial color={0x94a3b8} />
      </mesh>

      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.1]} />
        <meshStandardMaterial
          color={0xf59e0b}
          emissive={0xf59e0b}
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}

/* ---------------- Contact ---------------- */
export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      );

      gsap.fromTo(
        contentRef.current?.children || [],
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 75%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative py-24 px-4 sm:px-6 lg:px-8 bg-transparent overflow-hidden"
    >
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div ref={titleRef} className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold font-space mb-4">
            <span className="text-gradient">CONTACT ME</span>
          </h2>
          <p className="text-xl text-white/60">
            Let’s build something out of this world
          </p>
        </div>

        <div
          ref={contentRef}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
        >
          {/* Left */}
          <div className="space-y-8">
            <div className="h-[300px] glass rounded-3xl">
              <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
                <color attach="background" args={['transparent']} />
                <Satellite />
                <ambientLight intensity={0.6} />
              </Canvas>
            </div>

            <div className="glass rounded-xl p-4 flex items-center gap-3">
              <Mail className="text-purple-400" />
              <span className="text-white/80">your.email@example.com</span>
            </div>

            <div className="glass rounded-xl p-4 flex items-center gap-3">
              <MapPin className="text-pink-400" />
              <span className="text-white/80">India</span>
            </div>
          </div>

          {/* Right */}
          <div className="glass rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {['name', 'email', 'subject'].map((f) => (
                <input
                  key={f}
                  name={f}
                  value={(formData as any)[f]}
                  onChange={handleChange}
                  placeholder={f.toUpperCase()}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white"
                />
              ))}

              <textarea
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                placeholder="Message"
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white"
              />

              <button
                disabled={isSubmitting}
                className="w-full py-4 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin mx-auto" />
                ) : (
                  <>
                    <Send className="inline mr-2" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-20 flex justify-center gap-6">
          <Github className="text-white/50 hover:text-white" />
          <Linkedin className="text-white/50 hover:text-white" />
        </div>
      </div>
    </section>
  );
}
