import { useState, useEffect } from 'react';
import {
  X,
  Coins,
  AlertCircle,
  Plus,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { skillCategories } from '../../data/mockData';
import Button from '../shared/Button';

const durations = ['15 min', '30 min', '45 min', '60 min'];
const popularSkills = [
  'React',
  'JavaScript',
  'Python',
  'C++',
  'DSA',
  'Figma',
  'Linear Algebra',
  'Node.js',
  'SQL',
  'Arduino',
];

export default function PostDoubtModal() {
  const { isPostDoubtOpen, closePostDoubtModal, addDoubt, currentUser } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Programming');
  const [skills, setSkills] = useState(['React']);
  const [customSkill, setCustomSkill] = useState('');
  const [urgency, setUrgency] = useState('medium');
  const [bounty, setBounty] = useState(25);
  const [duration, setDuration] = useState('15 min');

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isPostDoubtOpen) {
        closePostDoubtModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPostDoubtOpen, closePostDoubtModal]);

  if (!isPostDoubtOpen) return null;

  const toggleSkill = (skill) => {
    if (skills.includes(skill)) {
      setSkills(skills.filter((s) => s !== skill));
    } else {
      if (skills.length < 5) {
        setSkills([...skills, skill]);
      }
    }
  };

  const addCustomSkill = (e) => {
    e.preventDefault();
    const clean = customSkill.trim();
    if (clean && !skills.includes(clean) && skills.length < 5) {
      setSkills([...skills, clean]);
      setCustomSkill('');
    }
  };

  const removeSkill = (skill) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const validate = () => {
    const errs = {};
    if (!title.trim()) {
      errs.title = 'Title is required';
    } else if (title.trim().length < 8) {
      errs.title = 'Title must be at least 8 characters';
    }

    if (!description.trim()) {
      errs.description = 'Please describe the problem in detail';
    } else if (description.trim().length < 20) {
      errs.description = 'Description should be at least 20 characters for mentors to understand';
    }

    if (skills.length === 0) {
      errs.skills = 'Please tag at least 1 skill';
    }

    if (bounty < 5) {
      errs.bounty = 'Minimum bounty is 5 points';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newDoubt = {
        title: title.trim(),
        description: description.trim(),
        category,
        skills,
        urgency,
        bounty: Number(bounty),
        duration,
        postedBy: currentUser?.fullName || 'Kartik Mehta',
        postedTime: 'Just now',
        responses: 0,
        status: 'open',
      };

      addDoubt(newDoubt);
      setIsSubmitting(false);

      // Reset
      setTitle('');
      setDescription('');
      setCategory('Programming');
      setSkills(['React']);
      setUrgency('medium');
      setBounty(25);
      setDuration('15 min');
      setErrors({});
      closePostDoubtModal();
    }, 350);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto font-sans">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#171329]/40 backdrop-blur-xs transition-opacity"
        onClick={closePostDoubtModal}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-[0_24px_60px_rgba(91,33,182,0.22)] border border-[#E9E2F5] overflow-hidden z-10 animate-scale-in my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 sm:p-7 border-b border-[#E9E2F5] bg-gradient-to-r from-[#FAF7FF] to-[#F5F0FF]">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#A855F7] shadow-[0_4px_14px_rgba(124,58,237,0.3)] flex items-center justify-center text-white">
              <HelpCircle size={22} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-xl font-heading font-extrabold text-[#171329]">
                Post a Doubt
              </h2>
              <p className="text-xs text-[#6B6680]">
                Connect with student micro-mentors across your university network
              </p>
            </div>
          </div>
          <button
            onClick={closePostDoubtModal}
            className="p-2 rounded-xl text-[#6B6680] hover:text-[#7C3AED] hover:bg-white transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Doubt Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#171329] mb-1.5">
              Doubt Title <span className="text-[#E11D48]">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. How to balance Red-Black Tree rotations on node deletion?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-2xl border text-sm text-[#171329] placeholder-[#9892AB] focus:outline-none focus:border-[#7C3AED] focus:shadow-[0_4px_16px_rgba(124,58,237,0.1)] bg-[#FAF9FF] focus:bg-white transition-all ${
                errors.title ? 'border-[#E11D48] bg-[#FFF1F2]' : 'border-[#E9E2F5]'
              }`}
            />
            {errors.title && (
              <p className="text-xs text-[#E11D48] mt-1 flex items-center gap-1">
                <AlertCircle size={13} /> {errors.title}
              </p>
            )}
          </div>

          {/* Detailed Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#171329] mb-1.5">
              Detailed Description <span className="text-[#E11D48]">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="Explain the background, what you've tried so far, and the exact error or roadblock..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-2xl border text-sm text-[#171329] placeholder-[#9892AB] focus:outline-none focus:border-[#7C3AED] focus:shadow-[0_4px_16px_rgba(124,58,237,0.1)] bg-[#FAF9FF] focus:bg-white transition-all ${
                errors.description ? 'border-[#E11D48] bg-[#FFF1F2]' : 'border-[#E9E2F5]'
              }`}
            />
            {errors.description && (
              <p className="text-xs text-[#E11D48] mt-1 flex items-center gap-1">
                <AlertCircle size={13} /> {errors.description}
              </p>
            )}
          </div>

          {/* Subject Category */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#171329] mb-1.5">
              Subject Area
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-[#E9E2F5] text-sm text-[#171329] bg-[#FAF9FF] focus:outline-none focus:border-[#7C3AED] focus:bg-white cursor-pointer"
            >
              {skillCategories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Skills / Tags */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#171329] mb-1.5">
              Required Skills / Tags <span className="text-[#E11D48]">*</span>{' '}
              <span className="text-xs font-normal text-[#6B6680] lowercase">
                (pick up to 5)
              </span>
            </label>

            {/* Selected Tags */}
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {skills.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white text-xs font-semibold shadow-xs"
                >
                  #{s}
                  <button
                    type="button"
                    onClick={() => removeSkill(s)}
                    className="hover:text-red-200 transition-colors cursor-pointer"
                  >
                    <X size={13} />
                  </button>
                </span>
              ))}
            </div>

            {/* Popular Skills Pills */}
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {popularSkills.map((ps) => {
                const active = skills.includes(ps);
                return (
                  <button
                    key={ps}
                    type="button"
                    onClick={() => toggleSkill(ps)}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#171329] text-white'
                        : 'bg-[#F5F0FF] text-[#7C3AED] hover:bg-[#EDE9FE] border border-[#E9E2F5]'
                    }`}
                  >
                    {active ? '✓ ' : '+ '}
                    {ps}
                  </button>
                );
              })}
            </div>

            {/* Add Custom Skill input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add custom skill tag (e.g. Redux)..."
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCustomSkill(e);
                  }
                }}
                className="flex-1 px-3.5 py-2 rounded-2xl border border-[#E9E2F5] text-xs text-[#171329] placeholder-[#9892AB] focus:outline-none focus:border-[#7C3AED] bg-[#FAF9FF]"
              />
              <button
                type="button"
                onClick={addCustomSkill}
                className="px-4 py-2 rounded-2xl bg-white border border-[#E9E2F5] hover:border-[#7C3AED] hover:text-[#7C3AED] text-xs font-bold text-[#171329] transition-colors cursor-pointer"
              >
                <Plus size={14} className="inline mr-1" />
                Add
              </button>
            </div>
            {errors.skills && (
              <p className="text-xs text-[#E11D48] mt-1 flex items-center gap-1">
                <AlertCircle size={13} /> {errors.skills}
              </p>
            )}
          </div>

          {/* Urgency & Preferred Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#171329] mb-1.5">
                Urgency Level
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setUrgency('medium')}
                  className={`py-2 px-3 rounded-2xl text-xs font-bold transition-all cursor-pointer border ${
                    urgency === 'medium'
                      ? 'bg-[#F5F0FF] text-[#7C3AED] border-[#7C3AED] shadow-xs'
                      : 'bg-white text-[#6B6680] border-[#E9E2F5] hover:text-[#171329]'
                  }`}
                >
                  Normal
                </button>
                <button
                  type="button"
                  onClick={() => setUrgency('high')}
                  className={`py-2 px-3 rounded-2xl text-xs font-bold transition-all cursor-pointer border ${
                    urgency === 'high'
                      ? 'bg-[#FFF1F2] text-[#E11D48] border-[#E11D48] shadow-xs'
                      : 'bg-white text-[#6B6680] border-[#E9E2F5] hover:text-[#E11D48]'
                  }`}
                >
                  Urgent ⚡
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#171329] mb-1.5">
                Preferred Duration
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {durations.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDuration(d)}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border text-center ${
                      duration === d
                        ? 'bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white border-transparent shadow-xs'
                        : 'bg-white text-[#6B6680] border-[#E9E2F5] hover:text-[#7C3AED]'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bounty Points */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#171329] flex items-center gap-1.5">
                <Coins size={15} className="text-[#7C3AED]" />
                Bounty Points Offer
              </label>
              <span className="text-xs font-bold text-[#7C3AED] px-3 py-0.5 rounded-full bg-[#F5F0FF] border border-[#E9E2F5]">
                +{bounty} points
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={bounty}
              onChange={(e) => setBounty(Number(e.target.value))}
              className="w-full h-2 bg-[#EDE9FE] rounded-lg appearance-none cursor-pointer accent-[#7C3AED]"
            />
            <div className="flex justify-between text-xs text-[#6B6680] mt-1.5">
              <span>10 pts (Quick fix)</span>
              <span>50 pts (Standard)</span>
              <span>100 pts (Complex)</span>
            </div>
            {errors.bounty && (
              <p className="text-xs text-[#E11D48] mt-1">{errors.bounty}</p>
            )}
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-[#E9E2F5] flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={closePostDoubtModal}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="md"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Publishing...' : 'Publish Doubt'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
