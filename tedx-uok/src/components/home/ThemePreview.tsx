import { ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";
import { Link } from "react-router-dom";
import { formatTedxText } from "../../utils/textFormatting";

const subPillars = [
  {
    title: "Innovation",
    description: "Pushing boundaries and challenging conventional thinking.",
  },
  {
    title: "Resilience",
    description: "Building strength through adversity and emerging stronger.",
  },
  {
    title: "Connection",
    description: "Bridging gaps between communities and perspectives.",
  },
];

const themePreview = {
  sectionTitle: "TEDx UoK 2026 Theme",
  title: "UNCHARTED",
  subtitle: "Ideas worth spreading",
  description:
    "Progress begins at the edge of the known. UNCHARTED explores ideas born in uncertainty, where curiosity challenges convention, boundaries are questioned, and new perspectives emerge. At TEDx UoK 2026, the theme invites thinkers, creators, and storytellers to venture beyond the familiar and reimagine what is possible.",
  ctaLabel: "Explore the Theme",
  ctaLink: "/theme",
};

export function ThemePreview() {
  return (
    <section className="py-24 bg-background border-t border-border">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-sm font-medium text-primary uppercase tracking-widest mb-4">
              {themePreview.sectionTitle}
            </p>

            <h2 className="text-4xl md:text-5xl lg:text-7xl font-extrabold leading-tight mb-2 text-foreground">
              {formatTedxText(themePreview.title)}
            </h2>

            <h3 className="text-2xl md:text-3xl font-light text-muted-foreground mb-6">
              {formatTedxText(themePreview.subtitle)}
            </h3>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {formatTedxText(themePreview.description)}
            </p>

            <Link to={themePreview.ctaLink}>
              <Button variant="tedxSecondary" size="lg">
                {themePreview.ctaLabel}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {subPillars.map((pillar, index) => (
              <div
                key={pillar.title}
                className="flex gap-6 p-6 border border-border rounded-xl bg-card hover:border-primary/50 transition-colors"
              >
                <span className="text-3xl font-bold text-primary/30">
                  0{index + 1}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-1">
                    {pillar.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
