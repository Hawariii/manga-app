'use client';

import { useState } from 'react';
import { getAuthToken } from '../../../lib/auth';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export default function UploadMangaPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const genreSlugs = String(formData.get('genre_slugs') || '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    formData.delete('genre_slugs');
    genreSlugs.forEach((slug) => formData.append('genre_slugs[]', slug));

    const token = getAuthToken();
    const res = await fetch(`${API_BASE}/admin/manga`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: formData
    });

    if (res.ok) {
      setMessage('Manga created successfully.');
      form.reset();
    } else {
      const text = await res.text();
      setMessage(`Failed: ${text}`);
    }

    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="section-title">Upload Manga</h1>
        <p className="text-ink-500">Create a new manga entry with metadata.</p>
      </header>

      <form
        onSubmit={onSubmit}
        className="grid gap-6 rounded-3xl border border-ink-100 bg-white p-6 shadow-soft"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm">
            <span className="text-ink-500">Title</span>
            <input
              name="title"
              required
              className="w-full rounded-xl border border-ink-200 px-4 py-2"
            />
          </label>
          <label className="space-y-2 text-sm">
            <span className="text-ink-500">Slug (optional)</span>
            <input name="slug" className="w-full rounded-xl border border-ink-200 px-4 py-2" />
          </label>
        </div>

        <label className="space-y-2 text-sm">
          <span className="text-ink-500">Description</span>
          <textarea
            name="description"
            rows={4}
            className="w-full rounded-xl border border-ink-200 px-4 py-2"
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm">
            <span className="text-ink-500">Author</span>
            <input name="author" className="w-full rounded-xl border border-ink-200 px-4 py-2" />
          </label>
          <label className="space-y-2 text-sm">
            <span className="text-ink-500">Artist</span>
            <input name="artist" className="w-full rounded-xl border border-ink-200 px-4 py-2" />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm">
            <span className="text-ink-500">Status</span>
            <select name="status" className="w-full rounded-xl border border-ink-200 px-4 py-2">
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </label>
          <label className="space-y-2 text-sm">
            <span className="text-ink-500">Genre slugs (comma separated)</span>
            <input
              name="genre_slugs"
              placeholder="action, fantasy"
              className="w-full rounded-xl border border-ink-200 px-4 py-2"
            />
          </label>
        </div>

        <label className="space-y-2 text-sm">
          <span className="text-ink-500">Cover Image</span>
          <input name="cover_image" type="file" accept="image/*" className="w-full" />
        </label>

        <button
          disabled={loading}
          className="rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold text-white"
        >
          {loading ? 'Uploading...' : 'Create Manga'}
        </button>

        {message ? <p className="text-sm text-ink-500">{message}</p> : null}
      </form>
    </div>
  );
}
