# Fund.me - Donation Management Platform

A full-stack web application built with Next.js that connects donors with NGOs, enabling transparent donation management with admin oversight.

## Features

### For Donors
- Browse verified NGO donation requests
- Submit donations with tracking
- View complete donation history
- Track donation status (Pending → Received → Verified)

### For NGOs
- Create and manage donation requests
- View incoming donations
- Update donation statuses
- Requires admin verification to post requests

### For Admins
- Verify/unverify NGO accounts
- View all donations and requests
- Access platform statistics and reports
- Full oversight of platform activity

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JWT with httpOnly cookies (jose + bcrypt)
- **Validation:** Zod
- **Styling:** Tailwind CSS
- **Package Manager:** pnpm

## Prerequisites

- Node.js 18+ 
- PostgreSQL database
- pnpm

## Getting Started

### 1. Clone and Install

```bash
git clone <repository-url>
cd se-project
pnpm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/donation_management?schema=public"

# JWT Secret (use a strong random string in production)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
```

### 3. Database Setup

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed the database with sample data
npx prisma db seed
```

### 4. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Demo Credentials

After running the seed script, you can login with:

- **Admin:** admin@example.com / admin123
- **Donor:** donor@example.com / donor123
- **NGO (verified):** hope@ngo.com / ngo123
- **NGO (unverified):** green@ngo.com / ngo123

## Project Structure

```
app/
  ├── api/                  # API routes
  │   ├── auth/            # Authentication endpoints
  │   ├── requests/        # Request management
  │   ├── donations/       # Donation management
  │   └── admin/           # Admin endpoints
  ├── auth/                # Auth pages (login/register)
  ├── dashboard/           # Role-aware dashboard
  ├── donor/              # Donor pages
  ├── ngo/                # NGO pages
  └── admin/              # Admin pages
components/
  ├── ui/                 # Reusable UI components
  └── layout/             # Layout components
lib/
  ├── prisma.ts           # Prisma client
  ├── auth.ts             # JWT auth functions
  ├── cookies.ts          # Cookie management
  ├── zod.ts              # Validation schemas
  └── rbac.ts             # Role-based access control
prisma/
  ├── schema.prisma       # Database schema
  └── seed.ts             # Seed data
middleware.ts             # Route protection
```

## Development Commands

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint

# Prisma commands
npx prisma studio              # Open Prisma Studio
npx prisma migrate dev         # Create and apply migration
npx prisma db seed            # Seed database
npx prisma generate           # Generate Prisma Client
```

## Testing the Application

### Test Flow 1: Donor Journey
1. Register as a Donor
2. Browse open requests at `/donor/requests`
3. Click "Donate" on a request
4. Fill donation form and submit
5. View donation in history at `/donor/donations`

### Test Flow 2: NGO Journey
1. Register as an NGO (verified=false by default)
2. Login as Admin (admin@example.com)
3. Go to `/admin/ngos` and verify the NGO
4. Login as the NGO
5. Create a request at `/ngo/requests`
6. View incoming donations at `/ngo/donations`
7. Update donation status (Received → Verified)

### Test Flow 3: Admin Journey
1. Login as Admin
2. View all NGOs at `/admin/ngos`
3. Verify/unverify NGOs
4. View statistics at `/admin/reports`

## Security Features

- JWT tokens with httpOnly cookies (access: 15m, refresh: 7d)
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Input validation with Zod
- Protected routes via middleware
- Secure cookies (httpOnly, Secure in production, SameSite=Lax)

## License

MIT
