import React from "react";
import bgImg from "../assets/Images/scoreboard-background.png";
import TitleImg from "../assets/Images/scoreboard-title.png";

function SecondPage() {
  return (
    <div
      className="font-custom"
      style={{
        backgroundImage: ` url(${bgImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <div className="w-full mx-auto text-2xl">
        <img
          className="pt-3 text-black lg:px-8 h-13"
          src={TitleImg}
          alt="uok robot battles scoreboard"
          style={{ maxWidth: "80%", margin: "0 auto" }}
        />
      </div>

      <div className="mt-10 ml-8 text-white align-left">
        
        <div className="justify-flex">
        <h1 >TEAM A</h1>
        <h3 className="bg-[#001AFF] mt-3">NUMBER</h3>
        <h3 className="bg-[#001AFF] mt-3">NAME</h3>
        <h3 className="bg-[#001AFF] mt-3">LEADER</h3>
        <h3 className="bg-[#001AFF] mt-3">LOGO</h3>
        </div>
      </div>






    </div>
  );
}

export default SecondPage;