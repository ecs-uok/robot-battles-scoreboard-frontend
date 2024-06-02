import { useState } from "react";
// import logo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>{/* <img src={viteLogo} className="logo" alt="Vite logo" /> */}</div>
      <h1>Scoreboard</h1>
      <div className="card"></div>
      <p className="read-the-docs">Copyrights ECSC 2024</p>
    </>
  );
}

export default App;
