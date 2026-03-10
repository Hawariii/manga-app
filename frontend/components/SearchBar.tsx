'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SearchBar({ compact }: { compact?: boolean }) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <form
      onSubmit={onSubmit}
      className={`flex items-center gap-2 rounded-full border border-ink-200 bg-white px-3 py-2 shadow-soft ${
        compact ? 'w-64' : 'w-full'
      }`}
    >
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search manga"
        className="w-full bg-transparent text-sm outline-none"
      />
      <button
        type="submit"
        className="rounded-full bg-ink-900 px-3 py-1 text-xs uppercase tracking-wide text-white"
      >
        Go
      </button>
    </form>
  );
}
