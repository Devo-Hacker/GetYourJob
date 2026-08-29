import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import SkillGap from "./pages/SkillGap";
import Roadmap from "./pages/Roadmap";
import Connections from "./pages/Connections";
import Projects from "./pages/Projects";
import Storage from "./pages/Storage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/skill-gap" element={<SkillGap />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/connections" element={<Connections />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/storage" element={<Storage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;