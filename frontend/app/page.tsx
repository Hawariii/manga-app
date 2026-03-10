import Link from 'next/link';
import { getMangaList } from '../lib/api';
import MangaGrid from '../components/MangaGrid';

export default async function HomePage() {
  const { data } = await getMangaList();

  return (
    <div className="space-y-10">
      <section className="grid gap-6 rounded-3xl border border-ink-100 bg-white/90 p-8 shadow-soft md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-ink-400">Featured</p>
          <h1 className="font-display text-4xl leading-tight">
            Dive into your next manga obsession.
          </h1>
          <p className="text-ink-500">
            Browse trending series, save your place, and enjoy a reader built for
            long sessions.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/manga"
              className="rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold text-white"
            >
              Browse Manga
            </Link>
            <Link
              href="/search"
              className="rounded-full border border-ink-200 px-6 py-3 text-sm font-semibold"
            >
              Search Library
            </Link>
          </div>
        </div>
        <div className="rounded-2xl bg-[conic-gradient(from_160deg,_#f5b344,_#f3e4c6,_#fff)] p-6">
          <div className="rounded-2xl bg-ink-900 p-6 text-white">
            <p className="text-sm uppercase tracking-[0.2em] text-ink-200">Now reading</p>
            <h2 className="mt-3 text-2xl font-display">Build your streak</h2>
            <p className="mt-2 text-sm text-ink-200">
              The reader auto-saves your place while you scroll.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="section-title">Latest additions</h2>
          <Link href="/manga" className="text-sm text-ink-500">
            View all
          </Link>
        </div>
        <MangaGrid mangas={data.data.slice(0, 8)} />
      </section>
    </div>
  );
}
