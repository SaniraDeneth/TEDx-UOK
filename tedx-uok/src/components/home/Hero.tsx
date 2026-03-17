import { ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";
import { Link } from "react-router-dom";
import { formatTedxText } from "../../utils/textFormatting";
import DensePulseMap from "./DensePulseMap";

interface props {
  date: string | null;
  venue: string | null;
  theme: string | null;
  ctaLabel?: string;
  ctaLink?: string;
}

const Hero = ({ date, venue, theme, ctaLabel, ctaLink }: props) => {
  const eventDate = date
    ? new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    : "Date To Be Announced";

  const eventVenue = venue || "Venue To Be Annouced";
  const eventTheme = theme || "Theme To Be Annouced";
  const primaryLabel = ctaLabel || "Register Now";
  const primaryLink = ctaLink || "/register";

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Subtle Red Accent Line */}
      <div className="absolute left-0 top-1/4 w-1 h-32 bg-primary" />

      <div className="container mx-auto px-6 pt-24 pb-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            {/* Event Badge */}
            <div className="inline-flex items-center gap-2 mb-8 opacity-0 animate-fade-in-up">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium uppercase text-muted-foreground tracking-widest">
                Independently Organized {formatTedxText("TEDx")} Event
              </span>
            </div>

            {/* Main Title */}
            <h1 className="relative text-5xl md:text-7xl lg:text-8xl font-extrabold leading-[0.95] mb-6 opacity-0 animate-fade-in-up animation-delay-100">
              {formatTedxText("TEDx UoK", true)}
            </h1>

            {/* Theme */}
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-foreground mb-8 opacity-0 animate-fade-in-up animation-delay-200">
              {formatTedxText(eventTheme, true)}
            </h2>

            {/* Event Details */}
            <div className="flex flex-col sm:flex-row gap-6 mb-12 opacity-0 animate-fade-in-up animation-delay-300">
              <div className="flex items-center gap-3">
                <div className="w-px h-8 bg-primary" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Date
                  </p>
                  <p className="text-lg font-medium text-foreground">
                    {eventDate}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-px h-8 bg-border" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Venue
                  </p>
                  <p className="text-lg font-medium text-foreground">
                    {eventVenue}
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-in-up animation-delay-400">
              <Link to={primaryLink}>
                <Button variant="tedxPrimary" size="xl">
                  {primaryLabel}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="tedxSecondary" size="xl">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Visual Element - Sri Lanka Pulse Map */}
          <div className="hidden lg:flex items-center justify-end relative opacity-0 animate-fade-in animation-delay-300 pr-0 mr-[-20%]">
            <div className="relative w-full aspect-square max-w-2xl translate-x-[-10%]">
              <DensePulseMap />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
