import MangaGrid from '../../components/MangaGrid';
import Pagination from '../../components/Pagination';
import { getMangaList } from '../../lib/api';

export default async function MangaListPage({
  searchParams
}: {
  searchParams?: { page?: string; q?: string; genre?: string };
}) {
  const page = Number(searchParams?.page || 1);
  const { data } = await getMangaList({
    page,
    q: searchParams?.q,
    genre: searchParams?.genre
  });

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="section-title">Manga library</h1>
        <p className="text-ink-500">
          Browse the full catalog and jump straight into your next series.
        </p>
      </header>

      <MangaGrid mangas={data.data} />
      <Pagination current={data.current_page} total={data.last_page} basePath="/manga" />
    </div>
  );
}
