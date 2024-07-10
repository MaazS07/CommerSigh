import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebaseClient";

import AmazonURLList from "./components/AmazonURLlist";
import FlipkartURLList from "./components/FlipkartURLlist";
import HeroPage from "./components/Hero/Hero";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  const [user] = useAuthState(auth);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HeroPage />} />
        <Route path="/amazon" element={<AmazonURLList />} user={user} />
        <Route path="/flipkart" element={<FlipkartURLList />} user={user} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
