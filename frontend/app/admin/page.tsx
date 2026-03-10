import Link from 'next/link';

const cards = [
  {
    title: 'Manage Manga',
    description: 'View existing series and jump into edits.',
    href: '/admin/manga'
  },
  {
    title: 'Upload Manga',
    description: 'Create a new manga with metadata and cover.',
    href: '/admin/upload-manga'
  },
  {
    title: 'Upload Chapter',
    description: 'Add chapters and upload page images.',
    href: '/admin/upload-chapter'
  }
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="section-title">Admin Dashboard</h1>
        <p className="text-ink-500">Manage the manga catalog and uploads.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="rounded-2xl border border-ink-100 bg-white p-6 shadow-soft transition hover:-translate-y-1"
          >
            <h2 className="font-display text-xl">{card.title}</h2>
            <p className="mt-2 text-sm text-ink-500">{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
