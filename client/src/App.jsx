import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import SkillGap from "./pages/SkillGap";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/skill-gap" element={<SkillGap />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
