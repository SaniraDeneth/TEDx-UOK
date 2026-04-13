import { useState, useRef } from "react";
import { supabase } from "../../lib/supabase";
import type { Block, BlockType } from "../../types/block";

// Unique ID generator
const uid = () => Math.random().toString(36).slice(2, 9);

interface BlockEditorProps {
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
}

export default function BlockEditor({ blocks, onChange }: BlockEditorProps) {
  const [uploading, setUploading] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingImageBlockId, setPendingImageBlockId] = useState<string | null>(
    null
  );

  function addBlock(type: BlockType, afterId?: string) {
    const newBlock: Block = {
      id: uid(),
      type,
      content: "",
      level: type === "heading" ? 2 : undefined,
      align: type === "image" ? "center" : undefined,
    };

    if (!afterId) {
      onChange([...blocks, newBlock]);
      return;
    }

    const idx = blocks.findIndex((b) => b.id === afterId);
    const updated = [...blocks];
    updated.splice(idx + 1, 0, newBlock);
    onChange(updated);
  }

  async function updateBlock(id: string, changes: Partial<Block>) {
    onChange(blocks.map((b) => (b.id === id ? { ...b, ...changes } : b)));
  }

  async function deleteStorageFile(url: string) {
    if (!url || !url.includes("blog-images")) return;
    
    try {
      const match = url.match(/\/blog-images\/(.+)$/);
      if (!match) return;
      
      const cleanPath = decodeURIComponent(match[1].split("?")[0]);
      const filenameOnly = cleanPath.split("/").pop() || "";
      const folder = cleanPath.includes("/") ? cleanPath.split("/")[0] : "blog-cover";

      await supabase.storage
        .from("blog-images")
        .remove([cleanPath, filenameOnly, `${folder}/${filenameOnly}`]);
    } catch (err) {
      // Sliently handle errors
    }
  }

  async function removeBlock(id: string) {
    const block = blocks.find((b) => b.id === id);
    if (block?.type === "image" && block.imageUrl) {
      await deleteStorageFile(block.imageUrl);
    }
    onChange(blocks.filter((b) => b.id !== id));
  }

  function moveBlock(id: string, direction: "up" | "down") {
    const idx = blocks.findIndex((b) => b.id === id);
    if (direction === "up" && idx === 0) return;
    if (direction === "down" && idx === blocks.length - 1) return;

    const updated = [...blocks];
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    [updated[idx], updated[swapIdx]] = [updated[swapIdx], updated[idx]];
    onChange(updated);
  }

  async function handleImageUpload(blockId: string, file: File) {
    setUploading(blockId);
    const ext = file.name.split(".").pop();
    const path = `blog-content/${Date.now()}-${uid()}.${ext}`;

    const { error } = await supabase.storage
      .from("blog-images")
      .upload(path, file);

    if (error) {
      setUploading(null);
      alert("Upload failed: " + error.message);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("blog-images").getPublicUrl(path);

    updateBlock(blockId, { imageUrl: publicUrl });
    setUploading(null);
  }

  return (
    <div className="space-y-3">
      {blocks.length === 0 && (
        <p className="text-white/30 text-sm text-center py-8 border-2 border-dashed border-[#1F1F1F] rounded-lg">
          No blocks yet. Add one below.
        </p>
      )}

      {blocks.map((block, idx) => (
        <div
          key={block.id}
          className="group relative bg-[#0a0a0a] border border-[#1F1F1F] rounded-xl p-4 hover:border-[#EB0028]/30 transition-all"
        >
          {/* Block Controls */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-white/30 uppercase tracking-wider font-medium">
              {block.type}
              {block.type === "heading" ? ` H${block.level}` : ""}
            </span>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => moveBlock(block.id, "up")}
                disabled={idx === 0}
                className="p-1 text-white/40 hover:text-white disabled:opacity-20 text-xs"
              >
                ↑
              </button>
              <button
                onClick={() => moveBlock(block.id, "down")}
                disabled={idx === blocks.length - 1}
                className="p-1 text-white/40 hover:text-white disabled:opacity-20 text-xs"
              >
                ↓
              </button>

              {/* Heading level toggle */}
              {block.type === "heading" && (
                <select
                  value={block.level}
                  onChange={(e) =>
                    updateBlock(block.id, {
                      level: Number(e.target.value) as 2 | 3,
                    })
                  }
                  className="text-xs bg-[#1F1F1F] text-white px-2 py-1 rounded border-0 outline-none ml-2"
                >
                  <option value={2}>H2</option>
                  <option value={3}>H3</option>
                </select>
              )}

              {/* Image alignment */}
              {block.type === "image" && (
                <select
                  value={block.align}
                  onChange={(e) =>
                    updateBlock(block.id, {
                      align: e.target.value as Block["align"],
                    })
                   }
                  className="text-xs bg-[#1F1F1F] text-white px-2 py-1 rounded border-0 outline-none ml-2"
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              )}

              <button
                onClick={() => removeBlock(block.id)}
                className="p-1 text-red-500/60 hover:text-red-400 text-xs ml-2"
              >
                ✕ Remove
              </button>
            </div>
          </div>

          {/* Block Content */}
          {block.type === "paragraph" && (
            <textarea
              value={block.content}
              onChange={(e) => updateBlock(block.id, { content: e.target.value })}
              rows={4}
              placeholder="Write your paragraph here..."
              className="w-full bg-transparent text-white/90 text-sm leading-relaxed outline-none resize-y placeholder-white/20"
            />
          )}

          {block.type === "heading" && (
            <input
              type="text"
              value={block.content}
              onChange={(e) => updateBlock(block.id, { content: e.target.value })}
              placeholder={`Heading ${block.level ?? 2} text...`}
              className={`w-full bg-transparent text-white outline-none placeholder-white/20 ${
                block.level === 2 ? "text-2xl font-bold" : "text-xl font-bold"
              }`}
            />
          )}

          {block.type === "quote" && (
            <textarea
              value={block.content}
              onChange={(e) => updateBlock(block.id, { content: e.target.value })}
              rows={2}
              placeholder="Enter a quote or highlighted text..."
              className="w-full bg-transparent text-white/80 text-lg italic outline-none resize-y placeholder-white/20 border-l-4 border-[#EB0028] pl-4"
            />
          )}

          {block.type === "divider" && <hr className="border-[#1F1F1F]" />}

          {block.type === "image" && (
            <div className="space-y-3">
              {block.imageUrl ? (
                <div className="relative">
                  <img
                    src={`${block.imageUrl}?t=${Date.now()}`}
                    alt="block"
                    className="max-h-64 rounded-lg object-contain"
                  />
                  <button
                    onClick={() => {
                      updateBlock(block.id, { imageUrl: "" });
                    }}
                    className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded hover:bg-red-600 transition-colors"
                  >
                    Replace
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => {
                    setPendingImageBlockId(block.id);
                    fileInputRef.current?.click();
                  }}
                  className="border-2 border-dashed border-[#1F1F1F] hover:border-[#EB0028] rounded-lg p-8 text-center cursor-pointer transition-all"
                >
                  {uploading === block.id ? (
                    <p className="text-white/40 text-sm">Uploading...</p>
                  ) : (
                    <>
                      <p className="text-white/40 text-sm">
                        Click to upload image
                      </p>
                      <p className="text-white/20 text-xs mt-1">JPG, PNG, WebP</p>
                    </>
                  )}
                </div>
              )}
              <input
                type="text"
                value={block.caption ?? ""}
                onChange={(e) => updateBlock(block.id, { caption: e.target.value })}
                placeholder="Caption (optional)..."
                className="w-full bg-transparent text-white/50 text-sm outline-none placeholder-white/20 border-b border-[#1F1F1F] pb-1"
              />
            </div>
          )}

          {/* Add Block After — shows on hover */}
          <div className="mt-3 pt-3 border-t border-[#1F1F1F] opacity-0 group-hover:opacity-100 transition-opacity">
            <p className="text-xs text-white/20 mb-2">Add after this block:</p>
            <div className="flex flex-wrap gap-2">
              {(
                ["paragraph", "heading", "image", "quote", "divider"] as BlockType[]
              ).map((type) => (
                <button
                  key={type}
                  onClick={() => addBlock(type, block.id)}
                  className="text-xs px-3 py-1 bg-[#1F1F1F] hover:bg-[#EB0028] text-white/60 hover:text-white rounded-full transition-all capitalize"
                >
                  + {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && pendingImageBlockId) handleImageUpload(pendingImageBlockId, file);
          e.target.value = "";
        }}
      />

      {/* Add First Block / Bottom Adder */}
      <div className="flex flex-wrap gap-2 pt-2">
        {(
          ["paragraph", "heading", "image", "quote", "divider"] as BlockType[]
        ).map((type) => (
          <button
            key={type}
            onClick={() => addBlock(type)}
            className="text-sm px-4 py-2 bg-[#1F1F1F] hover:bg-[#EB0028] text-white/60 hover:text-white rounded-full transition-all capitalize"
          >
            + {type}
          </button>
        ))}
      </div>
    </div>
  );
}