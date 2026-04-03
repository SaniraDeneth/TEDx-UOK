import { formatTedxText } from "../../utils/textFormatting";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { supabase } from "../../lib/supabase";

import { useSEO } from "../../hooks/useSEO";
import { seoConfig } from "../../config/seo";

type FAQItem = {
  faq_item_id: string;
  faq_category_id: string;
  question: string;
  answer: string;
  display_order: number;
};

type FAQCategory = {
  faq_category_id: string;
  name: string;
  display_order: number;
  faq_items: FAQItem[];
};

type FAQGroup = {
  category: FAQCategory;
  items: FAQItem[];
  titleParts: { text: string; isRed: boolean }[];
};

export default function FAQPage() {
  useSEO(seoConfig.faq);

  const [openId, setOpenId] = useState<string | null>(null);
  const [faqGroups, setFaqGroups] = useState<FAQGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function splitTitle(title: string) {
    const words = title.split(" ");

    if (words.length === 1) {
      return [{ text: title, isRed: true }];
    }

    const lastWord = words.pop();

    return [
      { text: words.join(" ") + " ", isRed: false },
      { text: lastWord!, isRed: true },
    ];
  }

  useEffect(() => {
    async function fetchFAQs() {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("faq_categories")
          .select(`
            faq_category_id,
            name,
            display_order,
            faq_items (
              faq_item_id,
              faq_category_id,
              question,
              answer,
              display_order
            )
          `)
          .order("display_order", { ascending: true })
          .order("display_order", {
            foreignTable: "faq_items",
            ascending: true,
          });

        if (error) throw error;

        const groups: FAQGroup[] =
          data
            ?.filter((c) => c.faq_items.length > 0)
            .map((c) => ({
              category: c,
              items: c.faq_items,
              titleParts: splitTitle(c.name),
            })) || [];

        setFaqGroups(groups);
      } catch (err) {
        console.error(err);
        setError("Failed to load FAQ data.");
      } finally {
        setLoading(false);
      }
    }

    fetchFAQs();
  }, []);

  if (loading) {
    return (
      <main className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-white">Loading FAQs...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </main>
    );
  }

  return (
    <main className="bg-black w-full">
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 md:py-24 lg:py-32 space-y-16 md:space-y-24">

        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">
            Frequently <span className="text-[#EB0028]">Asked Questions</span>
          </h1>

          <p className="mx-auto max-w-2xl text-white">
            Answers to common questions about attending {formatTedxText("TEDx UoK")}.
          </p>
        </div>

        {faqGroups.map((group) => (
          <div key={group.category.faq_category_id}>

            <h2 className="text-2xl font-semibold text-center mb-10">
              {group.titleParts.map((p, i) => (
                <span key={i} className={p.isRed ? "text-[#EB0028]" : "text-white"}>
                  {p.text}
                </span>
              ))}
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              {group.items.map((item) => {
                const isOpen = openId === item.faq_item_id;

                return (
                  <div
                    key={item.faq_item_id}
                    className="rounded-2xl border border-[#1F1F1F] bg-[#0E0E0E] px-6"
                  >
                    <button
                      onClick={() =>
                        setOpenId(isOpen ? null : item.faq_item_id)
                      }
                      className="w-full flex justify-between py-6 text-left text-white"
                    >
                      <span>{item.question}</span>

                      <ChevronDown
                        className={`text-[#EB0028] transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <p className="pb-6 text-gray-300 border-t border-[#1F1F1F] pt-4 whitespace-pre-line">
                        {item.answer}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}