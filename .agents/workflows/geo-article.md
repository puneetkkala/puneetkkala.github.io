---
description: Pipeline for optimizing a freshly drafted Markdown article for Generative Engine Optimization (GEO).
---

# GEO Article Pipeline

When you have finished drafting a new article for Happy Hub, run this workflow to format, structure, and index the content natively for AI search crawlers.

## Steps

1. **Optimize Metadata Frontmatter**
   - Read the drafted `.md` file.
   - Truncate the `description` frontmatter to < 160 characters.
   - Ensure a `subtitle` frontmatter exists.
   
2. **Inject Structural Machine-Readable Components**
   - Add `<AuthorBio />` to the bottom.
   - If missing, add an `<FAQ />` section targeting 3-4 specific long-tail queries derived from the article content.
   - If missing, add a formatted `## Key Takeaways` section listing the core thesis.
   - Replace standard markdown definition prose with bolded definition blocks or standard Markdown tables where multiple factors are being compared.
   - Ensure no redundant H1 titles exist in the markdown body (as the Next.js `page.tsx` renders the page H1).

3. **Verify Locally**
   - Run `npm run dev` and navigate to the article at `http://localhost:3000/blog/<post-slug>` using the browser subagent.
   - Verify visually that the `NonTextContent` schemas, tables, and spacing look aesthetically excellent and error-free.
   - Commit the changes to version control (e.g., `git commit -m "feat(geo): structured content optimization"`).

4. **Global Indexing (Glossary & Resources)**
   - Scan the new post specifically for external links (`[ ](http...)`).
     - For any new standard specs, academic literature, or tooling links, append them to `lib/data/resources.ts` inside the proper categorization.
   - Scan the new post for key technical, accessibility, or AI terminology.
     - Append any new terms and their definitions directly into the `lib/data/glossary.ts` array.
   
5. **Final Commit & Verification**
   - Run `tsc --noEmit` and `npm run build` to ensure the TypeScript dictionaries compile successfully.
   - Commit the secondary structural dictionary changes to version control (e.g., `git commit -m "chore(geo): automate glossary and resource indexing"`).
   - Push to `master`.
