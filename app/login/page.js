"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import BrandMark from '../../components/BrandMark';

export default function LoginPage() {
  const [mode,setMode] = useState('signin');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [name,setName] = useState('');
  const [message,setMessage] = useState('');
  const [busy,setBusy] = useState(false);

  useEffect(() => {
    // Supabase confirmation links return the authenticated session in the URL.
    // Once the client has consumed it, move the user into XL100.
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session) window.location.replace('/dashboard');
    });
  }, []);

  async function submit(e){
    e.preventDefault(); setBusy(true); setMessage('');
    try {
      if(mode === 'signup'){
        const emailRedirectTo = `${window.location.origin}/login`;
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options:{
            data:{ full_name:name },
            emailRedirectTo,
          },
        });
        if(error) throw error;
        setMessage('Account created. Check your email to confirm it, then XL100 will bring you back here and sign you in.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if(error) throw error;
        window.location.href='/dashboard';
      }
    } catch(err){ setMessage(err.message || 'Unable to continue.'); }
    finally { setBusy(false); }
  }

  return (
    <main className="grid min-h-screen place-items-center px-5 py-12">
      <div className="w-full max-w-md">
        <div className="flex justify-center"><BrandMark /></div>
        <div className="xl-card mt-7 p-7">
          <div className="xl-kicker">Professional membership</div>
          <h1 className="mt-3 text-3xl font-black">{mode==='signin'?'Welcome back':'Create your XL100 profile'}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">Individual membership is open to ETRM professionals across vendors, commodities, roles and employers.</p>
          <form onSubmit={submit} className="mt-7 space-y-4">
            {mode==='signup' && <label>Full name<input value={name} onChange={e=>setName(e.target.value)} required /></label>}
            <label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></label>
            <label>Password<input type="password" minLength={8} value={password} onChange={e=>setPassword(e.target.value)} required /></label>
            <button disabled={busy} className="w-full rounded-xl bg-cyan-400 px-4 py-3 font-bold text-slate-950 disabled:opacity-60">{busy?'Working…':mode==='signin'?'Sign in':'Create account'}</button>
          </form>
          {message && <div className="mt-4 rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-3 text-sm text-slate-300">{message}</div>}
          <button onClick={()=>{setMode(mode==='signin'?'signup':'signin');setMessage('')}} className="mt-5 text-sm text-cyan-300">{mode==='signin'?'New to XL100? Create an account':'Already have an account? Sign in'}</button>
        </div>
      </div>
    </main>
  );
}
