import React from 'react';

interface PreFooterCtaProps {
  onSignUpClick: () => void;
}

export const PreFooterCta: React.FC<PreFooterCtaProps> = ({ onSignUpClick }) => {
  return (
    <section className="py-20 lg:py-24 bg-white text-center border-b border-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight leading-tight">
          Project management, as effective as it gets.
        </h2>

        <div className="mt-8 flex justify-center">
          <button
            onClick={onSignUpClick}
            id="prefooter-signup-btn"
            className="px-8 py-3.5 rounded-md bg-[#E42525] hover:bg-[#cf1e1e] text-white text-base font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            Sign Up Now
          </button>
        </div>
      </div>
    </section>
  );
};
