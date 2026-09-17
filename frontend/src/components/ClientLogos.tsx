import React from 'react';

export const ClientLogos: React.FC = () => {
  const logos = [
    {
      name: 'HDFC securities',
      type: 'hdfc',
      display: (
        <div className="flex items-center gap-2 font-bold text-slate-800 tracking-tight">
          <div className="w-5 h-5 bg-[#004b87] text-white flex items-center justify-center text-[10px] font-black rounded-xs">
            H
          </div>
          <span className="text-sm uppercase tracking-wider font-extrabold text-[#004b87]">HDFC securities</span>
        </div>
      ),
    },
    {
      name: 'THE HOME DEPOT',
      type: 'homedepot',
      display: (
        <div className="bg-[#f96302] text-white font-black text-xs px-2.5 py-1 tracking-tighter uppercase rounded-xs border border-[#e05400] text-center leading-tight">
          THE HOME DEPOT
        </div>
      ),
    },
    {
      name: 'AIRBUS',
      type: 'airbus',
      display: (
        <div className="flex items-center gap-1 font-sans text-lg font-black tracking-widest text-[#00205b]">
          <span>AIRBUS</span>
        </div>
      ),
    },
    {
      name: 'TATA CHEMICALS LIMITED',
      type: 'tata',
      display: (
        <div className="flex items-center gap-1.5 text-slate-800">
          <div className="w-4 h-4 rounded-full border border-blue-900 flex items-center justify-center font-bold text-[8px] text-blue-900">
            T
          </div>
          <div className="flex flex-col text-left">
            <span className="font-extrabold text-xs tracking-wider text-[#1e3a8a]">TATA</span>
            <span className="text-[8px] text-slate-500 font-semibold tracking-wider -mt-0.5">TATA CHEMICALS LIMITED</span>
          </div>
        </div>
      ),
    },
    {
      name: 'legrand',
      type: 'legrand',
      display: (
        <div className="flex items-center gap-1 text-slate-900">
          <div className="w-4 h-4 bg-[#e42525] rounded-xs flex items-center justify-center text-white text-[9px] font-bold">
            l
          </div>
          <span className="font-bold text-base tracking-tight lowercase">legrand</span>
        </div>
      ),
    },
    {
      name: 'Vedantu',
      type: 'vedantu',
      display: (
        <div className="flex items-center gap-1">
          <span className="text-orange-500 font-black text-sm tracking-tight">Vedantu</span>
          <span className="w-2 h-2 rounded-full bg-orange-400" />
        </div>
      ),
    },
    {
      name: 'IIFL',
      type: 'iifl',
      display: (
        <div className="text-xs font-black text-red-700 tracking-wider">
          IIFL FINANCE
        </div>
      ),
    }
  ];

  return (
    <div id="customers" className="border-y border-slate-100 bg-slate-50/60 py-8 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 text-center mb-4">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
          Trusted by high-performance teams worldwide
        </p>
      </div>

      {/* Marquee Ticker */}
      <div className="relative w-full overflow-hidden flex items-center">
        <div className="flex items-center gap-12 sm:gap-16 animate-marquee whitespace-nowrap py-2">
          {[...logos, ...logos, ...logos].map((logo, idx) => (
            <div
              key={`${logo.name}-${idx}`}
              className="inline-flex items-center justify-center opacity-75 hover:opacity-100 transition-opacity grayscale hover:grayscale-0 cursor-pointer duration-200"
            >
              {logo.display}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
