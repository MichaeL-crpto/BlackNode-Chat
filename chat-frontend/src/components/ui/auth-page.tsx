'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AtSignIcon,
  Grid2x2PlusIcon,
  LockKeyholeIcon,
  UserPlusIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from './button';
import { Input } from './input';
import { api } from '@/lib/api-client';

export function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (mode === 'register') {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters');
          return;
        }
        const response = await api.auth.register(username, password);
        window.localStorage.setItem('blacknode.token', response.token);
        window.localStorage.setItem('blacknode.username', response.username);
        router.push('/main');
        router.refresh();
      } else {
        const response = await api.auth.login(username, password);
        window.localStorage.setItem('blacknode.token', response.token);
        window.localStorage.setItem('blacknode.username', response.username);
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-100 lg:grid lg:grid-cols-2">
      <div className="relative hidden h-full flex-col overflow-hidden border-r border-white/10 bg-slate-900/70 p-10 lg:flex">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        <div className="z-10 flex items-center gap-2 text-white">
          <Grid2x2PlusIcon className="size-6" />
          <p className="font-heading text-xl font-semibold tracking-[0.18em] uppercase">
            BlackNode Chat
          </p>
        </div>
        <div className="z-10 mt-auto">
          <div className="max-w-md">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">
              Secure Group Communication
            </p>
            <p className="mt-2 text-sm text-slate-500">
              End-to-end encrypted group messaging platform with public and private group support.
            </p>
          </div>
        </div>
        <div className="absolute inset-0">
          <FloatingPaths position={1} />
          <FloatingPaths position={-1} />
        </div>
      </div>
      <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-slate-950 p-4 text-slate-100">
        <div
          aria-hidden
          className="absolute inset-0 isolate -z-10 opacity-100"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(248,250,252,0.18),_transparent_28%),linear-gradient(135deg,_#020617_0%,_#0f172a_45%,_#111827_100%)]" />
          <div className="absolute right-0 top-0 h-[80rem] w-[35rem] -translate-y-[22rem] rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,rgb(255_255_255_/_0.10)_0,hsla(0,0%,100%,.03)_50%,rgb(255_255_255_/_0.01)_80%)]" />
          <div className="absolute right-0 top-0 h-[80rem] w-[15rem] translate-x-[5%] -translate-y-1/2 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,rgb(255_255_255_/_0.08)_0,rgb(255_255_255_/_0.01)_80%,transparent_100%)]" />
          <div className="absolute right-0 top-0 h-[80rem] w-[15rem] -translate-y-[22rem] rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,rgb(255_255_255_/_0.08)_0,rgb(255_255_255_/_0.01)_80%,transparent_100%)]" />
        </div>
        <div className="mx-auto w-full max-w-sm space-y-4">
          <div className="flex items-center gap-2 lg:hidden">
            <Grid2x2PlusIcon className="size-6" />
            <p className="font-heading text-lg font-semibold tracking-[0.14em] uppercase text-white">
              BlackNode Chat
            </p>
          </div>
          <div className="flex flex-col space-y-1">
            <h1 className="font-heading text-2xl font-bold tracking-wide text-white">
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </h1>
            <p className="text-base text-slate-300">
              {mode === 'login'
                ? 'Enter your credentials to access the chat platform.'
                : 'Register to create your account and join group discussions.'}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 rounded-2xl border px-4 py-2 text-sm font-medium transition ${
                mode === 'login'
                  ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300'
                  : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`flex-1 rounded-2xl border px-4 py-2 text-sm font-medium transition ${
                mode === 'register'
                  ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300'
                  : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              Register
            </button>
          </div>

          <form className="space-y-3" onSubmit={handleSubmit}>
            <div className="relative h-max">
              <Input
                placeholder="Username"
                className="peer border-white/10 bg-white/5 ps-9 text-white placeholder:text-slate-500 focus-visible:ring-white/30"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
              />
              <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-slate-400">
                <AtSignIcon className="size-4" aria-hidden="true" />
              </div>
            </div>
            <div className="relative h-max">
              <Input
                placeholder="Password"
                className="peer border-white/10 bg-white/5 ps-9 text-white placeholder:text-slate-500 focus-visible:ring-white/30"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-slate-400">
                <LockKeyholeIcon className="size-4" aria-hidden="true" />
              </div>
            </div>
            {mode === 'register' && (
              <div className="relative h-max">
                <Input
                  placeholder="Confirm Password"
                  className="peer border-white/10 bg-white/5 ps-9 text-white placeholder:text-slate-500 focus-visible:ring-white/30"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                />
                <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-slate-400">
                  <LockKeyholeIcon className="size-4" aria-hidden="true" />
                </div>
              </div>
            )}
            {error ? (
              <p className="text-sm text-amber-300">{error}</p>
            ) : null}
            <Button
              type="submit"
              size="lg"
              className="w-full border border-emerald-400/30 bg-emerald-500 text-slate-950 hover:bg-emerald-400"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Please wait...'
                : mode === 'login'
                  ? 'Sign In'
                  : 'Create Account'}
            </Button>
          </form>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-400">
            <p className="font-medium text-white">Backend Connection</p>
            <p className="mt-1">
              This connects to Spring Boot backend at:{' '}
              <code className="text-emerald-300">
                {process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}
              </code>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    duration: 20 + (i % 10),
    width: 0.5 + i * 0.03,
  }));

  return (
    <div className="pointer-events-none absolute inset-0">
      <svg
        className="h-full w-full text-white"
        viewBox="0 0 696 316"
        fill="none"
        aria-hidden="true"
      >
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.1 + path.id * 0.03}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.3, 0.6, 0.3],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: path.duration,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'linear',
            }}
          />
        ))}
      </svg>
    </div>
  );
}
