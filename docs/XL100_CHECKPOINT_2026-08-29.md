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
