// src/app/api/rss/route.ts
import {NextResponse} from 'next/server';
import {generateRSSFeed} from '@/lib/rss';
import { fetchAllBlogData, fetchAllPinnedBlogData } from '@/lib/firebase';

export async function GET() {
  const serverData = await fetchAllBlogData();
  const serverPinnedData = await fetchAllPinnedBlogData();

  const rss = generateRSSFeed(serverData.concat(serverPinnedData));

  return new NextResponse(rss, {
    headers: {'Content-Type': 'application/rss+xml'},
  });
}
