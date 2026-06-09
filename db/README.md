# Supabase PostgreSQL Setup

This folder contains SQL compatible with Supabase PostgreSQL and the matching Prisma schema lives at `../backend/prisma/schema.prisma`.

## Option 1: Use Supabase SQL Editor

1. Open your Supabase project.
2. Go to SQL Editor.
3. Paste and run the contents of `schema.sql`.
4. Copy the project database connection string from Project Settings > Database.
5. Put it in `../backend/.env` as `DATABASE_URL`.

Use the pooled or direct connection string Supabase provides. For Prisma migrations, the direct connection is usually simpler during development.

## Option 2: Use Prisma

From `myapp/backend`:

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
```

The Prisma schema maps to the same `users` and `password_resets` table names used in `schema.sql`.
