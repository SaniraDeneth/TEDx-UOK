import { useState, useEffect, useRef } from "react";
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

// Unique ID (Valid UUID for PostgreSQL)
const uid = () => crypto.randomUUID();

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
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const prevCoverUrlRef = useRef<string>("");

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
        prevCoverUrlRef.current = data.cover_image_url ?? "";
      });
  }, [id]);

  // Auto-generate slug from title
  useEffect(() => {
    if (!slugManuallyEdited && title) {
      setSlug(toSlug(title));
    }
  }, [title, slugManuallyEdited]);

  async function deleteStorageFile(url: string) {
    if (!url || !url.includes("blog-images")) return;
    
    try {
      const match = url.match(/\/blog-images\/(.+)$/);
      if (!match) return;
      
      const cleanPath = decodeURIComponent(match[1].split("?")[0]);
      const filenameOnly = cleanPath.split("/").pop() || "";
      const folder = cleanPath.includes("/") ? cleanPath.split("/")[0] : "blog-cover";

      // Try deleting using multiple potential path variations for maximum reliability
      await supabase.storage
        .from("blog-images")
        .remove([cleanPath, filenameOnly, `${folder}/${filenameOnly}`]);
    } catch (err) {
      // Sliently handle parsing errors
    }
  }

  async function handleCoverUpload(file: File) {
    setIsUploadingCover(true);
    const ext = file.name.split(".").pop();
    const path = `blog-cover/${Date.now()}-${uid()}.${ext}`;

    const { error } = await supabase.storage
      .from("blog-images")
      .upload(path, file);

    if (error) {
      alert("Upload failed: " + error.message);
      setIsUploadingCover(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("blog-images").getPublicUrl(path);

    setCoverImageUrl(publicUrl);
    setIsUploadingCover(false);
  }

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

    // 1. Get current post data to find images being replaced
    let oldImageUrls: string[] = [];
    if (isEditing) {
      const { data: oldPost } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("blog_id", id)
        .single();
      
      if (oldPost) {
        if (oldPost.cover_image_url) oldImageUrls.push(oldPost.cover_image_url);
        if (oldPost.blocks) {
          oldPost.blocks.forEach((b: any) => {
            if (b.type === "image" && b.imageUrl) oldImageUrls.push(b.imageUrl);
          });
        }
      }
    }

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

    let success = false;
    if (isEditing) {
      const { error } = await supabase
        .from("blog_posts")
        .update(payload)
        .eq("blog_id", id);
      if (error) {
        console.error("Update Error:", error);
        alert(`Update failed: ${error.message}`);
      } else {
        success = true;
      }
    } else {
      const { error } = await supabase.from("blog_posts").insert(payload);
      if (error) {
        console.error("Insert Error:", error);
        alert(`Create failed: ${error.message}`);
      } else {
        success = true;
      }
    }

    if (success) {
      // 2. Perform cleanup of abandoned images
      const newImageUrls = [
        coverImageUrl,
        ...blocks
          .filter(b => b.type === "image" && b.imageUrl)
          .map(b => b.imageUrl as string)
      ];

      const abandonedUrls = oldImageUrls.filter(url => !newImageUrls.includes(url));
      
      for (const url of abandonedUrls) {
        await deleteStorageFile(url);
      }

      setSaving(false);
      navigate("/admin/dashboard");
    } else {
      setSaving(false);
    }
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
                Cover Image
              </label>
              <div className="space-y-3">
                {coverImageUrl ? (
                  <div className="relative group">
                    <img
                      src={`${coverImageUrl}?t=${Date.now()}`}
                      alt="Cover preview"
                      className="w-full h-40 object-cover rounded-lg border border-[#1F1F1F]"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-lg">
                      <button
                        type="button"
                        onClick={() => coverInputRef.current?.click()}
                        className="px-3 py-1 bg-white text-black text-xs font-bold rounded hover:bg-[#EB0028] hover:text-white transition-colors"
                      >
                        Change Image
                      </button>
                      <button
                        type="button"
                        onClick={() => setCoverImageUrl("")}
                        className="px-3 py-1 bg-black/60 text-white text-xs font-bold rounded hover:bg-red-600 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => coverInputRef.current?.click()}
                    className="w-full h-40 border-2 border-dashed border-[#1F1F1F] hover:border-[#EB0028] rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all group"
                  >
                    {isUploadingCover ? (
                      <p className="text-white/40 text-sm animate-pulse">
                        Uploading...
                      </p>
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded-full bg-[#1F1F1F] group-hover:bg-[#EB0028]/10 flex items-center justify-center mb-2 transition-colors">
                          <span className="text-white/40 group-hover:text-[#EB0028]">
                            +
                          </span>
                        </div>
                        <p className="text-white/40 text-sm font-medium">
                          Click to upload cover image
                        </p>
                        <p className="text-white/20 text-xs mt-1">
                          Recommended: 1200x630px
                        </p>
                      </>
                    )}
                  </div>
                )}

                {/* Optional: manual URL input */}
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={coverImageUrl}
                    onChange={(e) => setCoverImageUrl(e.target.value)}
                    placeholder="Or paste image URL here..."
                    className="flex-1 bg-black border-2 border-[#1F1F1F] focus:border-[#EB0028] rounded-lg px-4 py-2 text-white text-xs outline-none transition-all"
                  />
                </div>
              </div>

              {/* Hidden file input */}
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleCoverUpload(file);
                  e.target.value = "";
                }}
              />
            </div>
          </div>
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
