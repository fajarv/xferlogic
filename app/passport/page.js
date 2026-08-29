"use client";

import { useEffect, useState } from 'react';
import AppShell from '../../components/AppShell';
import { supabase } from '../../lib/supabase';

const splitList = v => String(v || '').split(',').map(x=>x.trim()).filter(Boolean);

export default function PassportPage(){
  const [user,setUser]=useState(null);
  const [profile,setProfile]=useState({display_name:'',title:'',location:'',bio:'',availability_status:'not_specified'});
  const [passport,setPassport]=useState({years_etrm:'',summary:'',commodities:'',lifecycle_areas:'',delivery_roles:'',operating_regions:'',hardest_issue:'',go_live_ownership:'',end_to_end_processes:'',integrations:''});
  const [products,setProducts]=useState([]);
  const [message,setMessage]=useState('');

  useEffect(()=>{(async()=>{
    const {data:{user}}=await supabase.auth.getUser();
    if(!user){window.location.href='/login';return;}
    setUser(user);

    const [{data:p},{data:xp},{data:catalog},{data:expertise}] = await Promise.all([
      supabase.from('profiles').select('*').eq('id',user.id).maybeSingle(),
      supabase.from('experience_passports').select('*').eq('user_id',user.id).maybeSingle(),
      supabase.from('etrm_products').select('id,vendor_name,product_name').eq('active',true).order('vendor_name').order('product_name'),
      supabase.from('experience_products').select('product_id,years_experience,proficiency,hands_on').eq('user_id',user.id),
    ]);

    if(p) setProfile(prev=>({...prev,...p}));
    if(xp) setPassport(prev=>({...prev,...xp,commodities:(xp.commodities||[]).join(', '),lifecycle_areas:(xp.lifecycle_areas||[]).join(', '),delivery_roles:(xp.delivery_roles||[]).join(', '),operating_regions:(xp.operating_regions||[]).join(', '),...(xp.critical_experience||{})}));

    const expertiseByProduct = new Map((expertise||[]).map(x=>[x.product_id,x]));
    setProducts((catalog||[]).map(product=>{
      const existing=expertiseByProduct.get(product.id);
      return {...product,selected:Boolean(existing),years_experience:existing?.years_experience ?? '',proficiency:existing?.proficiency || 'strong',hands_on:existing?.hands_on ?? true};
    }));
  })()},[]);

  function patchProduct(id,patch){
    setProducts(rows=>rows.map(row=>row.id===id?{...row,...patch}:row));
  }

  async function save(e){
    e.preventDefault();
    if(!user) return;
    setMessage('Saving…');

    const {error:pErr}=await supabase.from('profiles').upsert({id:user.id,display_name:profile.display_name,title:profile.title,location:profile.location,bio:profile.bio,availability_status:profile.availability_status});
    const critical_experience={hardest_issue:passport.hardest_issue,go_live_ownership:passport.go_live_ownership,end_to_end_processes:passport.end_to_end_processes,integrations:passport.integrations};
    const {error:xErr}=await supabase.from('experience_passports').upsert({user_id:user.id,years_etrm:passport.years_etrm?Number(passport.years_etrm):null,summary:passport.summary,commodities:splitList(passport.commodities),lifecycle_areas:splitList(passport.lifecycle_areas),delivery_roles:splitList(passport.delivery_roles),operating_regions:splitList(passport.operating_regions),critical_experience});

    let productError=null;
    if(!pErr && !xErr){
      const {error:deleteError}=await supabase.from('experience_products').delete().eq('user_id',user.id);
      productError=deleteError;
      const selected=products.filter(x=>x.selected).map(x=>({user_id:user.id,product_id:x.id,years_experience:x.years_experience===''?null:Number(x.years_experience),proficiency:x.proficiency,hands_on:Boolean(x.hands_on)}));
      if(!productError && selected.length){
        const {error:insertError}=await supabase.from('experience_products').insert(selected);
        productError=insertError;
      }
    }

    const err=pErr||xErr||productError;
    setMessage(err ? err.message : 'Experience Passport saved.');
  }

  return <AppShell><main className="mx-auto max-w-5xl px-5 py-10"><div className="xl-kicker">Experience Passport</div><h1 className="mt-3 text-4xl font-black">Show what you can actually do.</h1><p className="mt-3 max-w-3xl text-slate-400">Structured experience makes ETRM talent searchable by real delivery history instead of job title alone. Everything is self-declared in Phase 1.</p>
    <form onSubmit={save} className="mt-8 space-y-5">
      <section className="xl-card grid gap-4 p-6 md:grid-cols-2"><label>Full name<input value={profile.display_name||''} onChange={e=>setProfile({...profile,display_name:e.target.value})}/></label><label>Current title<input value={profile.title||''} onChange={e=>setProfile({...profile,title:e.target.value})}/></label><label>Location<input placeholder="Houston, TX" value={profile.location||''} onChange={e=>setProfile({...profile,location:e.target.value})}/></label><label>Availability<select value={profile.availability_status||'not_specified'} onChange={e=>setProfile({...profile,availability_status:e.target.value})}><option value="not_specified">Not specified</option><option value="not_looking">Not looking</option><option value="open_to_opportunities">Open to opportunities</option><option value="contract_only">Contract only</option><option value="full_time">Full-time</option><option value="advisory_fractional">Advisory / fractional</option><option value="short_engagements">Short SME engagements</option></select></label><label className="md:col-span-2">Professional bio<textarea rows="3" value={profile.bio||''} onChange={e=>setProfile({...profile,bio:e.target.value})}/></label></section>

      <section className="xl-card grid gap-4 p-6 md:grid-cols-2"><label>Years in ETRM<input type="number" min="0" max="70" value={passport.years_etrm||''} onChange={e=>setPassport({...passport,years_etrm:e.target.value})}/></label><label>Operating regions<input placeholder="North America, Europe" value={passport.operating_regions||''} onChange={e=>setPassport({...passport,operating_regions:e.target.value})}/></label><label>Commodities<input placeholder="Crude, Products, Gas, Power" value={passport.commodities||''} onChange={e=>setPassport({...passport,commodities:e.target.value})}/></label><label>Lifecycle areas<input placeholder="Trade Capture, Risk, P&L, Scheduling, Settlements" value={passport.lifecycle_areas||''} onChange={e=>setPassport({...passport,lifecycle_areas:e.target.value})}/></label><label>Delivery roles<input placeholder="Product Owner, SME, Architect, Support Lead" value={passport.delivery_roles||''} onChange={e=>setPassport({...passport,delivery_roles:e.target.value})}/></label><label className="md:col-span-2">Experience summary<textarea rows="4" value={passport.summary||''} onChange={e=>setPassport({...passport,summary:e.target.value})}/></label></section>

      <section className="xl-card p-6"><div className="xl-kicker">ETRM product expertise</div><h2 className="mt-2 text-xl font-bold">Separate hands-on experience from product familiarity.</h2><p className="mt-2 text-sm leading-6 text-slate-400">Select the commercial platforms you have worked with, then capture approximate years and proficiency. These fields will power Talent Search and Team Builder.</p><div className="mt-5 space-y-3">{products.map(product=><div key={product.id} className="grid gap-3 rounded-xl border border-white/10 bg-white/[.02] p-4 md:grid-cols-[1.3fr_.6fr_.8fr_.55fr] md:items-end"><label className="flex-row items-center gap-3"><input className="!w-auto" type="checkbox" checked={product.selected} onChange={e=>patchProduct(product.id,{selected:e.target.checked})}/><span><strong className="text-white">{product.product_name}</strong><span className="ml-2 text-xs text-slate-500">{product.vendor_name}</span></span></label><label>Years<input type="number" min="0" max="70" disabled={!product.selected} value={product.years_experience} onChange={e=>patchProduct(product.id,{years_experience:e.target.value})}/></label><label>Proficiency<select disabled={!product.selected} value={product.proficiency} onChange={e=>patchProduct(product.id,{proficiency:e.target.value})}><option value="working">Working</option><option value="strong">Strong</option><option value="advanced">Advanced</option><option value="expert">Expert</option></select></label><label className="flex-row items-center gap-2"><input className="!w-auto" type="checkbox" disabled={!product.selected} checked={product.hands_on} onChange={e=>patchProduct(product.id,{hands_on:e.target.checked})}/><span>Hands-on</span></label></div>)}</div></section>

      <section className="xl-card space-y-4 p-6"><div className="xl-kicker">Critical experience</div><label>Which ETRM processes can you explain end-to-end?<textarea rows="3" value={passport.end_to_end_processes||''} onChange={e=>setPassport({...passport,end_to_end_processes:e.target.value})}/></label><label>Describe the hardest production issue you personally diagnosed. How did you prove the root cause?<textarea rows="4" value={passport.hardest_issue||''} onChange={e=>setPassport({...passport,hardest_issue:e.target.value})}/></label><label>What did you personally own during your most recent go-live?<textarea rows="3" value={passport.go_live_ownership||''} onChange={e=>setPassport({...passport,go_live_ownership:e.target.value})}/></label><label>Which integrations have you designed, built, or troubleshot hands-on?<textarea rows="3" value={passport.integrations||''} onChange={e=>setPassport({...passport,integrations:e.target.value})}/></label></section>
      <div className="flex items-center gap-4"><button className="rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950">Save Experience Passport</button>{message&&<span className="text-sm text-slate-400">{message}</span>}</div>
    </form></main></AppShell>
}
