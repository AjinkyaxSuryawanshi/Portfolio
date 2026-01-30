import { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Phone, MapPin, Copy, Check, FileDown } from 'lucide-react';
import { useState } from 'react';
import InteractiveGlobe from '@/components/three/InteractiveGlobe';

gsap.registerPlugin(ScrollTrigger);

const techStack = [
  'React',
  'Node.js',
  'TypeScript',
  'MongoDB',
  'Express',
  'Three.js',
  'Next.js',
  'TailwindCSS',
  'Python',
  'TensorFlow',
  'Git',
  'AWS',
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const globeContainerRef = useRef<HTMLDivElement>(null);
  const techStackRef = useRef<HTMLDivElement>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const copyToClipboard = (text: string, type: 'email' | 'phone') => {
    navigator.clipboard.writeText(text);
    if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Profile card animation
      gsap.fromTo(
        cardRef.current,
        { x: -100, opacity: 0, rotateY: -15 },
        {
          x: 0,
          opacity: 1,
          rotateY: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            end: 'top 30%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Globe container animation
      gsap.fromTo(
        globeContainerRef.current,
        { x: 100, opacity: 0, scale: 0.8 },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            end: 'top 20%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Tech stack tags stagger
      const tags = techStackRef.current?.querySelectorAll('.tech-tag');
      if (tags) {
        gsap.fromTo(
          tags,
          { y: 20, opacity: 0, scale: 0.8 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.05,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: techStackRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-24 px-4 sm:px-6 lg:px-8 space-bg overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold font-space mb-4">
            <span className="text-gradient">ABOUT ME</span>
          </h2>
          <p className="text-xl text-white/60">Full-Stack Developer</p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Profile Card */}
          <div
            ref={cardRef}
            className="glass rounded-3xl p-8 transform-gpu"
            style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
          >
            {/* Profile Image */}
            <div className="flex justify-center mb-6">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-500/30 transition-all duration-300 group-hover:border-purple-500/60 group-hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                  <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-4xl">
                    👨‍💻
                  </div>
                </div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>

            {/* Name */}
            <h3 className="text-2xl font-bold text-center mb-1 text-gradient">Ajinkya Suryawanshi</h3>
            <p className="text-white/50 text-center mb-6">Final Year IT Student</p>

            {/* Contact Info */}
            <div className="space-y-3">
              {/* Email */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group">
                <Mail className="w-5 h-5 text-purple-400" />
                <span className="flex-1 text-sm text-white/80">ajinkya.suryawanshi0104@gmail.com</span>
                <button
                  onClick={() => copyToClipboard('ajinkya.suryawanshi0104@gmail.com', 'email')}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  {copiedEmail ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-white/50 group-hover:text-white/80" />
                  )}
                </button>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group">
                <Phone className="w-5 h-5 text-purple-400" />
                <span className="flex-1 text-sm text-white/80">+91 9673444228</span>
                <button
                  onClick={() => copyToClipboard('+91 9673444228', 'phone')}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  {copiedPhone ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-white/50 group-hover:text-white/80" />
                  )}
                </button>
              </div>

              {/* Location */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <MapPin className="w-5 h-5 text-purple-400" />
                <span className="flex-1 text-sm text-white/80">India</span>
              </div>

              {/* Resume Button */}
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center justify-center gap-3 p-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium mt-4 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-shadow"
              >
                <FileDown className="w-5 h-5" />
                Download Resume
              </a>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Globe Card */}
            <div
              ref={globeContainerRef}
              className="glass rounded-3xl p-6 h-[350px] relative overflow-hidden"
            >
              <h4 className="text-lg font-semibold text-white/80 text-center mb-4">
                I'm flexible across all time zones
              </h4>
              <div className="absolute inset-0 pt-16">
                <Canvas camera={{ position: [0, 0, 7], fov: 50 }} dpr={[1, 2]}>
                 <InteractiveGlobe />
                  <ambientLight intensity={0.4} />
                  </Canvas>

              </div>
            </div>

            {/* Tech Stack */}
            <div ref={techStackRef} className="glass rounded-3xl p-6">
              <h4 className="text-lg font-semibold text-white/80 mb-4">My tech stack</h4>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech) => (
                  <span
                    key={tech}
                    className="tech-tag px-3 py-1.5 rounded-full text-sm bg-white/10 text-white/80 border border-white/10 hover:bg-purple-500/20 hover:border-purple-500/30 hover:scale-105 transition-all cursor-default"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
