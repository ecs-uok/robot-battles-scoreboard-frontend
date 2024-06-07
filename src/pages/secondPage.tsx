import React from "react";
import { useEffect, useState } from "react";
import bgImg from "../assets/Images/scoreboard-background.png";
import TitleImg from "../assets/Images/scoreboard-title.png";

var teamList: string[] = [];
async function getTeamList() {
  console.log("fetching teams..");
  teamList.length = 0;
  await fetch("https://robot-battles-scoreboard-backend.onrender.com/teams")
    .then((response) => response.json())
    .then((json) => {
      for (let i = 0; i < json.length; i++) {
        let obj = json[i];
        if (obj) teamList.push(i + " " + obj.name);
      }
    });
  var select1 = document.getElementById("teamA");
  var select2 = document.getElementById("teamB");
  select1!.innerHTML = "";
  select2!.innerHTML = "";
  for (var i = 0; i < teamList.length; i++) {
    var opt = teamList[i];
    var el1 = document.createElement("option");
    var el2 = document.createElement("option");
    el1.textContent = opt;
    el1.value = "" + (i + 1);
    el2.textContent = opt;
    el2.value = "" + (i + 1);
    select1 ? select1.appendChild(el1) : select1;
    select2 ? select2.appendChild(el2) : select2;
  }
}

var isSelectPopulated = false;
function SecondPage() {
  isSelectPopulated ? "" : getTeamList();
  isSelectPopulated = true;
  const [gameNo, setGameNo] = useState(1);
  const [team1id, setTeam1id] = useState("0");
  const [team2id, setTeam2id] = useState("0");
  var totalTime = 180;
  var pitOpenTime = 60;
  var pitTime = 20;
  fetch("https://robot-battles-scoreboard-backend.onrender.com/nextGameId")
    .then((response) => response.json())
    .then((json) => {
      setGameNo(json.gameId);
    });
  function setGameDetails() {
    var gameNo = document.getElementById("gameNo")?.innerText;
    var body = JSON.stringify({
      gameId: `${gameNo}`,
      team1: team1id,
      team2: team2id,
    });
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body,
    };
    fetch(
      "https://robot-battles-scoreboard-backend.onrender.com/setGameDetails",
      requestOptions
    );

    const requestOptions2 = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mainTime: totalTime,
      }),
    };
    fetch(
      "https://robot-battles-scoreboard-backend.onrender.com/setMain",
      requestOptions2
    );

    const requestOptions3 = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pitTime: pitTime,
      }),
    };
    fetch(
      "https://robot-battles-scoreboard-backend.onrender.com/setPit",
      requestOptions3
    );

    const requestOptions4 = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pitOpenTime: pitOpenTime,
      }),
    };
    fetch(
      "https://robot-battles-scoreboard-backend.onrender.com/setPitOpen",
      requestOptions4
    );
  }
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
          <select
            id="teamA"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={(e) => setTeam1id(e.target.value)}
          ></select>
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
            <select
              id="teamB"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={(e) => setTeam2id(e.target.value)}
            ></select>
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

      <div className="text-center text-white text-2xl mt-10">
        Total time: {totalTime} s
      </div>
      <div className="text-center text-white text-2xl mt-10">
        Pit opens at: {pitOpenTime} s
      </div>
      <div className="text-center text-white text-2xl mt-10">
        Pit time: {pitTime} s
      </div>
      <div className="text-center text-white text-2xl mt-10">
        Game No <span id="gameNo">{gameNo}</span>
      </div>
      <div className="flex flex-row justify-center my-5">
        <button
          className="bg-yellow-300 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-lg  "
          onClick={setGameDetails}
        >
          CREATE GAME
        </button>
      </div>
    </div>
  );
}

export default SecondPage;
