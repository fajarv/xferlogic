"use client";

import { useEffect, useMemo, useState } from "react";
import AppShell from "../../components/AppShell";
import { supabase } from "../../lib/supabase";

function includesAny(values, query) {
  if (!query) return true;
  return (values || []).some(v => String(v).toLowerCase().includes(query.toLowerCase()));
}

export default function TalentDirectoryPage() {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [filters, setFilters] = useState({ q: "", platform: "", commodity: "", lifecycle: "", availability: "" });

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      const { data: auth } = await supabase.auth.getUser();
      if (!auth?.user) {
        if (active) {
          setMessage("Sign in to search the XL100 talent network.");
          setLoading(false);
        }
        return;
      }

      const [profilesResult, passportsResult, expertiseResult, productsResult] = await Promise.all([
        supabase.from("profiles").select("id,display_name,title,location,bio,availability_status"),
        supabase.from("experience_passports").select("user_id,years_etrm,summary,commodities,lifecycle_areas,delivery_roles,operating_regions"),
        supabase.from("experience_products").select("user_id,product_id,years_experience,proficiency,hands_on"),
        supabase.from("etrm_products").select("id,vendor_name,product_name").eq("active", true),
      ]);

      const err = profilesResult.error || passportsResult.error || expertiseResult.error || productsResult.error;
      if (err) {
        if (active) {
          setMessage(err.message || "Unable to load talent.");
          setLoading(false);
        }
        return;
      }

      const passportByUser = new Map((passportsResult.data || []).map(p => [p.user_id, p]));
      const productById = new Map((productsResult.data || []).map(p => [p.id, p]));
      const expertiseByUser = new Map();
      (expertiseResult.data || []).forEach(row => {
        const list = expertiseByUser.get(row.user_id) || [];
        const product = productById.get(row.product_id);
        list.push({ ...row, product });
        expertiseByUser.set(row.user_id, list);
      });

      const merged = (profilesResult.data || []).map(p => ({
        ...p,
        passport: passportByUser.get(p.id) || null,
        expertise: expertiseByUser.get(p.id) || [],
      }));

      if (active) {
        setPeople(merged);
        setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    return people.filter(person => {
      const passport = person.passport || {};
      const platformText = (person.expertise || []).map(x => `${x.product?.vendor_name || ""} ${x.product?.product_name || ""}`).join(" ").toLowerCase();
      const haystack = [
        person.display_name,
        person.title,
        person.location,
        person.bio,
        passport.summary,
        ...(passport.delivery_roles || []),
        ...(passport.operating_regions || []),
        platformText,
      ].filter(Boolean).join(" ").toLowerCase();

      if (q && !haystack.includes(q)) return false;
      if (filters.platform && !platformText.includes(filters.platform.toLowerCase())) return false;
      if (!includesAny(passport.commodities, filters.commodity)) return false;
      if (!includesAny(passport.lifecycle_areas, filters.lifecycle)) return false;
      if (filters.availability && person.availability_status !== filters.availability) return false;
      return true;
    });
  }, [people, filters]);

  const clearFilters = () => setFilters({ q: "", platform: "", commodity: "", lifecycle: "", availability: "" });

  return (
    <AppShell>
      <main className="mx-auto max-w-7xl px-5 py-12">
        <div className="xl-kicker">XL100 Talent Graph</div>
        <div className="mt-3 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <h1 className="text-4xl font-black tracking-[-.045em] md:text-5xl">Find ETRM talent by <span className="text-cyan-300">actual experience.</span></h1>
            <p className="mt-3 max-w-3xl text-slate-400">Search structured Experience Passports and product expertise rather than job titles alone. This becomes the foundation for jobs, project staffing and the future XL100 Team Builder.</p>
          </div>
          <div className="rounded-xl border border-cyan-300/15 bg-cyan-300/[.04] px-4 py-3 text-sm text-slate-300">{filtered.length} specialist{filtered.length === 1 ? "" : "s"} visible</div>
        </div>

        <section className="xl-card mt-8 grid gap-4 p-5 md:grid-cols-5">
          <label className="md:col-span-2">Name, title, location, role or keyword
            <input value={filters.q} onChange={e => setFilters(f => ({ ...f, q: e.target.value }))} placeholder="e.g. settlement lead" />
          </label>
          <label>ETRM platform
            <input value={filters.platform} onChange={e => setFilters(f => ({ ...f, platform: e.target.value }))} placeholder="RightAngle, Endur..." />
          </label>
          <label>Commodity
            <input value={filters.commodity} onChange={e => setFilters(f => ({ ...f, commodity: e.target.value }))} placeholder="Crude, Power, Gas..." />
          </label>
          <label>Lifecycle area
            <input value={filters.lifecycle} onChange={e => setFilters(f => ({ ...f, lifecycle: e.target.value }))} placeholder="Risk, Scheduling..." />
          </label>
          <label className="md:col-span-3">Availability
            <select value={filters.availability} onChange={e => setFilters(f => ({ ...f, availability: e.target.value }))}>
              <option value="">Any availability</option>
              <option value="open_to_opportunities">Open to opportunities</option>
              <option value="contract_only">Contract only</option>
              <option value="full_time">Full-time</option>
              <option value="advisory_fractional">Advisory / fractional</option>
              <option value="short_engagements">Short SME engagements</option>
              <option value="not_looking">Not looking</option>
            </select>
          </label>
          <div className="md:col-span-2 flex items-end">
            <button onClick={clearFilters} className="w-full rounded-xl border border-white/15 px-4 py-3 font-bold text-slate-200">Clear filters</button>
          </div>
        </section>

        {loading && <div className="mt-8 text-slate-400">Loading XL100 talent…</div>}
        {message && <div className="mt-8 rounded-xl border border-amber-300/20 bg-amber-300/[.04] p-4 text-sm text-slate-300">{message}</div>}

        {!loading && !message && filtered.length === 0 && (
          <section className="xl-card mt-8 p-8 text-center">
            <h2 className="text-2xl font-bold">No matching specialists yet.</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-400">XL100 is at the beginning of its talent graph. As members create Experience Passports, this page will become searchable across ETRM products, commodities, modules, implementations, support history and availability.</p>
          </section>
        )}

        <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map(person => {
            const passport = person.passport || {};
            const productChips = (person.expertise || []).map(x => x.product?.product_name).filter(Boolean);
            const chips = [...productChips, ...(passport.commodities || []), ...(passport.lifecycle_areas || []), ...(passport.delivery_roles || [])].slice(0, 10);
            return (
              <article key={person.id} className="xl-card p-5">
                <div className="flex items-start gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-cyan-300 to-blue-600 font-black text-slate-950">{(person.display_name || "XL").split(/\s+/).slice(0,2).map(x => x[0]).join("").toUpperCase()}</div>
                  <div>
                    <h2 className="font-bold">{person.display_name || "XL100 Member"}</h2>
                    <p className="mt-1 text-sm text-slate-400">{person.title || "ETRM professional"}{person.location ? ` · ${person.location}` : ""}</p>
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-between text-sm">
                  <span className="text-slate-400">ETRM experience</span>
                  <strong>{passport.years_etrm ?? "—"}{passport.years_etrm != null ? " years" : ""}</strong>
                </div>
                {(person.expertise || []).length > 0 && <div className="mt-4 space-y-2">{person.expertise.slice(0,3).map(x => <div key={x.product_id} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[.02] px-3 py-2 text-xs"><span>{x.product?.product_name || "ETRM product"}{x.hands_on ? " · hands-on" : ""}</span><span className="text-cyan-300">{x.proficiency || ""}{x.years_experience != null ? ` · ${x.years_experience}y` : ""}</span></div>)}</div>}
                <p className="mt-4 text-sm leading-6 text-slate-400">{passport.summary || person.bio || "Experience Passport in progress."}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {chips.map((chip, index) => <span key={`${chip}-${index}`} className="rounded-full border border-white/10 bg-white/[.025] px-2.5 py-1 text-xs text-slate-300">{chip}</span>)}
                </div>
                <div className="mt-5 border-t border-white/10 pt-4 text-xs text-cyan-300">{String(person.availability_status || "not_specified").replaceAll("_", " ")}</div>
              </article>
            );
          })}
        </section>
      </main>
    </AppShell>
  );
}
