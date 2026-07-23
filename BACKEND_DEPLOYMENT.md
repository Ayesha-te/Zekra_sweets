# Backend and Admin Deployment

## Where the backend is

The Node.js backend is in:

```text
../sweets-backend/server.js
```

In production, live admin-managed data should be stored in MongoDB:

```text
MONGODB_URI=your Mongo connection string
MONGODB_DB=sweets
```

When MongoDB is configured, products, orders, delivery locations, admin users, and admin-uploaded images are stored in MongoDB/GridFS.

Without MongoDB, the backend falls back to runtime files outside the Git checkout:

```text
../zekra-runtime/data/products.json
../zekra-runtime/data/orders.json
../zekra-runtime/data/delivery-locations.json
../zekra-runtime/uploads/
```

The admin panel has been split into its own React app at:

```text
../zekra-admin-panel
```

## Local run

```bash
cd ../sweets-backend
npm install
npm start
```

Then open:

```text
http://localhost:4000
```

Run the admin app separately:

```bash
cd ../zekra-admin-panel
npm install
cp .env.example .env
npm run dev
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
MONGODB_URI=your-mongodb-connection-string
MONGODB_DB=sweets
RUNTIME_DIR=../zekra-runtime
CORS_ORIGIN=https://your-domain.com
VITE_API_URL=
```

For same-domain deployment, keep `VITE_API_URL` empty so the frontend calls `/api/...` on the same server.

## Production commands

```bash
cd ../sweets-backend
npm ci
npm start
```

For PM2:

```bash
pm2 start ../sweets-backend/server.js --name zekra-sweets
pm2 save
```

Keep MongoDB backed up. If MongoDB is not configured, keep `../zekra-runtime/data/` and `../zekra-runtime/uploads/` backed up. Admin changes should not be committed to or deployed from Git.
