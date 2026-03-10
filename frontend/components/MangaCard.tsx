import Link from 'next/link';
import { Manga } from '../lib/types';
import { fileUrl } from '../lib/api';

export default function MangaCard({ manga }: { manga: Manga }) {
  return (
    <Link
      href={`/manga/${manga.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft transition hover:-translate-y-1"
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={fileUrl(manga.cover_image)}
          alt={manga.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-display text-lg leading-tight">{manga.title}</h3>
        <div className="flex flex-wrap gap-2 text-xs text-ink-500">
          {manga.genres?.slice(0, 3).map((genre) => (
            <span key={genre.id} className="rounded-full bg-ink-100 px-2 py-1">
              {genre.name}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
