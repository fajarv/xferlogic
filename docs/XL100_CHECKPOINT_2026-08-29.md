# XL100 Phase 1 Progress Checkpoint

Date: 2026-08-29
Project: XferLogic / XL100
Repository: `fajarv/xferlogic`

## Safe branch structure

- Public production site branch: `site-v8-preview`
- XL100 application branch: `feature/xl100-phase1`
- Draft review PR: #1 — `XL100 Phase 1 Preview — DO NOT MERGE`
- Production website remains separate and must not be replaced by `main` or the XL100 feature branch without explicit approval.

## Live / preview URLs

- Public XferLogic site: `https://www.xferlogic.com`
- XL100 Phase 1 Vercel preview: `https://xferlogic-v8-preview-git-feature-xl100-phase1-fajarv-7996.vercel.app`

## Public website status

- V8 cinematic XferLogic website is live on Vercel.
- Approved glossy / 3D XferLogic logo restored on the public site.
- Google Analytics GA4 measurement ID: `G-LP5KYSRLVV`.
- Google successfully detected the GA4 tag on `www.xferlogic.com`.
- GoDaddy root `A @` changed from old host `107.180.112.233` to Vercel `76.76.21.21`.
- `www` CNAME points to Vercel.
- `admin.xferlogic.com` and `mail.xferlogic.com` remain on the old server for now and should not be changed casually.
- Root-domain DNS / SSL propagation was still settling on mobile at the end of the session.

## XL100 product model

XL100 is the ETRM enterprise + talent network inside XferLogic.

### Individual membership

Open to any ETRM professional regardless of employer size or company XL100 status.

Goal: create the largest structured talent graph for ETRM expertise across vendors, platforms, commodities, lifecycle areas, implementations, support, architecture, integrations, migrations, testing, leadership, and availability.

### Company membership

Companies qualify based on approximate commercial ETRM license count on an honor system, reviewed / approved by XferLogic.

- XL100 Member: 100–299 licenses
- XL100 Gold: 300–499 licenses
- XL100 Elite: 500+ licenses

Exact claimed license count is private; public profile only needs to expose the approved tier.

One company = one roadmap vote per roadmap item. Tier gives prestige / representation capacity, not extra voting power.

## Founder visibility / conflict-of-interest guardrails

The founder expects to remain somewhat behind the scenes because of their current P66 role and career responsibilities. XferLogic / XL100 should therefore be designed so the platform does not depend on the founder being the public face, spokesperson, procurement influencer, or visible commercial intermediary.

Future product, marketing, monetization, outreach, and governance decisions should be actively challenged whenever they could create an actual conflict of interest or even a reasonable appearance of one. Particular caution is required around:

- using employer title, authority, internal relationships, procurement influence, or nonpublic information to benefit XferLogic / XL100;
- soliciting or negotiating paid vendor participation with vendors that may also do business with the founder's employer;
- presenting employer views, priorities, usage, roadmap needs, spend, contracts, vendor performance, internal architecture, trading information, or procurement information as XL100 data;
- accepting compensation, gifts, preferred treatment, advisory benefits, or other personal value from vendors where the founder could influence employer decisions;
- allowing any vendor to infer that sponsorship, advertising, or participation in XL100 improves its standing with the founder's employer;
- using employer time, systems, confidential data, or company-owned materials for XferLogic work;
- positioning XL100 rankings, recommendations, or roadmap results as representing the founder's employer unless formally authorized.

When a proposed activity touches one of these areas, stop and flag the concern before implementation. Employer ethics / outside-business / conflict-of-interest policies and, when appropriate, qualified legal or compliance advice should govern the final decision.

## Community and monetization principles

Individual participation in the LinkedIn-style ETRM professional network is intended to remain free.

Commercial monetization should come from optional, clearly labeled, professional vendor participation rather than charging members for basic networking access. Acceptable models include:

- clearly labeled vendor / sponsor presence;
- vendor product directory pages;
- paid placement for specific ETRM products or offerings, without pay-to-rank treatment;
- subscription spaces where vendors can publish new product capabilities, releases, technical material, roadmap updates, webinars, or other ETRM offerings;
- sponsored content or events that are visibly identified as sponsored.

The platform should not directly sell vendor products or act as a pushy sales channel. Vendor participation must not buy favorable expert opinions, suppress criticism, alter search rankings unfairly, or influence XL100 voting results.

Experts in the network should remain free to provide direct professional feedback on vendor products and published offerings. Moderation should enforce professionalism, evidence, confidentiality, and anti-abuse standards without protecting vendors from legitimate criticism.

XL100 enterprise members retain an independent roadmap-influence role. They should be able to identify and rank the capabilities, operational problems, architecture needs, integrations, controls, workflows, and product improvements most important to them across different ETRM products.

Core roadmap-governance principles remain:

- one qualifying company = one vote per roadmap item;
- membership tier does not buy more votes;
- vendors cannot buy votes, rankings, favorable feedback, or moderation outcomes;
- sponsorship and roadmap influence remain structurally separate;
- no sharing of confidential pricing, contract terms, procurement strategy, competitive trading data, nonpublic positions, or other protected information;
- roadmap discussion focuses on product capabilities, operational experience, architecture, usability, controls, integrations, and future needs.

## Supabase backend

Project name: `XL100`
Project ref: `boopntgkwhaqhyzdbuze`
Region: `us-east-1`
Current project cost: $0/month at creation

### Applied schema

The following secured tables now exist with RLS enabled:

- `profiles`
- `organizations`
- `organization_applications`
- `etrm_products`
- `organization_products`
- `organization_members`
- `experience_passports`
- `experience_products`
- `approval_audit`

Initial ETRM product seed data:

- ION Endur
- ION RightAngle
- Allegro
- Brady CTRM
- Molecule
- Eka

### Security state

- RLS enabled across core tables.
- Anonymous execute access removed from privileged / SECURITY DEFINER helpers.
- Function search paths hardened.
- Remaining Supabase advisor warnings are limited to authenticated SECURITY DEFINER helper/admin functions that still enforce role checks internally; review again before public launch.

## XL100 Phase 1 functionality built

### Authentication

- Supabase email/password sign-up
- Supabase email/password sign-in
- Sign-out
- New users automatically receive a profile row

### Member experience

- XL100 landing page
- Member dashboard
- Experience Passport editor
- Talent Directory

### Experience Passport fields

Basic profile:

- full name
- title
- location
- bio
- availability status

Availability values include:

- not looking
- open to opportunities
- contract only
- full-time
- advisory / fractional
- short SME engagements

Structured ETRM experience:

- total years in ETRM
- operating regions
- commodities
- lifecycle areas
- delivery roles
- experience summary

Critical narrative evidence:

- processes the member can explain end-to-end
- hardest production issue personally diagnosed and how root cause was proven
- personal ownership during a go-live
- integrations personally designed / built / troubleshot

Product-specific expertise:

- ETRM product
- years on product
- proficiency
- hands-on yes/no

### Company application

- organization name
- website
- industry
- headquarters
- regions
- claimed approximate ETRM license count
- commercial ETRM products used
- application rationale
- automatic tier suggestion from license count

### Admin shell

Initial admin review interface exists for company application review and tier approval.

### Talent Directory

Search / filter framework now uses structured profile and Experience Passport data including:

- name / title / location / free-text role keywords
- ETRM platform / product expertise
- commodity
- lifecycle area
- availability

Product expertise search is based on structured `experience_products`, not just profile text.

## Build / deployment fixes completed

The legacy application contained placeholder infrastructure that blocked the XL100 preview. Fixed:

- removed old NextAuth route
- removed old MongoDB connector from the active path
- removed obsolete NextAuth / Mongo / Mongoose / Nodemailer dependencies from `package.json`
- upgraded from blocked Next.js 14.1.0 to patched Next.js 15.5.24 maintenance line
- upgraded React / ReactDOM to React 19
- added explicit `vercel.json` so the XL100 branch builds as Next.js rather than inheriting the original static-project behavior
- latest XL100 feature preview build is GREEN on Vercel

## Current review checkpoint

Draft PR #1 exists and is explicitly marked `DO NOT MERGE`.

Purpose:

- review XL100 Phase 1 safely
- preserve a clear checkpoint
- keep public production isolated

## Immediate next steps

1. Create a test XL100 user in the preview.
2. Promote the test owner account to `platform_admin` in Supabase.
3. Test the full flow end-to-end:
   - sign up
   - sign in
   - create / edit Experience Passport
   - add product-specific expertise
   - search Talent Directory
   - submit XL100 company application
   - approve / reject / request info as platform admin
4. Add individual public profile pages.
5. Add contact / outreach flow between members and hiring organizations.
6. Build Jobs + Projects posting model.
7. Build Team Builder using structured skills / product expertise / availability.
8. Add Connections / follows.
9. Add ETRM Q&A.
10. Add moderator-approved Knowledge Library uploads.
11. Add Vendor Councils and Roadmap Pulse later.
12. Before adding paid vendor features, design a formal sponsor / vendor-partner policy that separates commercial placement from expert feedback, roadmap voting, moderation, and employer relationships.

## Later roadmap

- jobs marketplace
- project / short SME engagements
- recruiter / hiring organization access
- AI-assisted talent matching
- AI-assisted team composition
- connections and messaging
- technical Q&A
- moderated knowledge library
- resource uploads / versioning / approval
- vendor partner accounts
- vendor councils
- roadmap ideas and company voting
- XL100 Roadmap Pulse
- events / sponsors
- future ChelsieAI customer portal integration under XferLogic

## Resume point

Resume from `feature/xl100-phase1` with the latest successful Vercel preview. Do not merge PR #1 or alter production until the preview has been functionally tested and explicitly approved.
