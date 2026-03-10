import MangaGrid from '../../../components/MangaGrid';
import Pagination from '../../../components/Pagination';
import { getGenreManga } from '../../../lib/api';

export default async function GenrePage({
  params,
  searchParams
}: {
  params: { slug: string };
  searchParams?: { page?: string };
}) {
  const page = Number(searchParams?.page || 1);
  const { data } = await getGenreManga(params.slug, page);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="section-title">Genre: {params.slug}</h1>
        <p className="text-ink-500">Series tagged with this genre.</p>
      </div>

      <MangaGrid mangas={data.data} />
      <Pagination
        current={data.current_page}
        total={data.last_page}
        basePath={`/genres/${params.slug}`}
      />
    </div>
  );
}
