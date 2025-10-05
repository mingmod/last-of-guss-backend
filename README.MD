# The Last of Guss

## Database Migrations

This document explains how to run database migrations and test the database connection for **The Last of Guss** backend project.

---

## Prerequisites

- Node.js >= 18
- PostgreSQL running (make sure the database exists)
- `npm install` executed in the project root
- `.env` file with the following variables:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=123
DATABASE_NAME=the_last_of_guss

JWT_SECRET=replace_this_secret
PORT=3000

ROUND_DURATION_MIN=1
COOLDOWN_DURATION_SEC=30
```

## Running migrations

```bash
# Create database
npx sequelize-cli db:create

# Run all migrations
npx sequelize-cli db:migrate

# Undo last migration (if needed)
npx sequelize-cli db:migrate:undo

# Undo all migrations
npx sequelize-cli db:migrate:undo:all
```

---

## Test DB connection

```bash
npm run test:db
```

---

## Run app in dev mode

```bash
npm run dev
```

---
