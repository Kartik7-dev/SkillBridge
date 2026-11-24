import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Search, Star, Video, Sparkles, MessageCircle, Check } from 'lucide-react';
import Badge from '../shared/Badge';
import Avatar from '../shared/Avatar';
import { featuredHelpers } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

function HelperProfileCard({ helper, onConnect, isConnected }) {
  const isAvail = helper.availability === 'available' || helper.available;

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white rounded-3xl border border-[#E9E2F5] shadow-[0_8px_24px_rgba(91,33,182,0.05)] p-6 hover:shadow-[0_16px_40px_rgba(124,58,237,0.12)] hover:border-[#7C3AED]/40 transition-all duration-200 flex flex-col justify-between group"
    >
      <div>
        {/* Header */}
        <div className="flex items-start gap-3.5 mb-4">
          <Avatar
            initials={helper.initials}
            size="lg"
            statusDot={isAvail ? 'online' : 'busy'}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-heading font-bold text-[#171329] group-hover:text-[#7C3AED] transition-colors truncate">
                  {helper.name}
                </h3>
                <p className="text-xs text-[#6B6680]">{helper.college} &middot; {helper.year}</p>
                {helper.branch && (
                  <p className="text-[11px] text-[#7C3AED] font-medium truncate mt-0.5">{helper.branch}</p>
                )}
              </div>
              <div className="flex items-center gap-1 bg-[#F5F0FF] text-[#7C3AED] border border-[#E9E2F5] px-2.5 py-0.5 rounded-full text-xs font-bold shrink-0">
                <Sparkles size={12} />
                <span>{helper.matchScore || 92}%</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-[#6B6680] mb-4 line-clamp-2 leading-relaxed font-sans">
          {helper.bio}
        </p>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {helper.skills.slice(0, 4).map((skill) => (
            <Badge key={skill} size="xs" variant="default">{skill}</Badge>
          ))}
          {helper.skills.length > 4 && (
            <span className="text-[10px] text-[#6B6680] self-center">+{helper.skills.length - 4}</span>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mb-4 text-xs text-[#6B6680] pt-3 border-t border-[#E9E2F5]">
          <span className="flex items-center gap-1 font-bold text-[#171329]">
            <Star size={13} className="text-amber-400 fill-amber-400" />
            {helper.rating}
          </span>
          <span className="flex items-center gap-1">
            <Video size={13} />
            {helper.doubtsSolved || helper.sessions || 12} solved
          </span>
          <span className="text-xs font-bold text-[#7C3AED]">
            {helper.xp || 600} XP
          </span>
          <span className={`flex items-center gap-1 font-semibold ${isAvail ? 'text-[#4D7C0F]' : 'text-[#6B6680]'}`}>
            <span className={`w-2 h-2 rounded-full ${isAvail ? 'bg-[#A3E635]' : 'bg-[#9CA3AF]'}`} />
            {isAvail ? 'Available' : 'Busy'}
          </span>
        </div>
      </div>

      {/* Action */}
      <div className="pt-2">
        <button
          onClick={() => onConnect(helper)}
          disabled={isConnected}
          className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
            isConnected
              ? 'bg-[#F7FEE7] text-[#4D7C0F] border border-[#ECFCCB]'
              : 'bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white shadow-[0_4px_16px_rgba(124,58,237,0.3)] hover:shadow-[0_8px_24px_rgba(124,58,237,0.45)] hover:-translate-y-0.5'
          }`}
        >
          {isConnected ? (
            <>
              <Check size={14} /> Request Sent
            </>
          ) : (
            <>
              <MessageCircle size={14} /> Request Mentorship
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}

export default function FindHelpersView() {
  const { addToast, peers } = useApp();
  const [search, setSearch] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [connectedHelpers, setConnectedHelpers] = useState([]);

  const helperList = peers && peers.length > 0 ? peers : featuredHelpers;

  const handleConnect = (helper) => {
    const isAvail = helper.availability === 'available' || helper.available;
    if (!isAvail) {
      addToast(`${helper.name} is currently ${helper.availability || 'busy'}. Mentorship inquiry logged for their next slot.`, 'info');
    } else {
      addToast(`Session request sent to ${helper.name}! Check 'My Sessions' for updates.`, 'success');
    }
    setConnectedHelpers((prev) => [...prev, helper.id]);
  };

  const allSkillTags = useMemo(() => {
    const tags = new Set();
    helperList.forEach((h) => (h.skills || []).forEach((s) => tags.add(s)));
    return ['all', ...Array.from(tags)];
  }, [helperList]);

  const filteredHelpers = useMemo(() => {
    return helperList.filter((h) => {
      const isAvail = h.availability === 'available' || h.available;
      const matchesSearch =
        search === '' ||
        h.name.toLowerCase().includes(search.toLowerCase()) ||
        (h.college && h.college.toLowerCase().includes(search.toLowerCase())) ||
        (h.branch && h.branch.toLowerCase().includes(search.toLowerCase())) ||
        (h.skills && h.skills.some((s) => s.toLowerCase().includes(search.toLowerCase())));

      const matchesSkill =
        selectedSkill === 'all' || (h.skills && h.skills.includes(selectedSkill));

      const matchesAvail =
        availabilityFilter === 'all' ||
        (availabilityFilter === 'available' && isAvail) ||
        (availabilityFilter === 'busy' && h.availability === 'busy');

      return matchesSearch && matchesSkill && matchesAvail;
    });
  }, [helperList, search, selectedSkill, availabilityFilter]);

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E9E2F5] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F0FF] border border-[#E9E2F5] text-xs font-semibold text-[#7C3AED] mb-2">
            <span>Verified Peer Roster</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#171329]">
            Find Peer Helpers
          </h1>
          <p className="text-xs sm:text-sm text-[#6B6680] mt-0.5">
            Connect with top-rated student mentors who know your course syllabus and solved your exact challenge.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B6680]"
            />
            <input
              type="text"
              placeholder="Search by name, university, or skill tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-[#E9E2F5] rounded-2xl text-xs sm:text-sm text-[#171329] placeholder-[#9892AB] focus:outline-none focus:border-[#7C3AED] focus:shadow-[0_4px_16px_rgba(124,58,237,0.1)] transition-all shadow-xs"
            />
          </div>

          {/* Availability Pills */}
          <div className="inline-flex p-1 bg-white border border-[#E9E2F5] rounded-2xl shadow-xs self-start sm:self-auto">
            {[
              { id: 'all', label: 'All Status' },
              { id: 'available', label: 'Online' },
              { id: 'busy', label: 'In Session' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setAvailabilityFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  availabilityFilter === tab.id
                    ? 'bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white shadow-xs'
                    : 'text-[#6B6680] hover:text-[#171329]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Skill Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {allSkillTags.map((skill) => (
            <button
              key={skill}
              onClick={() => setSelectedSkill(skill)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap capitalize ${
                selectedSkill === skill
                  ? 'bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white shadow-[0_4px_12px_rgba(124,58,237,0.3)]'
                  : 'bg-white text-[#6B6680] border border-[#E9E2F5] hover:text-[#7C3AED] hover:border-[#7C3AED]/40'
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      {/* Helpers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHelpers.map((helper) => (
          <HelperProfileCard
            key={helper.id}
            helper={helper}
            onConnect={handleConnect}
            isConnected={connectedHelpers.includes(helper.id)}
          />
        ))}
      </div>
    </div>
  );
}
