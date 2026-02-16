import React from 'react'
import { assets } from '../assets/assets'
import { motion } from 'framer-motion'

const Contact = () => {
  return (
    <div className='md:mx-10'>
      
      {/* --- Section Header --- */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className='text-center pt-16 space-y-2'
      >
        <h1 className='text-3xl md:text-5xl font-black tracking-tighter text-slate-900 uppercase'>
          Contact <span className='text-blue-600'>Us</span>
        </h1>
        <p className='text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]'>Get in touch with our global support team</p>
      </motion.div>

      {/* --- Main Contact Section --- */}
      <div className='my-20 flex flex-col lg:flex-row justify-center items-center gap-16 mb-32'>
        
        {/* --- Image Section with Decorative Elements --- */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className='relative group'
        >
          <div className='absolute -inset-4 bg-blue-100/40 rounded-[3rem] blur-2xl group-hover:bg-blue-200/60 transition-all duration-700'></div>
          <img 
            className='relative w-full md:max-w-[400px] rounded-[2.5rem] shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]' 
            src={assets.contact_image} 
            alt="Contact Prescripto" 
          />
        </motion.div>

        {/* --- Information Section --- */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className='flex flex-col justify-center items-start gap-10 max-w-md'
        >
          {/* Office Block */}
          <div className='space-y-4'>
            <div className='flex items-center gap-3'>
              <div className='w-8 h-px bg-blue-600'></div>
              <p className='font-black text-xs uppercase tracking-[0.3em] text-blue-600'>Our Office</p>
            </div>
            <div className='space-y-2'>
              <p className='text-2xl font-black text-slate-900 tracking-tight'>Washington, USA</p>
              <p className='text-slate-500 font-medium leading-relaxed'>
                54709 Willms Station <br /> 
                Suite 350, Washington, DC 20003
              </p>
            </div>
            <div className='text-slate-600 font-bold text-sm space-y-1'>
              <p className='hover:text-blue-600 transition-colors cursor-pointer'>Tel: (415) 555‑0132</p>
              <p className='hover:text-blue-600 transition-colors cursor-pointer'>Email: support@prescripto.com</p>
            </div>
          </div>

          {/* Careers Block */}
          <div className='p-8 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4 w-full'>
            <p className='font-black text-xs uppercase tracking-[0.3em] text-slate-900'>Careers at Prescripto</p>
            <p className='text-slate-500 text-sm font-medium leading-relaxed'>
              Join our mission to revolutionize healthcare technology. We’re always looking for ambitious talent.
            </p>
            <button className='group relative overflow-hidden border-2 border-slate-900 px-10 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-slate-900 hover:text-white transition-colors duration-500 rounded-xl'>
              <span className='relative z-10'>Explore Openings</span>
              <div className='absolute inset-0 bg-slate-900 translate-y-full group-hover:translate-y-0 transition-transform duration-500'></div>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Contact