import Logo from '../shared/Logo';

const footerLinks = [
  {
    title: 'Platform',
    links: ['How it works', 'Explore Doubts', 'Find Helpers', 'Leaderboard'],
  },
  {
    title: 'Resources',
    links: ['Community Guidelines', 'Honor Code', 'Help Center', 'Safety Standards'],
  },
  {
    title: 'Community',
    links: ['Campus Chapters', 'Discord Server', 'Top Mentors', 'Student Ambassador'],
  },
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#E9E2F5] relative z-10">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Logo size="sm" />
            <p className="mt-4 text-xs sm:text-sm text-[#6B6680] leading-relaxed max-w-xs font-sans">
              Peer-to-peer micro-mentorship and real-time doubt solving platform for college students.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF9FF] border border-[#E9E2F5] text-xs font-medium text-[#7C3AED]">
              <span className="w-2 h-2 rounded-full bg-[#A3E635]"></span>
              <span>All Systems Operational</span>
            </div>
          </div>

          {/* Link columns */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="font-heading font-bold text-[#171329] text-xs uppercase tracking-wider mb-4">
                {group.title}
              </h4>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-xs sm:text-sm text-[#6B6680] hover:text-[#7C3AED] transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-[#E9E2F5] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#6B6680]">
            &copy; {new Date().getFullYear()} SkillBridge. All rights reserved. Built with purple precision.
          </p>
          <div className="flex gap-6 text-xs text-[#6B6680]">
            <a href="#" className="hover:text-[#7C3AED] transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-[#7C3AED] transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-[#7C3AED] transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
