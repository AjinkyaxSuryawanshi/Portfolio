import { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { gsap } from 'gsap';
import { ChevronDown } from 'lucide-react';
import RobotCharacter from '@/components/three/RobotCharacter';

const titleText = 'Hello, Ajinkya here!';

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const letters = titleRef.current?.querySelectorAll('.letter');
      if (letters) {
        gsap.fromTo(
          letters,
          { y: -100, opacity: 0, rotateX: -90 },
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

      if (subtitleRef.current) {
        gsap.fromTo(
          subtitleRef.current,
          { opacity: 0, y : 10 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 1.5 }

        );
      }

      if (buttonsRef.current) {
        gsap.fromTo(
          buttonsRef.current.children,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'power3.out', delay: 2 }
        );
      }

      if (scrollIndicatorRef.current) {
        gsap.fromTo(
          scrollIndicatorRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.6, delay: 2.5 }
        );

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
    document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      className="text-lg sm:text-xl text-cyan-400/80 mb-8 font-mono overflow-hidden block"

    >
      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[80vh]">
          
          {/* LEFT: Text (Glass Container) */}
          <div className="order-2 lg:order-1">
            <div className="glass p-8 rounded-3xl">
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
                      textShadow: '0 0 60px rgba(168, 85, 247, 0.4)',
                    }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                ))}
              </h1>

              <p
                ref={subtitleRef}
                className="text-lg sm:text-xl text-cyan-400/80 mb-8 font-mono overflow-hidden whitespace-nowrap inline-block"
              >
                SDE Intern @Mahindra EPC | AI/ML Enthusiast
              </p>

              <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#projects"
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="group relative px-8 py-4 rounded-xl overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:scale-105 transition-transform" />
                  <span className="relative text-white font-semibold">View My Work →</span>
                </a>

                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-8 py-4 rounded-xl border border-white/20 text-white hover:bg-white/5 transition"
                >
                  Get In Touch →
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT: Robot */}
          <div className="order-1 lg:order-2 h-[400px] lg:h-[600px]">
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]}>
              <color attach="background" args={['transparent']} />
              <RobotCharacter />
              <ambientLight intensity={0.4} />
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
        <div className="bounce flex flex-col items-center gap-2 text-white/60 hover:text-white">
          <span className="text-sm font-mono tracking-wider">SCROLL</span>
          <ChevronDown className="w-5 h-5" />
        </div>
      </div>
    </section>
  );
}
