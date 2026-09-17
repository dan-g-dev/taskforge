import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopBar } from './components/TopBar';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ClientLogos } from './components/ClientLogos';
import { GanttSection } from './components/GanttSection';
import { TimesheetsSection } from './components/TimesheetsSection';
import { CustomizationSection } from './components/CustomizationSection';
import { AiSection } from './components/AiSection';
import { ConnectedIntelligence } from './components/ConnectedIntelligence';
import { IntegrationsSection } from './components/IntegrationsSection';
import { StatsSection } from './components/StatsSection';
import { RatingsAndAwards } from './components/RatingsAndAwards';
import { MobileAppSection } from './components/MobileAppSection';
import { PreFooterCta } from './components/PreFooterCta';
import { FaqSection } from './components/FaqSection';
import { ResourceCards } from './components/ResourceCards';
import { Footer } from './components/Footer';
import { SignUpModal } from './components/SignUpModal';
import { RequestDemoModal } from './components/RequestDemoModal';
import { AskZiaDrawer } from './components/AskZiaDrawer';

export function App() {
  const navigate = useNavigate();
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isZiaOpen, setIsZiaOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-[#E42525] selection:text-white">
      {/* Top utility notification bar */}
      <TopBar onSignInClick={() => navigate('/app')} />

      {/* Main sticky navigation */}
      <Navbar
        onSignUpClick={() => setIsSignUpOpen(true)}
        onRequestDemoClick={() => setIsDemoOpen(true)}
        onAskZiaClick={() => setIsZiaOpen(true)}
      />

      {/* Main Landing Sections */}
      <main>
        <HeroSection
          onSignUpClick={() => setIsSignUpOpen(true)}
          onRequestDemoClick={() => setIsDemoOpen(true)}
        />

        <ClientLogos />

        <div id="gantt">
          <GanttSection />
        </div>

        <div id="timesheets">
          <TimesheetsSection />
        </div>

        <div id="customization">
          <CustomizationSection />
        </div>

        <div id="ai">
          <AiSection />
        </div>

        <ConnectedIntelligence />

        <div id="integrations">
          <IntegrationsSection />
        </div>

        <StatsSection />

        <div id="ratings">
          <RatingsAndAwards />
        </div>

        <MobileAppSection />

        <PreFooterCta onSignUpClick={() => setIsSignUpOpen(true)} />

        <div id="faq">
          <FaqSection />
        </div>

        <ResourceCards />
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Modals & Slide-out Drawers */}
      <SignUpModal
        isOpen={isSignUpOpen}
        onClose={() => setIsSignUpOpen(false)}
      />

      <RequestDemoModal
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
      />

      <AskZiaDrawer
        isOpen={isZiaOpen}
        onClose={() => setIsZiaOpen(false)}
      />
    </div>
  );
}

export default App;
