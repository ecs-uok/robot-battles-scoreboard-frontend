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
  winnerId?: string | number;
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
    // Determine winner using winnerId
    let winnerName = "";
    if (game.winnerId && game.winnerId !== "0" && game.winnerId !== 0) {
      // winnerId matches team1 or team2? (Assume team ids are not available here, fallback to score comparison if needed)
      // If you want to show "Draw" for 0, else show nothing if winnerId missing
      if (game.winnerId === undefined || game.winnerId === null || game.winnerId === "0" || game.winnerId === 0) {
        winnerName = "Draw";
      } else if (game.winnerId === (game as any).team1id) {
        winnerName = game.team1name;
      } else if (game.winnerId === (game as any).team2id) {
        winnerName = game.team2name;
      } else {
        // fallback: try to infer by score
        if (Number(game.team1score) > Number(game.team2score)) {
          winnerName = game.team1name;
        } else if (Number(game.team2score) > Number(game.team1score)) {
          winnerName = game.team2name;
        } else {
          winnerName = "Draw";
        }
      }
    } else {
      // fallback: try to infer by score
      if (Number(game.team1score) > Number(game.team2score)) {
        winnerName = game.team1name;
      } else if (Number(game.team2score) > Number(game.team1score)) {
        winnerName = game.team2name;
      } else {
        winnerName = "Draw";
      }
    }
    // Color logic for winner
    const winnerColor =
      winnerName === "Draw"
        ? "text-gray-500"
        : winnerName === game.team1name
        ? "text-blue-600"
        : winnerName === game.team2name
        ? "text-yellow-600"
        : "text-red-500";
    return (
      <div key={game.gameid} className="flex justify-center px-2">
        <div className="w-full max-w-3xl bg-white/90 rounded-3xl shadow-2xl my-4 px-3 py-4 md:px-6 md:py-6 border border-blue-200 flex flex-col items-center transition-all duration-300 hover:scale-[1.015] hover:shadow-3xl">
          <div className="flex flex-col md:flex-row w-full items-center mb-2">
            <div className="flex-1 flex flex-col items-center justify-center mb-1 md:mb-0">
              <div className="text-base md:text-xl font-extrabold text-blue-700 uppercase tracking-widest text-center break-words">
                {game.team1name}
              </div>
            </div>
            <div className="flex flex-col items-center justify-center mx-0 md:mx-2">
              <div className="text-sm md:text-lg font-bold text-gray-400 tracking-widest text-center whitespace-nowrap mb-1">
                MATCH NO: <span className="text-blue-700">{game.gameid}</span>
              </div>
              <div className="flex flex-row items-center">
                <span className="text-2xl md:text-5xl font-extrabold text-blue-900 drop-shadow-lg">{game.team1score}</span>
                <span className="px-2 md:px-4 text-2xl md:text-5xl font-extrabold text-gray-400 drop-shadow-lg">:</span>
                <span className="text-2xl md:text-5xl font-extrabold text-yellow-600 drop-shadow-lg">{game.team2score}</span>
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center mt-1 md:mt-0">
              <div className="text-base md:text-xl font-extrabold text-yellow-500 uppercase tracking-widest text-center break-words">
                {game.team2name}
              </div>
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