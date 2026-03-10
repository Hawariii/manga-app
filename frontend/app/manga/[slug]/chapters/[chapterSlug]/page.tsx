import { redirect } from 'next/navigation';

export default function LegacyChapterReaderPage({
  params
}: {
  params: { slug: string; chapterSlug: string };
}) {
  redirect(`/manga/${params.slug}/${params.chapterSlug}`);
}
