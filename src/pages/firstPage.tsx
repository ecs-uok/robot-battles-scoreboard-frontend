import { useEffect, useState } from "react";

//images
import TitleImg from "../assets/Images/scoreboard-title.png";
import bgImg from "../assets/Images/scoreboard-background.png";
import versusImg from "../assets/Images/versus-img.png";

function firstPage() {
  const [gameNo, setGameNo] = useState();

  const [mainTime, setMainTime] = useState();
  const [pitTime, setPitTime] = useState();

  const [team1name, setTeam1Name] = useState();
  const [team2name, setTeam2Name] = useState();

  const [team1Leader, setTeam1Leader] = useState();
  const [team2Leader, setTeam2Leader] = useState();

  const [team1Logo, setTeam1Logo] = useState();
  const [team2Logo, setTeam2Logo] = useState();

  async function setTeamInfo() {
    fetch(
      "https://robot-battles-scoreboard-backend.onrender.com/getGameDetails"
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setTeam1Name(data.team1.name);
        setTeam2Name(data.team2.name);
        setTeam1Logo(data.team1.logo);
        setTeam2Logo(data.team2.logo);
        setTeam1Leader(data.team1.leader);
        setTeam2Leader(data.team2.leader);
      });
  }
  useEffect(() => {
    const eventSource = new EventSource(
      "https://robot-battles-scoreboard-backend.onrender.com/timer"
    );
    if (typeof eventSource != undefined) {
      console.log("Connection with timer successful");
      let oldVal = -1;
      eventSource.onmessage = (event) => {
        const eventData = JSON.parse(event.data);
        console.log(eventData);
        setMainTime(eventData.mainTime);
        setPitTime(eventData.pitTime);
        setGameNo(eventData.gameId);
        if (oldVal != eventData.gameId) {
          oldVal = eventData.gameId;
          console.log("Game no changed");
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
      className="font-custom"
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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-12 mx-8  my-4 text-right">
        <div
          style={{ backgroundColor: "rgb(245, 245, 220, 0.3)" }}
          className="md:col-span-3 lg:col-span-5 rounded-l-2xl text-3xl"
        >
          <span style={{ color: "#FFF338" }}>TEAM</span>
          <br /> {team1name}
        </div>
        <div className="md:col-span-3 lg:col-span-2 ">
          <img
            src={versusImg}
            alt="robot 1 vs robot 2"
            className="w-1/6 sm:w-1/3 mx-auto"
          />
        </div>
        <div
          style={{ backgroundColor: "rgb(245, 245, 220, 0.3)" }}
          className="md:col-span-3 lg:col-span-5  rounded-r-2xl text-left text-3xl "
        >
          <span style={{ color: "#FFF338" }}>TEAM</span>
          <br />
          {team2name}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-12 pt-5 mx-8  ">
        <div className="md:col-span-3 lg:col-span-3  ">
          <img src={team1Logo} className="w-4/5 mx-auto" />
          <div className="text-xl text-left text-white">LEADER</div>
          <div
            className="text-2xl text-left text-white"
            style={{ color: "#FFF338" }}
          >
            {team1Leader}
          </div>
        </div>
        <div className="md:col-span-3 lg:col-span-6 ">
          <div className="text-3xl text-center text-white">TIME REMAINING</div>
          <div className="text-8xl text-center text-white">
            {mainTime || "00.00"}
          </div>
          <hr className="border-2 border-white my-5" />
          <div className="text-2xl text-center text-white">ADDITIONAL TIME</div>
          <div className="text-6xl text-center text-green-400">
            {pitTime || "0"}
          </div>
          <div className="text-xl text-center text-white">SECONDS</div>
        </div>
        <div className="md:col-span-3 lg:col-span-3  ">
          <img src={team2Logo} className="w-4/5 mx-auto" />
          <div className="text-xl text-right text-white">LEADER</div>
          <div
            className="text-2xl text-right text-white"
            style={{ color: "#FFF338" }}
          >
            {team2Leader}
          </div>
        </div>
      </div>

      <div className="  mx-auto mt-4 text-lg  bg-gray-900 text-white text-center w-full">
        <h3>LIVE ON</h3>
        <h3>SATURDAY JUNE 13RD</h3>
      </div>
    </div>
  );
}

export default firstPage;