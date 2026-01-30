import { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { gsap } from 'gsap';
import { ChevronDown } from 'lucide-react';
import RobotCharacter from '@/components/three/RobotCharacter';
import Starfield, { ShootingStar } from '@/components/three/Starfield';

const titleText = 'WELCOME TO MY PORTFOLIO!';

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title letter animation
      const letters = titleRef.current?.querySelectorAll('.letter');
      if (letters) {
        gsap.fromTo(
          letters,
          {
            y: -100,
            opacity: 0,
            rotateX: -90,
          },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 0.8,
            stagger: 0.05,
            ease: 'bounce.out',
            delay: 0.5,
          }
        );
      }

      // Subtitle typewriter effect
      if (subtitleRef.current) {
        gsap.fromTo(
          subtitleRef.current,
          { opacity: 0, width: 0 },
          { opacity: 1, width: 'auto', duration: 2, ease: 'steps(40)', delay: 1.5 }
        );
      }

      // Buttons fade in
      if (buttonsRef.current) {
        gsap.fromTo(
          buttonsRef.current.children,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'power3.out', delay: 2 }
        );
      }

      // Scroll indicator
      if (scrollIndicatorRef.current) {
        gsap.fromTo(
          scrollIndicatorRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.6, delay: 2.5 }
        );

        // Bounce animation
        gsap.to(scrollIndicatorRef.current.querySelector('.bounce'), {
          y: 10,
          duration: 1,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut',
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scrollToAbout = () => {
    const aboutSection = document.querySelector('#about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at center, #0a0a12 0%, #050508 100%)' }}
    >
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 12], fov: 50 }} dpr={[1, 2]}>
          <color attach="background" args={['transparent']} />
          <Starfield count={200} parallaxFactor={0.05} />
          <ShootingStar />
          <ambientLight intensity={0.3} />
        </Canvas>
      </div>

      {/* Content Grid */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[80vh]">
          {/* Left: Text Content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            {/* Title */}
            <h1
              ref={titleRef}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-space tracking-wider mb-6"
              style={{ perspective: '1000px' }}
            >
              {titleText.split('').map((char, index) => (
                <span
                  key={index}
                  className="letter inline-block"
                  style={{
                    background: 'linear-gradient(135deg, #a855f7, #06b6d4, #ec4899)',
                    backgroundSize: '200% auto',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textShadow: '0 0 60px rgba(168, 85, 247, 0.4)',
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </h1>

            {/* Subtitle */}
            <p
              ref={subtitleRef}
              className="text-lg sm:text-xl text-cyan-400/80 mb-8 font-mono overflow-hidden whitespace-nowrap inline-block"
            >
              Full-Stack Developer | Software Engineer | AI/ML Enthusiast
            </p>

            {/* CTA Buttons */}
            <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group relative px-8 py-4 rounded-xl overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-50" />
                <span className="relative text-white font-semibold flex items-center justify-center gap-2">
                  View My Work
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
              </a>

              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group px-8 py-4 rounded-xl border border-white/20 text-white font-semibold hover:bg-white/5 transition-all duration-300 hover:border-white/40"
              >
                <span className="flex items-center justify-center gap-2">
                  Get In Touch
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
              </a>
            </div>
          </div>

          {/* Right: 3D Robot */}
          <div className="order-1 lg:order-2 h-[400px] lg:h-[600px]">
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]}>
              <color attach="background" args={['transparent']} />
              <RobotCharacter />
              <ambientLight intensity={0.4} />
              <pointLight position={[5, 5, 5]} intensity={0.5} color={0xa855f7} />
              <pointLight position={[-5, 3, 3]} intensity={0.3} color={0x06b6d4} />
            </Canvas>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 cursor-pointer"
        onClick={scrollToAbout}
      >
        <div className="bounce flex flex-col items-center gap-2 text-white/50 hover:text-white/80 transition-colors">
          <span className="text-sm font-mono tracking-wider">SCROLL</span>
          <ChevronDown className="w-5 h-5" />
        </div>
      </div>

      {/* Gradient Overlays */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050508] to-transparent pointer-events-none z-10" />
    </section>
  );
}
