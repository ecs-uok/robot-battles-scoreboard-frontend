import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "../components/Navbar/Navbar.jsx";
import SecondPage from "../components/Creategame.jsx";
import ThirdPage from "../components/ThirdPage.jsx";
import FourthPage from "../components/FourthPage.jsx";
import FifthPage from ".components/FifthPage.jsx";
function adminPage() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<SecondPage />} />
        <Route path="/third" element={<ThirdPage />} />
        <Route path="/fourth" element={<FourthPage />} />
        <Route path="/fifth" element={<FifthPage />} />
      </Routes>
    </>
  );
}

export default adminPage;
