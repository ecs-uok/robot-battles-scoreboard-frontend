import { useEffect, useState } from "react";
import "../styles/scoreboard.css";
import AOS from "aos";
import { useNavigate } from "react-router-dom";
//images
import TitleImg from "../assets/Images/scoreboard-title.png";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function ControlPanel() {
  var team1Id: number;
  var team2Id: number;
  var team3Id: number;

  const [mainTime, setMainTime] = useState();
  const [pitTime, setPitTime] = useState();
  const [pitOpenTime] = useState(60); // Default pit open time

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

  async function setTeamInfo() {
    fetch(
      `${API_BASE_URL}/getGameDetails`
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
        setGameName(data.gameName || "");
        // Optional team 3
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
  const navigate = useNavigate();
  function handleAddPoints() {
    navigate("/Admin/AddPoints");
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
        `${API_BASE_URL}/stopMain`,
        requestOptions
      );
      fetch(
        `${API_BASE_URL}/stopPit`,
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
        `${API_BASE_URL}/startMain`,
        requestOptions
      );
    }
  }
  const [start, setStart] = useState(false);
  const [pit, setPit] = useState(false);
  const [pitStatus, setPitStatus] = useState<boolean>(false);
  const [gameNo, setGameNo] = useState<number | undefined>(undefined); // <-- add state for game id

  // Fetch pit status from backend
  async function fetchPitStatus() {
    try {
      const res = await fetch(`${API_BASE_URL}/pitstatus`);
      const data = await res.json();
      setPitStatus(!!data.pitopen);
    } catch (e) {
      setPitStatus(false);
    }
  }

  // Fetch main timer running status from backend
  async function fetchMainRunningStatus() {
    try {
      const res = await fetch(`${API_BASE_URL}/timerstatus`);
      const data = await res.json();
      setStart(!!data.mainRunning);
    } catch (e) {
      setStart(false);
    }
  }

  useEffect(() => {
    AOS.init();
    const eventSource = new EventSource(
      `${API_BASE_URL}/timer`
    );
    if (typeof eventSource != undefined) {
      let oldVal = -1;
      eventSource.onmessage = (event) => {
        const eventData = JSON.parse(event.data);
        setMainTime(eventData.mainTime);
        setPitTime(eventData.pitTime);

        // Set game id from backend
        if ("gameId" in eventData) {
          setGameNo(eventData.gameId);
        }

        // Optionally update start state from SSE if available
        if ("mainRunning" in eventData) {
          setStart(!!eventData.mainRunning);
        } else {
          // Fallback: fetch from backend REST endpoint
          fetchMainRunningStatus();
        }

        // Real-time pit status update
        fetchPitStatus();

        if (
          oldVal != eventData.gameId ||
          team1Id != eventData.team1Id ||
          team2Id != eventData.team2Id ||
          team3Id != eventData.team3Id
        ) {
          oldVal = eventData.gameId;
          team1Id = eventData.team1Id;
          team2Id = eventData.team2Id;
          team3Id = eventData.team3Id;
          setTeamInfo();
        }
      };
    }
    // Initial fetch
    fetchPitStatus();
    fetchMainRunningStatus();
    return () => eventSource.close();
  }, []);

  function handlePitCounter() {
    if (pit) {
      setPit(false);
      const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      };
      fetch(
        `${API_BASE_URL}/resetPit`,
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
        `${API_BASE_URL}/startPit`,
        requestOptions
      );
    }
    fetchPitStatus();
  }
  function resetCounters() {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    };
    fetch(
      `${API_BASE_URL}/resetMain`,
      requestOptions
    );
    fetch(
      `${API_BASE_URL}/resetPit`,
      requestOptions
    );
    setPit(false);
    setStart(false);
  }

  // Calculate pit closing time
  const getPitClosingTime = () => {
    if (!mainTime || !pitOpenTime) return null;
    const timeUntilPitCloses = mainTime - pitOpenTime;
    return timeUntilPitCloses > 0 ? timeUntilPitCloses : 0;
  };

  return (
    <div className="font-custom flex flex-col items-center justify-start min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 via-white to-yellow-50">
      <div className="w-full flex flex-col items-center mt-5 mb-6 px-2">
        {/* Removed top Game ID display */}
        <img
          className="text-black h-13 drop-shadow-xl w-full max-w-xs md:max-w-md lg:max-w-lg rounded-[18px] bg-[rgba(255,255,255,0.85)]"
          src={TitleImg}
          alt="uok robot battles scoreboard"
        />
      </div>
      <div className="w-full flex justify-center px-2">
        <div className="relative bg-white/95 rounded-3xl shadow-2xl p-3 md:p-6 max-w-4xl w-full mx-0 border border-blue-200 flex flex-col gap-6 md:gap-8">
          {/* Teams and Timer Row */}
          {team3Logo && team3name ? (
            <>
              {/* Top row: three teams */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
                {/* Team 1 */}
                <div className="flex flex-col items-center gap-2 bg-blue-50 rounded-2xl p-3 md:p-4 shadow-inner min-h-[120px] md:min-h-[180px] mb-2 md:mb-0">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white border-4 border-blue-200 flex items-center justify-center shadow">
                    {team1Logo && (
                      <img src={team1Logo} alt="Team 1 Logo" className="w-12 h-12 md:w-16 md:h-16 object-contain rounded-full" />
                    )}
                  </div>
                  <div className="mt-2 text-base md:text-lg font-bold text-blue-700 uppercase tracking-wide text-center break-words">{team1name}</div>
                  {team1Leader && (
                    <div className="text-xs md:text-sm text-blue-600 font-medium text-center">
                      Leader: {team1Leader}
                    </div>
                  )}
                </div>
                {/* Team 2 */}
                <div className="flex flex-col items-center gap-2 bg-yellow-50 rounded-2xl p-3 md:p-4 shadow-inner min-h-[120px] md:min-h-[180px] mb-2 md:mb-0">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white border-4 border-yellow-200 flex items-center justify-center shadow">
                    {team2Logo && (
                      <img src={team2Logo} alt="Team 2 Logo" className="w-12 h-12 md:w-16 md:h-16 object-contain rounded-full" />
                    )}
                  </div>
                  <div className="mt-2 text-base md:text-lg font-bold text-yellow-600 uppercase tracking-wide text-center break-words">{team2name}</div>
                  {team2Leader && (
                    <div className="text-xs md:text-sm text-yellow-600 font-medium text-center">
                      Leader: {team2Leader}
                    </div>
                  )}
                </div>
                {/* Team 3 */}
                <div className="flex flex-col items-center gap-2 bg-green-50 rounded-2xl p-3 md:p-4 shadow-inner min-h-[120px] md:min-h-[180px] mb-2 md:mb-0">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white border-4 border-green-200 flex items-center justify-center shadow">
                    <img src={team3Logo} alt="Team 3 Logo" className="w-12 h-12 md:w-16 md:h-16 object-contain rounded-full" />
                  </div>
                  <div className="mt-2 text-base md:text-lg font-bold text-green-700 uppercase tracking-wide text-center break-words">{team3name}</div>
                  {team3Leader && (
                    <div className="text-xs md:text-sm text-green-600 font-medium text-center">
                      Leader: {team3Leader}
                    </div>
                  )}
                </div>
              </div>
              {/* Timer below */}
              <div className="relative flex flex-col items-center justify-center z-10 my-2 md:my-0">
                <div className="absolute -top-7 md:-top-8 left-1/2 -translate-x-1/2 w-full flex justify-center">
                  <span className="bg-blue-200 px-3 md:px-6 py-1 md:py-2 rounded-t-xl text-base md:text-lg font-bold text-blue-800 tracking-widest shadow border-b-2 border-blue-400">
                    TIME REMAINING
                  </span>
                </div>
                <div
                  className="relative z-10 font-bold text-4xl md:text-5xl text-white bg-black px-4 md:px-6 py-2 rounded-2xl shadow-2xl border-2 border-blue-400 outline outline-2 outline-yellow-400 font-custom"
                  style={{ letterSpacing: "0.15em", fontVariantNumeric: "tabular-nums", marginTop: "2.2rem" }}
                >
                  {mainTime ? Math.floor(mainTime / 60) : mainTime || "00"}:
                  {mainTime
                    ? (mainTime % 60).toLocaleString("en-US", {
                        minimumIntegerDigits: 2,
                        useGrouping: false,
                      })
                    : mainTime || "00"}
                </div>
                <div className="mt-3 md:mt-4 flex flex-col items-center">
                  <span className="text-green-700 font-bold text-base md:text-lg tracking-wide">ADDITIONAL TIME</span>
                  <div className="font-bold text-xl md:text-2xl text-green-600 bg-white px-3 md:px-4 py-1 rounded-xl shadow border border-green-200 mt-2">
                    {pitTime || "0"}
                  </div>
                  <span className="text-xs text-gray-600 mt-1">SECONDS</span>
                  
                  {/* Pit Closing Countdown */}
                  {mainTime && !pitStatus && getPitClosingTime() !== null && getPitClosingTime()! > 0 && (
                    <div className="mt-3 flex flex-col items-center">
                      <span className="text-orange-600 font-bold text-sm tracking-wide">PIT OPENS IN</span>
                      <div className="font-bold text-lg text-orange-600 bg-orange-50 px-3 py-1 rounded-lg shadow border border-orange-200 mt-1">
                        {Math.floor(getPitClosingTime()! / 60)}:
                        {(getPitClosingTime()! % 60).toLocaleString("en-US", {
                          minimumIntegerDigits: 2,
                          useGrouping: false,
                        })}
                      </div>
                    </div>
                  )}
                  
                  {/* Pit Status Display */}
                  {pitStatus && (
                    <div className="mt-3 flex flex-col items-center">
                      <span className="text-green-600 font-bold text-sm tracking-wide">PIT STATUS</span>
                      <div className="font-bold text-lg text-green-600 bg-green-50 px-3 py-1 rounded-lg shadow border border-green-200 mt-1">
                        OPEN
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              {/* Team 1 */}
              <div className="flex flex-col items-center gap-2 bg-blue-50 rounded-2xl p-3 md:p-4 shadow-inner min-h-[120px] md:min-h-[180px] mb-2 md:mb-0">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white border-4 border-blue-200 flex items-center justify-center shadow">
                  {team1Logo && (
                    <img src={team1Logo} alt="Team 1 Logo" className="w-12 h-12 md:w-16 md:h-16 object-contain rounded-full" />
                  )}
                </div>
                <div className="mt-2 text-base md:text-lg font-bold text-blue-700 uppercase tracking-wide text-center break-words">{team1name}</div>
                {team1Leader && (
                  <div className="text-xs md:text-sm text-blue-600 font-medium text-center">
                    Leader: {team1Leader}
                  </div>
                )}
              </div>
              {/* Timer Card - Overlapping and Centered */}
              <div className="relative flex flex-col items-center justify-center z-10 my-2 md:my-0">
                <div className="absolute -top-7 md:-top-8 left-1/2 -translate-x-1/2 w-full flex justify-center">
                  <span className="bg-blue-200 px-3 md:px-6 py-1 md:py-2 rounded-t-xl text-base md:text-lg font-bold text-blue-800 tracking-widest shadow border-b-2 border-blue-400">
                    TIME REMAINING
                  </span>
                </div>
                <div
                  className="relative z-10 font-bold text-4xl md:text-5xl text-white bg-black px-4 md:px-6 py-2 rounded-2xl shadow-2xl border-2 border-blue-400 outline outline-2 outline-yellow-400 font-custom"
                  style={{ letterSpacing: "0.15em", fontVariantNumeric: "tabular-nums", marginTop: "2.2rem" }}
                >
                  {mainTime ? Math.floor(mainTime / 60) : mainTime || "00"}:
                  {mainTime
                    ? (mainTime % 60).toLocaleString("en-US", {
                        minimumIntegerDigits: 2,
                        useGrouping: false,
                      })
                    : mainTime || "00"}
                </div>
                <div className="mt-3 md:mt-4 flex flex-col items-center">
                  <span className="text-green-700 font-bold text-base md:text-lg tracking-wide">ADDITIONAL TIME</span>
                  <div className="font-bold text-xl md:text-2xl text-green-600 bg-white px-3 md:px-4 py-1 rounded-xl shadow border border-green-200 mt-2">
                    {pitTime || "0"}
                  </div>
                  <span className="text-xs text-gray-600 mt-1">SECONDS</span>
                </div>
              </div>
              {/* Team 2 */}
              <div className="flex flex-col items-center gap-2 bg-yellow-50 rounded-2xl p-3 md:p-4 shadow-inner min-h-[120px] md:min-h-[180px] mb-2 md:mb-0">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white border-4 border-yellow-200 flex items-center justify-center shadow">
                  {team2Logo && (
                    <img src={team2Logo} alt="Team 2 Logo" className="w-12 h-12 md:w-16 md:h-16 object-contain rounded-full" />
                  )}
                </div>
                <div className="mt-2 text-base md:text-lg font-bold text-yellow-600 uppercase tracking-wide text-center break-words">{team2name}</div>
                {team2Leader && (
                  <div className="text-xs md:text-sm text-yellow-600 font-medium text-center">
                    Leader: {team2Leader}
                  </div>
                )}
              </div>
            </div>
          )}
          {/* Buttons */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-6 mt-2">
            <div className="flex flex-col gap-3">
              <button
                className="transition bg-blue-200 hover:bg-blue-400 text-blue-900 font-bold py-2 px-4 rounded-xl shadow w-full"
                onClick={handleStartStop}
              >
                {start ? "Stop" : "Start"} GAME
              </button>
              <button
                className="transition bg-gray-200 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-xl shadow w-full"
                onClick={resetCounters}
              >
                RESET COUNTERS
              </button>
            </div>
            <div className="flex flex-col gap-3 items-center justify-center">
              <div className="text-base md:text-lg font-bold text-blue-700 text-center mb-1 tracking-wider">
                {gameNo !== undefined && gameNo !== null ? `Game ID: ${gameNo}` : ""}
                {gameName ? (
                  <div className="text-sm font-semibold text-gray-600 mt-1">{gameName}</div>
                ) : null}
              </div>
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
                {pit ? "RESET" : "START"} ADDITIONAL COUNTER
              </button>
              <div className={`mt-1 text-sm font-semibold ${pitStatus ? "text-green-600" : "text-red-500"} text-center`}>
                {pitStatus ? "Pit Open" : "Pit Closed"}
              </div>
              
              {/* Enhanced Pit Closing Info */}
              {mainTime && !pitStatus && getPitClosingTime() !== null && getPitClosingTime()! > 0 && (
                <div className="text-xs text-orange-600 text-center font-medium">
                  Opens in {Math.floor(getPitClosingTime()! / 60)}:{(getPitClosingTime()! % 60).toString().padStart(2, '0')}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ControlPanel;
