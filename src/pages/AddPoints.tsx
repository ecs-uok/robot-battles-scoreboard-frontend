import { useEffect, useState } from "react";
import "../styles/scoreboard.css";

//images
import bgImg from "../assets/Images/scoreboard-background.png";
import versusImg from "../assets/Images/versus-img.png";

function AddPoints() {
  const host = "http://localhost:5000";
  const [team1Points, setTeam1Points] = useState("");
  const [team2Points, setTeam2Points] = useState("");

  const handleInputChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTeam1Points(event.target.value);
  };
  const handleInputChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTeam2Points(event.target.value);
  };
  const [gameNo, setGameNo] = useState();
  var team1Id: number;
  var team2Id: number;

  const [team1name, setTeam1Name] = useState();
  const [team2name, setTeam2Name] = useState();

  const [team1Logo, setTeam1Logo] = useState();
  const [team2Logo, setTeam2Logo] = useState();

  const [winnerId, setWinnerId] = useState<number | string | undefined>(
    undefined
  );

  function saveGame() {
    const body = { team1score: team1Points, team2score: team2Points };
    const requestOptions = {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };
    console.log(body);
    fetch(host + "/saveGame", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        window.alert(data.message);
        // Optionally, you can fetch the latest timer/winner info here if needed
      });
  }
  async function setTeamInfo() {
    fetch(host + "/getGameDetails")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setTeam1Name(data.team1.name);
        setTeam2Name(data.team2.name);
        setTeam1Logo(data.team1.logo);
        setTeam2Logo(data.team2.logo);
      });
  }

  useEffect(() => {
    const eventSource = new EventSource(host + "/timer");
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
      className=""
      style={{
        backgroundImage: `url(${bgImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <div className="text-white text-2xl text-center mt-4">
        {" "}
        Add Final Points - Game {gameNo}
      </div>
      {/* Winner display if winnerId is present */}
      {winnerId && (
        <div className="text-green-400 text-3xl text-center mt-2">
          Winner ID: {winnerId}
        </div>
      )}
      <div className="grid col-span-1 py-16  gap-4 sm:grid-cols-1 md:grid-cols-3 text-white text-center mt-8 py-5 mx-8 rounded-lg ">
        <div className="flex flex-col items-center gap-4">
          <div className="text-4xl  ">{team1name}</div>
          <img src={team1Logo} className="w-1/3"></img>
          <input
            type="text"
            value={team1Points}
            className="text-black text-xl bg-white w-1/2 mt-4 p-2 rounded-lg"
            onChange={handleInputChange1}
            placeholder="Enter points.."
          />
        </div>
        <div className="flex items-center justify-center">
          <img src={versusImg} className="w-1/4"></img>
        </div>
        <div className=" flex flex-col items-center gap-4">
          <div className="text-4xl ">{team2name}</div>
          <img src={team2Logo} className="w-1/3"></img>
          <input
            type="text"
            value={team2Points}
            className="text-black text-xl bg-white w-1/2 mt-4 p-2 rounded-lg"
            onChange={handleInputChange2}
            placeholder="Enter points.."
          />
        </div>
      </div>

      <div className="text-center text-2xl text-gray-500  mt-8">
        <button
          className="bg-yellow-300    hover:text-black p-2 rounded-2xl"
          style={{ width: "200px" }}
          onClick={saveGame}
        >
          Save Game
        </button>
      </div>
    </div>
  );
}

export default AddPoints;