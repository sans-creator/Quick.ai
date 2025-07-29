import React from 'react';

const Footer = () => {
  return (
    <footer className="flex flex-col items-center justify-center w-full py-20 bg-gradient-to-b from-[#5524B7] to-[#380B60] text-white/70">
      <svg width="157" height="40" viewBox="0 0 157 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* SVG PATHS */}
        <path d="M47.904 28.28q-1.54 0-2.744..." fill="#F5F5F5" />
        <path d="M8.75 11.3 6.75..." stroke="#F5F5F5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      <p className="mt-4 text-center">
        Experience the power of AI. Enhance your workflow with <a href="" className="underline text-white/80 hover:text-white">NeuroNest</a>.
      </p>

      <div className="flex items-center gap-4 mt-5">
        {/** Social Icons */}
        {[
          
         
          {
            href: 'https://www.linkedin.com/in/sanskar-jaiswal-b49a90352/',
            svgPath: (
              <>
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6M6 9H2v12h4zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
              </>
            )
          },
          
          {
            href: 'https://github.com/sans-creator/Quick.ai',
            svgPath: (
              <>
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65S8.93 17.38 9 18v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </>
            )
          },
        ].map((icon, i) => (
          <a key={i} href={icon.href} className="hover:-translate-y-0.5 transition-all duration-300">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
              xmlns="http://www.w3.org/2000/svg"
              stroke="#fff"
              strokeOpacity=".5"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {icon.svgPath}
            </svg>
          </a>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
