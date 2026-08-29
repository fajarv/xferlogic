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
  const [filters, setFilters] = useState({ q: "", commodity: "", lifecycle: "", availability: "" });

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

      const [{ data: profiles, error: profileError }, { data: passports, error: passportError }] = await Promise.all([
        supabase.from("profiles").select("id,display_name,title,location,bio,availability_status"),
        supabase.from("experience_passports").select("user_id,years_etrm,summary,commodities,lifecycle_areas,delivery_roles,operating_regions"),
      ]);

      if (profileError || passportError) {
        if (active) {
          setMessage(profileError?.message || passportError?.message || "Unable to load talent.");
          setLoading(false);
        }
        return;
      }

      const passportByUser = new Map((passports || []).map(p => [p.user_id, p]));
      const merged = (profiles || []).map(p => ({ ...p, passport: passportByUser.get(p.id) || null }));
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
      const haystack = [
        person.display_name,
        person.title,
        person.location,
        person.bio,
        passport.summary,
        ...(passport.delivery_roles || []),
        ...(passport.operating_regions || []),
      ].filter(Boolean).join(" ").toLowerCase();
      if (q && !haystack.includes(q)) return false;
      if (!includesAny(passport.commodities, filters.commodity)) return false;
      if (!includesAny(passport.lifecycle_areas, filters.lifecycle)) return false;
      if (filters.availability && person.availability_status !== filters.availability) return false;
      return true;
    });
  }, [people, filters]);

  return (
    <AppShell>
      <main className="mx-auto max-w-7xl px-5 py-12">
        <div className="xl-kicker">XL100 Talent Graph</div>
        <div className="mt-3 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <h1 className="text-4xl font-black tracking-[-.045em] md:text-5xl">Find ETRM talent by <span className="text-cyan-300">actual experience.</span></h1>
            <p className="mt-3 max-w-3xl text-slate-400">Search structured Experience Passports rather than job titles alone. This becomes the foundation for jobs, project staffing and the future XL100 Team Builder.</p>
          </div>
          <div className="rounded-xl border border-cyan-300/15 bg-cyan-300/[.04] px-4 py-3 text-sm text-slate-300">{filtered.length} specialist{filtered.length === 1 ? "" : "s"} visible</div>
        </div>

        <section className="xl-card mt-8 grid gap-4 p-5 md:grid-cols-4">
          <label className="md:col-span-2">Name, title, location, role or keyword
            <input value={filters.q} onChange={e => setFilters(f => ({ ...f, q: e.target.value }))} placeholder="e.g. RightAngle settlement lead" />
          </label>
          <label>Commodity
            <input value={filters.commodity} onChange={e => setFilters(f => ({ ...f, commodity: e.target.value }))} placeholder="Crude, Power, Gas..." />
          </label>
          <label>Lifecycle area
            <input value={filters.lifecycle} onChange={e => setFilters(f => ({ ...f, lifecycle: e.target.value }))} placeholder="Risk, Scheduling..." />
          </label>
          <label className="md:col-span-2">Availability
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
            <button onClick={() => setFilters({ q: "", commodity: "", lifecycle: "", availability: "" })} className="w-full rounded-xl border border-white/15 px-4 py-3 font-bold text-slate-200">Clear filters</button>
          </div>
        </section>

        {loading && <div className="mt-8 text-slate-400">Loading XL100 talent…</div>}
        {message && <div className="mt-8 rounded-xl border border-amber-300/20 bg-amber-300/[.04] p-4 text-sm text-slate-300">{message}</div>}

        {!loading && !message && filtered.length === 0 && (
          <section className="xl-card mt-8 p-8 text-center">
            <h2 className="text-2xl font-bold">No matching specialists yet.</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-400">XL100 is at the beginning of its talent graph. As members create Experience Passports, this page will become searchable across ETRM platforms, commodities, modules, implementations, support history and availability.</p>
          </section>
        )}

        <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map(person => {
            const passport = person.passport || {};
            const chips = [...(passport.commodities || []), ...(passport.lifecycle_areas || []), ...(passport.delivery_roles || [])].slice(0, 8);
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
