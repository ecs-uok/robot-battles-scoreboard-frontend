import { useEffect, useState, useMemo } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import FireWorks from "../components/FireWorks";
import LogoSlider from "../components/LogoSlider";
import { useNavigate } from "react-router-dom";

//images
const bgImg = "/scoreboard-background.png";

// Sponsor logos served from public folder for faster loads and stable URLs
const varioSystem = "https://res.cloudinary.com/du5tkpcut/image/upload/v1758258135/VarioSystems_ndidnr.png";
const zone24x7 = "https://res.cloudinary.com/du5tkpcut/image/upload/v1758258136/Zone24x7_xfsavc.png";
const IEEELogo = "https://res.cloudinary.com/du5tkpcut/image/upload/v1758258136/IEEE_izvibv.png";
const ecscLogo = "https://res.cloudinary.com/du5tkpcut/image/upload/v1758258135/ECSC_ogzqjy.png";
const gavelLogo = "https://res.cloudinary.com/du5tkpcut/image/upload/v1758258136/Gavel_rv3smg.png";
const hackSL = "https://res.cloudinary.com/du5tkpcut/image/upload/v1758258134/HackSL_uglkfd.png";
const xydder_3d = "https://res.cloudinary.com/du5tkpcut/image/upload/v1758258135/XYDDER3D_h00s7n.png";
const michelin = "https://res.cloudinary.com/du5tkpcut/image/upload/v1758258135/Michelin_ienabp.png";
const yashPhoto = "https://res.cloudinary.com/du5tkpcut/image/upload/v1758258135/YashPhotography_zqhww5.png";


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
              The teams fought valiantly
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Clean Modern Rounded Square - Add size parameter
const Hexagon: React.FC<{children: React.ReactNode, borderColor: string, size?: 'normal' | 'small'}> = ({ children, borderColor, size = 'normal' }) => (
  <div className="relative group">
    {/* Subtle outer glow */}
    <div 
      className="absolute inset-0 rounded-3xl"
      style={{
        width: size === 'small' ? '200px' : '200px',
        height: size === 'small' ? '200px' : '200px',
        background: `linear-gradient(135deg, ${borderColor}40, transparent, ${borderColor}40)`,
        filter: 'blur(20px)',
        margin: '0 auto',
        transform: 'translate(-15px, -15px)',
        opacity: 0.6
      }}
    ></div>
    
    {/* Main rounded square */}
    <div 
      className="relative transition-all duration-300 group-hover:scale-105 rounded-2xl"
      style={{
        width: size === 'small' ? '200px' : '200px',
        height: size === 'small' ? '200px' : '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))`,
        border: `3px solid ${borderColor}`,
        backdropFilter: 'blur(10px)',
        margin: '0 auto',
        boxShadow: `0 0 20px ${borderColor}50`
      }}
    >
      {children}
    </div>
  </div>
);

// Clean Team Name Pill
const TeamNamePill: React.FC<{children: React.ReactNode, gradient: string}> = ({ children, gradient }) => (
  <div className="relative">
    {/* Subtle glow */}
    <div 
      className="absolute inset-0 rounded-full blur-md opacity-50"
      style={{
        background: gradient,
        transform: 'scale(1.1)'
      }}
    ></div>
    
    {/* Main pill */}
    <div 
      className="relative transition-all duration-300 hover:scale-105"
      style={{
        minWidth: '140px',
        padding: '12px 32px',
        borderRadius: '25px',
    background: gradient,
    color: '#fff',
        fontWeight: 600,
        fontSize: '1.1rem',
        letterSpacing: '0.1em',
    textAlign: 'center',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}
    >
    {children}
    </div>
  </div>
);

function Main() {
  var team1Id: number;
  var team2Id: number;
  var team3Id: number;
  var winnerId: number | string;
  const [gameNo, setGameNo] = useState<number | undefined>(undefined); // <-- add state for game id

  const [mainTime, setMainTime] = useState();
  const [pitTime, setPitTime] = useState();

  const [team1name, setTeam1Name] = useState();
  const [team2name, setTeam2Name] = useState();
  const [team3name, setTeam3Name] = useState<string | undefined>(undefined);
  const [gameName, setGameName] = useState<string>("");

  // Add leader state variables
  const [team1Leader, setTeam1Leader] = useState();
  const [team2Leader, setTeam2Leader] = useState();
  const [team3Leader, setTeam3Leader] = useState<string | undefined>(undefined);

  const [team1Logo, setTeam1Logo] = useState();
  const [team2Logo, setTeam2Logo] = useState();
  const [team3Logo, setTeam3Logo] = useState<string | undefined>(undefined);
  const [winnerData, setWinnerData] = useState<{name: string; logo: string;} | null>(null);
  const [winnerIds, setWinnerIds] = useState<{winner_id?: any, team1_id?: any, team2_id?: any, team3_id?: any, game_id?: any}>({});
  const [gameStatus, setGameStatus] = useState<boolean>(false);
  const [isDrawGame, setIsDrawGame] = useState<boolean>(false);

  const logos = useMemo(() => [
    ecscLogo,
    varioSystem,
    zone24x7,
    hackSL,
    IEEELogo,
    gavelLogo,
    xydder_3d,
    michelin,
    yashPhoto
  ], []);

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
        setTeam1Leader(data.team1.leader);
        setTeam2Leader(data.team2.leader);
        setGameName(data.gameName || "");
        setGameNo(data.gameId); // <-- set game ID here
        if (data.team3 && data.team3.name) {
          setTeam3Name(data.team3.name);
          setTeam3Logo(data.team3.logo);
          setTeam3Leader(data.team3.leader);
        } else {
          setTeam3Name(undefined);
          setTeam3Logo(undefined);
          setTeam3Leader(undefined);
        }
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
          team3Id != eventData.team3Id ||
          winnerId != eventData.winnerId
        ) {
          oldVal = eventData.gameId;
          team1Id = eventData.team1Id;
          team2Id = eventData.team2Id;
          team3Id = eventData.team3Id;
          winnerId = eventData.winnerId;
          
          setTeamInfo();
          setWinnerIds({
            team1_id: eventData.team1Id,
            team2_id: eventData.team2Id,
            team3_id: eventData.team3Id,
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
    const { winner_id, team1_id, team2_id, team3_id, game_id } = winnerIds;
    
    console.log('Winner effect triggered:', { winner_id, team1_id, team2_id, game_id });
    console.log('Team names:', { team1name, team2name });
    console.log('Team logos:', { team1Logo, team2Logo });
    
    // Only set winner data if there's a valid winner (backend handles draw logic)
    if (winner_id && (team1_id || team2_id || team3_id) && winner_id !== 0 && winner_id !== "0") {
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
      } else if (winner_id == team3_id) {
        const winnerInfo = {
          name: team3name ?? "",
          logo: team3Logo ?? ""
        };
        console.log('Setting winner data for team 3:', winnerInfo);
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
      {/* Clean Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-900/60 via-purple-900/60 to-pink-900/60"></div>
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Subtle Lighting Effects */}
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
      
      {/* Smooth Moving Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => {
          const randomX = Math.random() * 100;
          const randomY = Math.random() * 100;
          const animationDuration = 15 + Math.random() * 25; // 15-40 seconds
          const direction = Math.random() > 0.5 ? 1 : -1;
          
          return (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-30"
              style={{
                left: `${randomX}%`,
                top: `${randomY}%`,
                animation: `floatSmooth${i} ${animationDuration}s linear infinite`,
              }}
            >
              <style>{`
                @keyframes floatSmooth${i} {
                  0% {
                    transform: translate(0, 0) scale(0.8);
                    opacity: 0.1;
                  }
                  25% {
                    transform: translate(${direction * (20 + Math.random() * 30)}px, ${-20 - Math.random() * 40}px) scale(1.2);
                    opacity: 0.4;
                  }
                  50% {
                    transform: translate(${direction * (40 + Math.random() * 60)}px, ${-40 - Math.random() * 80}px) scale(0.9);
                    opacity: 0.6;
                  }
                  75% {
                    transform: translate(${direction * (20 + Math.random() * 30)}px, ${-60 - Math.random() * 120}px) scale(1.1);
                    opacity: 0.3;
                  }
                  100% {
                    transform: translate(0, ${-80 - Math.random() * 160}px) scale(0.7);
                    opacity: 0.1;
                  }
                }
              `}</style>
            </div>
          );
        })}
      </div>

      {/* Title Section - UOK Robot Battles */}
        <div className="w-full flex flex-col items-center justify-center mt-2 mb-4 px-4 relative z-10" data-aos="fade-down" data-aos-duration="1000">
          <img
            src="/main-scoreboard-title.png"
            alt="UOK Robot Battles 2K25"
            className="w-full max-w-xs sm:max-w-sm rounded-xl shadow-xl backdrop-blur-md mb-1"
            style={{objectFit: 'cover'}}
          />
          <div className="text-gray-300 font-bold text-sm sm:text-base md:text-lg tracking-wider text-center drop-shadow-lg" style={{letterSpacing: '0.08em'}}>
            LIGHT WEIGHT CATEGORY
          </div>
        </div>

      {team1Logo && team2Logo ? (
        <div className="flex flex-col items-center justify-start lg:justify-center w-full relative z-10 px-4 mb-12 sm:mb-0 flex-grow lg:flex-grow-0 pt-8 lg:pt-0" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="300">
          {/* Match Number Section */}
          {(gameNo !== undefined || gameName) && (
            <div className="flex items-center justify-center mb-4 gap-2">
              {gameNo !== undefined && gameNo !== null && (
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-cyan-300 drop-shadow-lg tracking-wider animate-pulse">
                  MATCH NO : {gameNo}
                </div>
              )}
              {(gameNo !== undefined && gameName) && (
                <span className="text-cyan-400 font-bold text-lg mx-1">|</span>
              )}
              {gameName && (
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-400 drop-shadow-lg tracking-wider animate-pulse">
                  {gameName}
                </div>
              )}
            </div>
          )}
          
          {/* Mobile Layout - Vertical Stack */}
          <div className="flex flex-col lg:hidden items-center justify-start w-full max-w-4xl gap-3 pb-4">
            {/* Teams Row Above Timer - Mobile Layout */}
            <div className={`flex flex-row items-start justify-center w-full gap-2 px-1 ${team3name && team3Logo ? 'flex-wrap' : ''}`}>
              {/* Team 1 */}
              <div className={`flex flex-col items-center ${team3name && team3Logo ? 'flex-1 min-w-[100px]' : 'flex-1'}`} data-aos="slide-right" data-aos-duration="800" data-aos-delay="700">
                {/* Team Logo Container */}
                <div className="relative group">
                  <div 
                    className="absolute inset-0 rounded-3xl"
                    style={{
                      width: team3name && team3Logo ? '80px' : '120px',
                      height: team3name && team3Logo ? '80px' : '120px',
                      background: 'linear-gradient(135deg, #22d3ee40, transparent, #22d3ee40)',
                      filter: 'blur(12px)',
                      margin: '0 auto',
                      transform: 'translate(-8px, -8px)',
                      opacity: 0.6
                    }}
                  ></div>
                  
                  <div 
                    className="relative transition-all duration-300 group-hover:scale-105 rounded-3xl"
                    style={{
                      width: team3name && team3Logo ? '70px' : '110px',
                      height: team3name && team3Logo ? '70px' : '110px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                      border: '3px solid #22d3ee',
                      backdropFilter: 'blur(10px)',
                      margin: '0 auto',
                      boxShadow: '0 0 20px #22d3ee50'
                    }}
                  >
                    <img 
                      src={team1Logo} 
                      className="object-cover rounded-3xl"
                      style={{
                        width: '100%',
                        height: '100%'
                      }}
                      alt="Team 1 Logo"
                    />
                  </div>
                </div>
                
                <div className="mt-2 mb-1 text-xs font-bold text-white tracking-wider text-center uppercase">
                  TEAM
                </div>
                <div 
                  className="relative transition-all duration-300 hover:scale-105"
                  style={{
                    minWidth: team3name && team3Logo ? '70px' : '100px',
                    padding: team3name && team3Logo ? '6px 12px' : '8px 16px',
                    borderRadius: '20px',
                    background: 'linear-gradient(90deg, #22d3ee 0%, #06b6d4 100%)',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: team3name && team3Logo ? '0.6rem' : '0.8rem',
                    letterSpacing: '0.1em',
                    textAlign: 'center',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  {team1name || "NEW WAR"}
                </div>
                {team1Leader && (
                  <div className="text-[10px] text-cyan-200 font-medium text-center mt-1">
                    Leader: {team1Leader}
                  </div>
                )}
              </div>

              {/* Team 2 */}
              <div className={`flex flex-col items-center ${team3name && team3Logo ? 'flex-1 min-w-[100px]' : 'flex-1'}`} data-aos="slide-left" data-aos-duration="800" data-aos-delay="700">
                {/* Team Logo Container */}
                <div className="relative group">
                  <div 
                    className="absolute inset-0 rounded-3xl"
                    style={{
                      width: team3name && team3Logo ? '80px' : '120px',
                      height: team3name && team3Logo ? '80px' : '120px',
                      background: 'linear-gradient(135deg, #ec489940, transparent, #ec489940)',
                      filter: 'blur(12px)',
                      margin: '0 auto',
                      transform: 'translate(-8px, -8px)',
                      opacity: 0.6
                    }}
                  ></div>
                  
                  <div 
                    className="relative transition-all duration-300 group-hover:scale-105 rounded-3xl"
                    style={{
                      width: team3name && team3Logo ? '70px' : '110px',
                      height: team3name && team3Logo ? '70px' : '110px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                      border: '3px solid #ec4899',
                      backdropFilter: 'blur(10px)',
                      margin: '0 auto',
                      boxShadow: '0 0 20px #ec489950'
                    }}
                  >
                    <img 
                      src={team2Logo} 
                      className="object-cover rounded-3xl"
                      style={{
                        width: '100%',
                        height: '100%'
                      }}
                      alt="Team 2 Logo"
                    />
                  </div>
                </div>
                
                <div className="mt-2 mb-1 text-xs font-bold text-white tracking-wider text-center uppercase">
                  TEAM
                </div>
                <div 
                  className="relative transition-all duration-300 hover:scale-105"
                  style={{
                    minWidth: team3name && team3Logo ? '70px' : '100px',
                    padding: team3name && team3Logo ? '6px 12px' : '8px 16px',
                    borderRadius: '20px',
                    background: 'linear-gradient(90deg, #ec4899 0%, #be185d 100%)',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: team3name && team3Logo ? '0.6rem' : '0.8rem',
                    letterSpacing: '0.1em',
                    textAlign: 'center',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  {team2name || "AZURE BOT"}
                </div>
                {team2Leader && (
                  <div className="text-[10px] text-pink-200 font-medium text-center mt-1">
                    Leader: {team2Leader}
                  </div>
                )}
              </div>

              {/* Team 3 - Show only if exists */}
              {team3name && team3Logo && (
                <div className="flex flex-col items-center flex-1 min-w-[100px]" data-aos="slide-up" data-aos-duration="800" data-aos-delay="900">
                  {/* Team Logo Container */}
                  <div className="relative group">
                    <div 
                      className="absolute inset-0 rounded-3xl"
                      style={{
                        width: '80px',
                        height: '80px',
                        background: 'linear-gradient(135deg, #10b98140, transparent, #10b98140)',
                        filter: 'blur(12px)',
                        margin: '0 auto',
                        transform: 'translate(-8px, -8px)',
                        opacity: 0.6
                      }}
                    ></div>
                    
                    <div 
                      className="relative transition-all duration-300 group-hover:scale-105 rounded-3xl"
                      style={{
                        width: '70px',
                        height: '70px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                        border: '3px solid #10b981',
                        backdropFilter: 'blur(10px)',
                        margin: '0 auto',
                        boxShadow: '0 0 20px #10b98150'
                      }}
                    >
                      <img 
                        src={team3Logo} 
                        className="object-cover rounded-3xl"
                        style={{
                          width: '100%',
                          height: '100%'
                        }}
                        alt="Team 3 Logo"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-2 mb-1 text-xs font-bold text-white tracking-wider text-center uppercase">
                    TEAM
                  </div>
                  <div 
                    className="relative transition-all duration-300 hover:scale-105"
                    style={{
                      minWidth: '70px',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                      color: '#fff',
                      fontWeight: 600,
                      fontSize: '0.6rem',
                      letterSpacing: '0.1em',
                      textAlign: 'center',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    {team3name}
                  </div>
                  {team3Leader && (
                    <div className="text-[10px] text-green-200 font-medium text-center mt-1">
                      Leader: {team3Leader}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Timer Section Below Teams */}
            <div className="flex flex-col items-center justify-center">
              {/* Timer Container */}
              <div className="flex flex-col items-center bg-gradient-to-b from-teal-900/60 via-green-900/70 to-green-800/60 backdrop-blur-md rounded-xl p-3 border border-green-400/40 shadow-2xl min-w-[200px]">
                <div className="text-white font-medium uppercase tracking-wider mb-2 text-center text-sm">
                  TIME REMAINING
                </div>
                <div className="text-4xl font-bold mb-2 text-center" style={{
                  background: 'linear-gradient(to right, #ffffff, #4ade80)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '0.1em'
                }}>
                  {mainTime ? Math.floor(mainTime / 60) : "3"}:
                  {mainTime
                    ? (mainTime % 60).toLocaleString("en-US", {
                        minimumIntegerDigits: 2,
                        useGrouping: false,
                      })
                    : "00"}
                </div>
                <div className="text-gray-300 font-medium uppercase tracking-wider mb-2 text-center text-sm">
                  ADDITIONAL TIME
                </div>
                <div className="text-2xl font-bold text-gray-300">
                  {pitTime || "20"}<span className="text-lg ml-1">s</span>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:flex flex-col items-center justify-center w-full max-w-6xl gap-8">
            {team3name && team3Logo ? (
              // 3-team layout with timer below
              <>
                {/* Teams Row */}
                <div className="flex flex-row items-center justify-center w-full gap-16">
                  {/* Team 1 */}
                  <div className="flex flex-col items-center" data-aos="slide-right" data-aos-duration="800" data-aos-delay="500">
                    <Hexagon borderColor="#22d3ee" size="small">
                      <img 
                        src={team1Logo} 
                        className="object-cover rounded-2xl"
                        style={{
                          width: '100%',
                          height: '100%'
                        }}
                        alt="Team 1 Logo"
                      />
                    </Hexagon>
                    <div className="mt-4 mb-2 text-sm font-medium text-gray-300 tracking-wider text-center uppercase">
                      TEAM
                    </div>
                    <div 
                      className="relative transition-all duration-300 hover:scale-105"
                      style={{
                        minWidth: '120px',
                        padding: '10px 24px',
                        borderRadius: '25px',
                        background: 'linear-gradient(90deg, #22d3ee 0%, #06b6d4 100%)',
                        color: '#fff',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        letterSpacing: '0.1em',
                        textAlign: 'center',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                      }}
                    >
                      {team1name || "TEAM 1"}
                    </div>
                  </div>

                  {/* Team 2 */}
                  <div className="flex flex-col items-center" data-aos="fade-up" data-aos-duration="800" data-aos-delay="600">
                    <Hexagon borderColor="#ec4899" size="small">
                      <img 
                        src={team2Logo} 
                        className="object-cover rounded-2xl"
                        style={{
                          width: '100%',
                          height: '100%'
                        }}
                        alt="Team 2 Logo"
                      />
                    </Hexagon>
                    <div className="mt-4 mb-2 text-sm font-medium text-gray-300 tracking-wider text-center uppercase">
                      TEAM
                    </div>
                    <div 
                      className="relative transition-all duration-300 hover:scale-105"
                      style={{
                        minWidth: '120px',
                        padding: '10px 24px',
                        borderRadius: '25px',
                        background: 'linear-gradient(90deg, #ec4899 0%, #be185d 100%)',
                        color: '#fff',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        letterSpacing: '0.1em',
                        textAlign: 'center',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                      }}
                    >
                      {team2name || "TEAM 2"}
                    </div>
                  </div>

                  {/* Team 3 */}
                  <div className="flex flex-col items-center" data-aos="slide-left" data-aos-duration="800" data-aos-delay="700">
                    <Hexagon borderColor="#10b981" size="small">
                      <img 
                        src={team3Logo} 
                        className="object-cover rounded-2xl"
                        style={{
                          width: '100%',
                          height: '100%'
                        }}
                        alt="Team 3 Logo"
                      />
                    </Hexagon>
                    <div className="mt-4 mb-2 text-sm font-medium text-gray-300 tracking-wider text-center uppercase">
                      TEAM
                    </div>
                    <div 
                      className="relative transition-all duration-300 hover:scale-105"
                      style={{
                        minWidth: '120px',
                        padding: '10px 24px',
                        borderRadius: '25px',
                        background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                        color: '#fff',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        letterSpacing: '0.1em',
                        textAlign: 'center',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                      }}
                    >
                      {team3name}
                    </div>
                  </div>
                </div>

                {/* Timer Section - Below teams */}
                <div className="flex flex-col items-center pb-2" data-aos="fade-up" data-aos-duration="800" data-aos-delay="800">
                  <div className="flex flex-col items-center bg-gradient-to-b from-cyan-900/60 via-cyan-900/70 to-cyan-800/60 backdrop-blur-md rounded-xl p-6 border border-cyan-400/40 shadow-2xl min-w-[280px]">
                    <div className="text-white font-medium uppercase tracking-wider mb-3 text-center text-lg">
                      TIME REMAINING
                    </div>
                    <div className="text-6xl font-bold text-center" style={{
                      background: 'linear-gradient(to right, #ffffff, #A855F7)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      letterSpacing: '0.1em'
                    }}>
                      {mainTime ? Math.floor(mainTime / 60) : "3"}:
                      {mainTime
                        ? (mainTime % 60).toLocaleString("en-US", {
                            minimumIntegerDigits: 2,
                            useGrouping: false,
                          })
                        : "00"}
                    </div>
                    <div className="text-gray-300 font-medium uppercase tracking-wider mb-2 text-center">
                      ADDITIONAL TIME
                    </div>
                    <div className="text-3xl font-bold text-gray-300">
                      {pitTime || "20"}<span className="text-xl ml-1">s</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              // 2-team layout (existing code)
              <div className="flex flex-row items-center justify-center w-full gap-16">
                {/* Team 1 */}
                <div className="flex flex-col items-center" data-aos="slide-right" data-aos-duration="800" data-aos-delay="500">
                  <Hexagon borderColor="#22d3ee">
                    <img 
                      src={team1Logo} 
                      className="object-cover rounded-2xl"
                      style={{
                        width: '100%',
                        height: '100%'
                      }}
                      alt="Team 1 Logo"
                    />
                  </Hexagon>
                  <div className="mt-6 mb-3 text-base font-medium text-gray-300 tracking-wider text-center uppercase">
                    TEAM
                  </div>
                  <TeamNamePill gradient="linear-gradient(90deg, #22d3ee 0%, #06b6d4 100%)">
                    {team1name || "BUMBLEBEE"}
                  </TeamNamePill>
                  {team1Leader && (
                    <div className="text-sm text-cyan-200 font-medium text-center mt-3">
                      Leader: {team1Leader}
                    </div>
                  )}
                </div>

                {/* VS and Timer - Vertical Layout */}
                <div className="flex flex-col items-center justify-center">
                  {/* Decorative line above VS */}
                  <div className="w-px h-14 bg-gradient-to-b from-transparent via-white to-transparent opacity-60 mb-3"></div>
                  
                  {/* VS */}
                  <div className="text-7xl font-bold text-white tracking-wider mb-6">
                    VS
                  </div>
                  
                  {/* Decorative line below VS */}
                  <div className="w-px h-14 bg-gradient-to-b from-transparent via-white to-transparent opacity-60 mb-3"></div>
                  
                  {/* Timer Container */}
                  <div className="flex flex-col items-center bg-gradient-to-b from-cyan-900/60 via-cyan-900/70 to-cyan-800/60 backdrop-blur-md rounded-xl p-6 border border-cyan-400/40 shadow-2xl min-w-[280px]">
                    <div className="text-white font-medium uppercase tracking-wider mb-3 text-center text-lg">
                      TIME REMAINING
                    </div>
                    <div className="text-7xl font-bold text-center" style={{
                      background: 'linear-gradient(to right, #ffffff, #A855F7)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      letterSpacing: '0.1em'
                    }}>
                      {mainTime ? Math.floor(mainTime / 60) : "3"}:
                    {mainTime
                      ? (mainTime % 60).toLocaleString("en-US", {
                          minimumIntegerDigits: 2,
                          useGrouping: false,
                        })
                        : "00"}
                    </div>
                    <div className="text-gray-300 font-medium uppercase tracking-wider mb-2 text-center">
                      ADDITIONAL TIME
                    </div>
                    <div className="text-3xl font-bold text-gray-300">
                      {pitTime || "20"}<span className="text-xl ml-1">s</span>
                    </div>
                  </div>
                </div>

                {/* Team 2 */}
                <div className="flex flex-col items-center" data-aos="slide-left" data-aos-duration="800" data-aos-delay="500">
                  <Hexagon borderColor="#ec4899">
                    <img 
                      src={team2Logo} 
                      className="object-cover rounded-2xl"
                      style={{
                        width: '100%',
                        height: '100%'
                      }}
                      alt="Team 2 Logo"
                    />
                  </Hexagon>
                  <div className="mt-6 mb-3 text-base font-medium text-gray-300 tracking-wider text-center uppercase">
                    TEAM
                  </div>
                  <TeamNamePill gradient="linear-gradient(90deg, #ec4899 0%, #be185d 100%)">
                    {team2name || "BLOCKBOTS"}
                  </TeamNamePill>
                  {team2Leader && (
                    <div className="text-sm text-pink-200 font-medium text-center mt-3">
                      Leader: {team2Leader}
                    </div>
                  )}
                </div>
              </div>
            )}
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
            <button
              className="mt-4 px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-all duration-200 text-lg"
              onClick={() => navigate("/GameHistory")}
            >
              Show Game History
            </button>
          </div>
        </div>
      )}

      {/* Bottom Sponsors Section */}
      <div className="w-full px-2 sm:px-4 pb-6 sm:pb-4 pt-4 sm:pt-0 mt-auto relative z-20" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="200">
        <div className="w-full bg-gradient-to-r from-gray-900/90 via-cyan-900/20 to-gray-900/90 rounded-xl sm:rounded-2xl backdrop-blur-md  p-2 sm:p-4 shadow-2xl">
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


