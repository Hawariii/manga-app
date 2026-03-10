import { Manga, Chapter, Page, Paginated, ReaderPayload } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {})
    },
    cache: 'no-store'
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }

  return res.json() as Promise<T>;
}

export function getMangaList(params?: { q?: string; genre?: string; page?: number }) {
  const search = new URLSearchParams();
  if (params?.q) search.set('q', params.q);
  if (params?.genre) search.set('genre', params.genre);
  if (params?.page) search.set('page', String(params.page));
  const query = search.toString();
  return apiFetch<{ data: Paginated<Manga> }>(`/manga${query ? `?${query}` : ''}`);
}

export function getMangaDetail(slug: string) {
  return apiFetch<{ data: Manga & { chapters: Chapter[] } }>(`/manga/${slug}`);
}

export function getChapters(slug: string) {
  return apiFetch<{ data: { manga: Manga; chapters: Chapter[] } }>(`/manga/${slug}/chapters`);
}

export function getReader(slug: string, chapterSlug: string) {
  return apiFetch<{ data: ReaderPayload }>(`/reader/manga/${slug}/chapters/${chapterSlug}`);
}

export function searchManga(q: string, page?: number) {
  const search = new URLSearchParams();
  if (q) search.set('q', q);
  if (page) search.set('page', String(page));
  return apiFetch<{ data: Paginated<Manga> }>(`/search?${search.toString()}`);
}

export function getGenreManga(genreSlug: string, page?: number) {
  return getMangaList({ genre: genreSlug, page });
}

export async function saveReadingProgress(payload: {
  manga_slug: string;
  chapter_slug: string;
  page_number: number;
  token?: string;
}) {
  const res = await fetch(`${API_BASE}/reading-history`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(payload.token ? { Authorization: `Bearer ${payload.token}` } : {})
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    // Fail silently for now; reader should still work without auth.
    return null;
  }

  return res.json();
}

export function fileUrl(path?: string | null) {
  if (!path) return '/placeholder-cover.svg';
  return `${API_BASE.replace('/api', '')}/storage/${path}`;
}
