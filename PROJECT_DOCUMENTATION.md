# Himeshi & Madhawa Wedding Invitation

This project is a responsive digital wedding invitation with a cinematic envelope opening, a personalised guest invitation, an RSVP form, and a private admin dashboard.

## Live links

- Guest site: <https://himeshi-and-madhawa.pages.dev>
- Admin portal: <https://himeshi-and-madhawa.pages.dev/admin>
- Personal guest link: `https://himeshi-and-madhawa.pages.dev/?invite=<guest-token>`
- Supabase project dashboard: <https://supabase.com/dashboard/project/nsjxkcgqhobxxnzfvspy>

Preview deployments use a URL like `https://<deployment-id>.himeshi-and-madhawa.pages.dev`. The production site is the main `himeshi-and-madhawa.pages.dev` address.

## What the site does

1. A guest opens a personal link containing an invitation token.
2. The site reads the matching guest from Supabase and shows the guest's title, name, partner/family wording, and custom greeting on the letter.
3. The guest opens the animated envelope and enters the wedding home page.
4. The home page contains the cinematic journey, story, day schedule, venue details, and RSVP sections.
5. An RSVP is saved to Supabase and can be viewed from the admin dashboard.

The venue currently shown in the site is **The Cinnamon Room at Jetwing Lighthouse, Dadella, Galle 80000**. The wedding date is **15 January 2027**.

## Technology and dependencies

- React 19 and React DOM: user interface.
- TypeScript: type-safe application code.
- Vite: local development server and production build.
- React Router: guest route and `/admin` route.
- Supabase JS: authentication, guest records, and RSVP data.
- GSAP and `@gsap/react`: envelope, flower, chapter, and transition animation.
- Lenis: smooth scrolling support.
- Lucide React: interface icons.
- Three, React Three Fiber, and Drei: available for the visual layer used by the project.
- Tailwind CSS Vite plugin: styling tooling used by the build setup.
- Oxlint: lint checks.

The exact versions are recorded in [package.json](./package.json) and [package-lock.json](./package-lock.json).

## Important project folders

| Location | Purpose |
| --- | --- |
| `src/App.tsx` | Chooses the opening experience or the invitation home page. |
| `src/components/opening/` | Envelope opening, personalised letter, wind, birds, and opening audio flow. |
| `src/components/invitation/` | Guest-facing home page, sections, RSVP, and shared motion. |
| `src/components/invitation/cinematic/` | The five cinematic journey chapters and flower artwork. |
| `src/admin/` | Admin login and guest/RSVP dashboard. |
| `src/lib/supabase.ts` | Supabase client, data types, and guest greeting formatting. |
| `src/contexts/InvitationContext.tsx` | Reads the `invite` token and loads the guest record. |
| `src/data/wedding.ts` | Couple names, date, monogram, venue, and map link. |
| `src/useWeddingAudio.ts` | Opening ocean ambience and invitation music. |
| `public/assets/` | Images, fonts, and audio files served by the site. |
| `supabase/migrations/001_initial.sql` | Database tables, grants, RLS policies, and admin stats view. |

## Local setup

Requirements: Node.js and npm.

```sh
npm ci
npm run dev
```

Vite prints the local address, normally `http://localhost:5173`.

Useful commands:

```sh
npm run build    # TypeScript check and production build
npm run lint     # Oxlint checks
npm run preview  # Serve the built dist/ folder locally
```

## Environment variables

Create a local `.env.local` file. It is ignored by Git.

```env
VITE_SUPABASE_URL=https://nsjxkcgqhobxxnzfvspy.supabase.co
VITE_SUPABASE_ANON_KEY=<Supabase anon/publishable key>
```

The same two variables must be added to the Cloudflare Pages project under **Settings → Environment variables** for the Production environment and any Preview environment that should use Supabase.

Never put a Supabase `service_role` key in the browser or in this repository. Only the public anon/publishable key belongs in `VITE_SUPABASE_ANON_KEY`.

## Supabase setup

The Supabase project reference is `nsjxkcgqhobxxnzfvspy` and the project API URL is:

`https://nsjxkcgqhobxxnzfvspy.supabase.co`

Run [001_initial.sql](./supabase/migrations/001_initial.sql) once in **Supabase Dashboard → SQL Editor → New query**. It creates:

- `guests`: names, titles, invitation type, partner name, maximum guests, contact, greeting, token, and active state.
- `rsvp`: accepted/declined status, confirmed guest count, message, and response time.
- `guest_stats`: admin dashboard summary counts.

The migration also enables Row Level Security (RLS):

- Anonymous guests can read active guest data needed by a personal token link.
- Anonymous guests can create or update their RSVP.
- Authenticated admin users can manage guests and RSVP records.

### Admin account

Create the administrator in **Supabase Dashboard → Authentication → Users → Add user** with email and password. Then sign in at `/admin`. The admin app uses Supabase email/password authentication; there is no hard-coded admin password in the frontend.

### Creating a guest link

1. Sign in at the admin portal.
2. Create a guest with the title, name, invitation type, partner/family details, maximum guests, contact, and optional greeting.
3. Copy the generated personal link.
4. Share that link privately with the guest.

The link token is personal. Deactivate a guest from the dashboard to stop that invitation from loading.

## Cloudflare Pages deployment

The repository is connected to Cloudflare Pages from GitHub (`Anuradha-dol/business-1`). The production branch is `main`.

Recommended Pages settings:

- Framework preset: Vite (or none with the same commands).
- Build command: `npm run build`.
- Output directory: `dist`.
- Root directory: repository root.
- Environment variables: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

Every successful production deployment updates:

<https://himeshi-and-madhawa.pages.dev>

Pull requests and non-production branches receive preview URLs. A failed Pages build usually means the dependency lock file and `package.json` are out of sync, or a required environment variable is missing.

## Common problems

### `npm ci` says the lock file is out of sync

Run this locally after confirming the intended dependencies:

```sh
npm install
npm run build
```

Commit the resulting `package-lock.json` together with the matching `package.json`, then deploy again.

### `Could not find the table public.guests in the schema cache`

The migration has not been run in the connected Supabase project, or the schema has not refreshed yet. Run [001_initial.sql](./supabase/migrations/001_initial.sql) in the correct project and wait briefly before retrying.

### `permission denied for table guests` or `permission denied for table rsvp`

The table grants or RLS policies are missing. Re-run the grants and policies in [001_initial.sql](./supabase/migrations/001_initial.sql) using the Supabase SQL Editor. Confirm that the frontend is using the anon key and the admin is signed in with Supabase Auth.

### `Invalid login credentials` in `/admin`

The email/password must belong to a Supabase Auth user in this project. Check **Authentication → Users**, reset the password if needed, and confirm the browser is using the expected `VITE_SUPABASE_URL`.

### A personal invitation does not show the name

Check that the URL contains the correct `?invite=<token>`, the guest is active, and the guest exists in the same Supabase project used by the deployed site.

### Audio is not heard before a tap

The opening ambience is `public/assets/audio/sea-wind.mp3`. Browsers can block audible autoplay before a user gesture, even when the audio file is valid. The code tries to start it after the opening artwork is ready and retries from the first interaction. Device media volume, silent mode, a muted browser tab, and Bluetooth output should also be checked.

## Updating wedding details

Edit [wedding.ts](./src/data/wedding.ts) for names, date, venue, and map URL. Run `npm run build` after changes. Guest-specific names and greetings are stored in Supabase, so they are edited from the admin dashboard rather than from this file.

## Before handing over the project

- Confirm the production URL and `/admin` login.
- Confirm `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` exist in Cloudflare Pages.
- Confirm the migration has been run in the correct Supabase project.
- Create one test guest and verify the personalised letter and RSVP.
- Check that the RSVP response appears in the admin dashboard.
- Run `npm run build` and `npm run lint`.
- Keep `.env.local`, passwords, and service-role keys private.
