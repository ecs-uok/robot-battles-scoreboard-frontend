import React, { useMemo } from "react";

interface LogoSliderProps {
  logos: string[];
  speed?: number; // in seconds for one full loop
}

const LogoSlider: React.FC<LogoSliderProps> = React.memo(({ logos, speed = 30 }) => {
  // Triple the list for seamless effect and ensure enough content
  const logoList = useMemo(() => [...logos, ...logos, ...logos], [logos]);

  return (
    <div
      className="w-full min-h-16 sm:min-h-16 bg-black/90 rounded-xl sm:rounded-2xl shadow-2xl border-2 border-cyan-400 overflow-hidden relative"
      style={{
        padding: "0.5rem 0 0.75rem 0",
        boxShadow: "0 8px 40px 0 rgba(6,182,212,0.3), inset 0 0 20px rgba(6,182,212,0.1)",
        background:
          "linear-gradient(90deg, rgba(6,182,212,0.15) 0%, rgba(59,130,246,0.1) 50%, rgba(6,182,212,0.15) 100%)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
      }}
    >
      {/* Animated border glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/30 via-blue-500/20 to-purple-500/30 rounded-xl sm:rounded-2xl blur-sm animate-pulse"></div>
      
      {/* Title */}
      <div
        className="absolute top-0.5 sm:top-1 left-1 sm:left-4 right-1 sm:right-4 text-[10px] sm:text-sm font-bold text-cyan-400 uppercase tracking-wide z-10 truncate"
      >
        <span className="hidden sm:inline">Sponsors & Partners</span>
        <span className="sm:hidden">Sponsors & Partners</span>
      </div>
      
      {/* Endless scrolling container */}
      <div className="relative overflow-hidden mt-3 sm:mt-4 w-full" style={{ willChange: "transform" }}>
        <div
          className="flex items-center gap-x-4 sm:gap-x-6 md:gap-x-8"
          style={{
            animation: `slideEndless ${speed}s linear infinite`,
            width: 'max-content',
            willChange: 'transform',
            transform: 'translateZ(0)'
          }}
        >
          {logoList.map((logo, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-14 sm:w-20 md:w-28 flex justify-center items-center p-1 sm:p-2 md:p-3 rounded-lg sm:rounded-xl bg-white border border-white/20 hover:bg-white transition-all duration-300 hover:scale-105 group overflow-visible"
            >
              <img
                src={logo}
                alt={`Sponsor ${(index % logos.length) + 1}`}
                className="h-5 sm:h-8 md:h-12 w-auto object-contain filter drop-shadow-lg transition-transform duration-300 group-hover:scale-125"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced keyframes for truly seamless endless scroll */}
      <style>{`
        @keyframes slideEndless {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-33.333%, 0, 0);
          }
        }
        
        /* Ensure no pausing or jumping */
        .flex:hover {
          animation-play-state: running;
        }
      `}</style>
    </div>
  );
});

export default LogoSlider;

