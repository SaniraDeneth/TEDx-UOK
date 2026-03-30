# TEDxUOK SEO Documentation

## Overview
This document outlines the Search Engine Optimization (SEO) setup for the TEDxUOK React Single Page Application (SPA). Because React SPAs load content dynamically via JavaScript, traditional search engine web crawlers sometimes struggle to index the proper metadata (titles, descriptions, social media cards). 

To solve this, we implemented a robust, dynamic meta-tag injection system using `react-helmet-async`. This ensures every individual route in the application explicitly declares its own unique title, description, and canonical URL.

## Architecture

The SEO system consists of three main parts:
1. **The Provider (`src/App.tsx`)**: The entire application is wrapped in `<HelmetProvider>`.
2. **The Configuration (`src/config/seo.ts`)**: A centralized dictionary containing all page titles and descriptions.
3. **The Component (`src/components/common/SEO.tsx`)**: A reusable React component that injects the required `<meta>` and `<title>` tags into the `<head>` of the document.

### 1. Centralized Configuration (`seo.ts`)
All SEO text is stored in `src/config/seo.ts`. This makes it painless to update the copy across the application without having to dig through individual component files.

**Format Guidelines:**
- **Title**: Keep between 50-60 characters for optimal display on Google.
- **Description**: Keep between 150-160 characters for optimal snippet display.

### 2. The `<SEO />` Component
The SEO component accepts props for `title`, `description`, `type`, `image`, and `url`. When rendered inside a page component, it updates the document head with:
- Standard Meta Tags (`<title>`, `description`)
- Canonical Link (`<link rel="canonical" href="..." />`) to prevent duplicate content issues.
- OpenGraph Tags (`og:title`, `og:description`, `og:image`, etc.) for rich link previews on Facebook, LinkedIn, Discord, etc.
- Twitter Card Tags (`twitter:card`, `twitter:title`, etc.) for rich link previews on X/Twitter.

## How to Add SEO to a New Page

If you create a new route/page in the application (e.g., `src/pages/NewFeature/NewFeaturePage.tsx`), follow these steps to add SEO:

**Step 1. Add the metadata to `seo.ts`**
Open `src/config/seo.ts` and add a new entry:
```typescript
export const seoConfig = {
  // ... existing entries
  newFeature: {
    title: "New Feature | TEDxUOK",
    description: "Discover our exciting new feature for the TEDxUOK 2026 event at the University of Kelaniya."
  }
};
```

**Step 2. Import and use the `<SEO />` Component in your page**
Open your new page component and insert the `<SEO />` component inside the main render return.

```tsx
import React from 'react';
import SEO from '../../components/common/SEO';
import { seoConfig } from '../../config/seo';

export default function NewFeaturePage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Inject SEO Tags Here */}
      <SEO 
        {...seoConfig.newFeature} 
        url="https://tedxuok.org/new-feature" 
      />
      
      {/* Rest of your page content */}
      <h1>New Feature Page</h1>
    </div>
  );
}
```

## How to Handle Dynamic Routes (e.g., Blog Posts)
For dynamic routes where the content isn't known until runtime (like a blog post slug), you can pass strings directly to the `<SEO />` component instead of pulling from the static `seo.ts` file.

```tsx
import { useParams } from 'react-router-dom';
import SEO from '../../components/common/SEO';

export default function BlogPostPage() {
  const { slug } = useParams();
  
  // You would typically fetch the dynamic title/description from your backend using the slug here.

  return (
    <div>
      <SEO 
        title={`Dynamic Blog Post about ${slug} | TEDxUOK`}
        description="This is a dynamically generated description for the blog post."
        url={`https://tedxuok.org/blog/${slug}`}
        type="article"
      />
      <h1>Blog Post: {slug}</h1>
    </div>
  );
}
```

## Sitemaps and Robots.txt

In addition to dynamic meta tags, we've deployed static files in the `public/` directory for search engine crawlers:

- **`public/robots.txt`**: Instructions for crawlers. It explicitly allows all agents (`User-agent: *`) to index the site and points them directly to the sitemap.
- **`public/sitemap.xml`**: A comprehensive map of all available routes on the platform, indicating update frequency and priority. 
  - *Maintenance Note: Whenever you add a new route to `AppRouter.tsx`, you must manually add the new URL to `public/sitemap.xml` so search engines know it exists!*

## Verification
You can verify the SEO tags are working correctly in your development server (`npm run dev`) by inspecting the DOM in your browser (Right Click -> Inspect -> Expand the `<head>` tag). As you navigate between pages, you will see the `<title>` and `<meta>` tags dynamically change based on the current route.
