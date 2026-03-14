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
    <header className="border-b border-ink-100 bg-white/80 backdrop-blur">
      <div className="container-page flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between">
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
        <nav className="flex flex-wrap items-center gap-4 text-sm">
          <Link href="/manga" className="hover:text-ink-700">
            Manga
          </Link>
          <Link href="/search" className="hover:text-ink-700">
            Search
          </Link>
          <Link href="/genres/action" className="hover:text-ink-700">
            Genres
          </Link>
          {isAdmin ? (
            <Link href="/admin" className="hover:text-ink-700">
              Admin
            </Link>
          ) : null}
          {!checking && !user ? (
            <>
              <Link href="/login" className="hover:text-ink-700">
                Login
              </Link>
              <Link href="/signup" className="hover:text-ink-700">
                Sign Up
              </Link>
            </>
          ) : null}
          {!checking && user ? (
            <>
              <Link href="/account" className="text-ink-500 hover:text-ink-700">
                Hi, {user.name}
              </Link>
              <button onClick={handleLogout} className="hover:text-ink-700">
                Logout
              </button>
            </>
          ) : null}
          <span className="ml-auto">
            <SearchBar compact />
          </span>
        </nav>
      </div>
    </header>
  );
}
