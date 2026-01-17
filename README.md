# TRMNL4 Admin Panel Instructions

## Setup

```bash
npm install
cp .env.example .env
npm run db:up          # starts MySQL in Docker
npm run db:migrate     # creates tables
npm run db:seed        # adds sample data
npm run dev            # http://localhost:5173
```

Open http://localhost:5173

Requires Node 18+, Docker

If migrations fail, MySQL might still be starting. Wait 5 seconds and then try again


## What it does

Admins can filter applications by program and status, change statuses inline or from detail pages, add notes, and search across all fields. Each application has a shareable URL (`/applications/[id]`).

I added bulk status changes because changing statuses of 7,000+ applications would be annoying to do manually. Bunch of quality of life features added as well (flash notis, copy email, sort, pagination with choice on page size)

## Schema

Three tables: `programs`, `applications`, `notes`. Applications have a foreign key to programs (one-to-many). Notes reference applications with `ON DELETE CASCADE`.

I took the application fields from the real TRMNL4 intake forms.

Notes use a simple `authorName` text field since the spec said no auth. Would add a proper `users` table in production. Ideally with Google OAuth

## Tech choices

Everything lives in the URL (filters, sorting, pagination) and this way you can bookmark a view or share it 
Also makes browser back/forward just works instead of messing with client state 

Filtering and sorting in SQL, not JS (due to volume of applications)

Two different ways to change status so ease of use for admin. All changes produce a flash notification for quality of life

DBs enforce rules, meaning use ENUMs for status/industry/stage mean invalid values get rejected before they hit your code. 
Foreign keys with `ON DELETE CASCADE` so you never end up with orphaned notes or applications pointing to deleted programs

## What I'd add next

Tests
Input validation with zod (even though users are assumed all admins)
Real time updates if multiple admins are reviewing simultaneously
CSV export
Google Login or email login + OTP with actual users table

