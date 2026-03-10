import type { Metadata } from 'next';
import { getMangaDetail, fileUrl } from '../../../lib/api';

export async function generateMetadata({
  params
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { data } = await getMangaDetail(params.slug);
  const title = `${data.title} | Manga Haven`;
  const description = data.description || `Read ${data.title} chapters online.`;
  const image = fileUrl(data.cover_image);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `/manga/${data.slug}`,
      images: [{ url: image }]
    }
  };
}
