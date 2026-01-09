// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import "./App.css";
import ListPage from "./pages/ListPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DetailPage from "./pages/anime/[id]";

function App() {
  // const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ListPage />} />
          <Route path="/anime/:id" element={<DetailPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
