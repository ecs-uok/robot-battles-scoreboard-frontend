import { useEffect, useState } from "react";
// import logo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [mainTime, setMainTime] = useState();
  const [pitTime, setPitTime] = useState();
  useEffect(() => {
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
    <>
      <div>{/* <img src={viteLogo} className="logo" alt="Vite logo" /> */}</div>
      <h1>Scoreboard</h1>
      <div className="card">
        <h1>{mainTime}</h1>
        <h3>{pitTime}</h3>
      </div>
      <p className="read-the-docs">Copyrights ECSC 2024</p>
    </>
  );
}

export default App;
