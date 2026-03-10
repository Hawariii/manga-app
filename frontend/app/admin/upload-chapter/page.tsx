'use client';

import { useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export default function UploadChapterPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [chapterSlug, setChapterSlug] = useState('');
  const [mangaSlug, setMangaSlug] = useState('');

  async function onCreateChapter(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    const res = await fetch(`${API_BASE}/admin/manga/${data.manga_slug}/chapters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: data.title,
        slug: data.slug || undefined,
        number: Number(data.number),
        published_at: data.published_at || undefined
      })
    });

    const json = await res.json().catch(() => null);
    if (res.ok) {
      setMessage('Chapter created successfully.');
      setChapterSlug(String(json?.data?.slug || data.slug || ''));
      setMangaSlug(String(data.manga_slug));
      form.reset();
    } else {
      setMessage(`Failed: ${JSON.stringify(json)}`);
    }

    setLoading(false);
  }

  async function onUploadImages(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const res = await fetch(
      `${API_BASE}/admin/manga/${formData.get('manga_slug')}/chapters/${formData.get('chapter_slug')}/images`,
      {
        method: 'POST',
        body: formData
      }
    );

    if (res.ok) {
      setMessage('Images uploaded successfully.');
      form.reset();
    } else {
      const text = await res.text();
      setMessage(`Failed: ${text}`);
    }

    setLoading(false);
  }

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <h1 className="section-title">Upload Chapter</h1>
        <p className="text-ink-500">Create a chapter and upload page images.</p>
      </header>

      <form
        onSubmit={onCreateChapter}
        className="grid gap-6 rounded-3xl border border-ink-100 bg-white p-6 shadow-soft"
      >
        <h2 className="font-display text-xl">Create Chapter</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm">
            <span className="text-ink-500">Manga Slug</span>
            <input
              name="manga_slug"
              required
              className="w-full rounded-xl border border-ink-200 px-4 py-2"
            />
          </label>
          <label className="space-y-2 text-sm">
            <span className="text-ink-500">Chapter Title</span>
            <input
              name="title"
              required
              className="w-full rounded-xl border border-ink-200 px-4 py-2"
            />
          </label>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <label className="space-y-2 text-sm">
            <span className="text-ink-500">Slug (optional)</span>
            <input name="slug" className="w-full rounded-xl border border-ink-200 px-4 py-2" />
          </label>
          <label className="space-y-2 text-sm">
            <span className="text-ink-500">Chapter Number</span>
            <input
              name="number"
              type="number"
              min={1}
              required
              className="w-full rounded-xl border border-ink-200 px-4 py-2"
            />
          </label>
          <label className="space-y-2 text-sm">
            <span className="text-ink-500">Published At</span>
            <input
              name="published_at"
              type="date"
              className="w-full rounded-xl border border-ink-200 px-4 py-2"
            />
          </label>
        </div>
        <button
          disabled={loading}
          className="rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold text-white"
        >
          {loading ? 'Saving...' : 'Create Chapter'}
        </button>
      </form>

      <form
        onSubmit={onUploadImages}
        className="grid gap-6 rounded-3xl border border-ink-100 bg-white p-6 shadow-soft"
      >
        <h2 className="font-display text-xl">Upload Images</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm">
            <span className="text-ink-500">Manga Slug</span>
            <input
              name="manga_slug"
              required
              defaultValue={mangaSlug}
              className="w-full rounded-xl border border-ink-200 px-4 py-2"
            />
          </label>
          <label className="space-y-2 text-sm">
            <span className="text-ink-500">Chapter Slug</span>
            <input
              name="chapter_slug"
              required
              defaultValue={chapterSlug}
              className="w-full rounded-xl border border-ink-200 px-4 py-2"
            />
          </label>
        </div>
        <label className="space-y-2 text-sm">
          <span className="text-ink-500">Images</span>
          <input
            name="images[]"
            type="file"
            accept="image/*"
            multiple
            required
            className="w-full"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-ink-500">
          <input name="replace" type="checkbox" value="1" />
          Replace existing pages
        </label>
        <button
          disabled={loading}
          className="rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold text-white"
        >
          {loading ? 'Uploading...' : 'Upload Images'}
        </button>
      </form>

      {message ? <p className="text-sm text-ink-500">{message}</p> : null}
    </div>
  );
}
