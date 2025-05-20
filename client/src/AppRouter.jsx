import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SpotifyLogin from './components/SpotifyLogin';
import SpotifyProfile from './components/SpotifyProfile';
import Home from './components/Home';


export default function AppRouter() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/spotify" element={<SpotifyLogin />} />
          <Route path="/profile" element={<SpotifyProfile />} />
        </Routes>
      </div>
    </Router>
  );
}


