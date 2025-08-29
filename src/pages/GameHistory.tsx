import "../styles/scoreboard.css";
import { useEffect, useState } from "react";
//images
import TitleImg from "../assets/Images/scoreboard-title.png";
import bgImg from "../assets/Images/scoreboard-background.png";

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
        fetch("http://localhost:5000/games")
          .then((response) => response.json())
          .then((json) => {
            for (let i = 0; i < json.length; i++) {
              let obj = json[i];
              console.log(obj);
              if (obj) setGamesList((prevState) => [...prevState, obj]);
            }
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
    return (
      <div key={game.gameid} className="  gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-3 bg-gray-300 text-center mt-8 py-5 mx-8 rounded-lg ">
          <div className="col-span-1 flex flex-row justify-center items-center ">
            <div className="text-2xl ">{game.team1name}</div>
          </div>
          <div className="col-span-1">
            <div className="text-xl text-center">Match No: {game.gameid} </div>
            <div className="flex flex-row justify-center items-center">
              <div className="text-6xl ">{game.team1score} : </div>
              <div className="text-6xl "> {game.team2score}</div>
            </div>
            <div className="text-xl ">Winner</div>
            <div className="text-2xl text-center text-red-500">
              {winnerName}
            </div>
          </div>
          <div className="col-span-1 flex flex-row justify-center items-center">
            <div className="text-2xl ">{game.team2name}</div>
          </div>
        </div>
      </div>
    );
  });
  return content;
};
function GameHistory() {
  return (
    <div className="font-custom flex flex-col items-center justify-start min-h-[calc(100vh-64px)]">
      <div className="w-full flex flex-col items-center mt-5 mb-2">
        <img
          className="text-black h-13 drop-shadow-xl w-11/12 max-w-xs md:max-w-md lg:max-w-lg rounded-[18px] bg-[rgba(255,255,255,0.85)]"
          src={TitleImg}
          alt="uok robot battles scoreboard"
        />
      </div>
      <div className="w-full flex justify-center">
        <div className="bg-white/90 rounded-2xl shadow-2xl p-4 max-w-3xl w-full mx-2 border border-blue-200">
          {ShowGames()}
        </div>
      </div>
    </div>
  );
}

export default GameHistory;
