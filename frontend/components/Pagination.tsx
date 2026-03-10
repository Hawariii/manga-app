import Link from 'next/link';

export default function Pagination({
  current,
  total,
  basePath,
  queryKey = 'page',
  query
}: {
  current: number;
  total: number;
  basePath: string;
  queryKey?: string;
  query?: Record<string, string | number | undefined>;
}) {
  if (total <= 1) return null;

  const prev = current > 1 ? current - 1 : null;
  const next = current < total ? current + 1 : null;

  const buildUrl = (page: number) => {
    const params = new URLSearchParams();
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.set(key, String(value));
        }
      });
    }
    params.set(queryKey, String(page));
    return `${basePath}?${params.toString()}`;
  };

  return (
    <div className="mt-8 flex items-center justify-between rounded-2xl border border-ink-100 bg-white px-4 py-3">
      <div className="text-xs text-ink-500">
        Page {current} of {total}
      </div>
      <div className="flex gap-2">
        {prev ? (
          <Link
            href={buildUrl(prev)}
            className="rounded-full border border-ink-200 px-4 py-2 text-xs"
          >
            Prev
          </Link>
        ) : (
          <span className="rounded-full border border-ink-100 px-4 py-2 text-xs text-ink-300">
            Prev
          </span>
        )}
        {next ? (
          <Link
            href={buildUrl(next)}
            className="rounded-full border border-ink-200 px-4 py-2 text-xs"
          >
            Next
          </Link>
        ) : (
          <span className="rounded-full border border-ink-100 px-4 py-2 text-xs text-ink-300">
            Next
          </span>
        )}
      </div>
    </div>
  );
}
