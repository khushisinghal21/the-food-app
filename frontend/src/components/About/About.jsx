import React from 'react';
import { motion } from 'framer-motion';
import { features, stats, teamMembers } from '../../assets/dummydata';

const About = () => {
  const [hoverStat, setHoverStat] = React.useState(null);

  return (
    <div className='min-h-screen bg-gradient-to-br from-[#1a120b] via-[#3c2a21] to-[#1a120b] text-amber-50 overflow-hidden relative'>
      <div className='absolute inset-0 opacity-10 mix-blend-soft-light'></div>

      <motion.section initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}>
        <div className='max-w-4xl mx-auto py-16 text-center relative z-10'>
          <motion.h1 className='text-5xl sm:text-6xl md:text-7xl font-bold mb-4 font-serif bg-gradient-to-r from-amber-500 to-yellow-600 bg-clip-text text-transparent'>
            Culinary Express
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            Crafting unforgettable dining experiences delivered to your doorstep.
          </motion.p>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className='py-12 px-4 md:px-8 relative z-10'>
        <div className='max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12'>
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -100px 0px' }}
                transition={{ duration: 0.4 }}
                className='relative group'
              >
                <div className='absolute inset-0 bg-gradient-to-br from-amber-600/30 to-amber-500/30 rounded-3xl group-hover:opacity-80 transition-opacity duration-500' />

                <div className='relative bg-[#3c2a21]/90 backdrop-blur-lg rounded-3xl overflow-hidden border border-amber-600/30 hover:border-amber-500 transition-all duration-300 h-full'>
                  <div className='relative overflow-hidden'>
                    <motion.img
                      src={f.img}
                      alt={f.title}
                      className='w-full h-64 object-cover'
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.4 }}
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-[#1a120b] via-transparent to-transparent'></div>
                  </div>

                  <div className='p-8'>
                    <motion.div
                      className='text-amber-500 mb-4 inline-block'
                      whileHover={{ rotate: 15 }}
                    >
                      <Icon className='w-12 font-bold mb-2 text-amber-100' />
                    </motion.div>

                    <h3 className='text-2xl font-bold mb-2 text-amber-100'>
                      {f.title}
                    </h3>
                    <p className='text-amber-100/50'>{f.text}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
      <section className="py-20 px-6 md:px-12 bg-gradient-to-br from-[#1a120b] to-[#3c2a21]/90">
  <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
    {stats.map((s, i) => {
      const Icon = s.icon;
      return (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.05 }}
          onHoverStart={() => setHoverStat(i)}
          onHoverEnd={() => setHoverStat(null)}
          className="relative group h-56 bg-[#3c2a21]/80 border border-amber-600/30 rounded-3xl text-center p-6 text-amber-100 shadow-lg hover:shadow-amber-400/20 transition-shadow duration-300 flex flex-col justify-center"
        >
          <Icon className="w-12 h-12 mx-auto text-amber-400 mb-3 group-hover:animate-pulse" />
          <h4 className="text-3xl font-bold text-amber-100">{s.value}</h4>
          <p className="text-sm text-amber-100/70 tracking-wide">{s.label}</p>
          {s.number && (
            <div className="mt-2 text-lg text-amber-300 font-semibold">
              {s.number}
            </div>
          )}
        </motion.div>
      );
    })}
  </div>
</section>



       
    </div>
  );
};

export default About;
