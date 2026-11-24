import { Link, useParams } from 'react-router-dom';
import {
  LayoutDashboard,
  HelpCircle,
  Users,
  Video,
  Trophy,
  User,
  X,
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react';
import Logo from '../shared/Logo';
import Avatar from '../shared/Avatar';
import { useApp } from '../../context/AppContext';

const navItems = [
  { id: 'home', label: 'Overview', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'explore-doubts', label: 'Explore Doubts', icon: HelpCircle, path: '/dashboard/explore-doubts' },
  { id: 'find-helpers', label: 'Find Helpers', icon: Users, path: '/dashboard/find-helpers' },
  { id: 'my-sessions', label: 'My Sessions', icon: Video, path: '/dashboard/my-sessions' },
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, path: '/dashboard/leaderboard' },
  { id: 'profile', label: 'My Profile', icon: User, path: '/dashboard/profile' },
];

export default function Sidebar({ isOpen, onClose, collapsed, onToggleCollapse }) {
  const { section } = useParams();
  const activeSection = section || 'home';
  const { currentUser, helpOffers } = useApp();

  const pendingOffersCount = helpOffers.filter((o) => o.status === 'pending').length;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[#171329]/40 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-200"
          onClick={onClose}
        />
      )}

      {/* Sidebar Shell */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white border-r border-[#E9E2F5] z-50
          flex flex-col transition-all duration-300 ease-in-out
          ${collapsed ? 'w-20' : 'w-64'}
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:relative lg:z-auto
        `}
      >
        {/* Logo area */}
        <div className={`flex items-center h-18 border-b border-[#E9E2F5] shrink-0 ${collapsed ? 'justify-center px-2' : 'px-6 justify-between'}`}>
          {!collapsed && <Logo size="md" linkTo="/dashboard" />}
          {collapsed && (
            <Link to="/dashboard" className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#A855F7] text-white shadow-[0_4px_12px_rgba(124,58,237,0.3)]">
              <Zap size={18} strokeWidth={2.5} className="fill-white" />
            </Link>
          )}

          {/* Mobile close */}
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg hover:bg-[#F5F0FF] text-[#6B6680] hover:text-[#7C3AED] transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 py-5 px-3.5 overflow-y-auto">
          {!collapsed && (
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-[#9892AB] mb-2.5">
              Workspace
            </p>
          )}
          <ul className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <li key={item.id}>
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className={`
                      group flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold
                      transition-all duration-200 relative select-none
                      ${collapsed ? 'justify-center' : ''}
                      ${
                        isActive
                          ? 'bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white shadow-[0_6px_20px_rgba(124,58,237,0.28)]'
                          : 'text-[#6B6680] hover:text-[#7C3AED] hover:bg-[#F5F0FF]'
                      }
                    `}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon size={19} className={`shrink-0 ${isActive ? 'text-white' : 'text-[#6B6680] group-hover:text-[#7C3AED]'}`} />
                    {!collapsed && (
                      <span className="flex-1 flex items-center justify-between">
                        <span>{item.label}</span>
                        {item.id === 'my-sessions' && pendingOffersCount > 0 && (
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                              isActive
                                ? 'bg-white text-[#7C3AED]'
                                : 'bg-[#EDE9FE] text-[#7C3AED]'
                            }`}
                          >
                            {pendingOffersCount}
                          </span>
                        )}
                      </span>
                    )}

                    {/* Collapsed Tooltip */}
                    {collapsed && (
                      <div className="absolute left-full ml-3 px-3 py-1.5 bg-[#171329] text-white text-xs font-semibold rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none shadow-lg">
                        {item.label}
                      </div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Collapse toggle */}
        <div className="hidden lg:flex px-3.5 pb-2 border-t border-[#E9E2F5]/70 pt-2">
          <button
            onClick={onToggleCollapse}
            className="w-full flex items-center justify-center p-2 rounded-xl text-[#6B6680] hover:text-[#7C3AED] hover:bg-[#F5F0FF] transition-colors text-xs font-semibold cursor-pointer"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            {!collapsed && <span className="ml-2">Collapse Menu</span>}
          </button>
        </div>

        {/* User Mini Profile */}
        <div className={`border-t border-[#E9E2F5] p-3.5 shrink-0 ${collapsed ? 'flex justify-center' : ''}`}>
          <Link
            to="/dashboard/profile"
            onClick={onClose}
            className={`
              flex items-center gap-3 rounded-2xl transition-all
              hover:bg-[#F5F0FF] p-2
              ${collapsed ? 'justify-center' : ''}
            `}
          >
            <Avatar initials={currentUser.initials} size="sm" statusDot="online" />
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-heading font-bold text-[#171329] truncate leading-tight">
                  {currentUser.fullName}
                </p>
                <div className="flex items-center gap-1.5 text-[11px] text-[#6B6680] mt-0.5 truncate">
                  <span>{currentUser.college}</span>
                  <span>&middot;</span>
                  <span className="text-[#7C3AED] font-bold">{currentUser.points || 280} pts</span>
                </div>
              </div>
            )}
          </Link>
        </div>
      </aside>
    </>
  );
}
