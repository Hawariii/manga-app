import type { MetadataRoute } from 'next';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

type MangaListResponse = {
  data: {
    current_page: number;
    last_page: number;
    data: Array<{ slug: string }>;
  };
};

type MangaDetailResponse = {
  data: {
    slug: string;
    chapters: Array<{ slug: string }>;
  };
};

async function fetchMangaPage(page: number): Promise<MangaListResponse | null> {
  const res = await fetch(`${API_BASE}/manga?page=${page}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

async function fetchMangaDetail(slug: string): Promise<MangaDetailResponse | null> {
  const res = await fetch(`${API_BASE}/manga/${slug}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const urls: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date()
    },
    {
      url: `${SITE_URL}/manga`,
      lastModified: new Date()
    },
    {
      url: `${SITE_URL}/search`,
      lastModified: new Date()
    }
  ];

  const first = await fetchMangaPage(1);
  if (!first) return urls;

  const totalPages = first.data.last_page;
  const mangaSlugs: string[] = [];

  for (let page = 1; page <= totalPages; page++) {
    const payload = page === 1 ? first : await fetchMangaPage(page);
    if (!payload) continue;
    payload.data.data.forEach((manga) => mangaSlugs.push(manga.slug));
  }

  for (const slug of mangaSlugs) {
    urls.push({
      url: `${SITE_URL}/manga/${slug}`,
      lastModified: new Date()
    });

    const detail = await fetchMangaDetail(slug);
    detail?.data.chapters.forEach((chapter) => {
      urls.push({
        url: `${SITE_URL}/manga/${slug}/${chapter.slug}`,
        lastModified: new Date()
      });
    });
  }

  return urls;
}
