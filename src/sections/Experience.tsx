import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote, Building2, Calendar } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const experiences = [
  {
    id: 1,
    role: 'Software Development Intern',
    company: 'Tech Company Name',
    duration: 'June 2024 - August 2024',
    description: 'Developed and maintained web applications using React and Node.js. Collaborated with cross-functional teams to deliver high-quality software solutions.',
    achievements: [
      'Built 15+ RESTful microservices using Node.js and MongoDB',
      'Optimized CRUD efficiency by 30% through schema improvements',
      'Built responsive React dashboard with Redux for state management',
    ],
    logo: '💼',
    side: 'left',
  },
  {
    id: 2,
    role: 'Full-Stack Developer',
    company: 'Another Company',
    duration: 'January 2024 - May 2024',
    description: 'Led a team of developers in building scalable web applications. Implemented CI/CD pipelines and improved deployment processes.',
    achievements: [
      'Led a 5-week onboarding program for new developers',
      'Achieving 500+ RPS with 99.9% uptime through AWS scaling',
      'Implemented Redis caching, reducing downtime costs by 40%',
    ],
    logo: '🚀',
    side: 'right',
  },
];

const testimonials = [
  {
    id: 1,
    quote: 'He quickly learned everything taught to him during his internship and contributed to our internal monitoring tool. His contributions to the project are commendable.',
    author: 'Senior Developer',
    role: 'Lead Software Engineer',
    company: 'Tech Corp',
    avatar: '👨‍💻',
  },
  {
    id: 2,
    quote: 'I had the pleasure of working closely with him when he was assigned to our project. Not only did he demonstrate technical expertise but also a remarkable ability to learn.',
    author: 'Tech Lead',
    role: 'Software Architect',
    company: 'Innovation Labs',
    avatar: '👩‍💻',
  },
  {
    id: 3,
    quote: 'Working with him was a great experience. His deep understanding of backend technologies with JavaScript, Node.js, and API integrations was evident.',
    author: 'Project Manager',
    role: 'Engineering Manager',
    company: 'Digital Solutions',
    avatar: '🎯',
  },
];

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);

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

      // Timeline line draw animation
      const timelineLine = timelineRef.current?.querySelector('.timeline-line');
      if (timelineLine) {
        gsap.fromTo(
          timelineLine,
          { scaleY: 0 },
          {
            scaleY: 1,
            duration: 1.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: timelineRef.current,
              start: 'top 70%',
              end: 'bottom 50%',
              scrub: 1,
            },
          }
        );
      }

      // Experience cards animation
      const leftCards = timelineRef.current?.querySelectorAll('.exp-card-left');
      const rightCards = timelineRef.current?.querySelectorAll('.exp-card-right');

      if (leftCards) {
        leftCards.forEach((card) => {
          gsap.fromTo(
            card,
            { x: -100, rotateY: -30, opacity: 0 },
            {
              x: 0,
              rotateY: 0,
              opacity: 1,
              duration: 0.8,
              ease: 'back.out(1.7)',
              scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        });
      }

      if (rightCards) {
        rightCards.forEach((card) => {
          gsap.fromTo(
            card,
            { x: 100, rotateY: 30, opacity: 0 },
            {
              x: 0,
              rotateY: 0,
              opacity: 1,
              duration: 0.8,
              ease: 'back.out(1.7)',
              scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        });
      }

      // Testimonials animation
      const testimonialCards = testimonialsRef.current?.querySelectorAll('.testimonial-card');
      if (testimonialCards) {
        gsap.fromTo(
          testimonialCards,
          { y: 50, opacity: 0, rotateX: -15 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: testimonialsRef.current,
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
      id="experience"
      ref={sectionRef}
      className="relative py-24 px-4 sm:px-6 lg:px-8 space-bg overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div ref={titleRef} className="mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold font-space mb-4">
            <span className="text-gradient">EXPERIENCE & TESTIMONIALS</span>
          </h2>
          <p className="text-xl text-white/60">
            Wrote code ready for Production while surviving daily standups.
          </p>
        </div>

        {/* Timeline */}
        <div ref={timelineRef} className="relative mb-20">
          {/* Timeline Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden lg:block">
            <div
              className="timeline-line w-full h-full bg-gradient-to-b from-purple-500 via-cyan-500 to-purple-500 origin-top"
              style={{ transform: 'scaleY(0)' }}
            />
          </div>

          {/* Experience Cards */}
          <div className="space-y-12">
            {experiences.map((exp) => (
              <div
                key={exp.id}
                className={`relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${
                  exp.side === 'right' ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Card */}
                <div
                  className={`${exp.side === 'left' ? 'lg:pr-12' : 'lg:pl-12 lg:col-start-2'} ${
                    exp.side === 'left' ? 'exp-card-left' : 'exp-card-right'
                  }`}
                  style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
                >
                  <div className="glass rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group">
                    {/* Header */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-2xl">
                        {exp.logo}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white group-hover:text-gradient transition-all">
                          {exp.role}
                        </h3>
                        <div className="flex items-center gap-2 text-white/50 text-sm">
                          <Building2 className="w-4 h-4" />
                          {exp.company}
                        </div>
                        <div className="flex items-center gap-2 text-white/40 text-xs mt-1">
                          <Calendar className="w-3 h-3" />
                          {exp.duration}
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-white/60 text-sm mb-4">{exp.description}</p>

                    {/* Achievements */}
                    <ul className="space-y-2">
                      {exp.achievements.map((achievement, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-white/50">
                          <span className="text-purple-400 mt-1">•</span>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Timeline Node */}
                <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.5)]" />
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-8">What People Say</h3>

          <div
            ref={testimonialsRef}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            style={{ perspective: '1000px' }}
          >
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="testimonial-card glass rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Quote Icon */}
                <Quote className="w-8 h-8 text-purple-500/30 mb-4" />

                {/* Quote Text */}
                <p className="text-white/70 text-sm mb-6 leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm">{testimonial.author}</div>
                    <div className="text-white/40 text-xs">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
