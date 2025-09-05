import React from "react";

interface LogoSliderProps {
  logos: string[];
  speed?: number; // in seconds for one full loop
}

const LogoSlider: React.FC<LogoSliderProps> = ({ logos, speed = 30 }) => {
  // Create multiple copies for truly seamless infinite scroll
  const logoList = [...logos, ...logos, ...logos, ...logos]; // 4 copies for better seamless effect

  return (
    <div
      className="w-full rounded-xl sm:rounded-2xl shadow-2xl border border-cyan-400/40 overflow-hidden relative"
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
      <div className="absolute top-1 sm:top-2 left-2 sm:left-4 text-xs sm:text-sm font-bold text-cyan-400 uppercase tracking-wider z-10">
        Sponsors & Partners
      </div>
      
      {/* Endless scrolling container */}
      <div className="relative overflow-hidden mt-3 sm:mt-4">
        <div
          className="flex items-center gap-x-3 sm:gap-x-4 md:gap-x-6"
          style={{
            width: "max-content",
            animation: `slideEndless ${speed}s linear infinite`,
          }}
        >
          {logoList.map((logo, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-16 sm:w-20 md:w-28 flex justify-center items-center p-1.5 sm:p-2 md:p-3 rounded-lg sm:rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-110"
            >
              <img
                src={logo}
                alt={`Sponsor ${(index % logos.length) + 1}`}
                className="h-6 sm:h-8 md:h-12 w-auto object-contain filter drop-shadow-lg"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced keyframes for truly seamless endless scroll */}
      <style>{`
        @keyframes slideEndless {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-25%);
          }
        }
        
        /* Ensure no pausing or jumping */
        .flex:hover {
          animation-play-state: running;
        }
      `}</style>
    </div>
  );
};

export default LogoSlider;
