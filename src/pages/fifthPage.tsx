import "../styles/scoreboard.css";
import { useEffect, useState } from "react";
//images
import TitleImg from "../assets/Images/scoreboard-title.png";
import bgImg from "../assets/Images/scoreboard-background.png";

import sampleLogo1 from "../assets/Images/sample-team-logo-1.png";
import sampleLogo2 from "../assets/Images/sample-team-logo-2.png";

interface gameType {
  team1name: string;
  team2name: string;
  gameid: string;
  team1score: string;
  team2score: string;
}
const ShowGames = () => {
  const [gamesList, setGamesList] = useState<Array<gameType>>([]);
  useEffect(() => {
    async function fetchData() {
      try {
        await fetch(
          "https://robot-battles-scoreboard-backend.onrender.com/games"
        )
          .then((response) => response.json())
          .then((json) => {
            for (let i = 0; i < json.length; i++) {
              let obj = json[i];
              if (obj) setGamesList([...gamesList, obj]);
            }
          });
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, []);
  return gamesList.map((game) => {
    return (
      <div className="  gap-4">
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
              {game.team1score > game.team2score
                ? game.team1name
                : game.team2name}
            </div>
          </div>
          <div className="col-span-1 flex flex-row justify-center items-center">
            <div className="text-2xl ">{game.team2name}</div>
          </div>
        </div>
      </div>
    );
  });
};
function fifthPage() {
  return (
    <div
      className=" overflow-hidden"
      style={{
        backgroundImage: `url(${bgImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <div className="text-2xl  mx-auto    w-full">
        <img
          className="text-black  lg:px-8 h-13 pt-3"
          src={TitleImg}
          alt="uok robot battles scoreboard"
          style={{ maxWidth: "80%", margin: "0 auto" }}
        />
      </div>
      <div>{ShowGames()}</div>
    </div>
  );
}

export default fifthPage;
