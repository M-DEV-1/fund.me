# Quick Setup Guide

## Step 1: Install Dependencies
```bash
pnpm install
```

## Step 2: Setup Database

1. Make sure PostgreSQL is running
2. Copy `.env.local.example` to `.env.local`
3. Update `DATABASE_URL` with your PostgreSQL credentials

```bash
cp .env.local.example .env.local
# Edit .env.local with your database credentials
```

## Step 3: Initialize Database

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations to create tables
npx prisma migrate dev --name init

# Seed database with sample data
npx prisma db seed
```

## Step 4: Run Application

```bash
pnpm dev
```

Visit http://localhost:3000

## Demo Accounts

After seeding, login with:

- **Admin**: admin@example.com / admin123
- **Donor**: donor@example.com / donor123  
- **NGO (verified)**: hope@ngo.com / ngo123
- **NGO (unverified)**: green@ngo.com / ngo123

## Quick Test Workflow

### As Donor:
1. Login → Browse Requests → Donate → View History

### As NGO:
1. Login (verified account) → Create Request → View Incoming Donations → Update Status

### As Admin:
1. Login → Verify NGOs → View Reports

## Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env.local
- Verify database exists

### Prisma Client Error
Run: `npx prisma generate`

### Migration Error
Reset database: `npx prisma migrate reset --skip-seed`
Then: `npx prisma migrate dev --name init`
Then: `npx prisma db seed`

### Port Already in Use
Change port: `pnpm dev --port 3001`

## Development Tools

```bash
# Open Prisma Studio (Database GUI)
npx prisma studio

# View all routes and errors
# Check terminal running `pnpm dev`

# Format code
pnpm lint
```

## Project Status

✅ All MVP features implemented:
- Authentication (JWT + httpOnly cookies)
- Role-based access control (DONOR, NGO, ADMIN)
- Request management (CRUD)
- Donation workflow
- NGO verification
- Admin dashboard
- Responsive UI with Tailwind

## Next Steps

1. Test all user flows
2. Add environment-specific configs
3. Deploy to production (Vercel + PostgreSQL)
4. Add monitoring and logging
5. Implement future enhancements (email, payments, etc.)
