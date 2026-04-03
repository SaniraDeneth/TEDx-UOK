import { Link } from 'react-router-dom';
import { ChevronLeft, ExternalLink, Film, GraduationCap, Library } from 'lucide-react';
import SEO from "../../components/common/SEO";

const aboutTedContent = {
  title: "About TED",
  paragraphs: [
    "TED is a nonprofit, nonpartisan organisation dedicated to discovering, debating, and spreading ideas that spark conversation, deepen understanding, and drive meaningful change. TED is devoted to curiosity, reason, wonder, and the pursuit of knowledge — without an agenda.",
    "Founded in 1984 as a conference where Technology, Entertainment, and Design converged, TED has since grown into a global platform covering science, business, education, arts, and global issues. TED’s initiatives include TED Talks, TED-Ed, podcasts, and thousands of independently organised TEDx events worldwide.",
  ],
};

const historyContent = {
  title: "History",
  items: [
    {
      year: "1984 - The Beginning",
      description:
        "TED began as a conference where Technology, Entertainment, and Design came together, creating a platform for sharing ideas across disciplines.",
    },
    {
      year: "2006 - Going Global",
      description:
        "TED Talks were first shared online, making powerful ideas freely accessible to a global audience and expanding TED’s reach beyond the conference stage.",
    },
    {
      year: "Today",
      heading: "A Global Platform",
      description:
        "TED has grown into a global platform, sharing ideas across a wide range of topics and languages, and increasing dialogue among communities around the world.",
    },
  ],
};

export default function AboutTedPage() {
  return (
    <div className="min-h-screen bg-background text-foreground pt-20">
      <SEO 
        title="What Is TED? | TEDxUOK University of Kelaniya" 
        description="Discover TED — Technology, Entertainment, Design. The global platform sharing ideas worth spreading through powerful short talks that inspire millions worldwide." 
        url="https://tedxuok.org/about/ted" 
      />
      {/* Hero Section */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 md:mb-8">
            <span className="text-primary">TED</span>
            <span className="text-foreground ml-2 sm:ml-4">: Ideas Worth Spreading</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto px-2">
            A global community welcoming people from every discipline and culture who seek a deeper understanding of the world.
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6 md:mb-8 text-center md:text-left">
            {aboutTedContent.title}
          </h2>
          <div className="bg-card border border-border rounded-lg p-6 md:p-8 space-y-6">
            {aboutTedContent.paragraphs.map((paragraph, index) => (
              <p key={index} className="text-xl text-muted-foreground leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* History Section */}
        <div className="mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6 md:mb-8 text-center md:text-left">{historyContent.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {historyContent.items.map((item, index) => (
              <div key={index} className="bg-card border border-border rounded-lg p-6">
                <div className="text-primary text-2xl font-bold mb-4">{item.year}</div>
                {item.heading && (
                  <h3 className="text-xl font-bold text-foreground mb-3">{item.heading}</h3>
                )}
                <p className="text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Initiatives */}
        <div className="mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6 md:mb-8 text-center md:text-left">Key Initiatives</h2>
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                  <Film className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">TED Talks</h3>
                  <p className="text-muted-foreground">Free videos from the world's most inspiring thinkers</p>
                </div>
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">TED Conferences</h3>
                  <p className="text-muted-foreground">Annual flagship events featuring world-changing ideas</p>
                </div>
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                  <Library className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">TED-Ed</h3>
                  <p className="text-muted-foreground">Lessons worth sharing for youth and education</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <a
            href="https://www.ted.com/about"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary/90 transition-colors duration-300 mb-8 w-full sm:w-auto"
          >
            Visit TED.com
            <ExternalLink className="w-5 h-5 ml-2" />
          </a>
          <div className="pt-8 border-t border-border">
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