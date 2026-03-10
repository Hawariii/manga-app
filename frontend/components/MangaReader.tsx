'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Page, Chapter } from '../lib/types';
import { fileUrl, saveReadingProgress } from '../lib/api';

function useThrottle<T extends (...args: any[]) => void>(fn: T, delay: number) {
  const last = useRef(0);
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - last.current > delay) {
      last.current = now;
      fn(...args);
    }
  };
}

export default function MangaReader({
  mangaSlug,
  chapterSlug,
  pages,
  prev,
  next
}: {
  mangaSlug: string;
  chapterSlug: string;
  pages: Page[];
  prev?: Chapter | null;
  next?: Chapter | null;
}) {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const throttledSave = useThrottle((pageNumber: number) => {
    const payload = {
      manga_slug: mangaSlug,
      chapter_slug: chapterSlug,
      page_number: pageNumber
    };

    localStorage.setItem(
      `reading:${mangaSlug}:${chapterSlug}`,
      JSON.stringify(payload)
    );

    saveReadingProgress(payload).catch(() => null);
  }, 2000);

  const observerOptions = useMemo(
    () => ({ rootMargin: '0px 0px -60% 0px', threshold: 0.1 }),
    []
  );

  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLImageElement>('[data-page]')
    );

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const pageNumber = Number(
            (entry.target as HTMLElement).dataset.page || 1
          );
          setCurrentPage(pageNumber);
          throttledSave(pageNumber);
        }
      });
    }, observerOptions);

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [observerOptions, throttledSave]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between rounded-2xl border border-ink-100 bg-white px-4 py-3 text-sm">
        <div className="text-ink-500">Reading page {currentPage}</div>
        <div className="flex gap-2">
          {prev ? (
            <Link
              href={`/manga/${mangaSlug}/${prev.slug}`}
              className="rounded-full border border-ink-200 px-4 py-2 text-xs"
            >
              Prev Chapter
            </Link>
          ) : null}
          {next ? (
            <Link
              href={`/manga/${mangaSlug}/${next.slug}`}
              className="rounded-full border border-ink-200 px-4 py-2 text-xs"
            >
              Next Chapter
            </Link>
          ) : null}
        </div>
      </div>

      <div className="space-y-6">
        {pages.map((page) => (
          <div key={page.id} className="overflow-hidden rounded-2xl bg-white shadow-soft">
            <img
              data-page={page.page_number}
              src={fileUrl(page.image_path)}
              alt={`Page ${page.page_number}`}
              className="h-auto w-full"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-ink-100 bg-white px-4 py-3">
        <div className="text-xs text-ink-500">End of chapter</div>
        <div className="flex gap-2">
          {prev ? (
            <Link
              href={`/manga/${mangaSlug}/${prev.slug}`}
              className="rounded-full border border-ink-200 px-4 py-2 text-xs"
            >
              Prev Chapter
            </Link>
          ) : null}
          {next ? (
            <Link
              href={`/manga/${mangaSlug}/${next.slug}`}
              className="rounded-full border border-ink-200 px-4 py-2 text-xs"
            >
              Next Chapter
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
