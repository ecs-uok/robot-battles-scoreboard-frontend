import "../styles/scoreboard.css";
import { useEffect, useState } from "react";
//images
import TitleImg from "../assets/Images/scoreboard-title.png";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface gameType {
  team1name: string;
  team2name: string;
  gameid: string;
  team1score: string;
  team2score: string;
  team3name?: string;
  team3score?: string;
  winnerId?: string | number;
  isDraw?: boolean;
  gameName?: string;
}
const ShowGames = () => {
  const [gamesList, setGamesList] = useState<Array<gameType>>([]);
  useEffect(() => {
    function fetchData() {
      try {
        fetch(`${API_BASE_URL}/games`)
          .then((response) => response.json())
          .then((json) => {
            setGamesList(json.reverse());
          });
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, []);
  console.log(gamesList);
  const content = gamesList.map((game) => {
    // Determine winner using winnerId or score fallback (supports 2 or 3 teams)
    let winnerName = "";
    const hasTeam3 = !!game.team3name && game.team3name !== "";

    // If backend flagged draw or winnerId is 0/null, show Draw
    if (game.isDraw === true || game.winnerId === 0 || game.winnerId === "0") {
      winnerName = "Draw";
    } else if (hasTeam3) {
      // 3-team fallback by comparing scores
      const t1 = Number(game.team1score);
      const t2 = Number(game.team2score);
      const t3 = Number(game.team3score ?? "0");
      const max = Math.max(t1, t2, t3);
      const winners = [
        { name: game.team1name, score: t1 },
        { name: game.team2name, score: t2 },
        { name: game.team3name as string, score: t3 },
      ].filter((t) => t.score === max);
      winnerName = winners.length === 1 ? winners[0].name : "Draw";
    } else {
      // 2-team fallback by comparing scores
      const t1 = Number(game.team1score);
      const t2 = Number(game.team2score);
      if (t1 > t2) winnerName = game.team1name;
      else if (t2 > t1) winnerName = game.team2name;
      else winnerName = "Draw";
    }

    // Color logic for winner
    const winnerColor =
      winnerName === "Draw"
        ? "text-gray-500"
        : winnerName === game.team1name
        ? "text-blue-600"
        : winnerName === game.team2name
        ? "text-yellow-600"
        : "text-green-600";
    const isWinner1 = winnerName === game.team1name;
    const isWinner2 = winnerName === game.team2name;
    const isWinner3 = hasTeam3 && winnerName === game.team3name;
    return (
      <div key={game.gameid} className="flex justify-center px-2">
        <div className="w-full max-w-3xl bg-white/90 rounded-3xl shadow-2xl my-4 px-3 py-4 md:px-6 md:py-6 border border-blue-200 flex flex-col items-center transition-all duration-300 hover:scale-[1.015] hover:shadow-3xl">
          <div className="w-full flex flex-col items-center mb-2">
            <div className="text-sm md:text-lg font-bold text-gray-400 tracking-widest text-center whitespace-nowrap mb-2">
              MATCH NO: <span className="text-blue-700">{game.gameid}</span>
              {game.gameName ? (
                <div className="text-xs md:text-base font-semibold text-gray-600 mt-1">{game.gameName}</div>
              ) : null}
            </div>
            <div className={`grid ${hasTeam3 ? "grid-cols-3" : "grid-cols-2"} gap-3 md:gap-6 w-full`}>
              {/* Team 1 */}
              <div className={`flex flex-col items-center justify-center bg-blue-50 rounded-2xl p-3 shadow-inner border ${isWinner1 ? "border-blue-400" : "border-transparent"}`}>
                <div className="text-base md:text-xl font-extrabold text-blue-700 uppercase tracking-widest text-center break-words">
                  {game.team1name}
                </div>
                <div className="mt-1 text-2xl md:text-5xl font-extrabold text-blue-900 drop-shadow-lg">{game.team1score}</div>
              </div>
              {/* Team 2 */}
              <div className={`flex flex-col items-center justify-center bg-yellow-50 rounded-2xl p-3 shadow-inner border ${isWinner2 ? "border-yellow-400" : "border-transparent"}`}>
                <div className="text-base md:text-xl font-extrabold text-yellow-600 uppercase tracking-widest text-center break-words">
                  {game.team2name}
                </div>
                <div className="mt-1 text-2xl md:text-5xl font-extrabold text-yellow-600 drop-shadow-lg">{game.team2score}</div>
              </div>
              {/* Team 3 (optional) */}
              {hasTeam3 && (
                <div className={`flex flex-col items-center justify-center bg-green-50 rounded-2xl p-3 shadow-inner border ${isWinner3 ? "border-green-400" : "border-transparent"}`}>
                  <div className="text-base md:text-xl font-extrabold text-green-600 uppercase tracking-widest text-center break-words">
                    {game.team3name}
                  </div>
                  <div className="mt-1 text-2xl md:text-5xl font-extrabold text-green-600 drop-shadow-lg">{game.team3score ?? "0"}</div>
                </div>
              )}
            </div>
          </div>
          {/* Winner for mobile - after both team names */}
          <div className="flex flex-col items-center w-full md:hidden mt-2">
            <div className="text-sm font-bold text-gray-700 tracking-wide">WINNER</div>
            <div className={`text-lg font-extrabold text-center mt-1 tracking-widest ${winnerColor} drop-shadow`}>
              {winnerName}
            </div>
          </div>
          {/* Winner for desktop */}
          <div className="hidden md:flex flex-col items-center w-full">
            <div className="mt-2 text-lg font-bold text-gray-700 tracking-wide">WINNER</div>
            <div className={`text-2xl font-extrabold text-center mt-1 tracking-widest ${winnerColor} drop-shadow`}>
              {winnerName}
            </div>
          </div>
        </div>
      </div>
    );
  });
  return content;
};
function GameHistory() {
  return (
    <div className="font-custom flex flex-col items-center justify-start min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 via-white to-yellow-50">
      <div className="w-full flex flex-col items-center mt-5 mb-2">
        <img
          className="text-black h-13 drop-shadow-xl w-11/12 max-w-xs md:max-w-md lg:max-w-lg rounded-[18px] bg-[rgba(255,255,255,0.85)]"
          src={TitleImg}
          alt="uok robot battles scoreboard"
        />
      </div>
      <div className="w-full flex justify-center">
        <div className="w-full max-w-4xl">
          {ShowGames()}
        </div>
      </div>
    </div>
  );
}

export default GameHistory;