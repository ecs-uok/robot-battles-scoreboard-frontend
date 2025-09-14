import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "../styles/scoreboard.css";
import FireWorks from "../components/FireWorks";
import LogoSlider from "../components/LogoSlider";
import { useNavigate } from "react-router-dom";

//images
import bgImg from "../assets/Images/scoreboard-background.png";

import varioSystem from "../assets/Images/Vario-Systems.png";
import zone24x7 from "../assets/Images/Zone24x7.png";
import IEEELogo from "../assets/Images/IEEE logo.png";
import ecscLogo from "../assets/Images/ECSC_transparent.png";
import gavelLogo from "../assets/Images/gavel.png";
import codeChefLogo from "../assets/Images/Codechefs.png";
import hackSL from "../assets/Images/HackSL.png";
import xydder_3d from "../assets/Images/XYDDER_3D.png";


// **
// TODO: add a smoke effect to the background
// ! if their is no connection with the timer, the page will not load
// **

interface DialogProps {
  isOpen: boolean;
  title: string;
  winnerData: {name: string, logo: string};
}

const Dialog: React.FC<DialogProps> = ({ isOpen, title, winnerData }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 backdrop-blur-sm p-4" >
      <FireWorks fire={winnerData!=null?true:false} />
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl max-w-sm sm:max-w-md w-full p-6 sm:p-8 border border-cyan-400/30 animate-pulse-glow relative mx-4">
        
        <div className="flex justify-center items-center mb-4 sm:mb-6">
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text animate-pulse text-center">{title}</h3>
        </div>
        <>
          <div className="flex flex-col" >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl blur-lg opacity-75 animate-pulse"></div>
              <img
                data-aos="zoom-out-up"
                data-aos-delay="1500"
                data-aos-duration="500"
                src={winnerData.logo}
                className="relative w-3/5 sm:w-4/5 max-w-48 mx-auto rounded-xl border-2 border-cyan-400 shadow-2xl"
              />
            </div>
            <div className="mt-4 sm:mt-6 flex justify-center text-xl sm:text-2xl lg:text-3xl font-bold text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text animate-bounce text-center px-2" >
              {winnerData.name}
            </div>
          </div>
        </>
      </div>
    </div>
  );
};

interface DrawDialogProps {
  isOpen: boolean;
}

const DrawDialog: React.FC<DrawDialogProps> = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 backdrop-blur-sm p-4" >
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl max-w-sm sm:max-w-md w-full p-6 sm:p-8 border border-orange-400/30 animate-pulse-glow relative mx-4">
        
        <div className="flex justify-center items-center mb-4 sm:mb-6">
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-gradient-to-r from-orange-400 via-yellow-500 to-orange-600 bg-clip-text animate-pulse text-center">🤝 DRAW!</h3>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full blur-lg opacity-50 animate-pulse"></div>
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center border-4 border-orange-400 shadow-2xl">
              <span className="text-4xl sm:text-5xl">🤝</span>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-transparent bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text animate-bounce mb-2">
              It's a Tie!
            </div>
            <div className="text-sm sm:text-base text-orange-300 animate-pulse">
              Both teams fought valiantly
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function Main() {
  var team1Id: number;
  var team2Id: number;
  var winnerId: number | string;

  const [mainTime, setMainTime] = useState();
  const [pitTime, setPitTime] = useState();

  const [team1name, setTeam1Name] = useState();
  const [team2name, setTeam2Name] = useState();

  const [team1Logo, setTeam1Logo] = useState();
  const [team2Logo, setTeam2Logo] = useState();
  const [winnerData, setWinnerData] = useState<{name: string; logo: string;} | null>(null);
  const [winnerIds, setWinnerIds] = useState<{winner_id?: any, team1_id?: any, team2_id?: any, game_id?: any}>({});
  const [gameStatus, setGameStatus] = useState<boolean>(false);
  const [isDrawGame, setIsDrawGame] = useState<boolean>(false);

  const logos = [
    ecscLogo,
    varioSystem,
    zone24x7,
    hackSL,
    codeChefLogo,
    IEEELogo,
    gavelLogo,
    xydder_3d
  ];

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  async function setTeamInfo() {
    fetch(
      `${API_BASE_URL}/getGameDetails`
    )
      .then((response) => response.json())
      .then((data) => {
        setTeam1Name(data.team1.name);
        setTeam2Name(data.team2.name);
        setTeam1Logo(data.team1.logo);
        setTeam2Logo(data.team2.logo);
      });
  }

  useEffect(() => {
    AOS.init({ once: true });
    const eventSource = new EventSource(
      `${API_BASE_URL}/timer`
    );
    if (typeof eventSource != undefined) {
      console.log("Connection with timer successful");
      let oldVal = -1;
      eventSource.onmessage = (event) => {
        const eventData = JSON.parse(event.data);
        setMainTime(eventData.mainTime);
        setPitTime(eventData.pitTime);
        
        // Update game status from backend (three states: "active", "shown", "deactive")
        const gameStatusValue = eventData.gameStatus;
        setGameStatus(gameStatusValue === 'shown'); // Only show dialogs when status is "shown"
        
        // Update draw status from backend
        const drawStatus = eventData.isDraw === 'true' || eventData.isDraw === true;
        setIsDrawGame(drawStatus);
        
        // Debug logging
        console.log('Event data:', eventData);
        console.log('Game status (raw):', gameStatusValue);
        console.log('Game status (boolean):', gameStatusValue === 'shown');
        console.log('Draw status:', drawStatus);
        console.log('Winner ID:', eventData.winnerId);

        if (
          oldVal != eventData.gameId ||
          team1Id != eventData.team1Id ||
          team2Id != eventData.team2Id || 
          winnerId != eventData.winnerId
        ) {
          oldVal = eventData.gameId;
          team1Id = eventData.team1Id;
          team2Id = eventData.team2Id;
          winnerId = eventData.winnerId;
          
          setTeamInfo();
          setWinnerIds({
            team1_id: eventData.team1Id,
            team2_id: eventData.team2Id,
            winner_id: eventData.winnerId,
            game_id: eventData.gameId
          });
        }
      };
    } else {
      console.log("Coudn't connect to timer");
    }
    return () => eventSource.close();
  }, []);

  // This effect will update winnerData when all info is available
  useEffect(() => {
    const { winner_id, team1_id, team2_id, game_id } = winnerIds;
    
    console.log('Winner effect triggered:', { winner_id, team1_id, team2_id, game_id });
    console.log('Team names:', { team1name, team2name });
    console.log('Team logos:', { team1Logo, team2Logo });
    
    // Only set winner data if there's a valid winner (backend handles draw logic)
    if (winner_id && team1_id && team2_id && winner_id !== 0 && winner_id !== "0") {
      if (winner_id == team1_id) {
        const winnerInfo = {
          name: team1name ?? "",
          logo: team1Logo ?? ""
        };
        console.log('Setting winner data for team 1:', winnerInfo);
        setWinnerData(winnerInfo);
      } else if (winner_id == team2_id) {
        const winnerInfo = {
          name: team2name ?? "",
          logo: team2Logo ?? ""
        };
        console.log('Setting winner data for team 2:', winnerInfo);
        setWinnerData(winnerInfo);
      }
    } else {
      // Clear winner data if no valid winner
      console.log('Clearing winner data');
      setWinnerData(null);
    }
    
    // Debug dialog visibility
    console.log('Dialog visibility check:', {
      winnerData: !!winnerData,
      gameStatus,
      isDrawGame,
      shouldShowWinner: !!winnerData && gameStatus && !isDrawGame,
      shouldShowDraw: isDrawGame && gameStatus
    });
  }, [winnerIds, team1name, team2name, team1Logo, team2Logo]);

  return (
    <div
      className="font-custom w-full min-h-screen flex flex-col justify-between items-center relative overflow-hidden"
      style={{
        backgroundImage: `url(${bgImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      {/* Animated Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-cyan-900/20 animate-pulse"></div>
      <div className="absolute inset-0 bg-black/30"></div>
      
      {/* Floating Particles Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-cyan-400 rounded-full opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          ></div>
        ))}
      </div>

      {/* Title Section */}
      <div className="w-full flex justify-center mt-4 sm:mt-6 mb-2 px-4 relative z-10" data-aos="fade-down" data-aos-duration="1000">
        <div className="relative bg-gradient-to-br from-gray-900/95 via-blue-900/90 to-cyan-900/95 border-2 sm:border-4 border-cyan-400 rounded-2xl sm:rounded-3xl px-4 sm:px-6 md:px-8 py-4 sm:py-6 shadow-2xl backdrop-blur-md text-center max-w-3xl w-full transform hover:scale-105 transition-all duration-300">
          {/* Glowing border effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-2xl sm:rounded-3xl blur-lg opacity-30 animate-pulse -z-10"></div>
          
          <div className="text-xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-transparent bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 bg-clip-text tracking-wide sm:tracking-wider md:tracking-widest animate-shimmer" style={{letterSpacing: "0.05em"}}>
            UOK ROBOT BATTLES
          </div>
          <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text mt-1 sm:mt-2 tracking-wide sm:tracking-wider md:tracking-widest animate-pulse">
            2025
          </div>
          <div className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-cyan-400 mt-1 sm:mt-2 tracking-wide sm:tracking-wider md:tracking-widest animate-bounce">
            LIGHT WEIGHT CATEGORY
          </div>
        </div>
      </div>

      {/* Main Content */}
      {team1Logo && team2Logo ? (
        <div className="flex flex-col items-center justify-center flex-1 w-full relative z-10 px-4 mb-4 sm:mb-0" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="300">
          {/* Mobile Layout - Stacked */}
          <div className="flex flex-col lg:hidden items-center justify-center w-full gap-4 max-w-md">
            {/* Team 1 */}
            <div className="relative group w-full" data-aos="slide-right" data-aos-duration="800" data-aos-delay="500">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-all duration-300 animate-pulse"></div>
              <div className="relative flex flex-col items-center bg-gradient-to-br from-gray-900/95 via-red-900/30 to-gray-900/95 border-2 rounded-2xl px-4 py-6 border-red-500 w-full backdrop-blur-md transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                <div className="text-lg font-bold text-transparent bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text uppercase tracking-wider mb-3 animate-pulse">
                  TEAM {team1name}
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-full blur-lg opacity-50 animate-pulse"></div>
                  <img 
                    src={team1Logo} 
                    className="relative w-24 h-24 object-contain rounded-full border-2 border-red-500 bg-gradient-to-br from-gray-900 to-red-900/20 mb-3 shadow-2xl transform hover:rotate-12 transition-all duration-300" 
                  />
                </div>
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* VS and Timer */}
            <div className="flex flex-col items-center justify-center w-full" data-aos="zoom-in" data-aos-duration="800" data-aos-delay="700">
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 blur-2xl opacity-50 animate-pulse"></div>
                <div className="relative text-4xl font-extrabold text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text animate-bounce">
                  VS
                </div>
              </div>
              
              {/* Timer Display */}
              <div className="relative bg-gradient-to-br from-gray-900/95 via-green-900/30 to-gray-900/95 border-2 border-green-400 rounded-xl px-4 py-3 backdrop-blur-md shadow-2xl transform hover:scale-105 transition-all duration-300 w-full max-w-xs">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-cyan-400 rounded-xl blur-lg opacity-30 animate-pulse -z-10"></div>
                
                <div className="text-xs font-bold text-cyan-200 uppercase tracking-wider mb-1 text-center animate-pulse">
                  TIME REMAINING
                </div>
                <div className="text-3xl font-extrabold text-transparent bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-center mb-2 animate-pulse">
                  {mainTime ? Math.floor(mainTime / 60) : mainTime || "0"}:
                  {mainTime
                    ? (mainTime % 60).toLocaleString("en-US", {
                        minimumIntegerDigits: 2,
                        useGrouping: false,
                      })
                    : mainTime || "00"}
                </div>
                <div className="text-xs font-bold text-cyan-200 uppercase tracking-wider mb-1 text-center animate-pulse">
                  ADDITIONAL TIME
                </div>
                <div className="text-xl font-extrabold text-transparent bg-gradient-to-r from-yellow-400 to-green-400 bg-clip-text text-center animate-pulse">
                  {pitTime || "0"}
                </div>
              </div>
            </div>

            {/* Team 2 */}
            <div className="relative group w-full" data-aos="slide-left" data-aos-duration="800" data-aos-delay="500">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-all duration-300 animate-pulse"></div>
              <div className="relative flex flex-col items-center bg-gradient-to-br from-gray-900/95 via-blue-900/30 to-gray-900/95 border-2 rounded-2xl px-4 py-6 border-blue-400 w-full backdrop-blur-md transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                <div className="text-lg font-bold text-transparent bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text uppercase tracking-wider mb-3 animate-pulse">
                  TEAM {team2name}
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-lg opacity-50 animate-pulse"></div>
                  <img 
                    src={team2Logo} 
                    className="relative w-24 h-24 object-contain rounded-full border-2 border-blue-400 bg-gradient-to-br from-gray-900 to-blue-900/20 mb-3 shadow-2xl transform hover:rotate-12 transition-all duration-300" 
                  />
                </div>
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Desktop Layout - Horizontal */}
          <div className="hidden lg:flex flex-row items-center justify-center w-full gap-6 xl:gap-16">
            {/* Team 1 */}
            <div className="relative group" data-aos="slide-right" data-aos-duration="800" data-aos-delay="500">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition-all duration-300 animate-pulse"></div>
              <div className="relative flex flex-col items-center bg-gradient-to-br from-gray-900/95 via-red-900/30 to-gray-900/95 border-4 rounded-3xl px-6 py-8 xl:px-10 xl:py-10 border-red-500 max-w-sm w-full backdrop-blur-md transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                <div className="text-xl xl:text-3xl font-bold text-transparent bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text uppercase tracking-wider mb-4 animate-pulse">
                  TEAM {team1name}
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-full blur-lg opacity-50 animate-pulse"></div>
                  <img 
                    src={team1Logo} 
                    className="relative w-36 h-36 xl:w-44 xl:h-44 object-contain rounded-full border-4 border-red-500 bg-gradient-to-br from-gray-900 to-red-900/20 mb-4 shadow-2xl transform hover:rotate-12 transition-all duration-300" 
                  />
                </div>
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* VS and Timer */}
            <div className="flex flex-col items-center justify-center px-4 xl:px-8" data-aos="zoom-in" data-aos-duration="800" data-aos-delay="700">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 blur-2xl opacity-50 animate-pulse"></div>
                <div className="relative text-6xl xl:text-8xl font-extrabold text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text animate-bounce">
                  VS
                </div>
              </div>
              
              {/* Timer Display */}
              <div className="relative bg-gradient-to-br from-gray-900/95 via-green-900/30 to-gray-900/95 border-4 border-green-400 rounded-2xl px-6 py-4 backdrop-blur-md shadow-2xl transform hover:scale-105 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-cyan-400 rounded-2xl blur-lg opacity-30 animate-pulse -z-10"></div>
                
                <div className="text-base xl:text-lg font-bold text-cyan-200 uppercase tracking-widest mb-2 text-center animate-pulse">
                  TIME REMAINING
                </div>
                <div className="text-5xl xl:text-7xl font-extrabold text-transparent bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-center mb-4 animate-pulse">
                  {mainTime ? Math.floor(mainTime / 60) : mainTime || "0"}:
                  {mainTime
                    ? (mainTime % 60).toLocaleString("en-US", {
                        minimumIntegerDigits: 2,
                        useGrouping: false,
                      })
                    : mainTime || "00"}
                </div>
                <div className="text-base xl:text-lg font-bold text-cyan-200 uppercase tracking-widest mb-2 text-center animate-pulse">
                  ADDITIONAL TIME
                </div>
                <div className="text-3xl xl:text-4xl font-extrabold text-transparent bg-gradient-to-r from-yellow-400 to-green-400 bg-clip-text text-center animate-pulse">
                  {pitTime || "0"}
                </div>
              </div>
            </div>

            {/* Team 2 */}
            <div className="relative group" data-aos="slide-left" data-aos-duration="800" data-aos-delay="500">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition-all duration-300 animate-pulse"></div>
              <div className="relative flex flex-col items-center bg-gradient-to-br from-gray-900/95 via-blue-900/30 to-gray-900/95 border-4 rounded-3xl px-6 py-8 xl:px-10 xl:py-10 border-blue-400 max-w-sm w-full backdrop-blur-md transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                <div className="text-xl xl:text-3xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text uppercase tracking-wider mb-4 animate-pulse">
                  TEAM {team2name}
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-lg opacity-50 animate-pulse"></div>
                  <img 
                    src={team2Logo} 
                    className="relative w-36 h-36 xl:w-44 xl:h-44 object-contain rounded-full border-4 border-blue-400 bg-gradient-to-br from-gray-900 to-blue-900/20 mb-4 shadow-2xl transform hover:rotate-12 transition-all duration-300" 
                  />
                </div>
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 w-full relative z-10 px-4 mb-4" style={{ minHeight: "40vh" }}>
          <div className="bg-gradient-to-br from-gray-900/95 via-blue-900/90 to-cyan-900/95 border-2 border-cyan-400 rounded-2xl px-8 py-8 shadow-2xl backdrop-blur-md text-center max-w-lg w-full">
            <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text mb-4 animate-pulse">
              There is no game started
            </div>
            <button
              className="mt-4 px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-all duration-200 text-lg"
              onClick={() => navigate("/bracket")}
            >
              Show Bracket
            </button>
          </div>
        </div>
      )}

      {/* Bottom Sponsors Section */}
      <div className="w-full px-2 sm:px-4 pb-6 sm:pb-4 pt-4 sm:pt-0 mt-auto relative z-20" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="200">
        <div className="w-full bg-gradient-to-r from-gray-900/90 via-cyan-900/20 to-gray-900/90 rounded-xl sm:rounded-2xl backdrop-blur-md border-2 border-cyan-400 p-2 sm:p-4 shadow-2xl">
          <LogoSlider logos={logos} speed={35} />
        </div>
      </div>

      {/* Winner Dialog */}
      <Dialog 
        isOpen={!!winnerData && gameStatus && !isDrawGame} 
        title="🏆 WINNER!" 
        winnerData={winnerData || {name: "", logo: ""}} 
      />
      
      {/* Draw Dialog */}
      <DrawDialog 
        isOpen={isDrawGame && gameStatus} 
      />
    </div>
  );
}

export default Main;


