'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { setAuthToken } from '../../lib/auth';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export default function SignupPage() {
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
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          password_confirmation: data.password_confirmation
        })
      });

      const json = await res.json().catch(() => null);

      if (res.ok) {
        setAuthToken(json?.data?.token);
        setMessage('Sign up berhasil. Anda sudah login.');
        form.reset();
        router.push('/account');
      } else if (json?.errors) {
        const details = Object.values(json.errors).flat().join(' ');
        setMessage(details || json?.message || 'Sign up gagal.');
      } else {
        setMessage(json?.message || 'Sign up gagal.');
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
        <h1 className="section-title">Sign Up</h1>
        <p className="text-ink-500">Buat akun baru untuk fitur bookmark dan komentar.</p>
      </header>

      <form
        onSubmit={onSubmit}
        className="grid gap-4 rounded-3xl border border-ink-100 bg-white p-6 shadow-soft"
      >
        <label className="space-y-2 text-sm">
          <span className="text-ink-500">Nama</span>
          <input
            name="name"
            required
            className="w-full rounded-xl border border-ink-200 px-4 py-2"
          />
        </label>
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
            minLength={8}
            required
            className="w-full rounded-xl border border-ink-200 px-4 py-2"
          />
        </label>
        <label className="space-y-2 text-sm">
          <span className="text-ink-500">Konfirmasi Password</span>
          <input
            name="password_confirmation"
            type="password"
            minLength={8}
            required
            className="w-full rounded-xl border border-ink-200 px-4 py-2"
          />
        </label>
        <button
          disabled={loading}
          className="rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold text-white"
        >
          {loading ? 'Membuat akun...' : 'Sign Up'}
        </button>
        {message ? <p className="text-sm text-ink-500">{message}</p> : null}
      </form>

      <p className="text-sm text-ink-500">
        Sudah punya akun?{' '}
        <Link href="/login" className="font-medium text-ink-900">
          Login
        </Link>
      </p>
    </div>
  );
}
