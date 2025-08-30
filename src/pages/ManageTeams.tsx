import { useState, useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function ManageTeam() {
  const [teamName, setTeamName] = useState("");
  const [leader, setLeader] = useState("");
  const [logo, setLogo] = useState("");
  const [message, setMessage] = useState("");
  const [teams, setTeams] = useState<{ [id: string]: { name: string; leader: string; logo: string; points: number } }>({});
  const [editId, setEditId] = useState<string | null>(null);
  const [editTeam, setEditTeam] = useState<{ name: string; leader: string; logo: string; points: number }>({
    name: "",
    leader: "",
    logo: "",
    points: 0,
  });
  const [autoTeamId, setAutoTeamId] = useState(""); // for auto-generated team id
  const [uploading, setUploading] = useState(false);
  // Add a new state for edit logo uploading
  const [editUploading, setEditUploading] = useState(false);

  // Fetch all teams
  async function fetchTeams() {
    try {
      const res = await fetch(`${API_BASE_URL}/teams`);
      const data = await res.json();
      setTeams(data);

      // Generate next team id: L01, L02, ..., L99
      const ids = Object.keys(data)
        .map((id) => {
          const match = /^L(\d{2})$/.exec(id);
          return match ? parseInt(match[1], 10) : null;
        })
        .filter((n) => n !== null) as number[];
      let nextNum = 1;
      while (ids.includes(nextNum) && nextNum <= 99) nextNum++;
      setAutoTeamId(`L${nextNum.toString().padStart(2, "0")}`);
    } catch (e) {
      setTeams({});
      setAutoTeamId("L01");
    }
  }

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    const team = {
      id: autoTeamId,
      name: teamName,
      leader,
      logo,
      points: 0, // Always set points to zero for new team
    };
    try {
      await fetch(`${API_BASE_URL}/addTeam`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(team),
      });
      setMessage("Team added successfully");
      setTeamName("");
      setLeader("");
      setLogo("");
      fetchTeams(); // Refresh team list and autoTeamId
    } catch (err) {
      setMessage("Failed to add team");
    }
  };

  // Edit handlers
  const handleEditClick = (id: string, team: { name: string; leader: string; logo: string; points: number }) => {
    setEditId(id);
    setEditTeam({ ...team });
  };

  const handleEditChange = (field: keyof typeof editTeam, value: string) => {
    setEditTeam((prev) => ({
      ...prev,
      [field]: field === "points" ? Number(value) : value,
    }));
  };

  const handleEditSave = async (id: string) => {
    try {
      await fetch(`${API_BASE_URL}/addTeam`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...editTeam }),
      });
      // Always show "Team data changed successfully" after edit
      setMessage("Team data changed successfully");
      setEditId(null);
      fetchTeams();
    } catch (err) {
      setMessage("Failed to update team");
    }
  };

  const handleEditCancel = () => {
    setEditId(null);
  };

  // Delete handler
  const handleDeleteTeam = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this team?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/deleteTeam/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      setMessage(data.message);
      fetchTeams();
    } catch (err) {
      setMessage("Failed to delete team");
    }
  };

  // Freeimage.host upload handler (via Node.js proxy)
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("logo", file);

      // Use your backend proxy endpoint
      const res = await fetch(`${API_BASE_URL}/api/upload-logo`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        setMessage("Failed to upload logo. Network error: " + res.status + " " + res.statusText);
        setUploading(false);
        return;
      }
      const data = await res.json();
      if (data && data.status_code === 200 && data.image) {
        const url = data.image.url || data.image.url_display;
        if (url) {
          setLogo(url);
          setMessage("Logo uploaded successfully!");
        } else {
          setMessage("Upload succeeded but no URL returned.");
        }
      } else {
        setMessage("Failed to upload logo. " + (data && data.error ? JSON.stringify(data.error) : ""));
      }
    } catch (err: any) {
      setMessage("Error uploading logo: " + (err?.message || String(err)));
    }
    setUploading(false);
  };

  // Handler for uploading a new logo in edit mode
  const handleEditLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditUploading(true);
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("logo", file);

      const res = await fetch(`${API_BASE_URL}/api/upload-logo`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        setMessage("Failed to upload logo. Network error: " + res.status + " " + res.statusText);
        setEditUploading(false);
        return;
      }
      const data = await res.json();
      if (data && data.status_code === 200 && data.image) {
        const url = data.image.url || data.image.url_display;
        if (url) {
          setEditTeam(prev => ({ ...prev, logo: url }));
          setMessage("Logo uploaded successfully!");
        } else {
          setMessage("Upload succeeded but no URL returned.");
        }
      } else {
        setMessage("Failed to upload logo. " + (data && data.error ? JSON.stringify(data.error) : ""));
      }
    } catch (err: any) {
      setMessage("Error uploading logo: " + (err?.message || String(err)));
    }
    setEditUploading(false);
  };

  return (
    <div className="font-custom flex flex-col items-center justify-start min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 via-white to-yellow-50">
      
      <div className="w-full flex flex-col items-center mt-5 mb-2">
        <div className="text-3xl font-bold text-blue-700 mb-4">Manage Team</div>
      </div>
      <div className="w-full flex flex-col md:flex-row justify-center items-start gap-8 px-2">
        {/* Add Team Form - Left */}
        <div className="w-full md:w-1/2 flex justify-center">
          <form
            className="bg-white/95 rounded-3xl shadow-2xl p-8 max-w-md w-full border border-blue-200 flex flex-col gap-6"
            onSubmit={handleSubmit}
          >
            <div>
              <label className="block font-semibold mb-1 text-blue-900">Team ID</label>
              <input
                type="text"
                className="w-full p-2 rounded-lg border-2 border-blue-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                value={autoTeamId}
                disabled
                readOnly
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-blue-900">Team Name</label>
              <input
                type="text"
                className="w-full p-2 rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-blue-900">Leader</label>
              <input
                type="text"
                className="w-full p-2 rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                value={leader}
                onChange={(e) => setLeader(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-blue-900">Team Logo</label>
              <input
                type="file"
                accept="image/*"
                className="w-full p-2 rounded-lg border-2 border-blue-200 bg-gray-100"
                onChange={handleLogoUpload}
                disabled={uploading}
              />
              {uploading && <div className="text-blue-500 text-xs mt-1">Uploading...</div>}
              {logo && (
                <div className="mt-2 flex flex-col items-center">
                  <img src={logo} alt="Logo Preview" className="w-16 h-16 rounded-full border-2 border-blue-200 object-contain bg-white" />
                  <span className="text-xs text-gray-400 break-all">{logo}</span>
                </div>
              )}
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-400 to-blue-700 text-white font-bold py-2 rounded-xl shadow hover:scale-105 transition"
              disabled={uploading}
            >
              Add Team
            </button>
            {message && (
              <div className={`text-center font-semibold mt-2 ${message.includes("success") || message.includes("changed") ? "text-green-600" : "text-red-600"}`}>
                {message}
              </div>
            )}
          </form>
        </div>
        {/* Show all teams - Right */}
        <div className="w-full md:w-1/2 flex flex-col items-center mt-8 mb-10 md:mt-0">
          <div className="text-2xl font-bold text-blue-700 mb-4">All Teams</div>
          <div className="w-full flex flex-wrap justify-center gap-4">
            {Object.entries(teams).map(([id, team]) => (
              <div
                key={id}
                className="bg-white rounded-xl shadow p-2 flex flex-col items-center border border-blue-100"
                style={{
                  minHeight: "180px",
                  width: "180px",
                  maxWidth: "180px",
                  margin: "0",
                  flex: "0 1 180px",
                }}
              >
                {editId === id ? (
                  <>
                    <input
                      type="text"
                      className="w-full mb-1 text-center text-base font-bold text-blue-700 uppercase border-b border-blue-200"
                      value={editTeam.name}
                      onChange={e => handleEditChange("name", e.target.value)}
                    />
                    <img src={editTeam.logo} alt={editTeam.name} className="w-16 h-16 rounded-full border-2 border-blue-200 mb-2 object-contain bg-white" />
                    {/* New: Upload new logo in edit mode */}
                    <input
                      type="file"
                      accept="image/*"
                      className="w-full mb-1 p-1 rounded-lg border border-blue-200 text-xs file:text-xs"
                      onChange={handleEditLogoUpload}
                      disabled={editUploading}
                      style={{ fontSize: "0.75rem" }}
                    />
                    {editUploading && <div className="text-blue-500 text-xs mb-1">Uploading...</div>}
                    <input
                      type="text"
                      className="w-full mb-1 text-xs font-bold text-gray-800 text-center border-b border-blue-100"
                      value={editTeam.logo}
                      onChange={e => handleEditChange("logo", e.target.value)}
                      placeholder="Logo URL"
                    />
                    <input
                      type="text"
                      className="w-full mb-1 text-xs font-bold text-gray-800 text-center border-b border-blue-100"
                      value={editTeam.leader}
                      onChange={e => handleEditChange("leader", e.target.value)}
                      placeholder="Leader"
                    />
                    <input
                      type="number"
                      className="w-full mb-1 text-xs font-bold text-gray-800 text-center border-b border-blue-100"
                      value={editTeam.points}
                      onChange={e => handleEditChange("points", e.target.value)}
                      min={0}
                      placeholder="Points"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold hover:bg-blue-700"
                        onClick={() => handleEditSave(id)}
                        type="button"
                        disabled={editUploading}
                      >
                        Save
                      </button>
                      <button
                        className="bg-gray-300 text-gray-800 px-2 py-1 rounded text-xs font-bold hover:bg-gray-400"
                        onClick={handleEditCancel}
                        type="button"
                        disabled={editUploading}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <img src={team.logo} alt={team.name} className="w-16 h-16 rounded-full border-2 border-blue-200 mb-2 object-contain bg-white" />
                    <div className="text-base font-bold text-blue-700 uppercase">{team.name}</div>
                    <div className="text-xs font-bold text-gray-800 mt-1">ID: <span className="font-semibold">{id}</span></div>
                    <div className="text-xs font-bold text-gray-800">LEADER: <span className="font-semibold">{team.leader}</span></div>
                    <div className="text-xs font-bold text-gray-800">POINTS: <span className="font-semibold">{team.points}</span></div>
                    <div className="flex gap-2 mt-2">
                      <button
                        className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold px-3 py-1 rounded text-xs"
                        onClick={() => handleEditClick(id, team)}
                        type="button"
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white font-bold px-3 py-1 rounded text-xs"
                        onClick={() => handleDeleteTeam(id)}
                        type="button"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageTeam;