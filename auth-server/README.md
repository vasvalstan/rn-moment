# Better Auth server for Moment

This folder contains a Better Auth server with JWT/JWKS configured for Convex and PostgreSQL persistence for production.

## 1) Configure env

Copy the env template:

```bash
cp auth-server/.env.example auth-server/.env
```

Generate a secret:

```bash
openssl rand -base64 32
```

Set that value in `auth-server/.env` as `BETTER_AUTH_SECRET`.

## 2) Configure database (required for production)

Set `DATABASE_URL` in `auth-server/.env` to your Postgres instance.

Example:

```env
DATABASE_URL=postgres://user:password@host:5432/moment
DATABASE_SSL=true
DATABASE_SSL_REJECT_UNAUTHORIZED=true
```

Then run Better Auth migrations:

```bash
set -a && source auth-server/.env && set +a && npx @better-auth/cli@latest migrate --config auth-server/auth.mjs --yes
```

You can inspect generated SQL with:

```bash
set -a && source auth-server/.env && set +a && npx @better-auth/cli@latest generate --config auth-server/auth.mjs
```

## 3) Run the server

```bash
set -a && source auth-server/.env && set +a && node auth-server/server.mjs
```

Auth endpoints:

- `GET/POST /api/auth/*`
- `GET /api/auth/jwks`
- `GET /health`

Or use:

```bash
npm run auth:dev
```

## 4) App env (Expo)

Set in `.env.local`:

```env
EXPO_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
EXPO_PUBLIC_BETTER_AUTH_AUDIENCE=convex
```

If testing on a physical device, localhost will not work directly. Use a tunnel URL and set it as `EXPO_PUBLIC_BETTER_AUTH_URL`.

## 5) Convex env

Set these in your Convex deployment env:

```bash
npx convex env set BETTER_AUTH_ISSUER_URL http://localhost:3000
npx convex env set BETTER_AUTH_JWKS_URL http://localhost:3000/api/auth/jwks
npx convex env set BETTER_AUTH_AUDIENCE convex
```

For production, use your real auth domain for `BETTER_AUTH_ISSUER_URL` and `BETTER_AUTH_JWKS_URL`.

## Notes

- In production, `DATABASE_URL` is mandatory. The server throws at startup if it is missing.
- In development only, if `DATABASE_URL` is missing, Better Auth falls back to in-memory storage.
- For mobile device testing, use a tunnel/public URL instead of localhost for both app and Convex vars.
