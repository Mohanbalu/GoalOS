# GoalsOS - Production Deployment Guide

Follow these steps to deploy GoalsOS to a production environment using Vercel and Supabase.

## 1. Database Setup (Supabase)
1. Create a new project on [Supabase](https://supabase.com/).
2. Navigate to **Project Settings > Database**.
3. Copy the **Connection String** (URI) and use it for `DATABASE_URL`.
   - *Note: For Prisma, use the Transaction mode connection string (Port 6543) and append `?pgbouncer=true` if using pooling.*
4. Copy the **Direct Connection String** for `DIRECT_URL`.

## 2. Authentication Setup (Auth.js)
1. Generate a secure secret:
   ```bash
   openssl rand -base64 32
   ```
2. Use this for `NEXTAUTH_SECRET`.
3. Set `NEXTAUTH_URL` to your production domain (e.g., `https://goalsos.vercel.app`).

## 3. Environment Variables
Configure the following in your deployment platform (Vercel):

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | Supabase Connection String |
| `DIRECT_URL` | Supabase Direct Connection String |
| `NEXTAUTH_SECRET` | Auth.js Secret |
| `NEXTAUTH_URL` | Production URL |

## 4. Deployment Steps (Vercel)
1. Push your code to a GitHub repository.
2. Import the project into Vercel.
3. Configure the **Build Command**: `npx prisma generate && next build`
4. Configure the **Install Command**: `npm install`
5. Add the Environment Variables.
6. Deploy.

## 5. Post-Deployment
1. Run migrations on the production database:
   ```bash
   npx prisma db push
   ```
2. (Optional) Seed demo data:
   ```bash
   npx prisma db seed
   ```

## Production Checklist
- [ ] Verify RBAC middleware is active.
- [ ] Ensure all API routes are protected.
- [ ] Verify toast notifications work in production.
- [ ] Check responsive views on mobile devices.
- [ ] Audit logging is capturing all production actions.
