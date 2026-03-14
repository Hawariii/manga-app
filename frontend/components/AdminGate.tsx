'use client';

import { useEffect, useState } from 'react';
import { clearAuthToken, getAuthToken } from '../lib/auth';
import { fetchCurrentUser } from '../lib/authApi';
import type { AuthUser } from '../lib/types';

type GateState = 'loading' | 'guest' | 'forbidden' | 'allowed';

export default function AdminGate({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GateState>('loading');
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setState('guest');
      return;
    }

    fetchCurrentUser(token)
      .then((current) => {
        setUser(current);
        setState(current.role === 'admin' ? 'allowed' : 'forbidden');
      })
      .catch(() => {
        clearAuthToken();
        setState('guest');
      });
  }, []);

  if (state === 'loading') {
    return (
      <div className="rounded-3xl border border-ink-100 bg-white p-6 text-sm text-ink-500 shadow-soft">
        Checking admin access...
      </div>
    );
  }

  if (state !== 'allowed') {
    return (
      <div className="rounded-3xl border border-ink-100 bg-white p-6 shadow-soft">
        <h1 className="section-title">Akses ditolak</h1>
        <p className="mt-2 text-sm text-ink-500">
          Halaman admin hanya untuk role admin. Masuk melalui <span className="font-medium">/admin/login</span>.
        </p>
        {user ? (
          <p className="mt-3 text-xs text-ink-400">
            Role akun Anda: <span className="font-medium">{user.role}</span>
          </p>
        ) : null}
      </div>
    );
  }

  return <>{children}</>;
}
