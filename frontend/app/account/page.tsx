'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { clearAuthToken, getAuthToken } from '../../lib/auth';
import { fetchCurrentUser } from '../../lib/authApi';
import type { AuthUser } from '../../lib/types';

export default function AccountPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push('/login');
      return;
    }

    fetchCurrentUser(token)
      .then((current) => {
        setUser(current);
      })
      .catch(() => {
        clearAuthToken();
        router.push('/login');
      })
      .finally(() => setLoading(false));
  }, [router]);

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
    router.push('/');
  }

  if (loading) {
    return (
      <div className="rounded-3xl border border-ink-100 bg-white p-6 text-sm text-ink-500 shadow-soft">
        Memuat akun...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="section-title">Akun Saya</h1>
        <p className="text-ink-500">Informasi login dan role.</p>
      </header>

      <div className="rounded-3xl border border-ink-100 bg-white p-6 shadow-soft">
        <dl className="grid gap-4 text-sm">
          <div>
            <dt className="text-ink-500">Nama</dt>
            <dd className="font-medium">{user.name}</dd>
          </div>
          <div>
            <dt className="text-ink-500">Email</dt>
            <dd className="font-medium">{user.email}</dd>
          </div>
          <div>
            <dt className="text-ink-500">Role</dt>
            <dd className="font-medium">{user.role}</dd>
          </div>
        </dl>
      </div>

      <button
        onClick={handleLogout}
        className="rounded-full border border-ink-200 px-6 py-3 text-sm font-semibold text-ink-700"
      >
        Logout
      </button>
    </div>
  );
}
