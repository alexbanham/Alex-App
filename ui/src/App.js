import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SuccessPage from "./SuccessPage";
import './App.css';
import APITestPage from "./APITestPage";
import PortfolioPage from "./PortfolioPage";
import {ThemeProvider} from "@mui/material";
import theme from "./theme";  // Make sure to create this CSS file

function AuthPage() {
    const handleLogin = () => {
        // Redirect to your backend route that initiates the Spotify login
        window.location.href = 'http://localhost:3001/api/spotify/auth';
    };

    return (
        <div className="auth-container">
            <img src={require('./Assets/image 1.png')} alt="Spotify Translate Logo" className="logo" />
            <p className="welcome-text">Welcome to SpotifyTranslate!<br/>Please authorize with Spotify to access translated lyrics!</p>
            <button onClick={handleLogin} className="authorize-button">Authorize</button>
        </div>
    );
}

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<ThemeProvider theme={theme}><PortfolioPage/></ThemeProvider>} />
                    <Route path="/success" element={<SuccessPage/>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
