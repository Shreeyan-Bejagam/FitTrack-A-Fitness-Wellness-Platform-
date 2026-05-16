# FitTrack API

Node.js + Express + MongoDB backend for the FitTrack app. REST API under `/api/v1`.

## Environment variables

Copy `.env.example` to `.env` and set:

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default `5000`) |
| `MONGO_URI` | MongoDB connection string (e.g. Atlas) |
| `JWT_SECRET` | Access token signing secret (≥32 chars) |
| `JWT_REFRESH_SECRET` | Refresh token secret (≥32 chars, different from above) |
| `JWT_EXPIRES_IN` | Access TTL (e.g. `15m`) |
| `JWT_REFRESH_EXPIRES_IN` | Refresh TTL (e.g. `7d`) |
| `CLOUDINARY_*` | Cloudinary cloud name, API key, API secret |
| `CLIENT_URL` | Frontend origin for CORS (e.g. `http://localhost:5173`) |
| `NODE_ENV` | `development` or `production` |

## Run locally

```bash
cd server
npm install
cp .env.example .env   # then edit values
npm run dev
```

Health check: `GET http://localhost:5000/api/v1/health`

## Authentication (cookie + Bearer)

1. `POST /api/v1/auth/signup` or `/auth/login` — returns JSON `{ user, accessToken }` and sets `httpOnly` `refreshToken` cookie (`SameSite=Strict`, `Secure` in production).

2. Send `Authorization: Bearer <accessToken>` on protected routes.

3. When the access token expires, the client calls `POST /api/v1/auth/refresh-token` (cookie sent automatically) to obtain a new access token; refresh token is rotated server-side.

4. `POST /api/v1/auth/logout` — invalidates the current refresh token (requires valid access token).

Flow diagram (text):

```
Signup/Login → accessToken (JSON) + refreshToken (httpOnly cookie)
Each request → Authorization: Bearer <accessToken>
401 from API → POST /refresh-token with cookie → new accessToken
Logout → POST /logout → cookie cleared + refresh token removed from DB
```

## Deploy

- **Process:** `web: node src/server.js` (see `Procfile`).
- **Node:** `>=18` (see `engines` in `package.json`).
- Use MongoDB Atlas and Cloudinary; set env vars on Railway/Render/etc.
- Set frontend `VITE_API_URL` to this API’s public URL.
