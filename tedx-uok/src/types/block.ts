export type BlockType = "paragraph" | "heading" | "image" | "quote" | "divider";

export interface Block {
  id: string;
  type: BlockType;
  content: string; // text content for paragraph/heading/quote
  level?: 2 | 3; // for headings: h2 or h3
  imageUrl?: string; // for image blocks
  caption?: string; // for image captions
  align?: "left" | "center" | "right"; // for image positioning
}
// Converts blocks array to HTML string for the existing blog page
export function blocksToHtml(blocks: Block[]): string {
  return blocks
    .map((block) => {
      switch (block.type) {
        case "paragraph":
          return `<p>${block.content}</p>`;
        case "heading":
          return `<h${block.level ?? 2}>${block.content}</h${block.level ?? 2}>`;
        case "quote":
          return `<blockquote><p>${block.content}</p></blockquote>`;
        case "image":
          return `
            <figure class="blog-image align-${block.align ?? "center"}">
              <img src="${block.imageUrl}" alt="${block.caption ?? ""}" />
              ${block.caption ? `<figcaption>${block.caption}</figcaption>` : ""}
            </figure>`;
        case "divider":
          return `<hr />`;
        default:
          return "";
      }
    })
    .join("\n");
}
