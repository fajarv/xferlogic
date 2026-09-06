"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import AppShell from '../../../components/AppShell';
import { supabase } from '../../../lib/supabase';

export default function CompanyManage(){
  const [memberships,setMemberships]=useState([]);
  const [selectedOrg,setSelectedOrg]=useState('');
  const [products,setProducts]=useState([]);
  const [selectedProducts,setSelectedProducts]=useState([]);
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState(false);
  const [message,setMessage]=useState('');

  const org=useMemo(()=>memberships.find(m=>m.organization_id===selectedOrg)?.organizations||null,[memberships,selectedOrg]);

  useEffect(()=>{(async()=>{
    const {data:{user}}=await supabase.auth.getUser();
    if(!user){window.location.href='/login';return;}

    const [{data:memberships,error:mErr},{data:catalog,error:pErr}] = await Promise.all([
      supabase.from('organization_members')
        .select('organization_id,company_role,status,organizations(id,name,tier,status)')
        .eq('user_id',user.id)
        .eq('company_role','company_admin')
        .eq('status','approved'),
      supabase.from('etrm_products')
        .select('id,vendor_name,product_name')
        .eq('active',true)
        .order('vendor_name')
        .order('product_name'),
    ]);

    if(mErr||pErr){setMessage((mErr||pErr).message);setLoading(false);return;}
    const approved=(memberships||[]).filter(m=>m.organizations?.status==='approved');
    setMemberships(approved);
    setProducts(catalog||[]);
    if(approved.length)setSelectedOrg(approved[0].organization_id);
    setLoading(false);
  })()},[]);

  useEffect(()=>{
    if(!selectedOrg){setSelectedProducts([]);return;}
    (async()=>{
      setMessage('');
      const {data,error}=await supabase.from('organization_products').select('product_id').eq('organization_id',selectedOrg);
      if(error){setMessage(error.message);return;}
      setSelectedProducts((data||[]).map(x=>x.product_id));
    })();
  },[selectedOrg]);

  function toggle(id){
    setSelectedProducts(rows=>rows.includes(id)?rows.filter(x=>x!==id):[...rows,id]);
  }

  async function save(){
    if(!selectedOrg||saving)return;
    setSaving(true);
    setMessage('Saving current systems…');
    const {error}=await supabase.rpc('set_organization_products',{
      p_organization_id:selectedOrg,
      p_product_ids:selectedProducts,
    });
    setSaving(false);
    setMessage(error?error.message:'Current ETRM systems saved. Historical applications were not changed.');
  }

  return <AppShell><main className="mx-auto max-w-5xl px-5 py-10">
    <div className="xl-kicker">Company administration</div>
    <h1 className="mt-3 text-4xl font-black">Manage current ETRM systems.</h1>
    <p className="mt-3 max-w-3xl text-slate-400">Keep the approved company profile current without rewriting its historical XL100 application. Adding or removing a system creates an audit entry.</p>

    {loading&&<div className="mt-8 text-slate-400">Loading company access…</div>}
    {!loading&&memberships.length===0&&<section className="xl-card mt-8 p-6"><h2 className="text-xl font-bold">No company-admin access yet.</h2><p className="mt-2 text-slate-400">You need an approved company-admin membership to maintain current systems.</p><Link href="/company/apply" className="mt-5 inline-block rounded-xl bg-cyan-400 px-4 py-3 font-bold text-slate-950">Apply for company XL100</Link></section>}

    {!loading&&memberships.length>0&&<>
      {memberships.length>1&&<label className="mt-8 block max-w-md">Company<select value={selectedOrg} onChange={e=>setSelectedOrg(e.target.value)}>{memberships.map(m=><option key={m.organization_id} value={m.organization_id}>{m.organizations?.name}</option>)}</select></label>}

      <section className="xl-card mt-8 p-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><div className="xl-kicker">Current company profile</div><h2 className="mt-2 text-2xl font-bold">{org?.name}</h2><p className="mt-1 text-sm text-slate-400">{org?.tier?`XL100 ${String(org.tier).replace(/^./,c=>c.toUpperCase())}`:'Approved organization'}</p></div><div className="text-xs text-slate-500">Application history remains unchanged.</div></div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {products.map(product=><label key={product.id} className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/[.02] p-4"><input className="!w-auto" type="checkbox" checked={selectedProducts.includes(product.id)} onChange={()=>toggle(product.id)}/><span><strong>{product.vendor_name}</strong> · {product.product_name}</span></label>)}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4"><button onClick={save} disabled={saving} className="rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950 disabled:cursor-not-allowed disabled:opacity-60">{saving?'Saving…':'Save current systems'}</button>{message&&<span className="max-w-xl text-sm text-slate-400">{message}</span>}</div>
        <p className="mt-5 border-t border-white/10 pt-5 text-xs leading-5 text-slate-500">This page changes only the systems currently represented by the company. It does not change the historical application, claimed license count, or approved XL100 tier. Those require a separate review if the company’s eligibility changes.</p>
      </section>
    </>}
  </main></AppShell>;
}
