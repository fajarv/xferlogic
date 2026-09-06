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
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session && mode !== 'forgot') window.location.replace('/dashboard');
    });
  }, [mode]);

  async function submit(e){
    e.preventDefault(); setBusy(true); setMessage('');
    try {
      if(mode === 'signup'){
        const emailRedirectTo = `${window.location.origin}/login`;
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options:{ data:{ full_name:name }, emailRedirectTo },
        });
        if(error) throw error;
        setMessage('Account created. Check your email to confirm it, then XL100 will bring you back here and sign you in.');
      } else if(mode === 'forgot') {
        const redirectTo = `${window.location.origin}/reset-password`;
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
        if(error) throw error;
        setMessage('Password reset email sent. Open the link in that email to choose a new password.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if(error) throw error;
        window.location.href='/dashboard';
      }
    } catch(err){ setMessage(err.message || 'Unable to continue.'); }
    finally { setBusy(false); }
  }

  const title = mode==='signin' ? 'Welcome back' : mode==='signup' ? 'Create your XL100 profile' : 'Reset your password';
  const buttonLabel = busy ? 'Working…' : mode==='signin' ? 'Sign in' : mode==='signup' ? 'Create account' : 'Send reset link';

  return (
    <main className="grid min-h-screen place-items-center px-5 py-12">
      <div className="w-full max-w-md">
        <div className="flex justify-center"><BrandMark /></div>
        <div className="xl-card mt-7 p-7">
          <div className="xl-kicker">Professional membership</div>
          <h1 className="mt-3 text-3xl font-black">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">{mode==='forgot' ? 'Enter the email address for your XL100 account and we will send you a secure password-reset link.' : 'Individual membership is open to ETRM professionals across vendors, commodities, roles and employers.'}</p>
          <form onSubmit={submit} className="mt-7 space-y-4">
            {mode==='signup' && <label>Full name<input value={name} onChange={e=>setName(e.target.value)} required /></label>}
            <label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></label>
            {mode!=='forgot' && <label>Password<input type="password" minLength={8} value={password} onChange={e=>setPassword(e.target.value)} required /></label>}
            <button disabled={busy} className="w-full rounded-xl bg-cyan-400 px-4 py-3 font-bold text-slate-950 disabled:opacity-60">{buttonLabel}</button>
          </form>
          {message && <div className="mt-4 rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-3 text-sm text-slate-300">{message}</div>}
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-sm">
            {mode==='signin' && <><button onClick={()=>{setMode('forgot');setMessage('')}} className="text-cyan-300">Forgot password?</button><button onClick={()=>{setMode('signup');setMessage('')}} className="text-cyan-300">New to XL100? Create an account</button></>}
            {mode!=='signin' && <button onClick={()=>{setMode('signin');setMessage('')}} className="text-cyan-300">Back to sign in</button>}
          </div>
        </div>
      </div>
    </main>
  );
}
