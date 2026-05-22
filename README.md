# erre-plate

Hyperlocal neighborhood meal-prep marketplace with a credit economy for chefs and customers. Connects home cooks and neighbors in zip-based communities (demo data: Madison, WI) so labor and meals can circulate locally instead of only through large gig platforms.

> **Mobile web app** — The UI is optimized for phones. For the intended experience, open the app on a mobile browser or use Chrome DevTools device mode (viewport width ≤ 600px). Desktop layouts exist but are secondary.

**Status:** Portfolio / prototype build. There is no live hosted demo at this time; run locally with the steps below.

---

## Quick start (Docker — recommended for reviewers)

**Prerequisites:** [Docker Desktop](https://www.docker.com/products/docker-desktop/)

```bash
git clone <your-repo-url> erre-plate
cd erre-plate

docker compose up -d

docker compose exec backend composer install
docker compose exec backend cp .env.example .env   # skip if .env already exists
docker compose exec backend php artisan key:generate
docker compose exec backend php artisan jwt:secret
docker compose exec backend php artisan migrate --seed
```

| Service   | URL |
|-----------|-----|
| Web app   | http://localhost:5173 |
| API health | http://localhost:8000/api/health |

**Notes:**

- The compose file starts Postgres, Redis, API, and Vite; it does **not** auto-seed — run `migrate --seed` as shown.
- On first run, `composer install` inside the backend container is required because the app directory is volume-mounted over the image.
- Generate `JWT_SECRET` with `php artisan jwt:secret` before logging in.

---

## Quick start (native — Laravel Herd / local PHP)

**Prerequisites:** PHP 8.2+, Composer, Node 22+, PostgreSQL (or Docker for DB only)

```bash
# Database only via Docker
docker compose up postgres redis -d

# Backend
cd backend
cp .env.example .env
# Edit .env: DB_* to match postgres service (see backend/.env.example)
composer install
php artisan key:generate
php artisan jwt:secret
php artisan migrate --seed
php artisan serve   # http://localhost:8000

# Frontend (separate terminal)
cd frontend
cp .env.example .env
npm install
npm run dev         # http://localhost:5173
```

Set `FRONTEND_URL=http://localhost:5173` and `APP_URL=http://localhost:8000` in `backend/.env`.

---

## Demo accounts

After seeding, all demo users share the password **`password`**.

| Role     | Email | Where to go after login |
|----------|-------|-------------------------|
| Customer | `maseru.kuramoto@erreplate.test` | `/customer/browse` |
| Chef     | `moro.takayama@erreplate.test` | `/chef/dashboard` |

More accounts follow `{first}.{last}@erreplate.test` (see seeders in `backend/database/seeders/`).

---

## Viewing the mobile UI

1. **Desktop:** Open http://localhost:5173 → DevTools (F12) → toggle device toolbar → pick a phone preset → refresh.
2. **Physical phone (same Wi‑Fi):** Find your machine’s LAN IP, open `http://<your-ip>:5173`. Docker compose already runs Vite with `--host`.
3. **Register / login** at `/login` or `/register`.

---

## What to try (2-minute tour)

**As a customer**

1. Log in as `maseru.kuramoto@erreplate.test` / `password`.
2. Go to **Browse** — chefs filtered by neighborhood.
3. Open a chef’s public profile (`/chef/:slug`).
4. Start an order from a published weekly menu (`/customer/order/:slug`).

**As a chef**

1. Log out, log in as `moro.takayama@erreplate.test` / `password`.
2. Open **Dashboard** — weekly menus.
3. Edit a menu, assign dishes, publish when ready.
4. Check **Orders** (tickets) for incoming customer orders.

---

## Tech stack

| Layer | Stack |
|-------|--------|
| Frontend | React 19, Vite 7, MUI 7, Tailwind 4, TanStack Query, React Router 7 |
| Backend | Laravel 12, JWT (`tymon/jwt-auth`), Laravel Socialite, Cloudinary (optional) |
| Database | PostgreSQL 15 |
| Cache / queue | Redis (configured; demo runs without extra setup) |

### Repository layout

```
erre-plate/
├── frontend/     # Primary client — mobile-first web app
├── backend/      # REST API under /api
├── mobile/       # Expo prototype (not required for demo)
└── docker-compose.yml
```

### API overview

- Base path: `/api`
- Auth: JWT (access token in memory on the client; refresh via cookie flow)
- Roles: `customer`, `chef`, `admin` (admin UI is a stub)

Main domains: `User`, `ChefProfile`, `WeeklyMenu`, `Dish`, `Order`, `Neighborhood`, `Transaction` (credit ledger).

---

## Environment variables

Copy from `.env.example` files — do not commit real secrets.

### Backend (`backend/.env`)

| Variable | Required for demo? | Purpose |
|----------|-------------------|---------|
| `DB_*` | Yes | PostgreSQL connection |
| `APP_KEY` | Yes | `php artisan key:generate` |
| `JWT_SECRET` | Yes | `php artisan jwt:secret` |
| `FRONTEND_URL` | Yes | OAuth redirects; should match Vite URL |
| `APP_URL` | Yes | API base URL (e.g. `http://localhost:8000`) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | No | Google sign-in only |
| `CLOUDINARY_*` | No | Profile photo uploads |

### Frontend (`frontend/.env`)

| Variable | Required for demo? | Purpose |
|----------|-------------------|---------|
| `VITE_API_URL` | Yes | e.g. `http://localhost:8000/api` |
| `VITE_FRONTEND_URL` | Recommended | App origin for redirects |
| `VITE_GOOGLE_MAPS_KEY` | No | Maps on browse/profile |

If `frontend/.env` was committed in an older clone, prefer `cp .env.example .env` and add your own keys locally.

---

## Vision vs what’s built

**Product vision**

- Keep meal-prep commerce **hyperlocal** and relationship-driven.
- **Meal credits** let chefs earn labor credits they can spend in the network (reciprocal economy vs pure cash extraction).
- Build **interdependence** between neighbors, not anonymous one-off gigs.

**Implemented in this repo**

- JWT auth, registration, optional Google OAuth, role-based routes
- Zip/neighborhood model (Madison demo neighborhoods)
- Chef profiles, public slugs, weekly menus, dish library, publish/archive
- Customer browse, order builder, order history
- Credit balances on chef profiles; `transactions` table for ledger
- Mobile-first layouts (bottom nav, drawer) below ~600px width

**Not implemented (out of scope for this prototype)**

- Production hosting / payments
- Cottage-food compliance, insurance, certifications
- Full trust & safety (ratings enforcement, liability)
- Admin tooling beyond a placeholder route

---

## Resume bullet (copy-paste)

> Built **erre-plate**, a full-stack hyperlocal meal-prep marketplace (React 19, Laravel 12, PostgreSQL) with JWT auth, role-based chef/customer flows, neighborhood discovery, weekly menu publishing, and order management; mobile-first responsive UI with seed data for local demo.

---

## Development

```bash
# Backend tests
cd backend && php artisan test
```

Do not use `composer run dev` from `backend/` as the primary workflow — it expects npm in the backend folder. Use Docker compose or separate `php artisan serve` + `npm run dev` in `frontend/`.

---

## License

Private / portfolio project — add a license if you open-source it.
