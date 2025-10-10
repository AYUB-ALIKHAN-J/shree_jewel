# ShreeJewel

ShreeJewel is a full-stack e-commerce web application with a React/Vite front-end and a Node.js/Express back-end. It supports user authentication, product catalog, cart & checkout flows, admin product and order management, Cloudinary image uploads, and payment integrations (Razorpay, PayPal).

This README gives an overview of the project, how to run it locally, environment variables, testing guidance, deployment notes, and recommended next steps.

## Repository layout

- `client/` — React (Vite) single page application
  - `src/` — application source (components, pages, store)
  - `package.json`, `vite.config.js` — build tooling
- `server/` — Express API server
  - `models/`, `controllers/`, `routes/`, `helpers/` — server code
  - `server.js` — app entry
  - `package.json`, `Dockerfile`
- `docker-compose.yml` — convenient local deployment for multi-service stack
- `PRODUCTION-DEPLOYMENT-GUIDE.md` — production deployment hints & scripts
# ShreeJewel

ShreeJewel is a full-stack e-commerce application with a React + Vite front-end and a Node.js + Express back-end. It includes product catalog, cart/checkout, user auth, admin product/order management, Cloudinary image uploads, and payment integrations (Razorpay, PayPal).

This README explains the project layout, how to run the app locally (dev and Docker), required environment variables, helpful tips for production, and next steps.

## Repository layout

- `client/` — React (Vite) single-page app
  - `src/` — application source (components, pages, store)
  - `package.json`, `vite.config.js` — client tooling
- `server/` — Express API server
  - `models/`, `controllers/`, `routes/`, `helpers/` — server code
  - `server.js` — server entrypoint
  - `package.json`, `Dockerfile`, `config/` — server tooling & config
- `docker-compose.yml` — optional local multi-container setup
- `ssl/`, `client/fullchain.pem`, `client/privkey.pem` — certificates (check security notes)
- `PRODUCTION-DEPLOYMENT-GUIDE.md`, `deploy-https.sh`, `deploy-enhanced.sh` — deployment helpers

## Quick start — development

Prerequisites
- Node.js 16+ (recommended)
- npm (or yarn)
- MongoDB (local or remote)

1. Install dependencies

PowerShell

```powershell
cd client; npm install
cd ..\server; npm install
```

2. Environment variables

Create `server/.env` and (optionally) `client/.env` before running. See the Environment section below for the most important variables and examples.

3. Run servers (two terminals)

Client (Vite)

```powershell
cd client
npm run dev
```

Server (nodemon)

```powershell
cd server
npm run dev
```

By default Vite serves the client (usually at http://localhost:5173) and the server listens on the port configured in `server/.env` (commonly 3000 or 5000). Configure the client API base URL via the Vite env vars or `client/src/config/index.js`.

## Environment variables (server)

The server validates a minimal set of environment variables on start (see `server/config/validateEnv.js`). Required keys:

- MONGO_URI — MongoDB connection string (must include mongodb in the URL)
- JWT_SECRET — JWT signing secret (must be at least 32 characters)
- CLIENT_ORIGIN — front-end origin allowed for CORS (e.g. http://localhost:5173)

Other common variables used by the project (examples):

- NODE_ENV=development
- PORT=5000
- SESSION_SECRET (min length 32)
- RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET
- PAYPAL client credentials
- CLOUDINARY_URL (for image uploads)

Create `server/.env` and never commit it. For convenience you can add `server/.env.example` with placeholders.

Client env (Vite)

- VITE_API_BASE_URL or VITE_API_URL — API base used by the front-end at build/runtime (example: http://localhost:5000/api)

Security note: This repo currently contains `.pem` files under `ssl/` and `client/`. Do not commit private keys to source control for production; instead use secret stores or mount certificates at deploy time.

## Quick start — Docker (local)

The project contains a `docker-compose.yml` with services for the `server` and `client`. The compose file in this repo sets environment variables directly for convenience; in production you should replace these with secure secrets.

To build and run locally:

```powershell
docker-compose up --build
```

Stop and remove containers:

```powershell
docker-compose down
```

Notes:
- The compose file exposes the client on ports 80/443 and the server on port 5000 (exposed only to the compose network). It currently contains an example `MONGO_URI` using a cloud-hosted MongoDB.
- If you want a local MongoDB, uncomment/add a `mongo` service and point `MONGO_URI` at it.

## Useful scripts

Client (`client/package.json`)
- npm run dev — start Vite dev server
- npm run build — build production static assets
- npm run preview — preview the production build

Server (`server/package.json`)
- npm run dev — start server with nodemon (development)
- npm run start — start the server (production)

Top-level
- docker-compose up --build — build and run services defined in `docker-compose.yml`

## Production & deployment notes

- Read `PRODUCTION-DEPLOYMENT-GUIDE.md` before performing production deploys; it contains additional steps and scripts used by this project.
- Do not ship checked-in private keys or certificates. Use environment secret managers (CI/CD secrets, cloud KMS/vault) for credentials.
- Recommended production flow:
  1. Build client: `cd client && npm run build` (produces static files)
  2. Serve client with a static server or via nginx (project contains nginx configs in `client/`)
  3. Build server as a container and run behind a reverse proxy (nginx) or load balancer
  4. Configure HTTPS and strong TLS, enable HSTS and security headers

## Troubleshooting

- Server exits on startup complaining about missing env vars: ensure `MONGO_URI`, `JWT_SECRET` and `CLIENT_ORIGIN` are set and valid (JWT_SECRET must be >= 32 chars).
- API 401/403: check JWT_SECRET and client origin are correct and that cookies/headers are sent correctly from the client.
- File upload / Cloudinary issues: verify `CLOUDINARY_URL` and that the Cloudinary account has required settings.

## Code pointers — where to look

- Frontend entry: `client/src/main.jsx` and `client/src/App.jsx`
- Frontend state & API: `client/src/store`, `client/src/config/index.js`, `client/src/lib/utils.js`
- Backend entry: `server/server.js`
- Backend structure: `server/routes/`, `server/controllers/`, `server/models/`, `server/helpers/`
- Env validation: `server/config/validateEnv.js`

## Security checklist

- Rotate and remove any checked-in secrets (private keys, `.pem` files) before production
- Use HTTPS (nginx or cloud load balancer)
- Use strong secrets (JWT_SECRET, SESSION_SECRET) with sufficient length
- Sanitize inputs, enable rate-limiting, CORS and security middleware (helmet, xss-clean etc.) — many are already present in `server/package.json`

## Tests

There are no automated tests in the repo yet. Recommended first steps:
- Add `server/.env.example` and a small test suite using Jest + Supertest for core API routes
- Add a smoke Cypress/Playwright test for main user flows (search, add-to-cart, checkout)

## Next steps (suggested)

- Add `server/.env.example` and `client/.env.example` files with placeholders for required variables
- Add basic Jest + Supertest tests for server routes and wire them into CI
- Add a Dockerfile for the client static artifact (if you prefer serving via nginx in a container)
- Remove or rotate PEM files and switch to secret-managed certs

## Contributing

1. Fork the repo
2. Create a feature branch
3. Add tests for new behavior
4. Open a PR with a clear description

If you'd like, I can create `server/.env.example` and `client/.env.example` or scaffold a minimal test suite — tell me which and I'll implement it.

---

Last updated: 2025-10-10
