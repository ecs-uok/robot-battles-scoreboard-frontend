import { Routes, Route } from "react-router-dom";

import Navbar from "../components/Navbar.tsx";
import SecondPage from "./secondPage.tsx";
import ThirdPage from "./thirdPage.tsx";
import FourthPage from "./fourthPage.tsx";
import FifthPage from "./fifthPage.tsx";
import TonamentDrawPage from "./drawPage.tsx";

function adminPage() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<SecondPage />} />
        <Route path="/third" element={<ThirdPage />} />
        <Route path="/fourth" element={<FourthPage />} />
        <Route path="/fifth" element={<FifthPage />} />
        <Route path="/bracket" element={<TonamentDrawPage />} />
      </Routes>
    </>
  );
}

export default adminPage;
