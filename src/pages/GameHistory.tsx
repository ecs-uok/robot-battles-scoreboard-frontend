import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

//images - same as Main page
const bgImg = "/scoreboard-background.png";

interface GameHistoryItem {
  id: number;
  gameId: number;
  team1: { name: string; logo: string };
  team2: { name: string; logo: string };
  team3?: { name: string; logo: string };
  winner: { name: string; logo: string };
  team1score: number;
  team2score: number;
  team3score?: number;
  date: string;
  gameName?: string;
  isDraw: boolean;
}

function GameHistory() {
  const [gameHistory, setGameHistory] = useState<GameHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Fetch game history from API
  const fetchGameHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/games`);
      if (response.ok) {
        const data = await response.json();
        
        // Transform the data to match our interface
        const transformedData = Object.keys(data).map((key, index) => {
          const game = data[key];
          return {
            id: index + 1,
            gameId: parseInt(game.gameid) || 0,
            team1: { 
              name: game.team1name || "Unknown Team", 
              logo: "/default-logo.png" // You'll need to get actual logos
            },
            team2: { 
              name: game.team2name || "Unknown Team", 
              logo: "/default-logo.png" // You'll need to get actual logos
            },
            team3: game.team3name ? { 
              name: game.team3name, 
              logo: "/default-logo.png" 
            } : undefined,
            winner: game.isDraw ? { name: "Draw", logo: "" } : {
              name: getWinnerName(game),
              logo: "/default-logo.png"
            },
            team1score: parseInt(game.team1score) || 0,
            team2score: parseInt(game.team2score) || 0,
            team3score: game.team3score ? parseInt(game.team3score) : undefined,
            date: new Date().toISOString(), // You'll need to add actual dates to your backend
            gameName: game.gameName || "",
            isDraw: game.isDraw || false
          };
        });
        
        setGameHistory(transformedData.reverse()); // Show most recent first
      } else {
        console.error('Failed to fetch game history');
        setGameHistory([]);
      }
    } catch (error) {
      console.error('Error fetching game history:', error);
      setGameHistory([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to determine winner name
  const getWinnerName = (game: any) => {
    if (game.isDraw) return "Draw";
    
    const team1Score = parseInt(game.team1score) || 0;
    const team2Score = parseInt(game.team2score) || 0;
    const team3Score = game.team3score ? parseInt(game.team3score) : 0;
    
    if (game.team3name) {
      // 3-team match
      const maxScore = Math.max(team1Score, team2Score, team3Score);
      if (team1Score === maxScore) return game.team1name;
      if (team2Score === maxScore) return game.team2name;
      if (team3Score === maxScore) return game.team3name;
    } else {
      // 2-team match
      if (team1Score > team2Score) return game.team1name;
      if (team2Score > team1Score) return game.team2name;
    }
    
    return "Draw";
  };

  useEffect(() => {
    AOS.init({ once: true });
    fetchGameHistory();
  }, []);

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
      {/* Clean Background Overlay - same as Main page */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-900/60 via-purple-900/60 to-pink-900/60"></div>
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Subtle Lighting Effects - same as Main page */}
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>

      {/* Minimal Floating Particles - same as Main page */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 4}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Content with proper z-index */}
      <div className="relative z-10 w-full flex flex-col min-h-screen px-4">
        {/* Title Section */}
        <div className="w-full flex flex-col items-center justify-center mt-8 mb-8" data-aos="fade-down" data-aos-duration="1000">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text mb-4 text-center">
            GAME HISTORY
          </h1>
          <div className="text-gray-300 font-bold text-sm sm:text-base md:text-lg tracking-wider text-center drop-shadow-lg">
            ROBOT BATTLES 2K25 - MATCH RESULTS
          </div>
          <div className="text-gray-300 font-bold text-sm sm:text-base md:text-lg tracking-wider text-center drop-shadow-lg">
            LIGHT WEIGHT
          </div>
        </div>

        {/* Back Button */}
        <div className="w-full flex justify-start mb-6" data-aos="fade-right" data-aos-duration="800">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-all duration-200 text-lg backdrop-blur-md border border-cyan-400/30"
          >
            ← Back to Main
          </button>
        </div>

        {/* Game History Content */}
        <div className="flex-grow flex flex-col items-center justify-center" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="200">
          <div className="bg-gradient-to-br from-gray-900/95 via-blue-900/90 to-cyan-900/95 border-2 border-cyan-400/50 rounded-2xl px-12 py-12 shadow-2xl backdrop-blur-md text-center max-w-6xl w-full">
            {loading ? (
              <div>
                <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text mb-6 animate-pulse">
                  Loading Game History...
                </div>
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-cyan-400"></div>
                </div>
              </div>
            ) : gameHistory.length > 0 ? (
              <div className="space-y-6 max-h-[500px] overflow-y-auto scrollbar-hide">
                <div className="text-3xl font-bold text-cyan-300 mb-8">
                  Match Results ({gameHistory.length} games)
                </div>
                {gameHistory.map((game) => (
                  <div key={game.id} className="bg-gray-800/50 rounded-xl p-6 border border-gray-600/50 hover:bg-gray-800/70 transition-colors">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      <div className="flex-1">
                        <div className="text-2xl font-bold text-cyan-300 mb-3">
                          Match #{game.gameId} {game.gameName && `- ${game.gameName}`}
                        </div>
                        <div className="text-white text-xl">
                          <span className="font-semibold text-cyan-200">{game.team1.name}</span> ({game.team1score}) vs{' '}
                          <span className="font-semibold text-pink-200">{game.team2.name}</span> ({game.team2score})
                          {game.team3 && (
                            <> vs <span className="font-semibold text-green-200">{game.team3.name}</span> ({game.team3score})</>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-center md:items-end">
                        {game.isDraw ? (
                          <div className="text-orange-400 font-bold text-xl">
                            🤝 DRAW
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <div className="text-yellow-400 font-semibold text-lg">
                              🏆 Winner:
                            </div>
                            <span className="text-yellow-300 font-bold text-lg">
                              {game.winner.name}
                            </span>
                          </div>
                        )}
                        <div className="text-gray-400 text-base mt-2">
                          {new Date(game.date).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text mb-6 animate-pulse">
                  No Game History Available
                </div>
                <div className="text-gray-300 text-xl">
                  Match results will appear here once games are completed.
                </div>
                <button
                  onClick={fetchGameHistory}
                  className="mt-6 px-8 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition-all duration-200 text-lg"
                >
                  Refresh
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer spacer */}
        <div className="h-8"></div>
      </div>
    </div>
  );
}

export default GameHistory;