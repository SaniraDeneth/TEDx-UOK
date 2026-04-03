import { useParams } from "react-router-dom";
import SEO from "../../components/common/SEO";

export default function BlogPostPage() {
  const { slug } = useParams();

  // SEO Handled in JSX

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-6 text-center">
      <SEO title={`Blog Post - ${slug} | TEDxUOK`} description="Read our latest stories and insights." url={`https://tedxuok.org/blog/${slug}`} />
      <h1 className="text-4xl font-bold mb-4">Blog Post</h1>
      <p className="text-xl text-gray-400">Slug: {slug}</p>
    </div>
  );
}
