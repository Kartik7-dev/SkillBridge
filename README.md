# SkillBridge 🎓✨

> **Peer-to-Peer Academic & Technical Mentorship Platform**  
> Connect with student mentors who know your course syllabus, match with peers through intelligent radar-based matching, and collaborate over real-time video calls with built-in gamification.

---

## 🌟 Key Features

- **⚡ Smart Peer Matching**: Real-time algorithmic matching based on course syllabus, skills, peer availability, response rate, and reputation score with an interactive radar sweep visualization.
- **📹 Live Video Mentorship Room**: Real-time video conferencing powered by Jitsi Meet, complete with camera/microphone controls, screen sharing, live chat, session timer with proximity alerts, and collaborative notes.
- **🎯 Dynamic Doubt Board**: Search, filter, and discover academic and technical doubts by subject, university course, urgency, and skill tags.
- **🏆 Gamification & Progression**:
  - XP progression system with level-up modals and floating XP badges
  - Real-time podium leaderboard celebrating top student contributors
  - Badge rewards and peer karma reputation
- **🎨 Refined Design System**: Purple/lavender minimalist design built with modern Motion animations, responsive navigation, and accessible dark/light high-contrast elements.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4
- **Animation**: Motion (`motion/react`)
- **Icons**: Lucide React
- **Video Conferencing**: Jitsi Meet IFrame External API
- **State & Storage**: React Context API with LocalStorage sync and multi-tab broadcast synchronization
- **Code Quality**: Oxlint

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Kartik7-dev/SkillBridge.git
   cd SkillBridge
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

### Production Build

```bash
npm run build
npm run preview
```

---

## 📄 License

This project is licensed under the MIT License.
