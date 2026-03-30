import { formatTedxText } from '../../utils/textFormatting';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft } from 'lucide-react';
import SEO from "../../components/common/SEO";

const aboutTedxUokContent = {
  title: "About TEDx UoK - Our Mission and Story",
  paragraphs: [
    "TEDx UoK is an independently organised TEDx event based at the University of Kelaniya, created with the aim of assembling thinkers, innovators, and storytellers who are shaping ideas that matter.",
    "Rooted in a university known for academic excellence and cultural diversity, TEDx UoK serves as a platform for meaningful conversations that challenge assumptions, explore new perspectives, and spark meaningful dialogue. The event celebrates ideas that emerge from curiosity, courage, and the willingness to move beyond the familiar.",
    "TEDx UoK is organised by a passionate team of students and volunteers which reflects a commitment to intellectual openness and interdisciplinary thinking. It provides a space where voices from varied backgrounds such as academic, industry, arts, scientific, and community backgrounds can share insights that reverberate both locally and globally.",
  ],
};

export default function AboutTedxUokPage() {
  return (
    <div className="min-h-screen bg-background text-foreground pt-20">
      <SEO 
        title="About TEDxUOK | Our Story, Mission & Vision" 
        description="TEDxUOK is the flagship independently licensed TED event at the University of Kelaniya. Uncover our story, mission, and the vision driving ideas in Sri Lanka." 
        url="https://tedxuok.org/about/tedx-uok" 
      />
      {/* Hero Section */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 md:mb-8">
            {formatTedxText("TEDx UoK", true)}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto px-2">
            Spreading ideas worth sharing at the University of Kelaniya.
          </p>
        </div>

        {/* Mission & Story */}
        <div className="mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground mb-6 md:mb-8 text-center md:text-left">
            {aboutTedxUokContent.title}
          </h2>
          <div className="bg-card border border-border rounded-lg p-8 space-y-6">
            {aboutTedxUokContent.paragraphs.map((paragraph, index) => (
              <p key={index} className="text-lg text-muted-foreground leading-relaxed">
                {formatTedxText(paragraph)}
              </p>
            ))}
          </div>
        </div>

        {/* Theme Intro */}
        <div className="mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground mb-6 md:mb-8 text-center md:text-left">
            {formatTedxText("TEDx UoK 2026 Theme: UNCHARTED", true)}
          </h2>
          <div className="bg-card border border-border rounded-lg p-8">
            <h3 className="text-2xl font-bold text-foreground mb-4">What is UNCHARTED?</h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Progress begins at the edge of the known. UNCHARTED explores ideas born in uncertainty, where curiosity challenges convention, boundaries are questioned, and new perspectives emerge.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              At TEDx UoK 2026, the theme invites thinkers, creators, and storytellers to venture beyond the familiar and reimagine what is possible.
            </p>
          </div>
        </div>

        {/* Event Goals */}
        <div className="mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground mb-6 md:mb-8 text-center md:text-left">Event Goals & Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-2xl font-bold text-primary mb-4">Short-term Goals</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span className="text-muted-foreground">Curate 10+ inspiring talks from diverse fields</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span className="text-muted-foreground">Engage 500+ attendees from university and community</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span className="text-muted-foreground">Foster interdisciplinary connections among students</span>
                </li>
              </ul>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-2xl font-bold text-foreground mb-4">Long-term Impact</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-foreground mr-2">•</span>
                  <span className="text-muted-foreground">Establish annual tradition of idea-sharing</span>
                </li>
                <li className="flex items-start">
                  <span className="text-foreground mr-2">•</span>
                  <span className="text-muted-foreground">Create alumni network of speakers and thinkers</span>
                </li>
                <li className="flex items-start">
                  <span className="text-muted-foreground">Inspire innovation and research collaborations</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground mb-6 md:mb-8 text-center">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 border border-border rounded-lg bg-card">
              <div className="text-4xl font-bold text-primary mb-2">1st</div>
              <h4 className="text-lg font-bold text-foreground mb-2">Licensed Event</h4>
              <p className="text-muted-foreground text-sm">First TEDx at University of Kelaniya</p>
            </div>
            <div className="text-center p-6 border border-border rounded-lg bg-card">
              <div className="text-4xl font-bold text-primary mb-2">100%</div>
              <h4 className="text-lg font-bold text-foreground mb-2">Student-Led</h4>
              <p className="text-muted-foreground text-sm">Organized by passionate volunteers</p>
            </div>
            <div className="text-center p-6 border border-border rounded-lg bg-card">
              <div className="text-4xl font-bold text-primary mb-2">∞</div>
              <h4 className="text-lg font-bold text-foreground mb-2">Ideas Shared</h4>
              <p className="text-muted-foreground text-sm">Unlimited potential for impact</p>
            </div>
          </div>
        </div>

        {/* Team CTA */}
        <div className="text-center">
          <Link
            to="/team"
            className="inline-flex items-center justify-center bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary/90 transition-colors duration-300 mb-8 w-full sm:w-auto"
          >
            Meet Our Team
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>

          <div className="pt-8 border-t border-border">
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Link
                to="/about/ted"
                className="border-2 border-foreground text-foreground px-6 py-2 rounded-full hover:bg-foreground hover:text-background transition-all duration-300"
              >
                About TED
              </Link>
              <Link
                to="/about/tedx"
                className="border-2 border-primary text-foreground px-6 py-2 rounded-full hover:bg-primary hover:text-white transition-all duration-300"
              >
                About {formatTedxText("TEDx")}
              </Link>
            </div>
            <Link
              to="/about"
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Back to About Overview
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}