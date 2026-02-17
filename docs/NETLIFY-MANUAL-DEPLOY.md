# Netlify Manual Deploy (Production)

Use this when direct Netlify API access is not provided.

## 1) Configure environment variables in Netlify

Set these in Site Settings -> Environment Variables:

- `VITE_SUPABASE_URL=https://pxacpumgnxndwbkxkbao.supabase.co`
- `VITE_SUPABASE_ANON_KEY=<your publishable key>`
- `VITE_USE_REMOTE_STORAGE=true`
- `VITE_USE_MOCK_AI=false`
- `VITE_REQUIRE_ADMIN_AUTH=true`
- `VITE_API_BASE_URL=https://pxacpumgnxndwbkxkbao.supabase.co/functions/v1`

## 2) Build settings

Either import `netlify.toml` or set manually:

- Build command: `npm run build`
- Publish directory: `dist`
- Node version: `20`

## 3) SPA routing

`netlify.toml` already includes SPA rewrite:

- `/* -> /index.html (200)`

This ensures routes like `/admin` and `/admin/login` resolve.

## 4) Deploy

From Netlify UI:

1. Connect repo and branch.
2. Confirm environment variables above.
3. Trigger deploy.

## 5) Post-deploy smoke

- Open `/` and verify public sections render.
- Open `/admin` and confirm redirect to `/admin/login`.
- Login via magic link and confirm admin save works.
- Run JD analyzer and chat and verify direct non-fit behavior is preserved.

