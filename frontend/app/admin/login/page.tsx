'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { clearAuthToken, setAuthToken } from '../../../lib/auth';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export default function AdminLoginPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          password: data.password
        })
      });

      const json = await res.json().catch(() => null);

      if (res.ok) {
        const token = json?.data?.token;
        const role = json?.data?.user?.role;

        if (token && role === 'admin') {
          setAuthToken(token);
          setMessage('Logged in. You can now use admin pages.');
          form.reset();
          router.push('/admin');
        } else {
          clearAuthToken();
          setMessage('Akun ini bukan admin. Silakan gunakan halaman login user.');
        }
      } else if (json?.errors) {
        const details = Object.values(json.errors).flat().join(' ');
        setMessage(details || json?.message || 'Login failed.');
      } else {
        setMessage(json?.message || 'Login failed.');
      }
    } catch (error) {
      setMessage('Tidak bisa terhubung ke server.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="section-title">Admin Login</h1>
        <p className="text-ink-500">Sign in with your admin account.</p>
      </header>

      <form
        onSubmit={onSubmit}
        className="grid gap-4 rounded-3xl border border-ink-100 bg-white p-6 shadow-soft"
      >
        <label className="space-y-2 text-sm">
          <span className="text-ink-500">Email</span>
          <input
            name="email"
            type="email"
            required
            className="w-full rounded-xl border border-ink-200 px-4 py-2"
          />
        </label>
        <label className="space-y-2 text-sm">
          <span className="text-ink-500">Password</span>
          <input
            name="password"
            type="password"
            required
            className="w-full rounded-xl border border-ink-200 px-4 py-2"
          />
        </label>
        <button
          disabled={loading}
          className="rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold text-white"
        >
          {loading ? 'Signing in...' : 'Login'}
        </button>
        {message ? <p className="text-sm text-ink-500">{message}</p> : null}
      </form>
    </div>
  );
}
