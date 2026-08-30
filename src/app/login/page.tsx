'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Zap, Lock, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('alex.morgan@intentos.ai');
  const [password, setPassword] = useState('••••••••••••');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      router.push('/dashboard');
    }, 600);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4" data-testid="login-page">
      <Card className="max-w-md w-full p-8 bg-slate-900/90 border-slate-800 shadow-2xl space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 mb-1">
            <Zap className="w-6 h-6 fill-blue-400" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-100 uppercase">
            INTENTOS ENTERPRISE
          </h1>
          <p className="text-xs text-slate-400">
            Sign in to your autonomous sales intelligence workspace.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-medium">Enterprise Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 bg-slate-950 border-slate-800 text-slate-100 text-xs"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-medium">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 bg-slate-950 border-slate-800 text-slate-100 text-xs"
                required
              />
            </div>
          </div>

          <div className="p-3 rounded-lg bg-blue-950/20 border border-blue-500/20 text-[11px] text-blue-300">
            <strong>DEMO CREDENTIALS:</strong> Pre-filled for Alex Morgan (Head of Sales).
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white py-2 flex items-center justify-center gap-1.5"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Workspace'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </form>

        <div className="text-center pt-2 border-t border-slate-800/80">
          <Link href="/onboarding" className="text-xs text-slate-400 hover:text-blue-400 transition-colors">
            Need to configure a new workspace? Run Setup Wizard &rarr;
          </Link>
        </div>
      </Card>
    </div>
  );
}

