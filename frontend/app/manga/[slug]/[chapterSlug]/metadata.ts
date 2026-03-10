import type { Metadata } from 'next';
import { getReader, fileUrl } from '../../../../lib/api';

export async function generateMetadata({
  params
}: {
  params: { slug: string; chapterSlug: string };
}): Promise<Metadata> {
  const { data } = await getReader(params.slug, params.chapterSlug);
  const title = `${data.manga.title} ${data.chapter.title} | Manga Haven`;
  const description = `Read ${data.manga.title} - ${data.chapter.title}.`;
  const image = fileUrl(data.manga.cover_image);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `/manga/${data.manga.slug}/${data.chapter.slug}`,
      images: [{ url: image }]
    }
  };
}
