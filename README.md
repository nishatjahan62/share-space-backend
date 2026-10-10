# ShareSpace — Housing & Roommate Management API

ShareSpace is a RESTful backend API for a room rental and roommate management platform built with Node.js, TypeScript, Express.js, PostgreSQL, and Prisma ORM.
The API provides a structured system for tenants to discover rental rooms, submit rental applications, request property viewings, manage tenancies, make rent payments, split utility bills, and submit maintenance requests.


- **Live API:** `https://share-space-backend.onrender.com/`
- **API Docs:** `https://documenter.getpostman.com/view/52459423/2sBYHQ2P4P`
- **Demo Video:** `<video link>`
- **Repo:** https://github.com/nishatjahan62/share-space-backend

## Features

- Email/password and Google (GCP) login, JWT access and refresh tokens
- Three roles (Admin, Owner, Tenant) with role middleware and ownership checks
- Properties and rooms: CRUD, soft delete, pagination, filtering, sorting, search
- Roommate preference profiles and match scoring
- Viewing requests, applications, and transaction-safe approval
- Real Stripe payments with signature-verified webhooks
- Utility bills split automatically among active tenants
- Maintenance requests, admin dashboard, audit logs
- Helmet, CORS, rate limiting, bcrypt, Zod validation on all inputs

## Tech Stack

Node.js 22, TypeScript (ESM), Express, PostgreSQL (Neon), Prisma 7 (`adapter-pg`), Zod, JWT, Stripe, Render

## Architecture

`Route → Middleware (auth / role / validation) → Controller → Service → Prisma`

Each feature is a module (`routes`, `controller`, `service`, `validation`). Shared helpers: `ApiResponse`, `ApiError`, `catchAsync`, `getParam`, `getPagination`, `logAction`.

## Roles

| Role | Access |
|---|---|
| Admin | Users, owner verification, dashboard stats, audit logs |
| Owner | Own properties and rooms, viewings, application decisions, bills, maintenance status |
| Tenant | Search, roommate profile, viewings, applications, rent and bill payments, maintenance requests |

## API (`/api/v1`)

Protected routes need `Authorization: Bearer <token>`.

| Area | Endpoints |
|---|---|
| Auth | `POST /auth/register`, `/auth/login`, `/auth/google`, `/auth/refresh-token`, `/auth/logout` |
| Properties | `GET /properties` (page, limit, city, minRent, maxRent, sortBy), `GET /properties/search?q=`, `GET /properties/:id`, `POST /properties`, `PATCH /properties/:id`, `DELETE /properties/:id` |
| Rooms | `POST /properties/:propertyId/rooms`, `GET /rooms/:id`, `PATCH /rooms/:id`, `PATCH /rooms/:id/availability` |
| Roommates | `POST` and `GET /users/me/roommate-profile`, `GET /matches/roommates` |
| Viewings | `POST /viewing-requests`, `PATCH /viewing-requests/:id/status` |
| Applications | `POST /applications`, `GET /applications/my`, `PATCH /applications/:id/approve`, `PATCH /applications/:id/reject` |
| Payments | `POST /payments/initiate`, `POST /payments/webhook`, `GET /payments/:id` |
| Bills | `POST /rooms/:roomId/utility-bills`, `GET /utility-bills/:id/splits`, `PATCH /bill-splits/:id/pay` |
| Maintenance | `POST /maintenance-requests`, `GET /maintenance-requests/my`, `PATCH /maintenance-requests/:id/status` |
| Admin | `GET /admin/users`, `PATCH /admin/users/:id/verify`, `GET /admin/dashboard-stats`, `GET /admin/audit-logs` |

**Response format**
```json
{ "success": true, "message": "Operation successful", "data": {} }
{ "success": false, "message": "Something went wrong", "errors": [] }
```

## Key Logic

- **Approval transaction:** one Prisma `$transaction` claims a room slot with a conditional update (`currentOccupancy < capacity`), then creates the tenancy and first rent payment. A full room returns `409`, so rooms can't be overbooked.
- **Payments:** Stripe Checkout, then a webhook verifies the signature on the raw body and confirms payment before marking rent `PAID`.
- **Matching score:** +40 budget overlap, +30 same city, +10 per shared lifestyle tag.

## Getting Started

```bash
git clone https://github.com/nishatjahan62/share-space-backend.git
cd share-space-backend
npm install
npx prisma generate
npx prisma migrate deploy
npm run prisma:seed
npm run dev          # http://localhost:5000
``
## Testing Payments

```bash
stripe listen --forward-to localhost:5000/api/v1/payments/webhook
```
Put the printed `whsec_...` in `STRIPE_WEBHOOK_SECRET`, call `POST /payments/initiate`, and pay with test card `4242 4242 4242 4242`.

## Deployment (Render)

- **Build:** `npm install --include=dev && npx prisma generate && npx prisma migrate deploy`
- **Start:** `npm start`
- Set all env vars plus `NODE_VERSION=22` (not `PORT`), and add the Stripe webhook endpoint `/api/v1/payments/webhook`.
- Free tiers sleep when idle, so call `/health` first to wake the API and database.

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | `admin@sharespace.com` | `ShareSpace@Demo2026` |
| Owner | `owner@sharespace.com` | `password123` |
| Tenant | `tenant1@sharespace.com` | `password123` |

---
**Author:** Nishat Jahan