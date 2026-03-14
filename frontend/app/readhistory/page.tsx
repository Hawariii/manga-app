'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { clearAuthToken, getAuthToken } from '../../lib/auth';
import { fileUrl } from '../../lib/api';
import type { ReadingHistoryItem } from '../../lib/types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export default function ReadHistoryPage() {
  const [items, setItems] = useState<ReadingHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push('/login');
      return;
    }

    fetch(`${API_BASE}/reading-history`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store'
    })
      .then((res) => res.json())
      .then((json) => {
        setItems(json?.data || []);
      })
      .catch(() => {
        setMessage('Tidak bisa memuat riwayat baca.');
        clearAuthToken();
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="rounded-3xl border border-ink-100 bg-white p-6 text-sm text-ink-500 shadow-soft">
        Memuat riwayat baca...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="section-title">Read History</h1>
        <p className="text-ink-500">Lanjutkan bacaan terakhir kamu.</p>
      </header>

      {message ? <p className="text-sm text-ink-500">{message}</p> : null}

      {items.length === 0 ? (
        <div className="rounded-3xl border border-ink-100 bg-white p-6 text-sm text-ink-500 shadow-soft">
          Belum ada riwayat baca.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/reader/manga/${item.manga.slug}/chapters/${item.chapter.slug}`}
              className="flex gap-4 rounded-2xl border border-ink-100 bg-white p-4 shadow-soft transition hover:-translate-y-0.5"
            >
              <img
                src={fileUrl(item.manga.cover_image)}
                alt={item.manga.title}
                className="h-24 w-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <div className="font-medium">{item.manga.title}</div>
                <div className="text-xs text-ink-500">
                  Chapter {item.chapter.number} • Page {item.page_number}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
