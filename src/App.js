import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import DataExplorer from "./components/DataExplorer";
import ClimateAtlas from "./components/ClimateAtlas";
import FutureLens from "./components/FutureLens";
import EcoActions from "./components/EcoActions";
import Login from "./pages/Login"; // ✅ Import Login Page

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/data-explorer" element={<DataExplorer />} />
                <Route path="/climate-atlas" element={<ClimateAtlas />} />
                <Route path="/future-lens" element={<FutureLens />} />
                <Route path="/eco-actions" element={<EcoActions />} />
                <Route path="/login" element={<Login />} />  {/* ✅ Add this */}
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;
