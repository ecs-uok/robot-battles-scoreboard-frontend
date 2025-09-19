import { useEffect, useState } from "react";
import TitleImg from "../assets/Images/scoreboard-title.png";

const host = import.meta.env.VITE_API_BASE_URL;

function AdminSetupNextBattle() {
  const [teams, setTeams] = useState<{ [id: string]: { leader: string; logo: string; name: string } }>({});
  const [team1id, setTeam1id] = useState<string>("");
  const [team2id, setTeam2id] = useState<string>("");
  const [team3id, setTeam3id] = useState<string>("");
  const [isThreeTeam, setIsThreeTeam] = useState<boolean>(false);
  const [battleTitle, setBattleTitle] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log("API Base URL:", host); // Debug: Check if API URL is set
    console.log("Full teams URL:", host + "/teams"); // Debug: Check full URL
    
    // Fetch teams
    fetch(host + "/teams")
      .then((response) => {
        console.log("Teams response status:", response.status); // Debug: Check response status
        console.log("Teams response:", response); // Debug: Full response object
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((json) => {
        console.log("Teams data received:", json); // Debug: Check what data is received
        console.log("Teams data type:", typeof json); // Debug: Check data type
        console.log("Teams keys:", Object.keys(json)); // Debug: Check keys
        setTeams(json);
        const ids = Object.keys(json);
        console.log("Team IDs:", ids); // Debug: Check team IDs
        if (ids.length > 0) {
          setTeam1id(ids[0]);
          setTeam2id(ids.length > 1 ? ids[1] : ids[0]);
          setTeam3id(ids.length > 2 ? ids[2] : "");
        }
      })
      .catch((error) => {
        console.error("Error fetching teams:", error);
        console.error("Error details:", error.message);
        setMessage("Error fetching teams: " + error.message);
      })
      .finally(() => {
        setLoading(false);
      });
      
    // Fetch current next battle setup if exists
    fetch(host + "/getNextBattle")
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("No next battle configured");
      })
      .then((data) => {
        console.log("Next battle data:", data); // Debug: Check next battle data
        if (data.team1) setTeam1id(data.team1.id || data.team1);
        if (data.team2) setTeam2id(data.team2.id || data.team2);
        if (data.team3) {
          setTeam3id(data.team3.id || data.team3);
          setIsThreeTeam(true);
        }
        if (data.battleTitle) setBattleTitle(data.battleTitle);
      })
      .catch((error) => {
        console.log("No next battle configured or error:", error);
        // If no next battle is set up, use defaults - this is fine
      });
  }, []);

  async function setupNextBattle() {
    // Create payload with full team objects instead of just IDs
    const payload: any = {
      team1: {
        id: team1id,
        name: teams[team1id]?.name,
        logo: teams[team1id]?.logo,
        leader: teams[team1id]?.leader
      },
      team2: {
        id: team2id,
        name: teams[team2id]?.name,
        logo: teams[team2id]?.logo,
        leader: teams[team2id]?.leader
      },
      battleTitle: battleTitle,
    };
    
    if (isThreeTeam && team3id) {
      payload.team3 = {
        id: team3id,
        name: teams[team3id]?.name,
        logo: teams[team3id]?.logo,
        leader: teams[team3id]?.leader
      };
    }
    
    console.log("Sending payload:", payload); // Debug: Check what we're sending
    
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    };
    
    try {
      const response = await fetch(host + "/setNextBattle", requestOptions);
      console.log("Response status:", response.status); // Debug: Check response status
      
      if (response.ok) {
        setMessage("Next battle setup successfully!");
      } else {
        // Get error details from response
        const errorText = await response.text();
        console.log("Error response:", errorText); // Debug: Check error details
        setMessage(`Failed to setup next battle: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error("Network error:", error); // Debug: Check network errors
      setMessage("Error setting up next battle: " + (error instanceof Error ? error.message : String(error)));
    }
  }

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
          <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">Setup Next Battle</h2>
          
          {/* Loading state */}
          {loading && (
            <div className="text-center mb-4 p-3 rounded-lg bg-blue-100 text-blue-700">
              Loading teams...
            </div>
          )}
          
          {/* Debug info */}
          {!loading && Object.keys(teams).length === 0 && (
            <div className="text-center mb-4 p-3 rounded-lg bg-yellow-100 text-yellow-700">
              No teams found. Please check your API connection or add teams first.
            </div>
          )}
          
          {/* Team count info */}
          {!loading && Object.keys(teams).length > 0 && (
            <div className="text-center mb-4 p-2 rounded-lg bg-green-100 text-green-700 text-sm">
              Found {Object.keys(teams).length} teams
            </div>
          )}
          
          {/* Message */}
          {message && (
            <div className={`text-center mb-4 p-3 rounded-lg ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message}
            </div>
          )}
          
          {/* Battle Title Input */}
          <div className="mb-6 flex flex-col items-center">
            <label className="text-lg font-semibold text-gray-700 mb-1">Battle Title</label>
            <input
              type="text"
              className="text-center text-lg rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 p-2 w-64 transition"
              value={battleTitle}
              onChange={e => setBattleTitle(e.target.value)}
              placeholder="Enter battle name (optional)"
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
                disabled={loading || Object.keys(teams).length === 0}
              >
                {Object.keys(teams).length === 0 ? (
                  <option value="">No teams available</option>
                ) : (
                  Object.entries(teams).map(([id, team]) => (
                    <option key={id} value={id}>
                      {team.name}
                    </option>
                  ))
                )}
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
                disabled={loading || Object.keys(teams).length === 0}
              >
                {Object.keys(teams).length === 0 ? (
                  <option value="">No teams available</option>
                ) : (
                  Object.entries(teams).map(([id, team]) => (
                    <option key={id} value={id}>
                      {team.name}
                    </option>
                  ))
                )}
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
                  disabled={loading || Object.keys(teams).length === 0}
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

          <div className="flex flex-col items-center mt-8">
            <button
              className="mt-2 px-8 py-3 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold rounded-xl shadow-lg transition-all duration-200 text-lg tracking-wide uppercase disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={setupNextBattle}
              disabled={loading || Object.keys(teams).length === 0 || !team1id || !team2id}
            >
              Setup Next Battle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminSetupNextBattle;