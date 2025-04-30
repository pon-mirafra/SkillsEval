// App.js
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import SetQs from "./pages/SetQs";
import CreateLink from "./pages/CreateLink";
import CandidatePage from "./Containers/Candidate";
import CandidateFullscreen from "./Containers/Candidate/skills-questions";
import CompletePage from "./Containers/Candidate/complete-page";
import Results from "./pages/Results";
import CandidateResult from "./pages/CandidateResult";
import LinkTracking from "./pages/LinkTracking";
import LinkTrackingResult from "./pages/LinkTrackingResult";

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("email");
    if (token) {
      setLoggedIn(true);
    }
  }, []);

  const handleSignIn = (email) => {
    sessionStorage.setItem("email", email);
    setLoggedIn(true);
  };

  const handleSignOut = () => {
    sessionStorage.removeItem("email");
    setLoggedIn(false);
  };

  const PrivateRoute = ({ children }) => {
    const token = sessionStorage.getItem("email");
    return children;
    // return token ? children : <Navigate to="/" />;
  };

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login onSignIn={handleSignIn} />} />
          <Route path="/candidate/intro/:id" element={<CandidatePage />} />
          <Route path="/questions" element={<CandidateFullscreen />} />
          <Route path="/completed" element={<CompletePage />} />
          <Route path="/home" element={<Home />} />

          <Route
            path="/createlink"
            element={
              <PrivateRoute>
                <CreateLink />
              </PrivateRoute>
            }
          />
          <Route
            path="/setqs"
            element={
              <PrivateRoute>
                <SetQs />
              </PrivateRoute>
            }
          />
          <Route
            path="/results"
            element={
              <PrivateRoute>
                <Results />
              </PrivateRoute>
            }
          />
          <Route
            path="/results/candidate/result/:subjectId/analytics"
            element={
              <PrivateRoute>
                <CandidateResult />
              </PrivateRoute>
            }
          />
          <Route
            path="/linkTracking/subject/:subjectId"
            element={
              <PrivateRoute>
                <LinkTrackingResult />
              </PrivateRoute>
            }
          />
          <Route
            path="/linkTracking"
            element={
              <PrivateRoute>
                <LinkTracking />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
