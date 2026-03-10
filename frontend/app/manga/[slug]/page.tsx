import Link from 'next/link';
import ChapterList from '../../../components/ChapterList';
import { fileUrl, getMangaDetail } from '../../../lib/api';

export default async function MangaDetailPage({
  params
}: {
  params: { slug: string };
}) {
  const { data } = await getMangaDetail(params.slug);

  return (
    <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
      <div className="space-y-4">
        <div className="overflow-hidden rounded-3xl bg-white shadow-soft">
          <img
            src={fileUrl(data.cover_image)}
            alt={data.title}
            className="h-auto w-full object-cover"
          />
        </div>
        <div className="rounded-2xl border border-ink-100 bg-white p-4 text-sm">
          <p className="text-ink-500">Status</p>
          <p className="font-medium">{data.status || 'ongoing'}</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="section-title text-3xl">{data.title}</h1>
          <p className="text-ink-500">{data.description || 'No description yet.'}</p>
          <div className="flex flex-wrap gap-2 text-xs text-ink-500">
            {data.genres?.map((genre) => (
              <Link
                key={genre.id}
                href={`/genres/${genre.slug}`}
                className="rounded-full bg-ink-100 px-2 py-1"
              >
                {genre.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="section-title text-xl">Chapters</h2>
          <ChapterList mangaSlug={data.slug} chapters={data.chapters} />
        </div>
      </div>
    </div>
  );
}
