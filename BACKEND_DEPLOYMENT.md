# Backend and Admin Deployment

## Where the backend is

The Node.js backend is in:

```text
backend/server.js
backend/data/products.json
backend/uploads/
```

The admin panel is part of the frontend at:

```text
/admin
src/routes/admin.tsx
```

## Local run

```bash
npm install
cp .env.example .env
npm run build
npm start
```

Then open:

```text
http://localhost:4000
http://localhost:4000/admin
```

Default development login:

```text
username: admin
password: admin123
```

Change this before production in `.env`.

## VPS environment

Use these environment variables:

```text
PORT=4000
JWT_SECRET=replace-with-a-long-random-secret
ADMIN_USER=admin
ADMIN_PASSWORD=your-strong-password
CORS_ORIGIN=https://your-domain.com
VITE_API_URL=
```

For same-domain deployment, keep `VITE_API_URL` empty so the frontend calls `/api/...` on the same server.

## Production commands

```bash
npm ci
npm run build
npm start
```

For PM2:

```bash
pm2 start backend/server.js --name zekra-sweets
pm2 save
```

Keep `backend/data/products.json` and `backend/uploads/` backed up. Those are the product database and uploaded product images.
