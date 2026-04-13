import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../hooks/useAuth";
import type { BlogPost } from "../../types/models";

export default function AdminDashboardPage() {
  const { signOut, user } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });
    setPosts(data ?? []);
    setLoading(false);
  }

  async function togglePublish(post: BlogPost) {
    await supabase
      .from("blog_posts")
      .update({ is_published: !post.is_published })
      .eq("blog_id", post.blog_id);
    fetchPosts();
  }

  async function deletePost(id: string) {
    if (!confirm("Delete this post? This cannot be undone.")) return;

    // 1. Get the post data first to identify images to delete
    const { data: post } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("blog_id", id)
      .single();

    if (post) {
      const pathsToDelete: string[] = [];

      // Extract cover image path
      if (post.cover_image_url?.includes("blog-images")) {
        const path = post.cover_image_url.split("/blog-images/")[1];
        if (path) pathsToDelete.push(path);
      }

      // Extract block image paths
      if (post.blocks && Array.isArray(post.blocks)) {
        post.blocks.forEach((block: any) => {
          if (
            block.type === "image" &&
            block.imageUrl?.includes("blog-images")
          ) {
            const path = block.imageUrl.split("/blog-images/")[1];
            if (path) pathsToDelete.push(path);
          }
        });
      }

      // 2. Remove files from Supabase Storage
      if (pathsToDelete.length > 0) {
        const { error } = await supabase.storage
          .from("blog-images")
          .remove(pathsToDelete);
        if (error) console.error("Error deleting images:", error);
      }
    }

    // 3. Delete the database record
    const { error: dbError } = await supabase
      .from("blog_posts")
      .delete()
      .eq("blog_id", id);
    if (dbError) {
      alert("Delete failed: " + dbError.message);
    } else {
      fetchPosts();
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Bar */}
      <header className="bg-[#0E0E0E] border-b border-[#1F1F1F] px-6 py-4 flex items-center justify-between">
        <h1 className="font-bold text-lg">TEDxUOK Admin</h1>
        <div className="flex items-center gap-4">
          <span className="text-white/40 text-sm">{user?.email}</span>
          <button
            onClick={signOut}
            className="text-sm text-white/40 hover:text-white transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Blog Posts</h2>
          <Link
            to="/admin/blog/new"
            className="bg-[#EB0028] text-white px-5 py-2 rounded-full font-medium hover:bg-[#c7001f] transition-colors text-sm"
          >
            + New Post
          </Link>
        </div>

        {loading ? (
          <div className="text-white/40 text-center py-12">
            Loading posts...
          </div>
        ) : posts.length === 0 ? (
          <div className="text-white/40 text-center py-12 border-2 border-dashed border-[#1F1F1F] rounded-xl">
            No posts yet. Create your first one!
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <div
                key={post.blog_id}
                className="bg-[#0E0E0E] border border-[#1F1F1F] rounded-xl p-5 flex items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">
                    {post.title || "Untitled"}
                  </h3>
                  <p className="text-white/40 text-sm mt-1">
                    /{post.slug} · {post.author_name} ·{" "}
                    {post.published_at
                      ? new Date(post.published_at).toLocaleDateString()
                      : "No date"}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      post.is_published
                        ? "bg-green-500/20 text-green-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {post.is_published ? "Published" : "Draft"}
                  </span>
                  <button
                    onClick={() => togglePublish(post)}
                    className="text-xs text-white/40 hover:text-white border border-[#1F1F1F] hover:border-white/30 px-3 py-1 rounded-full transition-all"
                  >
                    {post.is_published ? "Unpublish" : "Publish"}
                  </button>
                  <Link
                    to={`/admin/blog/edit/${post.blog_id}`}
                    className="text-xs text-white/40 hover:text-white border border-[#1F1F1F] hover:border-white/30 px-3 py-1 rounded-full transition-all"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deletePost(post.blog_id)}
                    className="text-xs text-red-500/60 hover:text-red-400 border border-red-500/20 hover:border-red-400/40 px-3 py-1 rounded-full transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}