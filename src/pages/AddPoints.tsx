import { useEffect, useState } from "react";
import "../styles/scoreboard.css";

//images
import TitleImg from "../assets/Images/scoreboard-title.png";
import versusImg from "../assets/Images/versus-img.png";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function AddPoints() {
  const [team1Points, setTeam1Points] = useState("");
  const [team2Points, setTeam2Points] = useState("");
  const [team3Points, setTeam3Points] = useState<string>("");

  const handleInputChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTeam1Points(event.target.value);
  };
  const handleInputChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTeam2Points(event.target.value);
  };
  const handleInputChange3 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTeam3Points(event.target.value);
  };
  const [gameNo, setGameNo] = useState();
  var team1Id: number;
  var team2Id: number;

  const [team1name, setTeam1Name] = useState();
  const [team2name, setTeam2Name] = useState();
  const [team3name, setTeam3Name] = useState<string | undefined>(undefined);
  const [gameName, setGameName] = useState<string>("");

  const [team1Logo, setTeam1Logo] = useState();
  const [team2Logo, setTeam2Logo] = useState();
  const [team3Logo, setTeam3Logo] = useState<string | undefined>(undefined);

  const [winnerId, setWinnerId] = useState<number | string | undefined>(
    undefined
  );

  function saveGame() {
    const body: any = { team1score: team1Points, team2score: team2Points };
    if (team3name) {
      body.team3score = team3Points;
    }
    const requestOptions = {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };
    console.log(body);
    fetch(`${API_BASE_URL}/saveGame`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        window.alert(data.message);
        // Optionally, you can fetch the latest timer/winner info here if needed
      });
  }
  async function setTeamInfo() {
    fetch(`${API_BASE_URL}/getGameDetails`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setTeam1Name(data.team1.name);
        setTeam2Name(data.team2.name);
        setTeam1Logo(data.team1.logo);
        setTeam2Logo(data.team2.logo);
        setGameName(data.gameName || "");
        if (data.team3 && data.team3.name) {
          setTeam3Name(data.team3.name);
          setTeam3Logo(data.team3.logo);
        } else {
          setTeam3Name(undefined);
          setTeam3Logo(undefined);
        }
      });
  }

  useEffect(() => {
    const eventSource = new EventSource(`${API_BASE_URL}/timer`);
    if (typeof eventSource != undefined) {
      console.log("Connection with timer successful");
      let oldVal = -1;
      eventSource.onmessage = (event) => {
        const eventData = JSON.parse(event.data);
        console.log(eventData);
        setGameNo(eventData.gameId);

        // Set winnerId if present in eventData
        if ("winnerId" in eventData) {
          setWinnerId(eventData.winnerId);
        } else {
          setWinnerId(undefined);
        }

        if (
          oldVal != eventData.gameId ||
          team1Id != eventData.team1Id ||
          team2Id != eventData.team2Id
        ) {
          oldVal = eventData.gameId;
          team1Id = eventData.team1Id;
          team2Id = eventData.team2Id;
          console.log("Game details changed");
          setTeamInfo();
        }
      };
    } else {
      console.log("Coudn't connect to timer");
    }
    return () => eventSource.close();
  }, []);
  return (
    <div
      className="font-custom flex flex-col items-center justify-start min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 via-white to-yellow-50 mb-5" >
      <div className="w-full flex flex-col items-center mt-5 mb-5">
        <img
          className="text-black h-13 drop-shadow-xl w-11/12 max-w-xs md:max-w-md lg:max-w-lg rounded-[18px] bg-[rgba(255,255,255,0.85)]"
          src={TitleImg}
          alt="uok robot battles scoreboard"
        />
      </div>
      <div className="w-full flex flex-col items-center mt-5 mb-2">
        <div className="text-xl md:text-2xl font-bold text-blue-700 text-center mb-1 tracking-wider">
          {gameNo !== undefined && gameNo !== null ? `Game ID: ${gameNo}` : ""}
          {gameName ? (
            <div className="text-sm font-semibold text-gray-600 mt-1">{gameName}</div>
          ) : null}
        </div>
        <div className="text-3xl md:text-4xl font-bold text-green-400 text-center mb-6 drop-shadow-lg tracking-wider">
          {winnerId !== undefined && winnerId !== null
            ? `Winner ID: ${winnerId}`
            : "Add Final Points"}
        </div>
      </div>
      <div className="w-full flex justify-center">
        <div className="bg-white/95 rounded-3xl shadow-2xl p-8 max-w-3xl w-full mx-2 border border-blue-200 flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Team 1 */}
            <div className="flex flex-col items-center gap-4">
              <div className="text-2xl md:text-3xl font-bold text-blue-700 uppercase tracking-wide">
                {team1name}
              </div>
              <img
                src={team1Logo}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-blue-200 shadow bg-white object-contain"
                alt="Team 1 Logo"
              />
              <div className="w-44 min-h-[64px] flex items-center justify-center bg-blue-50 border-2 border-blue-300 rounded-xl shadow">
                <input
                  type="number"
                  value={team1Points}
                  className="text-center text-3xl font-bold text-blue-900 bg-transparent outline-none w-full placeholder:text-blue-300"
                  onChange={handleInputChange1}
                  placeholder="Enter points"
                  min={0}
                  style={{ fontSize: "1rem" }}
                />
              </div>
            </div>
            {/* Versus */}
            <div className="flex flex-col items-center justify-center gap-4">
              <img src={versusImg} className="w-16 md:w-24" alt="versus" />
              <div className="text-lg font-bold text-gray-400">VS</div>
              <div className="text-gray-400 text-sm mt-2">
                Game No:{" "}
                <span className="font-bold text-blue-700">{gameNo}</span>
              </div>
            </div>
            {/* Team 2 */}
            <div className="flex flex-col items-center gap-4">
              <div className="text-2xl md:text-3xl font-bold text-yellow-600 uppercase tracking-wide">
                {team2name}
              </div>
              <img
                src={team2Logo}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-yellow-200 shadow bg-white object-contain"
                alt="Team 2 Logo"
              />
              <div className="w-44 min-h-[64px] flex items-center justify-center bg-yellow-50 border-2 border-yellow-300 rounded-xl shadow">
                <input
                  type="number"
                  value={team2Points}
                  className="text-center text-3xl font-bold text-yellow-700 bg-transparent outline-none w-full placeholder:text-yellow-300"
                  onChange={handleInputChange2}
                  placeholder="Enter points"
                  min={0}
                  style={{ fontSize: "1rem" }}
                />
              </div>
            </div>
          </div>
          {team3name && (
            <div className="grid grid-cols-1 gap-8 items-center mt-6">
              {/* Team 3 */}
              <div className="flex flex-col items-center gap-4">
                <div className="text-2xl md:text-3xl font-bold text-green-600 uppercase tracking-wide">
                  {team3name}
                </div>
                <img
                  src={team3Logo}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-green-200 shadow bg-white object-contain"
                  alt="Team 3 Logo"
                />
                <div className="w-44 min-h-[64px] flex items-center justify-center bg-green-50 border-2 border-green-300 rounded-xl shadow">
                  <input
                    type="number"
                    value={team3Points}
                    className="text-center text-3xl font-bold text-green-700 bg-transparent outline-none w-full placeholder:text-green-300"
                    onChange={handleInputChange3}
                    placeholder="Enter points"
                    min={0}
                    style={{ fontSize: "1rem" }}
                  />
                </div>
              </div>
            </div>
          )}
          <div className="flex flex-col items-center mt-4">
            <button
              className="bg-gradient-to-r from-yellow-300 to-yellow-500 hover:from-yellow-400 hover:to-yellow-600 text-black font-bold px-10 py-4 rounded-2xl shadow-lg text-2xl tracking-widest transition-all duration-200 uppercase"
              style={{ minWidth: "200px" }}
              onClick={saveGame}
            >
              Save Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddPoints;