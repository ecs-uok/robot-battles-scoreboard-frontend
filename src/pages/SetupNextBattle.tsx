import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

// Background image
const battleBg = "/src/assets/battle.gif";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function SetupNextBattle() {
  console.log("SetupNextBattle component loaded!"); // Debug: Confirm component loads
  console.log("API_BASE_URL:", API_BASE_URL); // Debug: Check if env var is loaded
  
  const [team1name, setTeam1Name] = useState<string | undefined>(undefined);
  const [team2name, setTeam2Name] = useState<string | undefined>(undefined);
  const [team3name, setTeam3Name] = useState<string | undefined>(undefined);
  const [battleTitle, setBattleTitle] = useState<string>("");

  const [team1Logo, setTeam1Logo] = useState<string | undefined>(undefined);
  const [team2Logo, setTeam2Logo] = useState<string | undefined>(undefined);
  const [team3Logo, setTeam3Logo] = useState<string | undefined>(undefined);

  async function setTeamInfo() {
    console.log("Fetching next battle from:", `${API_BASE_URL}/getNextBattle`);
    fetch(`${API_BASE_URL}/getNextBattle`)
      .then((response) => {
        console.log("Response status:", response.status);
        console.log("Response ok:", response.ok);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Next battle data received:", data);
        console.log("Data type:", typeof data);
        console.log("Has team1:", !!data?.team1);
        console.log("Has team2:", !!data?.team2);
        
        // Only update state if we have valid data structure
        if (data && typeof data === 'object') {
          console.log("Processing team data...");
          
          if (data.team1) {
            console.log("Team1 raw data:", data.team1);
            if (data.team1.name && data.team1.logo) {
              console.log("Setting team1:", data.team1.name);
              setTeam1Name(data.team1.name);
              setTeam1Logo(data.team1.logo);
            } else {
              console.log("Team1 missing name or logo:", { name: data.team1.name, logo: data.team1.logo });
            }
          } else {
            console.log("No team1 data found");
          }
          
          if (data.team2) {
            console.log("Team2 raw data:", data.team2);
            if (data.team2.name && data.team2.logo) {
              console.log("Setting team2:", data.team2.name);
              setTeam2Name(data.team2.name);
              setTeam2Logo(data.team2.logo);
            } else {
              console.log("Team2 missing name or logo:", { name: data.team2.name, logo: data.team2.logo });
            }
          } else {
            console.log("No team2 data found");
          }
          
          if (data.team3) {
            console.log("Team3 raw data:", data.team3);
            if (data.team3.name && data.team3.logo) {
              console.log("Setting team3:", data.team3.name);
              setTeam3Name(data.team3.name);
              setTeam3Logo(data.team3.logo);
            } else {
              console.log("Team3 missing name or logo:", { name: data.team3.name, logo: data.team3.logo });
            }
          } else {
            console.log("No team3 data found");
            setTeam3Name(undefined);
            setTeam3Logo(undefined);
          }
          
          if (data.battleTitle !== undefined) {
            console.log("Setting battle title:", data.battleTitle);
            setBattleTitle(data.battleTitle);
          }
          
          // Debug: Log final state values
          console.log("Final state will be:", {
            team1name: data.team1?.name,
            team1Logo: data.team1?.logo,
            team2name: data.team2?.name,
            team2Logo: data.team2?.logo,
            team3name: data.team3?.name,
            team3Logo: data.team3?.logo,
            battleTitle: data.battleTitle
          });
        } else {
          console.log("Invalid data structure received");
        }
      })
      .catch((error) => {
        console.error("Error fetching next battle details:", error);
        console.error("Error type:", error.constructor.name);
        console.error("Error message:", error.message);
        
      });
  }

  useEffect(() => {
    AOS.init({ once: true });
    setTeamInfo();
  }, []);

  // Debug: Log current state values during render
  console.log("Render - Current state:", {
    team1name,
    team1Logo,
    team2name,
    team2Logo,
    team3name,
    team3Logo,
    battleTitle
  });

  return (
    <div
      className="font-custom w-full min-h-screen flex flex-col justify-center items-center relative overflow-hidden"
      style={{
        backgroundImage: `url(${battleBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center 0%",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
      }}
    >
      {/* Removed dark overlay to show battle.gif at 100% opacity */}
      <div className="absolute inset-0"></div>

      {/* Animated background effects */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl px-4 py-8">
        {/* Title Section */}
    
        {/* Battle Info */}
        {battleTitle && (
          <div className="text-center mb-8" data-aos="fade-up" data-aos-duration="800" data-aos-delay="200">
            <div className="bg-black/50 backdrop-blur-md rounded-xl p-4 inline-block">
              <div className="text-2xl md:text-3xl font-bold text-cyan-400 mb-2">
                NEXT BATTLE
              </div>
              <div className="text-lg md:text-xl font-semibold text-yellow-400">
                {battleTitle}
              </div>
            </div>
          </div>
        )}

        {/* Teams Display */}
        {team1Logo && team2Logo ? (
          <div className="flex flex-col items-center justify-center w-full" data-aos="zoom-in" data-aos-duration="1000" data-aos-delay="400">
            {/* VS Section */}
            <div className="flex flex-col lg:flex-row items-center justify-center w-full gap-8 lg:gap-16">
              {/* Team 1 */}
              <div className="flex flex-col items-center group" data-aos="slide-right" data-aos-duration="800" data-aos-delay="600" style={{ transform: "translate(-103px, 130px)" }}>
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/50 to-orange-500/50 rounded-2xl blur-xl animate-pulse"></div>
                  <div className="relative bg-black/70 backdrop-blur-md rounded-2xl p-4 border-2 border-red-500/50">
                    <img
                      src={team1Logo}
                      alt={`${team1name} Logo`}
                      className="w-24 h-24 md:w-32 md:h-32 object-contain rounded-xl border-2 border-red-400/50"
                    />
                  </div>
                </div>
                <div className="text-center">
                 
                  <div className="text-xl md:text-2xl font-extrabold text-transparent bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text uppercase" style={{ transform: "translate(0px, 10px)" }}>
                    {team1name || "TEAM 1"}
                  </div>
                </div>
              </div>

              {/* VS Symbol */}
              <div className="flex flex-col items-center justify-center my-8 lg:my-0" data-aos="fade-in" data-aos-duration="800" data-aos-delay="800">
                <div className="relative">
                 
                
                </div>
                <div className="mt-4 text-center">
                  <div className="text-sm md:text-base font-semibold text-yellow-300 tracking-widest uppercase">
                    Battle Ready
                  </div>
                </div>
              </div>

              {/* Team 2 */}
              <div className="flex flex-col items-center group" data-aos="slide-left" data-aos-duration="800" data-aos-delay="600" style={{ transform: "translate(125px, 130px)" }}>
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/50 to-cyan-500/50 rounded-2xl blur-xl animate-pulse"></div>
                  <div className="relative bg-black/70 backdrop-blur-md rounded-2xl p-4 border-2 border-blue-500/50">
                    <img
                      src={team2Logo}
                      alt={`${team2name} Logo`}
                      className="w-24 h-24 md:w-32 md:h-32 object-contain rounded-xl border-2 border-blue-400/50"
                    />
                  </div>
                </div>
                <div className="text-center">
                  
                  <div className="text-xl md:text-2xl font-extrabold text-transparent bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text uppercase" style={{ transform: "translate(0px, 10px)" }}>
                    {team2name || "TEAM 2"}
                  </div>
                </div>
              </div>
            </div>

            {/* Team 3 - Show only if exists */}
            {team3name && team3Logo && (
              <div className="flex flex-col items-center mt-8" data-aos="fade-up" data-aos-duration="800" data-aos-delay="1000">
                <div className="text-center mb-4">
                  <div className="text-lg font-bold text-white tracking-wider uppercase">
                    VS
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/50 to-emerald-500/50 rounded-2xl blur-xl animate-pulse"></div>
                  <div className="relative bg-black/70 backdrop-blur-md rounded-2xl p-4 border-2 border-green-500/50">
                    <img
                      src={team3Logo}
                      alt={`${team3name} Logo`}
                      className="w-20 h-20 md:w-24 md:h-24 object-contain rounded-xl border-2 border-green-400/50"
                    />
                  </div>
                </div>
                <div className="text-center mt-4">
                  <div className="text-base md:text-lg font-bold text-white mb-1 tracking-wider">
                    TEAM 3
                  </div>
                  <div className="text-lg md:text-xl font-extrabold text-transparent bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text uppercase">
                    {team3name}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 w-full mt-24" data-aos="fade-in" data-aos-duration="800">
            <div className="bg-black/70 backdrop-blur-md rounded-2xl p-8 border border-red-400/50 text-center max-w-md w-full">
              <div className="text-2xl font-bold text-transparent bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text mb-4 animate-pulse">
                ⚠️ No Next Battle Setup
              </div>
              <div className="text-white text-lg">
                Please ask admin to setup the next battle!
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default SetupNextBattle;