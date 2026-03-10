import Link from 'next/link';
import { Chapter } from '../lib/types';

export default function ChapterList({
  mangaSlug,
  chapters
}: {
  mangaSlug: string;
  chapters: Chapter[];
}) {
  return (
    <div className="divide-y divide-ink-100 rounded-2xl border border-ink-100 bg-white">
      {chapters.map((chapter) => (
        <Link
          key={chapter.id}
          href={`/manga/${mangaSlug}/chapters/${chapter.slug}`}
          className="flex items-center justify-between px-5 py-4 hover:bg-ink-50"
        >
          <div>
            <div className="font-medium">{chapter.title}</div>
            <div className="text-xs text-ink-500">Chapter {chapter.number}</div>
          </div>
          <span className="text-xs text-ink-400">Read</span>
        </Link>
      ))}
    </div>
  );
}
