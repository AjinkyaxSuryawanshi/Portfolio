import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Github, Linkedin, Code2, Terminal, Layers } from 'lucide-react';

const platforms = [
  { name: 'LeetCode', icon: Code2, color: '#FFA116', url: '#' },
  { name: 'GitHub', icon: Github, color: '#FFFFFF', url: '#' },
  { name: 'HackerRank', icon: Terminal, color: '#00EA64', url: '#' },
  { name: 'Codeforces', icon: Layers, color: '#1E88E5', url: '#' },
  { name: 'LinkedIn', icon: Linkedin, color: '#0A66C2', url: '#' },
];

export default function ExperienceBanner() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  };

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden" ref={sectionRef}>
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background-secondary to-background" />
      
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px]" />

      <div className="relative max-w-7xl mx-auto">
        {/* Main Text */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4">
            <span className="text-white">Full-Stack Software Engineer</span>
          </h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-2xl sm:text-3xl md:text-4xl text-white/60"
          >
            With Passion for Development
          </motion.p>
        </motion.div>

        {/* Platform Icons */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="flex flex-wrap justify-center gap-6 sm:gap-8"
        >
          {platforms.map((platform) => (
            <motion.a
              key={platform.name}
              href={platform.url}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.15,
                y: -5,
              }}
              whileTap={{ scale: 0.95 }}
              className="group relative flex flex-col items-center gap-3"
            >
              {/* Icon Container */}
              <div
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 group-hover:border-white/30"
                style={{
                  boxShadow: `0 0 0 rgba(${platform.color}, 0)`,
                }}
              >
                <platform.icon
                  className="w-10 h-10 sm:w-12 sm:h-12 transition-all duration-300"
                  style={{ color: platform.color }}
                />
              </div>
              
              {/* Glow Effect */}
              <motion.div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(circle at center, ${platform.color}20 0%, transparent 70%)`,
                }}
              />
              
              {/* Label */}
              <span className="text-sm text-white/50 group-hover:text-white/80 transition-colors">
                {platform.name}
              </span>
            </motion.a>
          ))}
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { value: '10+', label: 'Projects Completed' },
            { value: '500+', label: 'Commits' },
            { value: '1000+', label: 'Hours of Coding' },
            { value: '50+', label: 'Problems Solved' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 1 + index * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl sm:text-4xl font-bold text-gradient mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-white/50">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
