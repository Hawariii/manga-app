import MangaGrid from '../../components/MangaGrid';
import Pagination from '../../components/Pagination';
import SearchBar from '../../components/SearchBar';
import { searchManga } from '../../lib/api';

export default async function SearchPage({
  searchParams
}: {
  searchParams?: { q?: string; page?: string };
}) {
  const q = searchParams?.q || '';
  const page = Number(searchParams?.page || 1);
  const response = q ? await searchManga(q, page) : null;
  const data = response?.data;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="section-title">Search</h1>
        <p className="text-ink-500">Find manga by title, author, or artist.</p>
      </div>

      <SearchBar />

      {q && data ? (
        <>
          <MangaGrid mangas={data.data} />
          <Pagination
            current={data.current_page}
            total={data.last_page}
            basePath="/search"
            query={{ q }}
            queryKey="page"
          />
        </>
      ) : (
        <div className="rounded-2xl border border-ink-100 bg-white p-6 text-ink-500">
          Start typing to search the catalog.
        </div>
      )}
    </div>
  );
}
