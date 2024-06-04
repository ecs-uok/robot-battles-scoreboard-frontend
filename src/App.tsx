import { useEffect, useState } from "react";
// import logo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.tsx";

import FirstPage from "./pages/firstPage.tsx";
import SecondPage from "./pages/secondPage.tsx";
import ThirdPage from "./pages/thirdPage.tsx";
import FourthPage from "./pages/fourthPage.tsx";
import FifthPage from "./pages/fifthPage.tsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<FirstPage />} />
          <Route path="/second" element={<SecondPage />} />
          <Route path="/third" element={<ThirdPage />} />
          <Route path="/fourth" element={<FourthPage />} />
          <Route path="/fifth" element={<FifthPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
