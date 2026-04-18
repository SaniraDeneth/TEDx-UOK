import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export interface EventData {
  id: string;
  name: string;
  theme: string;
  description: string; // Needed for your new Theme section
  date: string;
  venue_id: string;
  venues?: {
    name: string;
    address: string;
    city: string;
  };
}

export const useEvents = () => {
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEventViaSettings = async () => {
      try {
        setLoading(true);

        // 1. Get the Global Settings to find out WHICH event is current
        const { data: settingsData, error: settingsError } = await supabase
          .from("settings")
          .select("current_event_id")
          .maybeSingle(); // Switch to maybeSingle to avoid 406 error if empty

        if (settingsError) {
          console.error("Settings Fetch Error:", settingsError);
          throw settingsError;
        }
        
        if (!settingsData) {
          console.warn("No settings found in 'settings' table. Please run the seed script.");
          setLoading(false);
          return;
        }

        if (!settingsData.current_event_id) {
          throw new Error("No current_event_id set in Settings table");
        }

        // 2. Fetch THAT specific event (and its venue)
        const { data: eventData, error: eventError } = await supabase
          .from("events")
          .select("*, venues(*)")
          .eq("event_id", settingsData.current_event_id)
          .maybeSingle(); // Switch to maybeSingle to handle missing event gracefully

        if (eventError) {
          console.error("Event Fetch Error for ID:", settingsData.current_event_id, eventError);
          throw eventError;
        }

        if (!eventData) {
          console.warn(`Event not found for ID: ${settingsData.current_event_id}`);
        }

        setEvent(eventData);
      } catch (err: any) {
        console.error("useEvents Hook Error:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEventViaSettings();
  }, []);

  return { event, loading, error };
};
