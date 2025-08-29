import React from "react";

interface LogoSliderProps {
  logos: string[];
  speed?: number; // in seconds for one full loop
}

const LogoSlider: React.FC<LogoSliderProps> = ({ logos, speed = 30 }) => {
  const logoList = [...logos, ...logos]; // Duplicate logos for smooth loop

  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 bottom-6 z-50 w-[90vw] max-w-6xl rounded-full shadow-xl border border-white/30 overflow-hidden"
      style={{
        padding: "0.5rem 0",
        boxShadow: "0 4px 32px 0 rgba(31,38,135,0.15)",
        background:
          "linear-gradient(90deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.15) 100%)",
        backdropFilter: "blur(18px) saturate(160%)",
        WebkitBackdropFilter: "blur(18px) saturate(160%)",
        border: "1.5px solid rgba(255,255,255,0.25)",
        maxWidth: "90vw", // ensure it never exceeds viewport width
      }}
    >
      <div
        className="flex items-center gap-x-8"
        style={{
          width: "max-content",
          animation: `slide ${speed}s linear infinite`,
        }}
      >
        {logoList.map((logo, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-32 flex justify-center items-center p-2 md:p-4"
          >
            <img
              src={logo}
              alt={`Logo ${index + 1}`}
              className="h-12 md:h-20 w-auto object-contain"
            />
          </div>
        ))}
      </div>

      {/* Keyframes for seamless scroll */}
      <style>{`
        @keyframes slide {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};

export default LogoSlider;
