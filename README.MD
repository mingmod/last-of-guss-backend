# The Last of Guss - Backend

## Project Description

"The Last of Guss" is a browser-based competitive game where players tap a virtual goose infected with the G-42 mutation. The goal is to tap as many times as possible during an active round to accumulate points. Every 11th tap grants bonus points. Special user roles affect gameplay:

- **Survivor**: Regular player who can tap and accumulate points.
- **Nikita**: Taps do not count toward the score, though requests are processed normally.
- **Admin**: Can create rounds and manage the game.

### Gameplay Rules

- Each round has a configurable **start time**, **end time**, and **cooldown period**.
- Players can tap only during an **active round** (between start and end times).
- Score calculation:
  - 1 tap = 1 point
  - Every 11th tap = 10 points
- Total round points are aggregated from all players except Nikita.

### Backend Stack

- **Node.js** + **TypeScript** (strict mode enabled)
- **NestJS** for API framework
- **PostgreSQL** as database
- **Sequelize ORM** for data models and migrations
- Environment variables configured via `.env` file:
  - `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`, `DATABASE_NAME`
  - `JWT_SECRET`, `PORT`
  - `ROUND_DURATION_MIN` (default round length)
  - `COOLDOWN_DURATION_SEC` (time before round starts)

### Features

- Create rounds (admin only)
- Tap action for users
- Get round info including all player stats
- Secure role-based access control
- Transaction-safe tap updates to prevent race conditions
- REST API with clear endpoints for frontend integration

### Development

- Supports multiple backend instances with a single database
- Designed for horizontal scaling
- Docker-friendly, although Docker setup is optional

### Testing

- `.env.test` for test environment
- E2E tests with Supertest for tap and round operations

---

This project forms the backend for a real-time competitive tap game, with a clean REST API and robust transaction handling.

---

## API Endpoints

| Method | Path              | Description                                  | Roles    |
| ------ | ----------------- | -------------------------------------------- | -------- |
| POST   | `/auth/login`     | Log in or register a user                    | All      |
| GET    | `/rounds`         | Get list of all rounds                       | All      |
| POST   | `/rounds`         | Create a new round                           | Admin    |
| GET    | `/rounds/:id`     | Get round details including all player stats | All      |
| POST   | `/rounds/:id/tap` | Tap the goose and update points              | Survivor |

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

### Environment Variables

- `DATABASE_HOST` - database host
- `DATABASE_PORT` - database port
- `DATABASE_USERNAME` - database user
- `DATABASE_PASSWORD` - database password
- `DATABASE_NAME` - database name
- `JWT_SECRET` - secret key for authentication
- `PORT` - backend server port
- `ROUND_DURATION_MIN` - duration of a round in minutes
- `COOLDOWN_DURATION_SEC` - cooldown before round starts, in seconds

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

## Run tests

```bash
npm run test:e2e
```
