// Backup of original fileimport { useEffect, useState } from "react";

import { useEffect, useState } from "react";

console.log("SetupNextBattle file loaded!");

function SetupNextBattle() {
  console.log("SetupNextBattle component rendering!");
  
  const [test, setTest] = useState("Hello World");
  
  useEffect(() => {
    console.log("UseEffect running!");
    console.log("API Base URL:", import.meta.env.VITE_API_BASE_URL);
  }, []);
  
  return (
    <div style={{ padding: "20px", backgroundColor: "white", color: "black" }}>
      <h1>Next Battle Page Test</h1>
      <p>If you can see this text, the route is working!</p>
      <p>Test state: {test}</p>
      <button onClick={() => {
        console.log("Button clicked!");
        setTest("Button was clicked!");
      }}>
        Click me to test state
      </button>
    </div>
  );
}

export default SetupNextBattle;