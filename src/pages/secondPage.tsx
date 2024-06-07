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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2  mx-8 my-4 text-center ">
        <div className="md:col-span-1 lg:col-span-1 flex mx-8 flex-col text-black">
          <div
            className="text-2xl rounded-xl  p-2 text-black"
            style={{ backgroundColor: "#001AFF" }}
          >
            TEAM A :
          </div>
          <input
            type="text"
            placeholder="Enter team number.."
            className="mt-4 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {/* <input
            type="text"
            placeholder="Enter team name.."
            className="mt-4 px-4 py-2  rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="text"
            placeholder="Enter team leader name.."
            className="mt-4 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          /> */}
        </div>
        <div className="md:col-span-1 lg:col-span-1 ">
          <div className="md:col-span-1 lg:col-span-1 flex mx-8 flex-col text-black">
            <div
              className="text-2xl rounded-xl  p-2 text-black"
              style={{ backgroundColor: "#FFF338" }}
            >
              TEAM B :
            </div>
            <input
              type="text"
              placeholder="Enter team number.."
              className="mt-4 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {/* <input
              type="text"
              placeholder="Enter team name.."
              className="mt-4 px-4 py-2  rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Enter team leader name.."
              className="mt-4 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            /> */}
          </div>
        </div>
      </div>

      <div className="text-center text-white text-2xl mt-10">Game No: 00</div>
      <div className="flex flex-row justify-center my-5">
        <button className="bg-yellow-300 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-lg  ">
          CREATE GAME
        </button>
      </div>
    </div>
  );
}

export default SecondPage;
