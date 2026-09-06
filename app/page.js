import Link from 'next/link';
import AppShell from '../components/AppShell';

const tiers = [
  ['XL100 Member','100–299 ETRM licenses','Enterprise member'],
  ['XL100 Gold','300–499 ETRM licenses','Gold member'],
  ['XL100 Elite','500+ ETRM licenses','Elite member'],
];

export default function Home() {
  return (
    <AppShell>
      <main>
        <section className="mx-auto grid min-h-[72vh] max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-[1.15fr_.85fr]">
          <div>
            <div className="xl-kicker">The ETRM enterprise & talent network</div>
            <h1 className="mt-5 max-w-4xl text-5xl font-black tracking-[-.055em] md:text-7xl">Find the people who have <span className="text-cyan-300">actually done the work.</span></h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">XL100 connects ETRM professionals, enterprise trading organizations, vendors, jobs, projects, implementation teams, technical knowledge and product-roadmap influence in one specialist network.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/login" className="rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950">Create your profile</Link>
              <Link href="/company/apply" className="rounded-xl border border-white/15 px-5 py-3 font-bold">Apply for XL100 company status</Link>
            </div>
          </div>
          <div className="xl-card p-6">
            <div className="xl-kicker">How membership works</div>
            <h2 className="mt-3 text-2xl font-bold">People are open. Enterprise status is curated.</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">Any ETRM professional can register and build an Experience Passport. Companies with 100+ commercial ETRM licenses can apply for XL100 recognition on an honor system, reviewed by XferLogic.</p>
            <div className="mt-6 space-y-3">
              {tiers.map(([name,range,detail]) => <div key={name} className="rounded-xl border border-white/10 bg-white/[.025] p-4"><div className="flex items-center justify-between gap-4"><strong>{name}</strong><span className="text-xs text-cyan-300">{detail}</span></div><div className="mt-1 text-sm text-slate-400">{range}</div></div>)}
            </div>
          </div>
        </section>
        <section className="border-y border-white/10 bg-white/[.015]">
          <div className="mx-auto grid max-w-7xl gap-4 px-5 py-12 md:grid-cols-4">
            {[['Experience Passports','Structured evidence of hands-on ETRM experience.'],['Talent Search','Find specialists by platform, commodity, lifecycle and delivery history.'],['Jobs + Teams','Reach talent and assemble implementation or support teams.'],['Roadmap Influence','Aggregate enterprise priorities across major ETRM vendors.']].map(([h,p]) => <div key={h} className="p-4"><h3 className="font-bold">{h}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{p}</p></div>)}
          </div>
        </section>
      </main>
    </AppShell>
  );
}
