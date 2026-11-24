import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  HelpCircle,
  Users,
  Video,
  Trophy,
} from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import TopBar from '../components/dashboard/TopBar';
import DashboardHome from '../components/dashboard/DashboardHome';
import ExploreDoubtsView from '../components/dashboard/ExploreDoubtsView';
import FindHelpersView from '../components/dashboard/FindHelpersView';
import MySessionsView from '../components/dashboard/MySessionsView';
import LeaderboardView from '../components/dashboard/LeaderboardView';
import ProfileView from '../components/dashboard/ProfileView';
import SessionRoom from '../components/dashboard/SessionRoom';
import AmbientBackground from '../components/shared/AmbientBackground';
import { pageVariants } from '../config/animations';
import { useApp } from '../context/AppContext';

const mobileNavItems = [
  { id: 'home', icon: LayoutDashboard, label: 'Home', path: '/dashboard' },
  { id: 'explore-doubts', icon: HelpCircle, label: 'Doubts', path: '/dashboard/explore-doubts' },
  { id: 'find-helpers', icon: Users, label: 'Helpers', path: '/dashboard/find-helpers' },
  { id: 'my-sessions', icon: Video, label: 'Sessions', path: '/dashboard/my-sessions' },
  { id: 'leaderboard', icon: Trophy, label: 'Ranks', path: '/dashboard/leaderboard' },
];

function renderSection(section) {
  switch (section) {
    case 'explore-doubts':
      return <ExploreDoubtsView />;
    case 'find-helpers':
      return <FindHelpersView />;
    case 'my-sessions':
      return <MySessionsView />;
    case 'leaderboard':
      return <LeaderboardView />;
    case 'profile':
      return <ProfileView />;
    case 'session':
      return <SessionRoom />;
    default:
      return <DashboardHome />;
  }
}

export default function Dashboard() {
  const { section } = useParams();
  const activeSection = section || 'home';
  const { helpOffers } = useApp();
  const pendingOffersCount = helpOffers.filter((o) => o.status === 'pending').length;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-[#FAF9FF] text-[#171329] overflow-hidden font-sans">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main content area */}
      <div className="relative flex-1 flex flex-col min-w-0 overflow-hidden bg-[#FAF9FF]">
        <AmbientBackground />
        <TopBar onMenuToggle={() => setSidebarOpen(true)} />

        <main className="relative z-10 flex-1 overflow-y-auto pb-20 lg:pb-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="min-h-full"
            >
              {renderSection(activeSection)}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-[#E9E2F5] z-30 shadow-[0_-4px_20px_rgba(91,33,182,0.06)]">
        <div className="flex items-center justify-around h-16 px-2">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <Link
                key={item.id}
                to={item.path}
                className={`relative flex flex-col items-center justify-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
                  isActive
                    ? 'text-[#7C3AED] font-bold'
                    : 'text-[#6B6680] hover:text-[#7C3AED]'
                }`}
              >
                <div className="relative">
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  {item.id === 'my-sessions' && pendingOffersCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#7C3AED] rounded-full ring-2 ring-white" />
                  )}
                </div>
                <span className="text-[10px] tracking-tight">{item.label}</span>
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
