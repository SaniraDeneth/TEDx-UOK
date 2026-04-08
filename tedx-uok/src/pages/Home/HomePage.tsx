// import { supabase } from "../../api/supabaseClient";

// Import ALL Hooks
import { useEvents } from "../../hooks/useEvents";
// import { useSpeakers } from "../../hooks/useSpeakers";
// import { usePartners } from "../../hooks/usePartners";
import { useSettings } from "../../hooks/useSettings";

// Import Components
import About from "../../components/home/About";
import Countdown from "../../components/home/Countdown";
import CTASection from "../../components/home/CTASection";
import Hero from "../../components/home/Hero";
import Highlights from "../../components/home/Highlights";
// import Speakers, { type Speaker } from "../../components/home/Speakers";
import { ThemePreview } from "../../components/home/ThemePreview";
// import { Partners, type Partner } from "../../components/home/Partners";
import SEO from "../../components/common/SEO";

// const SPEAKER_BUCKET = import.meta.env.VITE_SUPABASE_BUCKET_SPEAKER_PHOTOS;
// const PARTNER_BUCKET = import.meta.env.VITE_SUPABASE_BUCKET_PARTNER_LOGOS;

// const getImageUrl = (path: string | null, bucketName: string) => {
//   if (!path)
//     return "https://ui-avatars.com/api/?name=TEDx&background=EB0028&color=fff&size=400";

//   if (path.startsWith("http")) return path;

//   // Uses the specific bucket passed to the function
//   const { data } = supabase.storage.from(bucketName).getPublicUrl(path);
//   return data.publicUrl;
// };

const HomePage = () => {
  const { settings, loading: settingsLoading } = useSettings();
  const { event, loading: eventLoading } = useEvents();
  // const { speakers: rawSpeakers, loading: speakersLoading } = useSpeakers(3);
  // const { partners: rawPartners, loading: partnersLoading } = usePartners();

  if (eventLoading || settingsLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 bg-[#EB0028] rounded-full mb-4 animate-bounce"></div>
          <p className="tracking-widest uppercase text-sm">
            Setting The Stage...
          </p>
        </div>
      </div>
    );
  }

  // const realSpeakers: Speaker[] = rawSpeakers.map((s) => ({
  //   id: s.speaker_id,
  //   name: s.full_name,
  //   title: s.title,
  //   talkTitle: s.talk_title || "To Be Announced",
  //   image: getImageUrl(s.photo_url, SPEAKER_BUCKET),
  // }));

  // const realPartners: Partner[] = rawPartners.map((p) => ({
  //   id: p.id,
  //   name: p.name,
  //   tier: p.tier,
  //   logo: getImageUrl(p.logo_url, PARTNER_BUCKET),
  // }));

  const eventDate = event?.date || null;

  const eventVenue = event?.venues?.name || null;

  const ctaLabel = settings?.primary_cta_label;
  const ctaLink = settings?.primary_cta_url;

  return (
    <>
      <SEO 
        title="TEDxUOK – Ideas Worth Spreading | Kelaniya" 
        description="Experience TEDxUOK at the University of Kelaniya — a stage for bold ideas, inspiring speakers, and transformative talks that connect Sri Lanka to the world." 
        url="https://tedxuok.org/" 
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Event",
          "name": "TEDx UoK",
          "description": "An independently organised TED event at the University of Kelaniya, Sri Lanka.",
          "url": "https://tedxuok.org/",
          ...(eventDate ? { "startDate": new Date(eventDate).toISOString() } : {}),
          "eventStatus": "https://schema.org/EventScheduled",
          "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
          "organizer": {
            "@type": "Organization",
            "name": "TEDx UoK",
            "url": "https://tedxuok.org/"
          },
          "location": {
            "@type": "Place",
            "name": eventVenue || "University of Kelaniya",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Kelaniya",
              "addressRegion": "Western Province",
              "addressCountry": "LK"
            }
          }
        }}
      />
      <div className="relative -top-16.25 min-h-screen bg-background">
        <Hero
          date={eventDate}
          venue={eventVenue}
          ctaLabel={ctaLabel}
          ctaLink={ctaLink}
        />
        <Countdown date={eventDate} />
        <About />
        <Highlights />
        <ThemePreview />
        {/* <Speakers speakers={realSpeakers} /> */}
        {/* <Partners partners={realPartners} /> */}
        <CTASection ctaLabel={ctaLabel} ctaLink={ctaLink} />
      </div>
    </>
  );
};

export default HomePage;
