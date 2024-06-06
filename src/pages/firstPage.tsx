import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "../styles/scoreboard.css";

//images
import TitleImg from "../assets/Images/scoreboard-title.png";
import bgImg from "../assets/Images/scoreboard-background.png";
import versusImg from "../assets/Images/versus-img.png";
import team1Img from "../assets/Images/sample-team-logo-1.png";
import team2Img from "../assets/Images/sample-team-logo-2.png";

// **
// TODO: add a smoke effect to the background
// **

function firstPage() {
  const [mainTime, setMainTime] = useState();
  const [pitTime, setPitTime] = useState();

  useEffect(() => {
    AOS.init();
    const eventSource = new EventSource(
      "https://robot-battles-scoreboard-backend.onrender.com/timer"
    );
    if (typeof eventSource != undefined) {
      console.log("Connection with timer successful");
      eventSource.onmessage = (event) => {
        const eventData = JSON.parse(event.data);
        console.log(eventData);
        setMainTime(eventData.mainTime);
        setPitTime(eventData.pitTime);
      };
    } else {
      console.log("Coudn't connect to timer");
    }
    return () => eventSource.close();
  }, []);

  return (
    <div
      className="font-custom overflow-hidden"
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
          data-aos="fade-right"
          data-aos-delay="500"
          data-aos-duration="1000"
          style={{
            backgroundImage: `url(${team1Img})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          className="md:col-span-3 lg:col-span-5 rounded-l-2xl text-4xl text-red-600 pt-3 "
        >
          <span style={{ color: "#FFF338" }}>TEAM</span>
          <br /> MACHINE
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
            backgroundImage: `url(${team2Img})`,
            backgroundSize: "cover",
            backgroundPosition: "center ",
          }}
          className="md:col-span-3 lg:col-span-5  rounded-r-2xl text-left text-4xl text-red-600 pt-3"
        >
          <span style={{ color: "#FFF338" }}>TEAM</span>
          <br />
          ROBOTS
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-12 pt-5 mx-8  ">
        <div className="md:col-span-3 lg:col-span-3  ">
          {/* <div className="w-1 h-full bg-white"></div> */}
          <img
            data-aos="zoom-out-up"
            data-aos-delay="1500"
            data-aos-duration="500"
            src={team1Img}
            className="w-4/5 mx-auto"
            style={{ paddingRight: "10px", backgroundColor: "#0DECC4" }}
          />
          <div className="text-xl text-left text-white pt-3">LEADER</div>
          <div
            className="text-xl text-left text-white"
            style={{ color: "#FFF338" }}
          >
            YASIRU WEDITHUWAKKU
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
          <img
            data-aos="zoom-out-up"
            data-aos-delay="1500"
            data-aos-duration="500"
            src={team2Img}
            className="w-4/5 mx-auto"
            style={{ paddingLeft: "10px", backgroundColor: "#001AFF" }}
          />
          <div className="text-xl text-right text-white pt-3">LEADER</div>
          <div
            className="text-xl text-right text-white"
            style={{ color: "#FFF338" }}
          >
            DIMUTHU LAKMAL
          </div>
        </div>
      </div>

      <div className="  mx-auto mt-4  text-lg  bg-gray-900 text-white text-center w-full">
        <h3>LIVE ON</h3>
        <h3>SATURDAY JUNE 13RD</h3>
      </div>
    </div>
  );
}

export default firstPage;
