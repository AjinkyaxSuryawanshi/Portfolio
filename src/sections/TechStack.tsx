import { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TechConstellation from '@/components/three/TechConstellation';

gsap.registerPlugin(ScrollTrigger);

const techCategories = [
  { category: 'Frontend', skills: 'React, Next.js, TypeScript, Tailwind' },
  { category: 'Backend', skills: 'Node.js, Express, Python, REST APIs' },
  { category: 'Database', skills: 'MongoDB, PostgreSQL, Redis' },
  { category: 'Tools', skills: 'Git, Docker, AWS, TensorFlow' },
];

export default function TechStack() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
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

      gsap.fromTo(
        canvasRef.current,
        { scale: 0.5, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      const cards = categoriesRef.current?.querySelectorAll('.category-card');
      if (cards) {
        gsap.fromTo(
          cards,
          { y: 40, opacity: 0, rotateX: -20 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'back.out(1.4)',
            scrollTrigger: {
              trigger: categoriesRef.current,
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
      id="techstack"
      ref={sectionRef}
      className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-screen bg-transparent"
    >
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div ref={titleRef} className="text-center mb-8">
          <h2 className="text-4xl sm:text-5xl font-bold font-space mb-4">
            <span className="text-gradient">TECH STACK</span>
          </h2>
          <p className="text-xl text-white/60 mb-4">
            Front-end to Back-end — Visualized
          </p>
          <p className="text-white/40 text-sm uppercase tracking-widest">
            Explore with your mouse
          </p>
        </div>

        {/* 3D Tech Constellation (MAIN feature) */}
        <div ref={canvasRef} className="relative h-[500px] mb-16 transparent">
          <Canvas camera={{ position: [0, 0, 10], fov: 50 }} dpr={[1, 2]}>
            <TechConstellation />
            <ambientLight intensity={0.4} />
          </Canvas>
        </div>

        {/* Tech Categories */}
        <div ref={categoriesRef} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {techCategories.map((item) => (
            <div
              key={item.category}
              className="category-card glass rounded-2xl p-5 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02]"
              style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
            >
              <h4 className="text-lg font-semibold text-purple-400 mb-2">
                {item.category}
              </h4>
              <p className="text-sm text-white/50">{item.skills}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
