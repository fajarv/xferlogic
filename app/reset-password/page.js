"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import BrandMark from '../../components/BrandMark';

export default function ResetPasswordPage(){
  const [ready,setReady]=useState(false);
  const [password,setPassword]=useState('');
  const [confirm,setConfirm]=useState('');
  const [message,setMessage]=useState('Checking reset link…');
  const [busy,setBusy]=useState(false);

  useEffect(()=>{
    let mounted=true;
    const check = async()=>{
      const { data } = await supabase.auth.getSession();
      if(!mounted) return;
      if(data?.session){ setReady(true); setMessage('Choose a new password for your XL100 account.'); }
      else setMessage('This reset link is invalid or has expired. Request a new one from the sign-in page.');
    };
    check();
    const { data: listener } = supabase.auth.onAuthStateChange((event,session)=>{
      if(!mounted) return;
      if(event==='PASSWORD_RECOVERY' || session){ setReady(true); setMessage('Choose a new password for your XL100 account.'); }
    });
    return ()=>{ mounted=false; listener.subscription.unsubscribe(); };
  },[]);

  async function submit(e){
    e.preventDefault();
    if(password.length<8){ setMessage('Use at least 8 characters.'); return; }
    if(password!==confirm){ setMessage('The passwords do not match.'); return; }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if(error){ setMessage(error.message); return; }
    setMessage('Password updated. Redirecting to your dashboard…');
    setTimeout(()=>{ window.location.href='/dashboard'; },900);
  }

  return <main className="grid min-h-screen place-items-center px-5 py-12">
    <div className="w-full max-w-md">
      <div className="flex justify-center"><BrandMark /></div>
      <div className="xl-card mt-7 p-7">
        <div className="xl-kicker">Account security</div>
        <h1 className="mt-3 text-3xl font-black">Set a new password</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">{message}</p>
        {ready && <form onSubmit={submit} className="mt-7 space-y-4">
          <label>New password<input type="password" minLength={8} value={password} onChange={e=>setPassword(e.target.value)} required /></label>
          <label>Confirm new password<input type="password" minLength={8} value={confirm} onChange={e=>setConfirm(e.target.value)} required /></label>
          <button disabled={busy} className="w-full rounded-xl bg-cyan-400 px-4 py-3 font-bold text-slate-950 disabled:opacity-60">{busy?'Updating…':'Update password'}</button>
        </form>}
        {!ready && <a className="mt-6 inline-block text-sm text-cyan-300" href="/login">Return to sign in</a>}
      </div>
    </div>
  </main>
}
