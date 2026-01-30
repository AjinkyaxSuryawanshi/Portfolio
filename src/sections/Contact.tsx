import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Send, Github, Linkedin, Loader2, Mail, MapPin } from 'lucide-react';
import Starfield from '@/components/three/Starfield';

gsap.registerPlugin(ScrollTrigger);

// Simple 3D Satellite Component
function Satellite() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Slow rotation
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.1;
      groupRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.2) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main body */}
      <mesh>
        <boxGeometry args={[1, 0.8, 1.2]} />
        <meshStandardMaterial color={0xe2e8f0} roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Solar panels */}
      <mesh position={[-1.5, 0, 0]}>
        <boxGeometry args={[2, 0.05, 1]} />
        <meshStandardMaterial color={0x1e40af} roughness={0.2} metalness={0.5} />
      </mesh>
      <mesh position={[1.5, 0, 0]}>
        <boxGeometry args={[2, 0.05, 1]} />
        <meshStandardMaterial color={0x1e40af} roughness={0.2} metalness={0.5} />
      </mesh>

      {/* Antenna */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.6]} />
        <meshStandardMaterial color={0x94a3b8} />
      </mesh>
      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.1]} />
        <meshStandardMaterial color={0xf59e0b} emissive={0xf59e0b} emissiveIntensity={0.5} />
      </mesh>

      {/* Signal waves */}
      {Array.from({ length: 3 }).map((_, i) => (
        <mesh key={i} position={[0, 1.5 + i * 0.3, 0]} rotation={[0, 0, 0]}>
          <ringGeometry args={[0.2 + i * 0.2, 0.25 + i * 0.2, 32]} />
          <meshBasicMaterial color={0x06b6d4} transparent opacity={0.3 - i * 0.1} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

// Need to import THREE for the Satellite component
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

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

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });

    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Content animation
      gsap.fromTo(
        contentRef.current?.children || [],
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
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
      className="relative py-24 px-4 sm:px-6 lg:px-8 space-bg overflow-hidden"
    >
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 15], fov: 50 }} dpr={[1, 2]}>
          <color attach="background" args={['transparent']} />
          <Starfield count={100} parallaxFactor={0.15} />
          <ambientLight intensity={0.4} />
        </Canvas>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div ref={titleRef} className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold font-space mb-4">
            <span className="text-gradient">CONTACT ME</span>
          </h2>
          <p className="text-xl text-white/60">Want the best? Lucky you — I'm available.</p>
        </div>

        {/* Content Grid */}
        <div ref={contentRef} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - 3D Satellite & Info */}
          <div className="flex flex-col gap-8">
            {/* 3D Satellite */}
            <div className="h-[300px] relative">
              <Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 2]}>
                <color attach="background" args={['transparent']} />
                <Satellite />
                <ambientLight intensity={0.5} />
                <pointLight position={[5, 5, 5]} intensity={0.5} color={0xa855f7} />
                <pointLight position={[-5, -3, 3]} intensity={0.3} color={0x06b6d4} />
              </Canvas>
            </div>

            {/* Contact Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="glass rounded-xl p-4 hover:bg-white/10 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-white/50">Email</p>
                    <p className="text-white font-medium text-sm">your.email@example.com</p>
                  </div>
                </div>
              </div>

              <div className="glass rounded-xl p-4 hover:bg-white/10 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-pink-400" />
                  </div>
                  <div>
                    <p className="text-sm text-white/50">Location</p>
                    <p className="text-white font-medium">India</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Availability Status */}
            <div className="glass rounded-xl p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
              <div className="flex items-center gap-3 mb-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-white font-medium">Available for work</span>
              </div>
              <p className="text-white/60 text-sm">
                I'm currently open to new opportunities and collaborations. Let's build something
                amazing together!
              </p>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="glass rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="What's your name?"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Where should I send the proposal?"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What are we building?"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Drop the details. I'm already thinking in code."
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-shadow"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : isSubmitted ? (
                  <>Message Sent! ✓</>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="p-3 rounded-full bg-white/5 text-white/70 hover:text-white hover:bg-white/10 transition-all hover:scale-110"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-3 rounded-full bg-white/5 text-white/70 hover:text-white hover:bg-white/10 transition-all hover:scale-110"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>

            {/* Copyright */}
            <p className="text-white/40 text-sm">2026 All rights reserved.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
