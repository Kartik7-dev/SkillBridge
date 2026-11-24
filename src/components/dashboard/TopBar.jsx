import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  LogOut,
  Settings,
  User,
  Plus,
  Coins,
  CheckCircle2,
  Info,
  Award,
  Check,
  Trash2,
} from 'lucide-react';
import Avatar from '../shared/Avatar';
import Button from '../shared/Button';
import { useApp } from '../../context/AppContext';
import { Link } from 'react-router-dom';

export default function TopBar({ onMenuToggle }) {
  const {
    currentUser,
    userAvailability,
    setUserAvailability,
    notifications,
    unreadNotificationsCount,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
    openPostDoubtModal,
    respondToOffer,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showAvailabilityDropdown, setShowAvailabilityDropdown] = useState(false);

  const currentAvail = userAvailability || currentUser?.availability || 'available';

  const availConfig = {
    available: { dot: 'bg-[#A3E635]', label: 'Available to Help', border: 'border-[#A3E635]/40' },
    busy: { dot: 'bg-amber-400', label: 'Busy', border: 'border-amber-400/40' },
    offline: { dot: 'bg-slate-400', label: 'Offline', border: 'border-slate-300' },
  };

  const { dot: availDot, label: availLabel } = availConfig[currentAvail] || availConfig.available;

  const notifIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={16} className="text-[#65A30D] shrink-0" />;
      case 'award':
        return <Award size={16} className="text-[#7C3AED] shrink-0" />;
      default:
        return <Info size={16} className="text-[#7C3AED] shrink-0" />;
    }
  };

  return (
    <header className="h-18 bg-white/90 backdrop-blur-xl border-b border-[#E9E2F5] flex items-center justify-between px-4 md:px-7 shrink-0 sticky top-0 z-30">
      {/* Left: menu toggle + search */}
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-xl hover:bg-[#F5F0FF] text-[#6B6680] hover:text-[#7C3AED] transition-colors cursor-pointer"
          aria-label="Toggle menu"
        >
          <Menu size={22} />
        </button>

        <div className="hidden sm:flex items-center gap-2.5 bg-[#FAF9FF] rounded-2xl px-4 py-2 flex-1 max-w-sm border border-[#E9E2F5] focus-within:border-[#7C3AED] focus-within:bg-white focus-within:shadow-[0_4px_16px_rgba(124,58,237,0.1)] transition-all duration-200">
          <Search size={16} className="text-[#6B6680] shrink-0" />
          <input
            type="text"
            placeholder="Search doubts, peers, topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-xs sm:text-sm text-[#171329] placeholder-[#9892AB] outline-none w-full font-sans"
          />
        </div>
      </div>

      {/* Right: Points + Post Doubt + notifications + user */}
      <div className="flex items-center gap-3">
        {/* Points Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F5F0FF] border border-[#E9E2F5] text-[#7C3AED] text-xs font-bold shadow-xs">
          <Coins size={14} className="text-[#7C3AED]" />
          <span>{currentUser?.points || 280} pts</span>
        </div>

        {/* Quick Post Doubt Button */}
        <Button
          size="sm"
          onClick={openPostDoubtModal}
          icon={Plus}
          className="shadow-[0_4px_14px_rgba(124,58,237,0.3)]"
        >
          Post Doubt
        </Button>

        {/* Availability Toggle */}
        <div className="relative">
          <button
            onClick={() => {
              setShowAvailabilityDropdown(!showAvailabilityDropdown);
              setShowNotifs(false);
              setShowDropdown(false);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E9E2F5] bg-[#FAF9FF] hover:bg-white text-xs font-semibold text-[#171329] transition-all cursor-pointer shadow-xs"
            title="Set your peer mentoring availability"
          >
            <span className={`w-2.5 h-2.5 rounded-full ${availDot} ring-2 ring-white`} />
            <span className="hidden sm:inline text-xs font-bold">{availLabel}</span>
            <ChevronDown size={13} className="text-[#6B6680]" />
          </button>

          {showAvailabilityDropdown && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowAvailabilityDropdown(false)}
              />
              <div className="absolute right-0 mt-2.5 w-52 bg-white rounded-3xl shadow-[0_16px_40px_rgba(91,33,182,0.18)] border border-[#E9E2F5] py-2 z-50 animate-scale-in origin-top-right overflow-hidden">
                <div className="px-4 py-2 border-b border-[#E9E2F5] text-[10px] font-bold uppercase tracking-wider text-[#6B6680]">
                  Your Peer Availability
                </div>
                <div className="p-1 space-y-0.5">
                  <button
                    onClick={() => {
                      setUserAvailability('available');
                      setShowAvailabilityDropdown(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                      currentAvail === 'available'
                        ? 'bg-[#F5F0FF] text-[#7C3AED] font-bold'
                        : 'text-[#171329] hover:bg-[#FAF9FF]'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#A3E635]" />
                      <span>Available to Help</span>
                    </span>
                    {currentAvail === 'available' && <Check size={14} className="text-[#7C3AED]" />}
                  </button>

                  <button
                    onClick={() => {
                      setUserAvailability('busy');
                      setShowAvailabilityDropdown(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                      currentAvail === 'busy'
                        ? 'bg-[#F5F0FF] text-[#7C3AED] font-bold'
                        : 'text-[#171329] hover:bg-[#FAF9FF]'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      <span>Busy (In Session)</span>
                    </span>
                    {currentAvail === 'busy' && <Check size={14} className="text-[#7C3AED]" />}
                  </button>

                  <button
                    onClick={() => {
                      setUserAvailability('offline');
                      setShowAvailabilityDropdown(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                      currentAvail === 'offline'
                        ? 'bg-[#F5F0FF] text-[#7C3AED] font-bold'
                        : 'text-[#171329] hover:bg-[#FAF9FF]'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                      <span>Offline</span>
                    </span>
                    {currentAvail === 'offline' && <Check size={14} className="text-[#7C3AED]" />}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Notifications toggle */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifs(!showNotifs);
              setShowDropdown(false);
            }}
            className="relative p-2 rounded-xl hover:bg-[#F5F0FF] text-[#6B6680] hover:text-[#7C3AED] transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell size={20} />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#7C3AED] rounded-full ring-2 ring-white" />
            )}
          </button>

          {/* Notifications Dropdown */}
          <AnimatePresence>
            {showNotifs && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifs(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                  className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-3xl shadow-[0_20px_60px_rgba(91,33,182,0.18)] border border-[#E9E2F5] py-2 z-50 origin-top-right overflow-hidden"
                >
                  <div className="flex items-center justify-between px-5 py-3 border-b border-[#E9E2F5] bg-[#FAF9FF]">
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-bold text-[#171329] text-sm">Notifications</h3>
                      {unreadNotificationsCount > 0 && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#9333EA] text-white">
                          {unreadNotificationsCount} new
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2.5">
                      {unreadNotificationsCount > 0 && (
                        <button
                          onClick={markAllNotificationsRead}
                          className="text-xs text-[#7C3AED] hover:text-[#5B21B6] font-semibold flex items-center gap-1 cursor-pointer"
                          title="Mark all notifications as read"
                        >
                          <Check size={13} /> Mark read
                        </button>
                      )}
                      {notifications.length > 0 && (
                        <button
                          onClick={clearNotifications}
                          className="text-xs text-[#6B6680] hover:text-[#E11D48] font-semibold flex items-center gap-1 cursor-pointer"
                          title="Clear all notifications"
                        >
                          <Trash2 size={12} /> Clear
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-[#E9E2F5]/70">
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <motion.div
                          key={n.id}
                          whileHover={{ x: 2 }}
                          transition={{ duration: 0.15 }}
                          onClick={() => markNotificationRead(n.id)}
                          className={`flex items-start gap-3 px-5 py-3.5 hover:bg-[#FAF9FF] transition-colors cursor-pointer ${
                            !n.read ? 'bg-[#F5F0FF]/50' : ''
                          }`}
                        >
                        <div className="mt-0.5">{notifIcon(n.type)}</div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-xs ${
                              !n.read
                                ? 'font-bold text-[#171329]'
                                : 'font-medium text-[#171329]'
                            }`}
                          >
                            {n.title}
                          </p>
                          <p className="text-xs text-[#6B6680] leading-snug mt-0.5">
                            {n.message}
                          </p>
                          <span className="text-[10px] text-[#9892AB] mt-1 block">
                            {n.time}
                          </span>

                          {/* Quick Action buttons for Help Requests */}
                          {n.actionable && n.requestId && (
                            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#E9E2F5]" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => {
                                  respondToOffer(n.requestId, 'accepted');
                                  markNotificationRead(n.id);
                                }}
                                className="px-3 py-1 rounded-xl text-[11px] font-bold bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white shadow-xs hover:shadow-md cursor-pointer"
                              >
                                Accept &amp; Schedule
                              </button>
                              <button
                                onClick={() => {
                                  respondToOffer(n.requestId, 'rejected');
                                  markNotificationRead(n.id);
                                }}
                                className="px-2.5 py-1 rounded-xl text-[11px] font-semibold text-[#E11D48] hover:bg-[#FFF1F2] border border-[#FFE4E6] cursor-pointer"
                              >
                                Decline
                              </button>
                            </div>
                          )}
                        </div>
                        {!n.read && (
                          <span className="w-2 h-2 rounded-full bg-[#7C3AED] shrink-0 mt-1" />
                        )}
                      </motion.div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-xs text-[#6B6680]">
                      No notifications yet
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
        </div>

        {/* User dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowDropdown(!showDropdown);
              setShowNotifs(false);
            }}
            className="flex items-center gap-2 p-1 rounded-2xl hover:bg-[#F5F0FF] transition-colors cursor-pointer"
          >
            <Avatar initials={currentUser?.initials || 'KM'} size="sm" />
            <span className="hidden md:block text-xs font-heading font-bold text-[#171329]">
              {currentUser?.name || 'Kartik'}
            </span>
            <ChevronDown size={14} className="hidden md:block text-[#6B6680]" />
          </button>

          {showDropdown && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowDropdown(false)}
              />
              <div className="absolute right-0 mt-3 w-60 bg-white rounded-3xl shadow-[0_20px_60px_rgba(91,33,182,0.18)] border border-[#E9E2F5] py-2 z-50 animate-scale-in origin-top-right font-sans overflow-hidden">
                <div className="px-5 py-3.5 border-b border-[#E9E2F5] bg-[#FAF9FF]">
                  <p className="text-sm font-heading font-bold text-[#171329]">
                    {currentUser?.fullName || 'Kartik Mehta'}
                  </p>
                  <p className="text-xs text-[#6B6680] mt-0.5">
                    {currentUser?.college || 'IIT Bombay'} &middot; {currentUser?.year || '2nd Year'}
                  </p>
                  <div className="flex items-center gap-1.5 mt-2.5 text-xs text-[#7C3AED] bg-white px-3 py-1 rounded-full border border-[#E9E2F5] font-semibold shadow-xs">
                    <Coins size={13} className="text-[#7C3AED]" />
                    <span>Balance: <strong>{currentUser?.points || 280} pts</strong></span>
                  </div>
                </div>
                <div className="py-1">
                  <Link
                    to="/dashboard/profile"
                    onClick={() => setShowDropdown(false)}
                    className="w-full flex items-center gap-2.5 px-5 py-2.5 text-xs font-semibold text-[#6B6680] hover:text-[#7C3AED] hover:bg-[#F5F0FF] transition-colors"
                  >
                    <User size={15} />
                    <span>My Profile</span>
                  </Link>
                  <Link
                    to="/dashboard/my-sessions"
                    onClick={() => setShowDropdown(false)}
                    className="w-full flex items-center gap-2.5 px-5 py-2.5 text-xs font-semibold text-[#6B6680] hover:text-[#7C3AED] hover:bg-[#F5F0FF] transition-colors"
                  >
                    <Settings size={15} />
                    <span>My Sessions</span>
                  </Link>
                </div>
                <div className="border-t border-[#E9E2F5] pt-1">
                  <button
                    onClick={() => setShowDropdown(false)}
                    className="w-full flex items-center gap-2.5 px-5 py-2.5 text-xs font-semibold text-[#E11D48] hover:bg-[#FFF1F2] transition-colors cursor-pointer"
                  >
                    <LogOut size={15} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
