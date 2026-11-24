import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import SessionRoom from './components/dashboard/SessionRoom';
import { AppProvider, useApp } from './context/AppContext';
import PostDoubtModal from './components/dashboard/PostDoubtModal';
import OfferHelpModal from './components/dashboard/OfferHelpModal';
import FeedbackModal from './components/dashboard/FeedbackModal';
import SmartMatchModal from './components/dashboard/SmartMatchModal';
import ToastContainer from './components/shared/ToastContainer';
import LevelUpModal from './components/shared/LevelUpModal';
import XpFloatingCelebration from './components/shared/XpFloatingCelebration';

function GlobalCelebrations() {
  const { xpCelebration, clearXpCelebration, levelUpData, closeLevelUpModal } = useApp();

  return (
    <>
      <LevelUpModal levelUpData={levelUpData} onClose={closeLevelUpModal} />
      <XpFloatingCelebration celebration={xpCelebration} onComplete={clearXpCelebration} />
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/:section" element={<Dashboard />} />
        <Route path="/dashboard/:section/:sessionId" element={<Dashboard />} />
        <Route path="/session/:sessionId" element={<SessionRoom />} />
      </Routes>
      <PostDoubtModal />
      <OfferHelpModal />
      <SmartMatchModal />
      <FeedbackModal />
      <ToastContainer />
      <GlobalCelebrations />
    </AppProvider>
  );
}

export default App;
