# Manga Platform

Fullstack manga platform with Laravel (API), Next.js (App Router), MySQL, and local image storage.

## Prerequisites
- PHP 8.2+
- Composer
- Node.js 18+
- MySQL 8+

## Backend (Laravel)
1. Configure `backend/.env`:
   - `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`
2. Install dependencies:
   ```bash
   cd backend
   composer install
   ```
3. Generate app key:
   ```bash
   php artisan key:generate
   ```
4. Run migrations:
   ```bash
   php artisan migrate
   ```
5. Create storage symlink:
   ```bash
   php artisan storage:link
   ```
6. Start server:
   ```bash
   php artisan serve
   ```

## Frontend (Next.js)
1. Configure `frontend/.env.local`:
   - `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api`
   - `NEXT_PUBLIC_SITE_URL=http://localhost:3000`
2. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
3. Run dev server:
   ```bash
   npm run dev
   ```

## Storage
Manga images stored at:
```
storage/app/public/manga/{manga_slug}/{chapter_slug}/001.jpg
```

Example:
```
storage/app/public/manga/one-piece/chapter-1/001.jpg
```

## URLs
- Manga detail: `/manga/{slug}`
- Chapter reader: `/manga/{slug}/{chapterSlug}`

## Admin
- `/admin`
- `/admin/manga`
- `/admin/upload-manga`
- `/admin/upload-chapter`

## Notes
- Admin API endpoints are exposed without auth for local development. Add auth/roles for production.
