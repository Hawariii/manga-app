export type Genre = {
  id: number;
  name: string;
  slug: string;
};

export type Manga = {
  id: number;
  title: string;
  slug: string;
  description?: string | null;
  cover_image?: string | null;
  author?: string | null;
  artist?: string | null;
  status?: string | null;
  genres?: Genre[];
};

export type Chapter = {
  id: number;
  manga_id: number;
  title: string;
  slug: string;
  number: number;
  published_at?: string | null;
};

export type Page = {
  id: number;
  chapter_id: number;
  page_number: number;
  image_path: string;
};

export type Paginated<T> = {
  current_page: number;
  data: T[];
  last_page: number;
};

export type ReaderPayload = {
  manga: Manga;
  chapter: Chapter;
  pages: Page[];
  prev_chapter?: Chapter | null;
  next_chapter?: Chapter | null;
};
