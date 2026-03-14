import Link from 'next/link';
import SearchBar from './SearchBar';

export default function Navbar() {
  return (
    <header className="border-b border-ink-100 bg-white/80 backdrop-blur">
      <div className="container-page flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink-900 text-white font-display text-lg">
            MH
          </div>
          <div>
            <Link href="/" className="font-display text-xl">
              Manga Haven
            </Link>
            <p className="text-sm text-ink-500">Curated manga reading</p>
          </div>
        </div>
        <nav className="flex flex-wrap items-center gap-4 text-sm">
          <Link href="/manga" className="hover:text-ink-700">
            Manga
          </Link>
          <Link href="/search" className="hover:text-ink-700">
            Search
          </Link>
          <Link href="/genres/action" className="hover:text-ink-700">
            Genres
          </Link>
          <Link href="/admin" className="hover:text-ink-700">
            Admin
          </Link>
          <Link href="/admin/login" className="hover:text-ink-700">
            Admin Login
          </Link>
          <span className="ml-auto">
            <SearchBar compact />
          </span>
        </nav>
      </div>
    </header>
  );
}
