import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "../styles/scoreboard.css";
import FireWorks from "../components/FireWorks";
import LogoSlider from "../components/LogoSlider";
import { Link } from "react-router-dom";
import { useRef } from "react";

//images
import TitleImg from "../assets/Images/scoreboard-title.png";
import bgImg from "../assets/Images/scoreboard-background.png";
import versusImg from "../assets/Images/versus-img.png";

import tronicLK from "../assets/Images/tronic-lk.png";
import microRewordsLogo from "../assets/Images/MicroRewards_teal.png";
import IEEELogo from "../assets/Images/IEEE logo.png";
import icapsLogo from "../assets/Images/ICAPS_logo_with_UoK_logo_2024.png";
import ecscLogo from "../assets/Images/ECSC_transparent.png";
import gavelLogo from "../assets/Images/gavel.png";
import XydderLogo from "../assets/Images/Xydder 3D Logo.png";
import codeChefLogo from "../assets/Images/Codechefs.png";
import hackSL from "../assets/Images/HackSL.png";
import NeoLogo from "../assets/Images/NEO Logo.png";
import IEEStudentsLogo from "../assets/Images/IEEE_Student_Branch_University_of_Kelaniya_Logo_00629B.png";

// **
// TODO: add a smoke effect to the background
// ! if their is no connection with the timer, the page will not load
// **

interface DialogProps {
  isOpen: boolean;
  title: string;
  winnerData: {name: string, logo: string};
}

const Dialog: React.FC<DialogProps> = ({ isOpen, title, winnerData }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 " >
      <FireWorks fire={winnerData!=null?true:false} />
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <div className="flex justify-center items-center mb-4">
          <h3 className="text-4xl font-semibold text-black">{title}</h3>
        </div>
        <>
          <div className="flex flex-col" >
            <div>
              <img
                data-aos="zoom-out-up"
                data-aos-delay="1500"
                data-aos-duration="500"
                src={winnerData.logo}
                className="w-2/5 md:w-4/5 mx-auto rounded-md"
                // style={{ paddingRight: "10px", backgroundColor: "#0DECC4" }}
              />
            </div>
            <div className="mt-5 flex justify-center text-2xl text-red-500" >
              {winnerData.name}
            </div>
          </div>
        </>
      </div>
    </div>
  );
};

function firstPage() {
  var team1Id: number;
  var team2Id: number;
  var winnerId: number | string;

  const [mainTime, setMainTime] = useState();
  const [pitTime, setPitTime] = useState();

  const [team1name, setTeam1Name] = useState();
  const [team2name, setTeam2Name] = useState();

  const [team1Leader, setTeam1Leader] = useState();
  const [team2Leader, setTeam2Leader] = useState();

  const [team1Logo, setTeam1Logo] = useState();
  const [team2Logo, setTeam2Logo] = useState();
  const [winnerData, setWinnerData] = useState<{name: string; logo: string;} | null>(null);
  const [winnerIds, setWinnerIds] = useState<{winner_id?: any, team1_id?: any, team2_id?: any}>({});

  const logos = [
    ecscLogo,
    hackSL,
    icapsLogo,
    codeChefLogo,
    tronicLK,
    NeoLogo,
    IEEELogo,
    microRewordsLogo,
    gavelLogo,
    IEEStudentsLogo,
    XydderLogo,
  ];

  async function setTeamInfo() {
    fetch(
      "http://localhost:5000/getGameDetails"
    )
      .then((response) => response.json())
      .then((data) => {
        setTeam1Name(data.team1.name);
        setTeam2Name(data.team2.name);
        setTeam1Logo(data.team1.logo);
        setTeam2Logo(data.team2.logo);
        setTeam1Leader(data.team1.leader);
        setTeam2Leader(data.team2.leader);
      });
  }

  useEffect(() => {
    AOS.init({ once: true });
    const eventSource = new EventSource(
      "http://localhost:5000/timer"
    );
    if (typeof eventSource != undefined) {
      console.log("Connection with timer successful");
      let oldVal = -1;
      eventSource.onmessage = (event) => {
        const eventData = JSON.parse(event.data);
        setMainTime(eventData.mainTime);
        setPitTime(eventData.pitTime);

        if (
          oldVal != eventData.gameId ||
          team1Id != eventData.team1Id ||
          team2Id != eventData.team2Id || 
          winnerId != eventData.winnerId
        ) {
          oldVal = eventData.gameId;
          team1Id = eventData.team1Id;
          team2Id = eventData.team2Id;
          winnerId = eventData.winnerId;
          setTeamInfo();
          setWinnerIds({
            team1_id: eventData.team1Id,
            team2_id: eventData.team2Id,
            winner_id: eventData.winnerId
          });
        }
      };
    } else {
      console.log("Coudn't connect to timer");
    }
    return () => eventSource.close();
  }, []);

  // This effect will update winnerData when all info is available
  useEffect(() => {
    const { winner_id, team1_id, team2_id } = winnerIds;
    if (winner_id && team1_id && team2_id) {
      if (winner_id == team1_id) {
        setWinnerData({
          name: team1name ?? "",
          logo: team1Logo ?? ""
        });
      } else if (winner_id == team2_id) {
        setWinnerData({
          name: team2name ?? "",
          logo: team2Logo ?? ""
        });
      } else {
        setWinnerData(null);
      }
    }
  }, [winnerIds, team1name, team2name, team1Logo, team2Logo]);

  return (
    <div
      className="font-custom overflow-hidden w-full"
      style={{
        backgroundImage: `url(${bgImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <Dialog 
        isOpen={winnerData!=null?true:false} 
        title="Winner" 
        winnerData={winnerData ?? { name: "", logo: "" }}
      />        
      <div className="text-2xl  mx-auto    w-full">
        <img
          className="text-black  lg:px-8 h-13 pt-1"
          src={TitleImg}
          alt="uok robot battles scoreboard"
          style={{ maxWidth: "72%", margin: "0 auto" }}
        />
      </div>
      {team1Logo && team2Logo && (
        <div>
          <div className="hidden md:inline-grid mt-2 mx-8 md:mb-6 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-12  text-right  md:pt-4  ">
            <div
              data-aos="fade-right"
              data-aos-delay="500"
              data-aos-duration="1000"
              style={{
                backgroundImage: `url(${team1Logo})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundColor: "#0DECC4",
              }}
              className=" md:col-span-3 lg:col-span-5 rounded-l-2xl text-2xl md:text-4xl text-red-600 pt-3 "
            >
              <span style={{ color: "#FFF338" }}>TEAM</span>
              <br /> {team1name}
            </div>

            <div className="md:col-span-3 lg:col-span-2 ">
              <img
                data-aos="fade-up"
                data-aos-delay="1000"
                data-aos-duration="500"
                src={versusImg}
                alt="robot 1 vs robot 2"
                className="w-1/6 sm:w-1/3 mx-auto"
              />
            </div>
            <div
              data-aos="fade-left"
              data-aos-delay="500"
              data-aos-duration="1000"
              style={{
                backgroundImage: `url(${team2Logo})`,
                backgroundSize: "cover",
                backgroundPosition: "center ",
                backgroundColor: "#001AFF",
              }}
              className="md:col-span-3 lg:col-span-5  rounded-r-2xl text-left text-2xl md:text-4xl text-red-600 pt-3"
            >
              <span style={{ color: "#FFF338" }}>TEAM</span>
              <br />
              {team2name}
            </div>
          </div>
          <div
            data-aos="zoom-in-up"
            data-aos-delay="1500"
            data-aos-duration="500"
            className="md:hidden mt-8 flex flex-row items-center justify-center text-2xl text-red-500"
          >
            {"TEAM " + team1name}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-12 md:pt-5  md:my-1 mx-8 ">
            <div className="md:col-span-3 lg:col-span-3  flex items-center justify-center md:flex-col flex-row  ">
              {/* <div className="w-1 h-full bg-white"></div> */}
              <img
                data-aos="zoom-out-up"
                data-aos-delay="1500"
                data-aos-duration="500"
                src={team1Logo}
                className="w-2/5 md:w-4/5 mx-auto"
                style={{ paddingRight: "10px", backgroundColor: "#0DECC4" }}
              />
              <div className=" hidden md:block md:flex md:flex-col items-center justify-center ">
                <div className=" text-xl text-left text-white pt-3">LEADER</div>
                <div
                  className="text-xl text-left "
                  style={{ color: "#FFF338" }}
                >
                  {team1Leader}
                  <hr className=" md:border-2  border-white my-5 md:hidden" />
                </div>
              </div>
              <div className="md:hidden flex flex-col items-center justify-center text-center">
                <div className="  text-xl   text-white pt-3">LEADER</div>
                <div className="text-xl   " style={{ color: "#FFF338" }}>
                  {team1Leader}
                  <hr className=" md:border-2  border-white my-5 md:hidden" />
                </div>
              </div>
            </div>

            <div className="border-2 border-white rounded-xl md:border-none md:col-span-3 lg:col-span-6 py-4 md:py-0">
              <div className="text-3xl text-center text-white">
                TIME REMAINING
              </div>
              <div className="text-8xl text-center text-white">
                {mainTime ? Math.floor(mainTime / 60) : mainTime || "00"}:
                {mainTime
                  ? (mainTime % 60).toLocaleString("en-US", {
                      minimumIntegerDigits: 2,
                      useGrouping: false,
                    })
                  : mainTime || "00"}
              </div>
              <hr className="hidden md:border-2  md:border-white my-5" />
              <div className="mt-4 md-mt-0 text-2xl text-center text-white">
                ADDITIONAL TIME
              </div>
              <div className="text-6xl text-center text-green-400">
                {pitTime || "0"}
              </div>
              <div className="text-xl  text-center text-white">SECONDS</div>
            </div>
            <div
              data-aos="zoom-in-up"
              data-aos-delay="1500"
              data-aos-duration="500"
              className="md:hidden  flex flex-row items-center justify-center text-2xl text-red-500"
            >
              {"TEAM " + team2name}
            </div>

            <div className="md:col-span-3 lg:col-span-3  flex items-center justify-center md:flex-col-reverse flex-row  ">
              <div className="for-position-change-purpose">
                <div className=" hidden md:block  md:flex md:flex-col items-center justify-center ">
                  <div className=" text-xl text-left text-white pt-3">
                    LEADER
                  </div>
                  <div
                    className="text-xl text-left "
                    style={{ color: "#FFF338" }}
                  >
                    {team2Leader}
                    <hr className=" md:border-2  border-white my-5 md:hidden" />
                  </div>
                </div>
                <div className="md:hidden  flex flex-col items-center text-center justify-center">
                  <div className=" text-xl  text-white pt-3">LEADER</div>
                  <div
                    className="text-lg md:text-xl "
                    style={{ color: "#FFF338" }}
                  >
                    {team2Leader}
                    <hr className=" md:border-2  border-white my-5 md:hidden " />
                  </div>
                </div>
              </div>
              <img
                data-aos="zoom-out-up"
                data-aos-delay="1500"
                data-aos-duration="500"
                src={team2Logo}
                className="w-2/5 md:w-4/5 mx-auto"
                style={{ paddingLeft: "10px", backgroundColor: "#001AFF" }}
              />
            </div>
          </div>
        </div>
      )}
      <div className="container mt-10 m-auto flex justify-center">
        <Link
          to={"/bracket"}
          className="py-5 px-20 w-[60%] text-2xl bg-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,1)] flex justify-center items-center text-center rounded-xl" >
          Brackets
        </Link>
      </div>
      <div className="container mt-10">
        <LogoSlider logos={logos} />
      </div>
      
    </div>
  );
}

export default firstPage;
