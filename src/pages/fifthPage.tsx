import "../styles/scoreboard.css";

//images
import TitleImg from "../assets/Images/scoreboard-title.png";
import bgImg from "../assets/Images/scoreboard-background.png";

import sampleLogo1 from "../assets/Images/sample-team-logo-1.png";
import sampleLogo2 from "../assets/Images/sample-team-logo-2.png";

function fifthPage() {
  var gamesList: string[] = [];
  console.log("fetching teams..");
  gamesList.length = 0;
  fetch("https://robot-battles-scoreboard-backend.onrender.com/games")
    .then((response) => response.json())
    .then((json) => {
      for (let i = 0; i < json.length; i++) {
        let obj = json[i];
        if (obj) gamesList.push(i + " " + obj.name);
      }
    });
  console.log(gamesList);

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

      <div className="  gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-3 bg-gray-300 text-center mt-8 py-5 mx-8 rounded-lg ">
          <div className="col-span-1 flex flex-row justify-items-center items-center ">
            <img src={sampleLogo1} className="w-1/3 mx-auto" />
            <div className="text-2xl ">Team ROBOTS</div>
          </div>
          <div className="col-span-1">
            <div className="text-xl text-center">Match No: 2 </div>
            <div className="flex flex-row justify-center items-center">
              <div className="text-6xl ">2 : </div>
              <div className="text-6xl "> 1</div>
            </div>
            <div className="text-xl ">Winner</div>
            <div className="text-2xl text-center text-red-500">TEAM ROBOTS</div>
          </div>
          <div className="col-span-1 flex flex-row justify-items-center items-center">
            <div className="text-2xl ">Team MACHINE</div>
            <img src={sampleLogo2} className="w-1/3 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default fifthPage;
