import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import RocketLaunch from '@/components/loading/RocketLaunch';
import RocketCursor from '@/components/cursor/RocketCursor';
import Navigation from '@/components/Navigation';
import Hero from '@/sections/Hero';
import About from '@/sections/About';
import TechStack from '@/sections/TechStack';
import Projects from '@/sections/Projects';
import Experience from '@/sections/Experience';
import Contact from '@/sections/Contact';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const handleLoadingComplete = () => {
    // Animate main content in
    if (mainRef.current) {
      gsap.fromTo(
        mainRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          onComplete: () => setIsLoading(false),
        }
      );
    } else {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Loading Screen */}
      {isLoading && <RocketLaunch onComplete={handleLoadingComplete} />}

      {/* Custom Cursor */}
      <RocketCursor />

      {/* Main Content */}
      <div
        ref={mainRef}
        className="relative"
        style={{ opacity: isLoading ? 0 : 1 }}
      >
        <Navigation />

        <main className="relative">
          <Hero />
          <About />
          <TechStack />
          <Projects />
          <Experience />
          <Contact />
        </main>
      </div>
    </>
  );
}

export default App;
