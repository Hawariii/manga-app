'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { clearAuthToken, getAuthToken } from '../../lib/auth';
import { fetchCurrentUser } from '../../lib/authApi';
import type { AuthUser } from '../../lib/types';

export default function AccountPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
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

  async function handleProfileUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMessage(null);

    const token = getAuthToken();
    if (!token) {
      router.push('/login');
      return;
    }

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api'}/auth/profile`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            name: data.name,
            email: data.email
          })
        }
      );

      const json = await res.json().catch(() => null);
      if (res.ok) {
        setUser(json?.data || user);
        setProfileMessage('Profil berhasil diperbarui.');
      } else if (json?.errors) {
        const details = Object.values(json.errors).flat().join(' ');
        setProfileMessage(details || json?.message || 'Gagal memperbarui profil.');
      } else {
        setProfileMessage(json?.message || 'Gagal memperbarui profil.');
      }
    } catch (error) {
      setProfileMessage('Tidak bisa terhubung ke server.');
    } finally {
      setSavingProfile(false);
    }
  }

  async function handlePasswordChange(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSavingPassword(true);
    setPasswordMessage(null);

    const token = getAuthToken();
    if (!token) {
      router.push('/login');
      return;
    }

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api'}/auth/password`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            current_password: data.current_password,
            password: data.password,
            password_confirmation: data.password_confirmation
          })
        }
      );

      const json = await res.json().catch(() => null);
      if (res.ok) {
        setPasswordMessage('Password berhasil diperbarui.');
        form.reset();
      } else if (json?.errors) {
        const details = Object.values(json.errors).flat().join(' ');
        setPasswordMessage(details || json?.message || 'Gagal mengganti password.');
      } else {
        setPasswordMessage(json?.message || 'Gagal mengganti password.');
      }
    } catch (error) {
      setPasswordMessage('Tidak bisa terhubung ke server.');
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="section-title">Akun Saya</h1>
        <p className="text-ink-500">Informasi login dan role.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <form
          onSubmit={handleProfileUpdate}
          className="grid gap-4 rounded-3xl border border-ink-100 bg-white p-6 shadow-soft"
        >
          <h2 className="font-display text-xl">Edit Profil</h2>
          <label className="space-y-2 text-sm">
            <span className="text-ink-500">Nama</span>
            <input
              name="name"
              defaultValue={user.name}
              required
              className="w-full rounded-xl border border-ink-200 px-4 py-2"
            />
          </label>
          <label className="space-y-2 text-sm">
            <span className="text-ink-500">Email</span>
            <input
              name="email"
              type="email"
              defaultValue={user.email}
              required
              className="w-full rounded-xl border border-ink-200 px-4 py-2"
            />
          </label>
          <div className="text-xs text-ink-400">Role: {user.role}</div>
          <button
            disabled={savingProfile}
            className="rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold text-white"
          >
            {savingProfile ? 'Menyimpan...' : 'Simpan Profil'}
          </button>
          {profileMessage ? <p className="text-sm text-ink-500">{profileMessage}</p> : null}
        </form>

        <form
          onSubmit={handlePasswordChange}
          className="grid gap-4 rounded-3xl border border-ink-100 bg-white p-6 shadow-soft"
        >
          <h2 className="font-display text-xl">Change Password</h2>
          <label className="space-y-2 text-sm">
            <span className="text-ink-500">Password Saat Ini</span>
            <input
              name="current_password"
              type="password"
              required
              className="w-full rounded-xl border border-ink-200 px-4 py-2"
            />
          </label>
          <label className="space-y-2 text-sm">
            <span className="text-ink-500">Password Baru</span>
            <input
              name="password"
              type="password"
              minLength={8}
              required
              className="w-full rounded-xl border border-ink-200 px-4 py-2"
            />
          </label>
          <label className="space-y-2 text-sm">
            <span className="text-ink-500">Konfirmasi Password Baru</span>
            <input
              name="password_confirmation"
              type="password"
              minLength={8}
              required
              className="w-full rounded-xl border border-ink-200 px-4 py-2"
            />
          </label>
          <button
            disabled={savingPassword}
            className="rounded-full border border-ink-200 px-6 py-3 text-sm font-semibold text-ink-700"
          >
            {savingPassword ? 'Menyimpan...' : 'Ubah Password'}
          </button>
          {passwordMessage ? <p className="text-sm text-ink-500">{passwordMessage}</p> : null}
        </form>
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
