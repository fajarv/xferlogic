"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AppShell from '../../components/AppShell';
import { supabase } from '../../lib/supabase';

export default function Dashboard(){
  const [user,setUser]=useState(null);
  const [profile,setProfile]=useState(null);
  const [passport,setPassport]=useState(null);
  const [memberships,setMemberships]=useState([]);

  useEffect(()=>{(async()=>{
    const { data:{ user } } = await supabase.auth.getUser();
    if(!user){ window.location.href='/login'; return; }
    setUser(user);
    const [{data:p},{data:xp},{data:m}] = await Promise.all([
      supabase.from('profiles').select('*').eq('id',user.id).maybeSingle(),
      supabase.from('experience_passports').select('*').eq('user_id',user.id).maybeSingle(),
      supabase.from('organization_members').select('company_role,status,organizations(name,tier,status)').eq('user_id',user.id),
    ]);
    setProfile(p); setPassport(xp); setMemberships(m||[]);
  })()},[]);

  const completion = [profile?.display_name,profile?.title,profile?.location,passport?.years_etrm,passport?.summary].filter(Boolean).length * 20;

  return <AppShell><main className="mx-auto max-w-7xl px-5 py-10">
    <div className="xl-kicker">Member workspace</div>
    <div className="mt-3 flex flex-col justify-between gap-5 md:flex-row md:items-end">
      <div><h1 className="text-4xl font-black">{profile?.display_name || user?.email || 'XL100 member'}</h1><p className="mt-2 text-slate-400">Build your professional identity, connect to your company, and make your ETRM experience discoverable.</p></div>
      <Link href="/passport" className="rounded-xl bg-cyan-400 px-4 py-3 font-bold text-slate-950">Edit Experience Passport</Link>
    </div>
    <div className="mt-8 grid gap-4 md:grid-cols-3">
      <section className="xl-card p-5"><div className="text-sm text-slate-400">Profile completion</div><div className="mt-2 text-3xl font-black text-cyan-300">{completion}%</div><div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full bg-cyan-400" style={{width:`${completion}%`}} /></div></section>
      <section className="xl-card p-5"><div className="text-sm text-slate-400">ETRM experience</div><div className="mt-2 text-3xl font-black">{passport?.years_etrm ?? '—'} <span className="text-base text-slate-500">years</span></div><div className="mt-3 text-sm text-slate-400">{passport?.commodities?.length ? passport.commodities.join(' · ') : 'Add commodities and lifecycle expertise.'}</div></section>
      <section className="xl-card p-5"><div className="text-sm text-slate-400">Company affiliation</div><div className="mt-2 text-xl font-bold">{memberships[0]?.organizations?.name || 'Not connected yet'}</div><div className="mt-3 text-sm text-slate-400">{memberships[0]?.organizations?.tier ? `XL100 ${memberships[0].organizations.tier}` : 'Join or submit an eligible organization.'}</div></section>
    </div>
    <div className="mt-8 grid gap-4 lg:grid-cols-2">
      <section className="xl-card p-6"><h2 className="text-xl font-bold">Next steps</h2><div className="mt-5 space-y-3">{[
        ['/passport','Complete your Experience Passport','Platforms, commodities, lifecycle areas and hands-on evidence.'],
        ['/company/apply','Connect your company','Apply for XL100 enterprise status if your organization has 100+ licenses.'],
        ['#','Talent search — Phase 1B','Search by ETRM platform, commodity, role and availability.'],
      ].map(([href,h,p])=><Link key={h} href={href} className="block rounded-xl border border-white/10 p-4"><strong>{h}</strong><p className="mt-1 text-sm text-slate-400">{p}</p></Link>)}</div></section>
      <section className="xl-card p-6"><div className="xl-kicker">Coming next</div><h2 className="mt-2 text-xl font-bold">Jobs, projects & Team Builder</h2><p className="mt-3 text-sm leading-6 text-slate-400">XL100 will use structured Experience Passports to match specialists to roles and assemble implementation/support teams around real ETRM requirements.</p></section>
    </div>
  </main></AppShell>
}
