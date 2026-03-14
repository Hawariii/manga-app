'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import SearchBar from './SearchBar';
import { clearAuthToken, getAuthToken } from '../lib/auth';
import { fetchCurrentUser } from '../lib/authApi';
import type { AuthUser } from '../lib/types';

export default function Navbar() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    function loadUser() {
      const token = getAuthToken();
      if (!token) {
        setUser(null);
        setChecking(false);
        return;
      }

      setChecking(true);
      fetchCurrentUser(token)
        .then((current) => {
          setUser(current);
          setChecking(false);
        })
        .catch(() => {
          clearAuthToken();
          setUser(null);
          setChecking(false);
        });
    }

    loadUser();
    window.addEventListener('auth:change', loadUser);
    return () => window.removeEventListener('auth:change', loadUser);
  }, []);

  async function handleLogout() {
    const token = getAuthToken();
    if (token) {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api'}/auth/logout`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        }
      ).catch(() => null);
    }
    clearAuthToken();
    setUser(null);
  }

  const isAdmin = user?.role === 'admin';

  return (
    <aside className="border-b border-ink-100 bg-white/80 backdrop-blur md:border-b-0 md:border-r">
      <div className="flex h-full flex-col gap-6 px-6 py-6 md:sticky md:top-0 md:h-screen md:w-72">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink-900 text-white font-display text-lg">
            MH
          </div>
          <div>
            <Link href="/" className="font-display text-xl">
              Manga Haven
            </Link>
            <p className="text-sm text-ink-500">Curated manga reading</p>
          </div>
        </div>

        <nav className="grid gap-2 text-sm">
          <Link href="/" className="rounded-xl px-3 py-2 hover:bg-ink-50">
            Home
          </Link>
          <Link href="/manga" className="rounded-xl px-3 py-2 hover:bg-ink-50">
            Manga
          </Link>
          <Link href="/search" className="rounded-xl px-3 py-2 hover:bg-ink-50">
            Search
          </Link>
          <Link href="/genres/action" className="rounded-xl px-3 py-2 hover:bg-ink-50">
            Genres
          </Link>
          <Link href="/readhistory" className="rounded-xl px-3 py-2 hover:bg-ink-50">
            Read History
          </Link>
          <Link href="/top-weekly" className="rounded-xl px-3 py-2 hover:bg-ink-50">
            Top Baca Mingguan
          </Link>
          {isAdmin ? (
            <Link href="/admin" className="rounded-xl px-3 py-2 hover:bg-ink-50">
              Admin
            </Link>
          ) : null}
        </nav>

        <div className="grid gap-2 text-sm">
          {!checking && !user ? (
            <>
              <Link href="/login" className="rounded-xl px-3 py-2 hover:bg-ink-50">
                Login
              </Link>
              <Link href="/signup" className="rounded-xl px-3 py-2 hover:bg-ink-50">
                Sign Up
              </Link>
            </>
          ) : null}
          {!checking && user ? (
            <>
              <Link href="/account" className="rounded-xl px-3 py-2 text-ink-500 hover:bg-ink-50">
                Hi, {user.name}
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-xl px-3 py-2 text-left hover:bg-ink-50"
              >
                Logout
              </button>
            </>
          ) : null}
        </div>

        <div className="mt-auto">
          <SearchBar compact />
        </div>
      </div>
    </aside>
  );
}
