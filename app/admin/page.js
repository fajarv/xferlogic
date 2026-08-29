"use client";

import { useEffect, useState } from 'react';
import AppShell from '../../components/AppShell';
import { supabase } from '../../lib/supabase';

export default function Admin(){
  const [allowed,setAllowed]=useState(null);
  const [apps,setApps]=useState([]);
  const [message,setMessage]=useState('');

  async function load(){
    const {data:{user}}=await supabase.auth.getUser(); if(!user){window.location.href='/login';return;}
    const {data:profile}=await supabase.from('profiles').select('role').eq('id',user.id).maybeSingle();
    const ok=profile?.role==='platform_admin' || profile?.role==='moderator'; setAllowed(ok);
    if(!ok)return;
    const {data,error}=await supabase.from('organization_applications').select('*, organizations(name,website,industry,headquarters,tier,status), profiles!organization_applications_submitted_by_fkey(display_name)').order('submitted_at',{ascending:false});
    if(error){
      const fallback=await supabase.from('organization_applications').select('*, organizations(name,website,industry,headquarters,tier,status)').order('submitted_at',{ascending:false});
      setApps(fallback.data||[]);
    } else setApps(data||[]);
  }
  useEffect(()=>{load()},[]);

  async function approve(app,tier){setMessage('Approving…');const {error}=await supabase.rpc('approve_organization_application',{p_application_id:app.id,p_tier:tier,p_notes:'Approved in XL100 admin console'});setMessage(error?error.message:'Approved.');if(!error)load();}
  async function review(app,status){const notes=window.prompt(status==='needs_info'?'What information do you need?':'Reason for rejection?')||'';if(!notes&&status==='rejected')return;setMessage('Saving review…');const {error}=await supabase.rpc('review_organization_application',{p_application_id:app.id,p_status:status,p_notes:notes});setMessage(error?error.message:'Review saved.');if(!error)load();}

  return <AppShell><main className="mx-auto max-w-7xl px-5 py-10"><div className="xl-kicker">XL100 governance</div><h1 className="mt-3 text-4xl font-black">Admin approval console</h1><p className="mt-3 max-w-3xl text-slate-400">Review enterprise applications, validate the requested tier using your market knowledge, and keep an audit trail of decisions.</p>
    {allowed===false && <div className="xl-card mt-8 p-6"><h2 className="text-xl font-bold">Admin access required</h2><p className="mt-2 text-slate-400">This account is not currently assigned an XL100 moderator/platform-admin role.</p></div>}
    {allowed && <div className="mt-8 space-y-4">{apps.length===0&&<div className="xl-card p-6 text-slate-400">No company applications are waiting for review.</div>}{apps.map(app=><article key={app.id} className="xl-card p-6"><div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start"><div><div className="text-xs uppercase tracking-[.15em] text-cyan-300">Requested · XL100 {app.requested_tier}</div><h2 className="mt-2 text-2xl font-bold">{app.organizations?.name}</h2><div className="mt-2 text-sm text-slate-400">{app.organizations?.industry||'Industry not supplied'} · {app.organizations?.headquarters||'HQ not supplied'}</div><p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300">{app.rationale||'No rationale supplied.'}</p><div className="mt-4 text-xs text-slate-500">Claimed license count is private: {app.claimed_license_count}. Submitted {new Date(app.submitted_at).toLocaleString()}.</div></div><div className="min-w-[260px] rounded-xl border border-white/10 bg-white/[.02] p-4"><div className="text-sm text-slate-400">Decision</div><div className="mt-3 grid grid-cols-3 gap-2"><button onClick={()=>approve(app,'member')} className="rounded-lg border border-cyan-400/30 px-2 py-2 text-xs">Member</button><button onClick={()=>approve(app,'gold')} className="rounded-lg border border-amber-300/40 px-2 py-2 text-xs text-amber-200">Gold</button><button onClick={()=>approve(app,'elite')} className="rounded-lg border border-violet-300/40 px-2 py-2 text-xs text-violet-200">Elite</button></div><div className="mt-2 grid grid-cols-2 gap-2"><button onClick={()=>review(app,'needs_info')} className="rounded-lg border border-white/15 px-2 py-2 text-xs">Need info</button><button onClick={()=>review(app,'rejected')} className="rounded-lg border border-red-400/30 px-2 py-2 text-xs text-red-300">Reject</button></div></div></div></article>)}{message&&<div className="text-sm text-slate-400">{message}</div>}</div>}
  </main></AppShell>
}
