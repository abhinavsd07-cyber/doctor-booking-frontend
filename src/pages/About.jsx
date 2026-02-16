import React from 'react'
import { assets } from '../assets/assets'
import { motion } from 'framer-motion'

const About = () => {
  return (
    <div className='md:mx-10 container'>
      
      {/* --- Section Header --- */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className='text-center pt-16 space-y-2'
      >
        <h1 className='text-3xl md:text-5xl font-black tracking-tighter text-slate-900 uppercase'>
          About <span className='text-blue-600'>Us</span>
        </h1>
        <p className='text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]'>Establishing the future of care</p>
      </motion.div>

      {/* --- Main Story Section --- */}
      <div className='my-16 flex flex-col lg:flex-row gap-16 items-center'>
        <div className='relative group w-full lg:max-w-[480px]'>
          {/* Decorative Back-glow for "Wow" factor */}
          <div className='absolute -inset-4 bg-blue-100/50 rounded-[3rem] blur-2xl group-hover:bg-blue-200/50 transition-all duration-700'></div>
          <img 
            className='relative w-full rounded-[2.5rem] shadow-2xl transition-all duration-700 object-cover grayscale-[0.2] group-hover:grayscale-0' 
            src={assets.about_image} 
            alt="Medical team" 
          />
        </div>

        <div className='flex flex-col justify-center gap-8 lg:w-1/2'>
          <div className='space-y-6 text-slate-600 leading-relaxed font-medium'>
            <p className='first-letter:text-5xl first-letter:font-black first-letter:text-blue-600 first-letter:mr-3 first-letter:float-left'>
              Welcome to Prescripto, your trusted partner in managing your healthcare needs conveniently and efficiently. At Prescripto, we understand the challenges individuals face when it comes to scheduling doctor appointments and managing health records.
            </p>
            <p>
              Prescripto is committed to excellence in healthcare technology. We continuously strive to enhance our platform, integrating the latest advancements to improve user experience and deliver superior service.
            </p>
          </div>

          <div className='p-8 bg-slate-50 rounded-[2rem] border border-slate-100'>
             <h3 className='text-slate-900 font-black uppercase tracking-widest text-xs mb-4'>Our Vision</h3>
             <p className='text-slate-500 text-sm leading-relaxed font-medium'>
               To create a seamless healthcare experience for every user. We aim to bridge the gap between patients and healthcare providers, making it easier for you to access the care you need, when you need it.
             </p>
          </div>
        </div>
      </div>

      {/* --- Why Choose Us Section --- */}
      <div className='text-center mt-32 mb-12 space-y-2'>
        <h2 className='text-2xl md:text-4xl font-black tracking-tighter text-slate-900 uppercase'>
          Why <span className='text-blue-600'>Choose Us</span>
        </h2>
      </div>

      {/* Bento-Grid Style Layout */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-0 border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm bg-white mb-28'>
        {[
          { 
            title: "Efficiency", 
            desc: "Streamlined appointment scheduling that fits into your busy lifestyle." 
          },
          { 
            title: "Convenience", 
            desc: "Access to a network of trusted healthcare professionals in your area." 
          },
          { 
            title: "Personalization", 
            desc: "Tailored recommendations and reminders to help you stay on top of your health." 
          }
        ].map((item, index) => (
          <div 
            key={index}
            className='px-10 py-16 md:px-14 md:py-24 flex flex-col gap-4 group hover:bg-slate-900 transition-all duration-500 cursor-default border-slate-100 md:border-r last:border-r-0'
          >
            <b className='text-blue-600 group-hover:text-blue-400 font-black uppercase tracking-[0.2em] text-xs transition-colors'>
              {item.title}
            </b>
            <p className='text-slate-500 group-hover:text-slate-300 text-sm font-medium leading-relaxed transition-colors'>
              {item.desc}
            </p>
          </div>
        ))}
      </div>

    </div>
  )
}

export default About