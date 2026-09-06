"use client";

import { useEffect, useMemo, useState } from 'react';
import AppShell from '../../../components/AppShell';
import { supabase } from '../../../lib/supabase';

function tierFor(count){const n=Number(count);if(n>=500)return 'Elite';if(n>=300)return 'Gold';if(n>=100)return 'Member';return null;}
function slugify(v){return v.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');}

export default function CompanyApply(){
  const [user,setUser]=useState(null);
  const [profile,setProfile]=useState(null);
  const [products,setProducts]=useState([]);
  const [form,setForm]=useState({name:'',website:'',industry:'',headquarters:'',regions:'',licenseCount:'',rationale:'',productIds:[]});
  const [message,setMessage]=useState('');
  const tier=useMemo(()=>tierFor(form.licenseCount),[form.licenseCount]);

  useEffect(()=>{(async()=>{const {data:{user}}=await supabase.auth.getUser();if(!user){window.location.href='/login';return;}setUser(user);const [{data:catalog},{data:profile}]=await Promise.all([supabase.from('etrm_products').select('*').order('vendor_name').order('product_name'),supabase.from('profiles').select('display_name,title').eq('id',user.id).maybeSingle()]);setProducts(catalog||[]);setProfile(profile||null);})()},[]);
  const toggle=id=>setForm({...form,productIds:form.productIds.includes(id)?form.productIds.filter(x=>x!==id):[...form.productIds,id]});

  async function submit(e){e.preventDefault();setMessage('Submitting…');if(!tier){setMessage('XL100 company status requires at least 100 commercial ETRM licenses.');return;}
    const slug=`${slugify(form.name)}-${Date.now().toString().slice(-5)}`;
    const {data:org,error:oErr}=await supabase.from('organizations').insert({name:form.name,slug,website:form.website||null,industry:form.industry||null,headquarters:form.headquarters||null,regions:form.regions.split(',').map(x=>x.trim()).filter(Boolean),created_by:user.id}).select().single();
    if(oErr){setMessage(oErr.message);return;}
    const {error:aErr}=await supabase.from('organization_applications').insert({organization_id:org.id,submitted_by:user.id,claimed_license_count:Number(form.licenseCount),rationale:form.rationale||null});
    if(aErr){setMessage(aErr.message);return;}
    if(form.productIds.length){await supabase.from('organization_products').insert(form.productIds.map(product_id=>({organization_id:org.id,product_id})));}
    setMessage(`Application submitted for XL100 ${tier}. XferLogic will review the company and tier.`);
  }

  return <AppShell><main className="mx-auto max-w-5xl px-5 py-10"><div className="xl-kicker">Enterprise membership</div><h1 className="mt-3 text-4xl font-black">Apply for XL100 company status.</h1><p className="mt-3 max-w-3xl text-slate-400">Organizations with 100+ commercial ETRM licenses qualify to apply. License counts are self-declared on an honor system and reviewed by XferLogic; exact counts are not intended to be public.</p>
    <div className="mt-6 rounded-xl border border-cyan-300/15 bg-cyan-300/[.04] p-4"><div className="xl-kicker">Submitting as</div><div className="mt-2 font-bold">{profile?.display_name || user?.email || 'Signed-in XL100 member'}</div>{profile?.title&&<div className="mt-1 text-sm text-slate-400">{profile.title}</div>}<div className="mt-2 text-xs leading-5 text-slate-500">This signed-in XL100 account will be recorded as the company application submitter. If approved, the submitter becomes the initial company administrator / representative.</div></div>
    <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_320px]"><form onSubmit={submit} className="xl-card grid gap-4 p-6 md:grid-cols-2"><label>Company name<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label><label>Website<input value={form.website} onChange={e=>setForm({...form,website:e.target.value})}/></label><label>Industry / business<input placeholder="Integrated energy, utility, trading company…" value={form.industry} onChange={e=>setForm({...form,industry:e.target.value})}/></label><label>Headquarters<input value={form.headquarters} onChange={e=>setForm({...form,headquarters:e.target.value})}/></label><label>Regions<input placeholder="North America, Europe" value={form.regions} onChange={e=>setForm({...form,regions:e.target.value})}/></label><label>Approximate ETRM license count<input type="number" min="100" required value={form.licenseCount} onChange={e=>setForm({...form,licenseCount:e.target.value})}/></label><fieldset className="md:col-span-2"><legend className="mb-2 text-sm text-slate-400">Commercial ETRM products represented</legend><div className="grid gap-2 sm:grid-cols-2">{products.map(p=><label key={p.id} className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 p-3"><input className="h-4 w-4" type="checkbox" checked={form.productIds.includes(p.id)} onChange={()=>toggle(p.id)}/><span>{p.vendor_name} · {p.product_name}</span></label>)}</div></fieldset><label className="md:col-span-2">Why should this organization be represented in XL100?<textarea rows="4" value={form.rationale} onChange={e=>setForm({...form,rationale:e.target.value})}/></label><div className="md:col-span-2 flex flex-wrap items-center gap-4"><button className="rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950">Submit company application</button>{message&&<span className="max-w-xl text-sm text-slate-400">{message}</span>}</div></form>
      <aside className="xl-card h-fit p-6"><div className="xl-kicker">Calculated tier</div><div className="mt-3 text-3xl font-black text-cyan-300">{tier?`XL100 ${tier}`:'—'}</div><div className="mt-5 space-y-3 text-sm text-slate-400"><p><strong className="text-white">Member:</strong> 100–299 licenses</p><p><strong className="text-white">Gold:</strong> 300–499 licenses</p><p><strong className="text-white">Elite:</strong> 500+ licenses</p></div><p className="mt-5 border-t border-white/10 pt-5 text-xs leading-5 text-slate-500">Tier is prestige and representation capacity—not extra roadmap voting power. The intended governance model is one company, one vote per roadmap item.</p></aside></div>
  </main></AppShell>
}
