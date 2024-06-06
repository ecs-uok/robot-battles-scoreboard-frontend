// import logo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import FirstPage from "./pages/firstPage.tsx";
import AdminPage from "./pages/adminPage.tsx";
import SecondPage from "./pages/secondPage.tsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<FirstPage />} />
          <Route path="/admin/*" element={<AdminPage />} />
          <Route path="/admin/*" element={<SecondPage />} />

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
