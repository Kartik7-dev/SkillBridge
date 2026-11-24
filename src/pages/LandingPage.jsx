import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import HowItWorks from '../components/landing/HowItWorks';
import ExploreSkills from '../components/landing/ExploreSkills';
import FeaturedHelpers from '../components/landing/FeaturedHelpers';
import LiveDoubtBoard from '../components/landing/LiveDoubtBoard';
import ImpactStats from '../components/landing/ImpactStats';
import FinalCTA from '../components/landing/FinalCTA';
import Footer from '../components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <Hero />
      <HowItWorks />
      <ExploreSkills />
      <FeaturedHelpers />
      <LiveDoubtBoard />
      <ImpactStats />
      <FinalCTA />
      <Footer />
    </div>
  );
}
