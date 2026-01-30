import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, Github } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    id: 1,
    title: 'Hotel Tonight - Perfect Stay',
    description: 'Find your perfect stay — fast, easy, and beautifully designed.',
    image: '/images/project-hotel.jpg',
    tech: ['React', 'Node.js', 'MongoDB', 'Express'],
    demoUrl: '#',
    repoUrl: '#',
  },
  {
    id: 2,
    title: 'Socials - New ways to connect',
    description: 'Connect, share, and build communities — a modern social app.',
    image: '/images/project-social.jpg',
    tech: ['Next.js', 'TypeScript', 'Tailwind', 'Prisma'],
    demoUrl: '#',
    repoUrl: '#',
  },
  {
    id: 3,
    title: 'Portfolio - Next-gen 3D Site',
    description: 'A 3D web-powered portfolio blending immersive visuals.',
    image: '/images/project-portfolio.jpg',
    tech: ['Three.js', 'React', 'GSAP', 'WebGL'],
    demoUrl: '#',
    repoUrl: '#',
  },
  {
    id: 4,
    title: 'Zoom - Video Conferencing App',
    description: 'Simplify your video conferencing experience.',
    image: '/images/project-video.jpg',
    tech: ['WebRTC', 'Socket.io', 'Express', 'React'],
    demoUrl: '#',
    repoUrl: '#',
  },
  {
    id: 5,
    title: 'SaveIt - Store, Sync & Share',
    description: 'A modern cloud platform built for secure storage.',
    image: '/images/project-cloud.jpg',
    tech: ['AWS', 'Node.js', 'React', 'PostgreSQL'],
    demoUrl: '#',
    repoUrl: '#',
  },
  {
    id: 6,
    title: 'Ecommerce Platform',
    description: 'Reimagine your online shopping experience.',
    image: '/images/project-ecommerce.jpg',
    tech: ['Next.js', 'Stripe', 'MongoDB', 'Redux'],
    demoUrl: '#',
    repoUrl: '#',
  },
];

const techIcons: Record<string, string> = {
  React: '⚛️',
  'Node.js': '🟢',
  TypeScript: '🔷',
  MongoDB: '🍃',
  Express: '🚂',
  'Next.js': '▲',
  Tailwind: '🌊',
  'Three.js': '3D',
  Prisma: '🔷',
  WebRTC: '📹',
  'Socket.io': '🔌',
  AWS: '☁️',
  PostgreSQL: '🐘',
  Stripe: '💳',
  Redux: '🔄',
  GSAP: '🎬',
  WebGL: '🖼️',
};

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

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

      // Cards drop animation with stagger
      const cards = cardsRef.current?.querySelectorAll('.project-card');
      if (cards) {
        cards.forEach((card) => {
          gsap.fromTo(
            card,
            {
              y: -200,
              rotateX: 45,
              opacity: 0,
            },
            {
              y: 0,
              rotateX: 0,
              opacity: 1,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative py-24 px-4 sm:px-6 lg:px-8 space-bg overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div ref={titleRef} className="mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold font-space mb-4">
            <span className="text-gradient">MY PROJECTS</span>
          </h2>
          <p className="text-xl text-white/60">Clean. Functional. Purposeful.</p>
        </div>

        {/* Projects Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          style={{ perspective: '1000px' }}
        >
          {projects.map((project) => (
            <div
              key={project.id}
              className="project-card group relative"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="relative overflow-hidden rounded-2xl glass border border-white/10 transition-all duration-500 group-hover:border-purple-500/30 group-hover:shadow-[0_0_40px_rgba(168,85,247,0.15)]">
                {/* Project Image */}
                <div className="relative h-56 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${project.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent" />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                    <a
                      href={project.demoUrl}
                      className="p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 hover:scale-110 transition-all"
                    >
                      <ExternalLink className="w-6 h-6" />
                    </a>
                    <a
                      href={project.repoUrl}
                      className="p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 hover:scale-110 transition-all"
                    >
                      <Github className="w-6 h-6" />
                    </a>
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gradient transition-all">
                    {project.title}
                  </h3>
                  <p className="text-white/60 text-sm mb-4">{project.description}</p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-white/10 text-white/70"
                      >
                        <span>{techIcons[tech] || '•'}</span>
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex items-center gap-4">
                    <a
                      href={project.demoUrl}
                      className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-cyan-400 transition-colors group/link"
                    >
                      Preview
                      <ExternalLink className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                    </a>
                    <a
                      href={project.repoUrl}
                      className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white/70 transition-colors group/link"
                    >
                      Source
                      <Github className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="mt-12 text-center">
          <a
            href="#"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-white/20 text-white font-medium hover:bg-white/5 hover:border-white/40 transition-all"
          >
            <Github className="w-5 h-5" />
            View More on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
