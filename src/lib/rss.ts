// src/lib/rss.ts
import { ThumbnailBlogItem } from "@/components/blog-catalogue/useBlogCatalogue";
import xml from "xml";

export function generateRSSFeed(posts: ThumbnailBlogItem[]): string {
  const feed = {
    rss: [
      { _attr: { version: "2.0" } },
      { channel: [
        { title: "TN Notes | Capturing ideas and thoughts." },
        { link: "https://notes.tenyain.com/" },
        { description: "Welcome to TN Notes! A tiny space of mine for capturing ideas and thoughts." },
        { language: "en-us" },
        ...posts.map((post) => ({
          item: [
            { title: post.title },
            { link: `https://notes.tenyain.com/notes/${post.slug}` },
            { guid: `https://notes.tenyain.com/notes/${post.slug}` },
            { pubDate: post.createdAt },
            { description: post.summary },
          ],
        })),
      ]},
    ],
  };

  return xml(feed, { declaration: true, indent: "  " });
}
