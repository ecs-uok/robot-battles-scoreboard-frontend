import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Main from "./pages/Main.tsx";
import AdminPage from "./pages/Admin.tsx";
import TonamentDrawPage from "./pages/Draw.tsx";
import GameHistory from "./pages/GameHistory.tsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/bracket" element={<TonamentDrawPage />} />
          <Route path="/Admin/*" element={<AdminPage />} />
          <Route path="/GameHistory" element={<GameHistory />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
