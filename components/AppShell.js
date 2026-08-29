"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function AppShell({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user || null));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user || null));
    return () => data.subscription.unsubscribe();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <div className="min-h-screen bg-[#02070d] text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#02070d]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-3 font-black tracking-[0.15em]">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-300 via-blue-500 to-slate-950 text-sm shadow-lg shadow-blue-500/20">XL</span>
            <span>XFERLOGIC <span className="text-cyan-300">XL100</span></span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/passport">Experience Passport</Link>
            <Link href="/company/apply">Company XL100</Link>
            <Link href="/admin">Admin</Link>
          </nav>
          {user ? (
            <button onClick={signOut} className="rounded-lg border border-white/15 px-3 py-2 text-sm">Sign out</button>
          ) : (
            <Link href="/login" className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-bold text-slate-950">Join XL100</Link>
          )}
        </div>
      </header>
      {children}
    </div>
  );
}
