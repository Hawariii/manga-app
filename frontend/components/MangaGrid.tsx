import { Manga } from '../lib/types';
import MangaCard from './MangaCard';

export default function MangaGrid({ mangas }: { mangas: Manga[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {mangas.map((manga) => (
        <MangaCard key={manga.id} manga={manga} />
      ))}
    </div>
  );
}
