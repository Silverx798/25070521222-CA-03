import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AtmosphericCanvas from './components/animations/AtmosphericCanvas';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import RegionsPage from './pages/RegionsPage';
import WorldMapPage from './pages/WorldMapPage';
import StoryDetailPage from './pages/StoryDetailPage';
import SubmitStoryPage from './pages/SubmitStoryPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Living Ambient Fog & Celestial Ember Background */}
        <AtmosphericCanvas />

        <div className="app-container">
          <Navbar />
          
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/regions" element={<RegionsPage />} />
              <Route path="/map" element={<WorldMapPage />} />
              <Route path="/stories/:slug" element={<StoryDetailPage />} />
              <Route path="/submit" element={<SubmitStoryPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/collection" element={<ProfilePage />} />
              <Route path="/admin" element={<AdminDashboardPage />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
