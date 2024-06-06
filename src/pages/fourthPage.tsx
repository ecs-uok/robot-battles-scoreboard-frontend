import { useEffect, useState } from "react";
import "../styles/scoreboard.css";

//images
import bgImg from "../assets/Images/scoreboard-background.png";

import sampleLogo1 from "../assets/Images/sample-team-logo-1.png";
import sampleLogo2 from "../assets/Images/sample-team-logo-2.png";
import versusImg from "../assets/Images/versus-img.png";

function fourthPage() {
  const [team1Points, setTeam1Points] = useState("");
  const [team2Points, setTeam2Points] = useState("");

  const handleInputChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTeam1Points(event.target.value);
  };
  const handleInputChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTeam2Points(event.target.value);
  };

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

      <div className="text-white text-2xl text-center mt-4"> Add Final Points</div>
      <div className="grid col-span-1 py-16  gap-4 sm:grid-cols-1 md:grid-cols-3 text-white text-center mt-8 py-5 mx-8 rounded-lg ">
        <div className="flex flex-col items-center gap-4">
          <div className="text-4xl  ">TEAM ROBOTS </div>
          <img src={sampleLogo1} className="w-1/3"></img>
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
          <div className="text-4xl ">TEAM MACHINE</div>
          <img src={sampleLogo2} className="w-1/3"></img>
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
        <button className="bg-yellow-300    hover:text-black p-2 rounded-2xl" style={{ width: "200px" }}>Submit</button>
      </div>
    </div>
  );
}

export default fourthPage;
