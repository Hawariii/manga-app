'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { setAuthToken } from '../../lib/auth';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export default function LoginPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
        setAuthToken(json?.data?.token);
        setMessage(`Login berhasil sebagai ${json?.data?.user?.role || 'user'}.`);
        form.reset();
        router.push('/account');
      } else if (json?.errors) {
        const details = Object.values(json.errors).flat().join(' ');
        setMessage(details || json?.message || 'Login gagal.');
      } else {
        setMessage(json?.message || 'Login gagal.');
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
        <h1 className="section-title">Login</h1>
        <p className="text-ink-500">Masuk untuk menyimpan bookmark dan komentar.</p>
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
            type={showPassword ? 'text' : 'password'}
            required
            className="w-full rounded-xl border border-ink-200 px-4 py-2"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-ink-500">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={(e) => setShowPassword(e.target.checked)}
          />
          Tampilkan password
        </label>
        <button
          disabled={loading}
          className="rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold text-white"
        >
          {loading ? 'Masuk...' : 'Login'}
        </button>
        {message ? <p className="text-sm text-ink-500">{message}</p> : null}
      </form>

      <p className="text-sm text-ink-500">
        Belum punya akun?{' '}
        <Link href="/signup" className="font-medium text-ink-900">
          Sign up
        </Link>
      </p>
    </div>
  );
}
