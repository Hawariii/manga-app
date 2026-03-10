import type { Metadata } from 'next';

export async function generateMetadata({
  params
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const name = params.slug.replace(/-/g, ' ');
  return {
    title: `${name} Manga | Manga Haven`,
    description: `Browse ${name} manga series.`
  };
}
