import { useEffect, useState } from "react";
import "../styles/scoreboard.css";
import AOS from "aos";
import { useNavigate } from "react-router-dom";
//images
import TitleImg from "../assets/Images/scoreboard-title.png";
import bgImg from "../assets/Images/scoreboard-background.png";

function ControlPanel() {
  var team1Id: number;
  var team2Id: number;

  const [mainTime, setMainTime] = useState();
  const [pitTime, setPitTime] = useState();

  const [team1name, setTeam1Name] = useState();
  const [team2name, setTeam2Name] = useState();

  const [team1Logo, setTeam1Logo] = useState();
  const [team2Logo, setTeam2Logo] = useState();

  async function setTeamInfo() {
    fetch(
      "http://localhost:5000/getGameDetails"
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setTeam1Name(data.team1.name);
        setTeam2Name(data.team2.name);
        setTeam1Logo(data.team1.logo);
        setTeam2Logo(data.team2.logo);
      });
  }
  const navigate = useNavigate();
  function handleAddPoints() {
    navigate("/admin/AddPoints");
  }
  function handleStartStop() {
    if (start) {
      setStart(false);
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      };
      fetch(
        "http://localhost:5000/stopMain",
        requestOptions
      );
      fetch(
        "http://localhost:5000/stopPit",
        requestOptions
      );
    } else {
      setStart(true);
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      };
      fetch(
        "http://localhost:5000/startMain",
        requestOptions
      );
    }
  }
  function handlePitCounter() {
    if (pit) {
      setPit(false);
      const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      };
      fetch(
        "http://localhost:5000/resetPit",
        requestOptions
      );
    } else {
      setPit(true);
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      };
      fetch(
        "http://localhost:5000/startPit",
        requestOptions
      );
    }
  }
  function resetCounters() {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    };
    fetch(
      "http://localhost:5000/resetMain",
      requestOptions
    );
    fetch(
      "http://localhost:5000/resetPit",
      requestOptions
    );
    setPit(false);
    setStart(false);
  }
  useEffect(() => {
    AOS.init();
    const eventSource = new EventSource(
      "http://localhost:5000/timer"
    );
    if (typeof eventSource != undefined) {
      console.log("Connection with timer successful");
      let oldVal = -1;
      eventSource.onmessage = (event) => {
        const eventData = JSON.parse(event.data);
        console.log(eventData);
        setMainTime(eventData.mainTime);
        setPitTime(eventData.pitTime);

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

  const [start, setStart] = useState(false);
  const [pit, setPit] = useState(false);
  return (
    <div className="font-custom flex flex-col items-center justify-start min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 via-white to-yellow-50">
      <div className="w-full flex flex-col items-center mt-5 mb-10">
        <img
          className="text-black h-13 drop-shadow-xl w-11/12 max-w-xs md:max-w-md lg:max-w-lg rounded-[18px] bg-[rgba(255,255,255,0.85)]"
          src={TitleImg}
          alt="uok robot battles scoreboard"
        />
      </div>
      <div className="w-full flex justify-center">
        <div className="relative bg-white/95 rounded-3xl shadow-2xl p-6 max-w-4xl w-full mx-2 border border-blue-200 flex flex-col gap-8">
          {/* Teams and Timer Row */}
          <div className="grid grid-cols-3 gap-4 items-center">
            {/* Team 1 */}
            <div className="flex flex-col items-center gap-2 bg-blue-50 rounded-2xl p-4 shadow-inner min-h-[180px]">
              <div className="w-20 h-20 rounded-full bg-white border-4 border-blue-200 flex items-center justify-center shadow">
                {team1Logo && (
                  <img src={team1Logo} alt="Team 1 Logo" className="w-16 h-16 object-contain rounded-full" />
                )}
              </div>
              <div className="mt-2 text-lg font-bold text-blue-700 uppercase tracking-wide text-center">{team1name}</div>
            </div>
            {/* Timer Card - Overlapping and Centered */}
            <div className="relative flex flex-col items-center justify-center z-10">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-full flex justify-center">
                <span className="bg-blue-200 px-6 py-2 rounded-t-xl text-lg font-bold text-blue-800 tracking-widest shadow border-b-2 border-blue-400">
                  TIME REMAINING
                </span>
              </div>
              <div
                className="relative z-10 font-mono text-5xl md:text-6xl text-white bg-black px-6 py-2 rounded-2xl shadow-2xl border-2 border-blue-400 outline outline-2 outline-yellow-400"
                style={{ letterSpacing: "0.15em", fontVariantNumeric: "tabular-nums", marginTop: "2.5rem" }}
              >
                {mainTime ? Math.floor(mainTime / 60) : mainTime || "00"}:
                {mainTime
                  ? (mainTime % 60).toLocaleString("en-US", {
                      minimumIntegerDigits: 2,
                      useGrouping: false,
                    })
                  : mainTime || "00"}
              </div>
              <div className="mt-4 flex flex-col items-center">
                <span className="text-green-700 font-bold text-lg tracking-wide">ADDITIONAL TIME</span>
                <div className="font-mono text-2xl text-green-600 bg-white px-4 py-1 rounded-xl shadow border border-green-200 mt-2">
                  {pitTime || "0"}
                </div>
                <span className="text-xs text-gray-600 mt-1">SECONDS</span>
              </div>
            </div>
            {/* Team 2 */}
            <div className="flex flex-col items-center gap-2 bg-yellow-50 rounded-2xl p-4 shadow-inner min-h-[180px]">
              <div className="w-20 h-20 rounded-full bg-white border-4 border-yellow-200 flex items-center justify-center shadow">
                {team2Logo && (
                  <img src={team2Logo} alt="Team 2 Logo" className="w-16 h-16 object-contain rounded-full" />
                )}
              </div>
              <div className="mt-2 text-lg font-bold text-yellow-600 uppercase tracking-wide text-center">{team2name}</div>
            </div>
          </div>
          {/* Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
            <div className="flex flex-col gap-3">
              <button
                className={`transition bg-blue-200 hover:bg-blue-400 text-blue-900 font-bold py-2 px-4 rounded-xl shadow`}
                onClick={handleStartStop}
              >
                {start ? "Stop" : "Start"} GAME
              </button>
              <button
                className="transition bg-gray-200 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-xl shadow"
                onClick={resetCounters}
              >
                RESET COUNTERS
              </button>
            </div>
            <div className="flex flex-col gap-3 items-center justify-center">
              <button
                className="transition bg-gradient-to-r from-yellow-300 to-yellow-500 hover:from-yellow-400 hover:to-yellow-600 text-black font-bold py-2 px-8 rounded-xl shadow"
                onClick={handleAddPoints}
              >
                ADD POINTS
              </button>
            </div>
            <div className="flex flex-col gap-3">
              <button
                className="transition bg-gray-200 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-xl shadow"
                onClick={handlePitCounter}
              >
                {pit ? "RESET" : "START"} 20 COUNTER
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ControlPanel;
