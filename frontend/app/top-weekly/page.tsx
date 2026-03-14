import Link from 'next/link';
import { getTopWeekly, fileUrl } from '../../lib/api';

export default async function TopWeeklyPage() {
  const { data } = await getTopWeekly();

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="section-title">Top Baca Mingguan</h1>
        <p className="text-ink-500">Manga yang paling sering dibaca minggu ini.</p>
      </header>

      {data.length === 0 ? (
        <div className="rounded-3xl border border-ink-100 bg-white p-6 text-sm text-ink-500 shadow-soft">
          Belum ada data minggu ini.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.map((item) => (
            <Link
              key={item.manga_id}
              href={`/manga/${item.manga.slug}`}
              className="group flex flex-col gap-3 rounded-2xl border border-ink-100 bg-white p-4 shadow-soft transition hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-4">
                <img
                  src={fileUrl(item.manga.cover_image)}
                  alt={item.manga.title}
                  className="h-24 w-16 rounded-lg object-cover"
                />
                <div className="space-y-1">
                  <div className="font-medium">{item.manga.title}</div>
                  <div className="text-xs text-ink-500">
                    {item.read_count} pembacaan
                  </div>
                </div>
              </div>
              <span className="text-xs text-ink-500 group-hover:text-ink-700">
                Lihat detail
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
