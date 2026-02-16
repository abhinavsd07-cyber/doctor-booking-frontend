import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Footer = () => {
  const navigate = useNavigate();

  const handleNav = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <footer className='md:mx-10 mt-24 border-t border-slate-100'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-16 text-sm'>

        {/* --------- Brand Section --------- */}
        <div className='space-y-6'>
          <img 
            className='w-44 brightness-100 hover:brightness-110 transition-all cursor-pointer' 
            src={assets.logo} 
            alt="Prescripto Logo" 
            onClick={() => handleNav('/')}
          />
          <p className='w-full md:w-3/4 text-slate-500 leading-7 font-medium'>
            Prescripto is redefining healthcare through digital innovation. Our mission 
            is to make world-class medical consultation accessible, seamless, and 
            efficient for everyone, everywhere.
          </p>
        </div>

        {/* --------- Navigation Section --------- */}
        <div>
          <p className='text-sm font-black uppercase tracking-[0.2em] text-slate-900 mb-6'>Company</p>
          <ul className='flex flex-col gap-3 text-slate-500 font-medium'>
            <li onClick={() => handleNav('/')} className='hover:text-blue-600 cursor-pointer transition-colors w-fit'>Home</li>
            <li onClick={() => handleNav('/about')} className='hover:text-blue-600 cursor-pointer transition-colors w-fit'>About us</li>
            <li onClick={() => handleNav('/contact')} className='hover:text-blue-600 cursor-pointer transition-colors w-fit'>Contact us</li>
            <li className='hover:text-blue-600 cursor-pointer transition-colors w-fit'>Privacy policy</li>
          </ul>
        </div>

        {/* --------- Support Section --------- */}
        <div>
          <p className='text-sm font-black uppercase tracking-[0.2em] text-slate-900 mb-6'>Get in Touch</p>
          <ul className='flex flex-col gap-3 text-slate-500 font-medium'>
            <li className='hover:text-slate-900 transition-colors'>+1-212-456-7890</li>
            <li className='hover:text-slate-900 transition-colors'>support@prescripto.com</li>
          </ul>
        </div>

      </div>

      {/* --------- Footer Bottom Bar --------- */}
      <div className='relative'>
        <div className='h-[1px] w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent'></div>
        <div className='py-8 flex flex-col md:flex-row justify-between items-center gap-4'>
            <p className='text-[12px] font-bold text-slate-400 uppercase tracking-widest'>
              &copy; 2026 Prescripto <span className='mx-2 opacity-20'>|</span> Global Medical Network
            </p>
            <div className='flex gap-6 text-[11px] font-black uppercase tracking-tighter text-slate-400'>
                <span className='hover:text-blue-600 cursor-pointer transition-colors'>Terms of Service</span>
                <span className='hover:text-blue-600 cursor-pointer transition-colors'>Cookie Policy</span>
            </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer