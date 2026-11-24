import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Search,
  Clock,
  MessageSquare,
  Plus,
  SlidersHorizontal,
  HandHeart,
  Coins,
  Sparkles,
} from 'lucide-react';
import Badge from '../shared/Badge';
import Button from '../shared/Button';
import { skillCategories } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

function DoubtCard({ doubt, onHelp, onFindPeer, isOwnDoubt }) {
  const isUrgent = doubt.urgency === 'high';

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white rounded-3xl border border-[#E9E2F5] shadow-[0_8px_24px_rgba(91,33,182,0.05)] p-6 hover:shadow-[0_16px_40px_rgba(124,58,237,0.12)] hover:border-[#7C3AED]/40 transition-all duration-200 flex flex-col justify-between group"
    >
      <div>
        <div className="flex items-start justify-between mb-3.5 gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge
              size="xs"
              variant={isUrgent ? 'urgent' : 'default'}
            >
              {isUrgent ? '⚡ Urgent Priority' : 'Normal'}
            </Badge>
            <span
              className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                doubt.status === 'resolved'
                  ? 'bg-[#F7FEE7] text-[#4D7C0F] border-[#ECFCCB]'
                  : doubt.status === 'in-progress'
                  ? 'bg-[#F5F0FF] text-[#7C3AED] border-[#E9E2F5]'
                  : 'bg-[#FAF9FF] text-[#6B6680] border-[#E9E2F5]'
              }`}
            >
              {(doubt.status || 'open').replace('-', ' ')}
            </span>
            {isOwnDoubt && (
              <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#9333EA] text-white">
                Your Doubt
              </span>
            )}
            {doubt.category && (
              <span className="text-[10px] font-medium px-2.5 py-0.5 rounded-full bg-[#FAF9FF] text-[#6B6680] border border-[#E9E2F5]">
                {doubt.category}
              </span>
            )}
          </div>
          <span className="text-xs font-bold text-[#7C3AED] px-3 py-1 rounded-full bg-[#F5F0FF] border border-[#E9E2F5] flex items-center gap-1 shrink-0">
            <Coins size={13} className="text-[#7C3AED]" />
            +{doubt.bounty} pts
          </span>
        </div>

        <h3 className="text-base font-heading font-bold text-[#171329] mb-2 leading-snug group-hover:text-[#7C3AED] transition-colors">
          {doubt.title}
        </h3>
        <p className="text-xs text-[#6B6680] line-clamp-3 mb-4 leading-relaxed font-sans">
          {doubt.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {doubt.skills?.map((skill) => (
            <Badge key={skill} size="xs" variant="default">{skill}</Badge>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-[#E9E2F5]">
        <div className="flex items-center gap-3 text-xs text-[#6B6680] flex-wrap">
          <span className="font-semibold text-[#171329]">{doubt.postedBy}</span>
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {doubt.postedTime}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare size={12} />
            {doubt.responses || 0} {doubt.responses === 1 ? 'offer' : 'offers'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {doubt.status === 'resolved' ? (
            <span className="text-xs font-semibold text-[#4D7C0F] bg-[#F7FEE7] px-3 py-1 rounded-full border border-[#ECFCCB]">
              Resolved
            </span>
          ) : doubt.status === 'matched' ? (
            <span className="text-xs font-semibold text-[#7C3AED] bg-[#F5F0FF] px-3 py-1 rounded-full border border-[#E9E2F5] flex items-center gap-1">
              <Sparkles size={12} /> Matched
            </span>
          ) : (
            <>
              <Button
                size="sm"
                variant={isOwnDoubt ? 'primary' : 'secondary'}
                onClick={() => onFindPeer(doubt)}
                icon={Sparkles}
                className={isOwnDoubt ? 'shadow-[0_4px_14px_rgba(124,58,237,0.3)]' : ''}
              >
                Find a Peer
              </Button>
              {!isOwnDoubt && (
                <Button
                  size="sm"
                  onClick={() => onHelp(doubt)}
                  icon={HandHeart}
                >
                  Help
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function ExploreDoubtsView() {
  const { doubts, openPostDoubtModal, openOfferHelpModal, openSmartMatchModal, currentUser } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedUrgency, setSelectedUrgency] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const filteredDoubts = useMemo(() => {
    return doubts
      .filter((d) => {
        const matchesSearch =
          search === '' ||
          d.title.toLowerCase().includes(search.toLowerCase()) ||
          d.description.toLowerCase().includes(search.toLowerCase()) ||
          d.skills?.some((s) => s.toLowerCase().includes(search.toLowerCase()));

        const matchesCat =
          selectedCategory === 'all' || d.category === selectedCategory;

        const matchesUrg =
          selectedUrgency === 'all' || d.urgency === selectedUrgency;

        const matchesStatus =
          selectedStatus === 'all' || (d.status || 'open') === selectedStatus;

        return matchesSearch && matchesCat && matchesUrg && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'bounty') return (b.bounty || 0) - (a.bounty || 0);
        if (sortBy === 'responses')
          return (b.responses || 0) - (a.responses || 0);
        return 0;
      });
  }, [doubts, search, selectedCategory, selectedUrgency, selectedStatus, sortBy]);

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E9E2F5] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F0FF] border border-[#E9E2F5] text-xs font-semibold text-[#7C3AED] mb-2">
            <span>Doubt Registry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#171329]">
            Explore Open Doubts
          </h1>
          <p className="text-xs sm:text-sm text-[#6B6680] mt-0.5">
            Peer questions waiting for micro-mentorship. Claim a session to earn bounty points.
          </p>
        </div>

        <Button
          size="md"
          onClick={openPostDoubtModal}
          icon={Plus}
        >
          Post a Doubt
        </Button>
      </div>

      {/* Search and Filters Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B6680]"
            />
            <input
              type="text"
              placeholder="Search by title, description, or skill tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-[#E9E2F5] rounded-2xl text-xs sm:text-sm text-[#171329] placeholder-[#9892AB] focus:outline-none focus:border-[#7C3AED] focus:shadow-[0_4px_16px_rgba(124,58,237,0.1)] transition-all shadow-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value)}
              className="bg-white border border-[#E9E2F5] rounded-2xl px-3.5 py-2.5 text-xs font-semibold text-[#171329] focus:outline-none focus:border-[#7C3AED] shadow-xs cursor-pointer"
            >
              <option value="all">All Urgencies</option>
              <option value="high">Urgent Priority</option>
              <option value="medium">Normal Priority</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-white border border-[#E9E2F5] rounded-2xl px-3.5 py-2.5 text-xs font-semibold text-[#171329] focus:outline-none focus:border-[#7C3AED] shadow-xs cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-[#E9E2F5] rounded-2xl px-3.5 py-2.5 text-xs font-semibold text-[#171329] focus:outline-none focus:border-[#7C3AED] shadow-xs cursor-pointer"
            >
              <option value="newest">Sort: Newest</option>
              <option value="bounty">Sort: Highest Bounty</option>
              <option value="responses">Sort: Most Offers</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 pt-1 -mx-1 px-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white shadow-[0_4px_12px_rgba(124,58,237,0.3)]'
                : 'bg-white text-[#6B6680] border border-[#E9E2F5] hover:text-[#7C3AED] hover:border-[#7C3AED]/40'
            }`}
          >
            All Subjects
          </button>
          {skillCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                selectedCategory === cat.name
                  ? 'bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white shadow-[0_4px_12px_rgba(124,58,237,0.3)]'
                  : 'bg-white text-[#6B6680] border border-[#E9E2F5] hover:text-[#7C3AED] hover:border-[#7C3AED]/40'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Doubts Grid */}
      {filteredDoubts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoubts.map((doubt) => {
            const isOwn =
              doubt.postedBy === currentUser?.fullName ||
              doubt.postedBy === currentUser?.name ||
              doubt.postedBy === 'Kartik M.';

            return (
              <DoubtCard
                key={doubt.id}
                doubt={doubt}
                onHelp={openOfferHelpModal}
                onFindPeer={openSmartMatchModal}
                isOwnDoubt={isOwn}
              />
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-[#E9E2F5] rounded-3xl p-12 text-center shadow-sm max-w-md mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-[#F5F0FF] text-[#7C3AED] flex items-center justify-center mx-auto mb-4 border border-[#E9E2F5]">
            <SlidersHorizontal size={24} />
          </div>
          <h3 className="font-heading font-bold text-base text-[#171329] mb-1">
            No doubts match your criteria
          </h3>
          <p className="text-xs text-[#6B6680] mb-5">
            Try adjusting search terms or resetting filters to explore more doubts.
          </p>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setSearch('');
              setSelectedCategory('all');
              setSelectedUrgency('all');
              setSelectedStatus('all');
            }}
          >
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );
}
