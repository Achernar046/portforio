import dynamic from "next/dynamic";
import NetworkCanvas from "@/components/NetworkCanvas";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import SkillsSection from "@/components/sections/SkillsSection";

/* ── Lazy-load below-the-fold sections ── */
const ProjectsSection     = dynamic(() => import("@/components/sections/ProjectsSection"));
const LabSection          = dynamic(() => import("@/components/sections/LabSection"));
const AchievementsSection = dynamic(() => import("@/components/sections/AchievementsSection"));
const LearningSection     = dynamic(() => import("@/components/sections/LearningSection"));
const CertificatesSection = dynamic(() => import("@/components/sections/CertificatesSection"));
const ContactSection      = dynamic(() => import("@/components/sections/ContactSection"));
const GallerySection      = dynamic(() => import("@/components/sections/GallerySection"));
const Footer              = dynamic(() => import("@/components/Footer"));

export default function Home() {
  return (
    <main className="relative min-h-screen">
      {/* Animated network background */}
      <NetworkCanvas />

      {/* Subtle radial gradient overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-800/5 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <Navbar />

      {/* Above-the-fold sections — loaded immediately */}
      <HeroSection />
      <AboutSection />
      <SkillsSection />

      {/* Below-the-fold sections — lazy loaded */}
      <ProjectsSection />
      <LabSection />
      <AchievementsSection />
      <LearningSection />
      <CertificatesSection />
      <ContactSection />
      <GallerySection />
      <Footer />
    </main>
  );
}
