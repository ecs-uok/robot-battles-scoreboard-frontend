import { useEffect, useState } from "react";
import TitleImg from "../assets/Images/scoreboard-title.png";
import { useNavigate } from "react-router-dom";

const host = import.meta.env.VITE_API_BASE_URL;

function NewGame() {
  const [teams, setTeams] = useState<{ [id: string]: { leader: string; logo: string; name: string } }>({});
  const [team1id, setTeam1id] = useState<string>("");
  const [team2id, setTeam2id] = useState<string>("");
  const [team3id, setTeam3id] = useState<string>("");
  const [isThreeTeam, setIsThreeTeam] = useState<boolean>(false);
  const [gameNo, setGameNo] = useState(1);
  const [gameName, setGameName] = useState<string>("");
  const [totalTime, setTotalTime] = useState(180);
  const [pitOpenTime, setPitOpenTime] = useState(60);
  const [pitTime, setPitTime] = useState(20);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(host + "/teams")
      .then((response) => response.json())
      .then((json) => {
        setTeams(json);
        const ids = Object.keys(json);
        if (ids.length > 0) {
          setTeam1id(ids[0]);
          setTeam2id(ids.length > 1 ? ids[1] : ids[0]);
          setTeam3id(ids.length > 2 ? ids[2] : "");
        }
      });
    fetch(host + "/nextGameId")
      .then((response) => response.json())
      .then((json) => {
        setGameNo(json.gameId);
      });
  }, []);

  async function setGameDetails() {
    const payload: any = {
      gameId: `${gameNo}`,
      gameName: gameName,
      team1: team1id,
      team2: team2id,
    };
    if (isThreeTeam && team3id) {
      payload.team3 = team3id;
    }
    var body = JSON.stringify(payload);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body,
    };
    fetch(host + "/setGameDetails", requestOptions);

    const requestOptions2 = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mainTime: totalTime,
      }),
    };
    fetch(host + "/setMain", requestOptions2);

    const requestOptions3 = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pitTime: pitTime,
      }),
    };
    fetch(host + "/setPit", requestOptions3);

    const requestOptions4 = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pitOpenTime: pitOpenTime,
      }),
    };
    fetch(host + "/setPitOpen", requestOptions4);

    navigate("/Admin/ControlPanel");
  }

  const handleTotalTimeChange = (e: any) => setTotalTime(e.target.value);
  const handlePitOpenTimeChange = (e: any) => setPitOpenTime(e.target.value);
  const handlePitTimeChange = (e: any) => setPitTime(e.target.value);

  return (
    <div className="font-custom flex flex-col items-center justify-start min-h-[calc(100vh-64px)]">
      <div className="w-full flex flex-col items-center mt-5 mb-5">
        <img
          className="text-black h-13 drop-shadow-xl w-11/12 max-w-xs md:max-w-md lg:max-w-lg rounded-[18px] bg-[rgba(255,255,255,0.85)]"
          src={TitleImg}
          alt="uok robot battles scoreboard"
        />
      </div>
      <div className="w-full flex justify-center">
        <div className="bg-white/90 rounded-2xl shadow-2xl p-4 max-w-3xl w-full mx-2 border border-blue-200">
          {/* Game Name Input */}
          <div className="mb-6 flex flex-col items-center">
            <label className="text-lg font-semibold text-gray-700 mb-1">Game Name</label>
            <input
              type="text"
              className="text-center text-lg rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 p-2 w-64 transition"
              value={gameName}
              onChange={e => setGameName(e.target.value)}
              placeholder="Enter game name (optional)"
              maxLength={50}
            />
          </div>
          {/* Match Type Toggle */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <button
              className={`px-4 py-2 rounded-lg font-bold shadow border ${!isThreeTeam ? "bg-blue-600 text-white border-blue-700" : "bg-gray-100 text-gray-700 border-gray-300"}`}
              onClick={() => setIsThreeTeam(false)}
            >
              2 Teams
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-bold shadow border ${isThreeTeam ? "bg-blue-600 text-white border-blue-700" : "bg-gray-100 text-gray-700 border-gray-300"}`}
              onClick={() => setIsThreeTeam(true)}
            >
              3 Teams
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Team A */}
            <div className="flex flex-col items-center">
              <div className="text-xl font-bold mb-2 px-6 py-2 rounded-lg bg-blue-700 text-white shadow">
                TEAM A
              </div>
              <select
                className="w-full mt-2 mb-4 p-2 rounded-lg border-2 border-blue-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition"
                value={team1id}
                onChange={(e) => setTeam1id(e.target.value)}
              >
                {Object.entries(teams).map(([id, team]) => (
                  <option key={id} value={id}>
                    {team.name}
                  </option>
                ))}
              </select>
              {team1id && teams[team1id] && (
                <div className="flex flex-col items-center">
                  <img src={teams[team1id].logo} alt="logo" className="w-20 h-20 rounded-full border-4 border-blue-200 shadow mb-2 bg-white object-contain" />
                  <div className="text-gray-700 text-sm font-semibold">Leader: <span className="text-blue-700">{teams[team1id].leader}</span></div>
                </div>
              )}
            </div>
            {/* Team B */}
            <div className="flex flex-col items-center">
              <div className="text-xl font-bold mb-2 px-6 py-2 rounded-lg bg-yellow-400 text-gray-900 shadow">
                TEAM B
              </div>
              <select
                className="w-full mt-2 mb-4 p-2 rounded-lg border-2 border-yellow-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition"
                value={team2id}
                onChange={(e) => setTeam2id(e.target.value)}
              >
                {Object.entries(teams).map(([id, team]) => (
                  <option key={id} value={id}>
                    {team.name}
                  </option>
                ))}
              </select>
              {team2id && teams[team2id] && (
                <div className="flex flex-col items-center">
                  <img src={teams[team2id].logo} alt="logo" className="w-20 h-20 rounded-full border-4 border-yellow-200 shadow mb-2 bg-white object-contain" />
                  <div className="text-gray-700 text-sm font-semibold">Leader: <span className="text-yellow-600">{teams[team2id].leader}</span></div>
                </div>
              )}
            </div>
          </div>

          {/* Team C - visible only for 3-team matches */}
          {isThreeTeam && (
            <div className="grid grid-cols-1 gap-8 mt-4">
              <div className="flex flex-col items-center">
                <div className="text-xl font-bold mb-2 px-6 py-2 rounded-lg bg-green-500 text-gray-900 shadow">
                  TEAM C
                </div>
                <select
                  className="w-full mt-2 mb-4 p-2 rounded-lg border-2 border-green-300 focus:border-green-600 focus:ring-2 focus:ring-green-200 transition"
                  value={team3id}
                  onChange={(e) => setTeam3id(e.target.value)}
                >
                  <option value="">Select team</option>
                  {Object.entries(teams).map(([id, team]) => (
                    <option key={id} value={id}>
                      {team.name}
                    </option>
                  ))}
                </select>
                {team3id && teams[team3id] && (
                  <div className="flex flex-col items-center">
                    <img src={teams[team3id].logo} alt="logo" className="w-20 h-20 rounded-full border-4 border-green-200 shadow mb-2 bg-white object-contain" />
                    <div className="text-gray-700 text-sm font-semibold">Leader: <span className="text-green-700">{teams[team3id].leader}</span></div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            <div className="flex flex-col items-center">
              <label className="text-lg font-semibold text-blue-900 mb-1">Total time</label>
              <input
                type="number"
                className="text-center text-lg rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 p-2 w-24 transition"
                value={totalTime}
                onChange={handleTotalTimeChange}
                min={0}
              />
              <span className="text-gray-500 mt-1">seconds</span>
            </div>
            <div className="flex flex-col items-center">
              <label className="text-lg font-semibold text-yellow-700 mb-1">Pit opens at</label>
              <input
                type="number"
                className="text-center text-lg rounded-lg border-2 border-yellow-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100 p-2 w-24 transition"
                value={pitOpenTime}
                onChange={handlePitOpenTimeChange}
                min={0}
              />
              <span className="text-gray-500 mt-1">seconds</span>
            </div>
            <div className="flex flex-col items-center">
              <label className="text-lg font-semibold text-green-700 mb-1">Additional Time</label>
              <input
                type="number"
                className="text-center text-lg rounded-lg border-2 border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 p-2 w-24 transition"
                value={pitTime}
                onChange={handlePitTimeChange}
                min={0}
              />
              <span className="text-gray-500 mt-1">seconds</span>
            </div>
          </div>

          <div className="flex flex-col items-center mt-8">
            <div className="text-xl font-bold text-gray-700 mb-2">
              Game No <span className="text-blue-700">{gameNo}</span>
            </div>
            <button
              className="mt-2 px-8 py-3 bg-gradient-to-r from-yellow-300 to-yellow-500 hover:from-yellow-400 hover:to-yellow-600 text-black font-bold rounded-xl shadow-lg transition-all duration-200 text-lg tracking-wide uppercase"
              onClick={setGameDetails}
            >
              Create Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewGame;