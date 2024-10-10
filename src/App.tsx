// import logo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import FirstPage from "./pages/firstPage.tsx";
import AdminPage from "./pages/adminPage.tsx";
import TonamentDrawPage from "./pages/drawPage.tsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<FirstPage />} />
          <Route path="/bracket" element={<TonamentDrawPage />} />
          <Route path="/h72xutmpivrro7/*" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
