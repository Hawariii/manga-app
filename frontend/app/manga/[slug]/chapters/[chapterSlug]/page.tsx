import Link from 'next/link';
import MangaReader from '../../../../../components/MangaReader';
import { getReader } from '../../../../../lib/api';

export default async function ChapterReaderPage({
  params
}: {
  params: { slug: string; chapterSlug: string };
}) {
  const { data } = await getReader(params.slug, params.chapterSlug);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href={`/manga/${data.manga.slug}`} className="text-sm text-ink-500">
            ← Back to {data.manga.title}
          </Link>
          <h1 className="section-title mt-2">{data.chapter.title}</h1>
          <p className="text-sm text-ink-500">Chapter {data.chapter.number}</p>
        </div>
      </div>

      <MangaReader
        mangaSlug={data.manga.slug}
        chapterSlug={data.chapter.slug}
        pages={data.pages}
        prev={data.prev_chapter}
        next={data.next_chapter}
      />
    </div>
  );
}
