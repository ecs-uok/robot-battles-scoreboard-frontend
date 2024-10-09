import React from "react";

interface LogoSliderProps {
  logos: string[]; 
  speed?: number;  
}

const LogoSlider: React.FC<LogoSliderProps> = ({ logos, speed = 50 }) => {
  const logoList = [...logos, ...logos];

  return (
    <div className="overflow-hidden bg-white w-screen">
        {
            // bg-[rgba(130,130,130,0.6)]
        }
      <div
        className="flex w-full animate-slide"
        style={{
          animationDuration: `${speed}s`,
        }}
      >
        {logoList.map((logo, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-1/5 flex justify-center items-center p-4 py-2 md:py-14"
          >
            <img
              src={logo}
              alt={`Logo ${index + 1}`}
              className="h-24 w-auto object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogoSlider;
