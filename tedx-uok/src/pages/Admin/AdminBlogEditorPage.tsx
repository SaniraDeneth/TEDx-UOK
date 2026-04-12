import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import BlockEditor from "./BlockEditor";
import { blocksToHtml } from "../../types/block";
import type { Block } from "../../types/block";

// Slug generator
const toSlug = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// Unique ID
const uid = () => Math.random().toString(36).slice(2, 9);

export default function AdminBlogEditorPage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [authorName, setAuthorName] = useState("TEDxUOK Team");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isPublished, setIsPublished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  // Load existing post
  useEffect(() => {
    if (!id) return;
    supabase
      .from("blog_posts")
      .select("*")
      .eq("blog_id", id)
      .single()
      .then(({ data }) => {
        if (!data) return;
        setTitle(data.title);
        setSlug(data.slug);
        setAuthorName(data.author_name);
        setCoverImageUrl(data.cover_image_url ?? "");
        setBlocks(data.blocks ?? []);
        setIsPublished(data.is_published);
        setSlugManuallyEdited(true); // Don't auto-overwrite slug on edit
      });
  }, [id]);

  // Auto-generate slug from title
  useEffect(() => {
    if (!slugManuallyEdited && title) {
      setSlug(toSlug(title));
    }
  }, [title, slugManuallyEdited]);

  async function handleSave(publish?: boolean) {
    if (!title.trim()) {
      alert("Please enter a title.");
      return;
    }
    if (!slug.trim()) {
      alert("Slug is required.");
      return;
    }

    setSaving(true);
    const htmlContent = blocksToHtml(blocks);
    const shouldPublish = publish ?? isPublished;

    const payload = {
      title,
      slug,
      author_name: authorName,
      cover_image_url: coverImageUrl || null,
      content: htmlContent,
      blocks,
      is_published: shouldPublish,
      published_at: shouldPublish ? new Date().toISOString() : null,
    };

    if (isEditing) {
      const { error } = await supabase
        .from("blog_posts")
        .update(payload)
        .eq("blog_id", id);
      if (error) {
        alert("Save failed: " + error.message);
        setSaving(false);
        return;
      }
    } else {
      const { error } = await supabase
        .from("blog_posts")
        .insert({ ...payload, blog_id: uid() });
      if (error) {
        alert("Save failed: " + error.message);
        setSaving(false);
        return;
      }
    }

    setSaving(false);
    if (publish || isEditing) navigate("/admin/dashboard");
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-[#0E0E0E] border-b border-[#1F1F1F] px-6 py-3 flex items-center justify-between">
        <Link
          to="/admin/dashboard"
          className="text-white/40 hover:text-white text-sm transition-colors"
        >
          ← Back to Dashboard
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="text-sm px-4 py-2 border border-[#1F1F1F] hover:border-white/30 text-white/60 hover:text-white rounded-full transition-all"
          >
            {saving ? "Saving..." : "Save Draft"}
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="text-sm px-4 py-2 bg-[#EB0028] hover:bg-[#c7001f] text-white rounded-full transition-all font-medium disabled:opacity-50"
          >
            {isPublished ? "Update & Keep Published" : "Publish"}
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10 space-y-8">
        {/* Post Metadata */}
        <section className="bg-[#0E0E0E] border border-[#1F1F1F] rounded-xl p-6 space-y-5">
          <h2 className="text-sm font-semibold text-white/40 uppercase tracking-wider">
            Post Details
          </h2>
          <div>
            <label className="block text-sm text-white/60 mb-1">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title..."
              className="w-full bg-black border-2 border-[#1F1F1F] focus:border-[#EB0028] rounded-lg px-4 py-3 text-white text-xl font-bold outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-1">
              URL Slug *
            </label>
            <div className="flex items-center gap-2">
              <span className="text-white/20 text-sm">/blog/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlug(toSlug(e.target.value));
                  setSlugManuallyEdited(true);
                }}
                className="flex-1 bg-black border-2 border-[#1F1F1F] focus:border-[#EB0028] rounded-lg px-4 py-2 text-white text-sm outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/60 mb-1">
                Author Name
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full bg-black border-2 border-[#1F1F1F] focus:border-[#EB0028] rounded-lg px-4 py-2 text-white text-sm outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1">
                Cover Image URL
              </label>
              <input
                type="url"
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-black border-2 border-[#1F1F1F] focus:border-[#EB0028] rounded-lg px-4 py-2 text-white text-sm outline-none transition-all"
              />
            </div>
          </div>

          {coverImageUrl && (
            <img
              src={coverImageUrl}
              alt="cover"
              className="w-full h-40 object-cover rounded-lg"
            />
          )}
        </section>

        {/* Block Editor */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-white/40 uppercase tracking-wider">
            Content Blocks
          </h2>
          <BlockEditor blocks={blocks} onChange={setBlocks} />
        </section>

        {/* Preview */}
        {blocks.length > 0 && (
          <section className="bg-[#0E0E0E] border border-[#1F1F1F] rounded-xl p-6">
            <h2 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">
              HTML Preview
            </h2>
            <div
              className="prose prose-invert prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: blocksToHtml(blocks) }}
            />
          </section>
        )}
      </main>
    </div>
  );
}
