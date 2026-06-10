# MyApp Backend

Production-structured MVP backend for authentication using NestJS, Prisma, JWT, bcrypt, Swagger, and Supabase PostgreSQL.

## Structure

```text
myapp/
  backend/   NestJS API server
  db/        Supabase PostgreSQL schema and setup notes
```

## Setup

```bash
cd myapp/backend
npm install
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?schema=public"
JWT_SECRET="replace-with-a-long-random-secret-at-least-32-chars"
JWT_EXPIRY="1h"
PORT=3000
CORS_ORIGIN="http://localhost:3000,http://localhost:5173"
DB_QUERY_LOGS="true"
```

## Database

For Supabase, run `myapp/db/schema.sql` in the Supabase SQL Editor.

Alternatively, use Prisma migrations:

```bash
cd myapp/backend
npx prisma generate
npx prisma migrate dev --name init
```

## Run

```bash
cd myapp/backend
npm run start:dev
```

Swagger is available at:

```text
http://localhost:3000/api/docs
```

Simple browser auth tester:

```text
http://localhost:3000/auth-test.html
```

Backend request logs and Prisma database logs print in the same terminal where
`npm run start:dev` is running. Set `DB_QUERY_LOGS="false"` in `.env` to hide
raw SQL query logs.

## Endpoints

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `GET /users/me` with `Authorization: Bearer <token>`

## Password Reset Notes

`POST /auth/forgot-password` generates a raw reset token but stores only its SHA-256 hash in PostgreSQL. For MVP development the raw token is returned in the response. In production, send that token by email and remove it from the API response.
