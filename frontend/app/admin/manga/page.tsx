import Link from 'next/link';
import AdminGate from '../../../components/AdminGate';
import { getMangaList } from '../../../lib/api';

export default async function AdminMangaPage() {
  const { data } = await getMangaList();

  return (
    <AdminGate>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="section-title">Manage Manga</h1>
            <p className="text-ink-500">Browse and verify existing manga.</p>
          </div>
          <Link
            href="/admin/upload-manga"
            className="rounded-full bg-ink-900 px-5 py-2 text-sm font-semibold text-white"
          >
            + Add Manga
          </Link>
        </div>

        <div className="divide-y divide-ink-100 rounded-2xl border border-ink-100 bg-white">
          {data.data.map((manga) => (
            <div key={manga.id} className="flex items-center justify-between px-6 py-4">
              <div>
                <div className="font-medium">{manga.title}</div>
                <div className="text-xs text-ink-500">/{manga.slug}</div>
              </div>
              <Link
                href={`/manga/${manga.slug}`}
                className="rounded-full border border-ink-200 px-4 py-2 text-xs"
              >
                View
              </Link>
            </div>
          ))}
        </div>
      </div>
    </AdminGate>
  );
}
