import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import SkillGap from "./pages/SkillGap";
import Roadmap from "./pages/Roadmap";
import Uploads from "./pages/Uploads";
import Connections from "./pages/Connections";
import Storage from "./pages/Storage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";


function App() {
  return (
    // NOTE: if you already have a ThemeProvider wrapping the app (ui.jsx's
    // useTheme() needs it), keep it wrapping AuthProvider - don't remove it.
    <AuthProvider>
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
            <Route path="/uploads" element={<Uploads />} />
            <Route path="/connections" element={<Connections />} />
            <Route path="/storage" element={<Storage />} />
          
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
