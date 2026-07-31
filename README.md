# RentNest — Frontend

RentNest is a full-stack rental property platform built for the Bangladesh market. Tenants can browse verified listings, submit rental requests, make payments, and leave reviews. Landlords can list and manage their properties, review incoming requests, and track active leases. Admins have full oversight of users, listings, rentals, and property categories.

This repository contains the **frontend** application. The backend API is maintained in a separate repository: **RentNest Backend**.

---

## Features

### Tenant
- Browse and filter properties by location, price, and category
- View detailed property pages with images, amenities, bedrooms/bathrooms
- Submit rental requests with move-in date and message
- Track request status (Pending → Approved → Active → Completed)
- Make payments via Stripe/SSLCommerz
- Leave reviews on completed rentals
- Personal dashboard with rental history, payment history, and stats

### Landlord
- List new properties with images, pricing, amenities, and category
- Edit and delete existing listings
- Review incoming rental requests — approve, reject, or mark as completed
- Dashboard showing all listings with status and quick edit access

### Admin
- Platform-wide overview: user count, property count, pending requests
- Manage all users — view roles, ban/unban accounts
- View all properties across the platform
- View all rental requests with status
- Full CRUD on property categories

---

## Tech Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Framework    | Next.js 16 (App Router)             |
| Language     | TypeScript 5                        |
| Styling      | Tailwind CSS v4                     |
| UI Components| Radix UI + shadcn/ui                |
| Forms        | React Hook Form + Zod v4            |
| Data Fetching| TanStack Query v5 (React Query)     |
| HTTP Client  | Axios                               |
| Auth         | JWT stored in cookies (js-cookie)   |
| Icons        | Lucide React + HugeIcons            |
| Toasts       | Sonner                              |
| Font         | Inter (Google Fonts via next/font)  |

---

## Project Structure

```
src/
├── app/                        # Next.js App Router pages
│   ├── page.tsx                # Home page
│   ├── properties/             # Browse & detail pages
│   ├── auth/                   # Login & register
│   ├── dashboard/
│   │   ├── tenant/             # Tenant dashboard
│   │   ├── landlord/           # Landlord dashboard + property management
│   │   └── admin/              # Admin dashboard
│   └── payment/                # Payment success/cancel pages
├── components/
│   ├── home/                   # Home page section components
│   ├── layout/                 # Navbar, Footer
│   ├── shared/                 # EmptyState, etc.
│   └── ui/                     # Base UI components (shadcn)
├── features/
│   ├── auth/                   # Login/register forms, auth hook
│   ├── properties/             # Property card, form, filters, hooks
│   ├── rentals/                # Rental request button, status badge, hooks
│   ├── payments/               # Payment hooks
│   ├── reviews/                # Review dialog, hooks
│   └── admin/                  # Admin hooks (users, categories, overview)
├── lib/
│   ├── api-client.ts           # Axios instance with auth interceptor
│   ├── api-error.ts            # Typed error message helper
│   └── utils.ts                # cn() utility
├── providers/
│   ├── auth-provider.tsx       # Auth context
│   └── query-provider.tsx      # TanStack Query client
└── types/
    ├── api.ts                  # ApiResponse, ApiErrorResponse
    ├── property.ts             # Property, PropertyCategory types
    ├── rental.ts               # RentalRequest, RentalStatus types
    ├── payment.ts              # Payment types
    └── user.ts                 # User, Role, AuthResult types
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- The **RentNest Backend** running locally or deployed

### Installation

```bash
git clone <repo-url>
cd rentnest-frontend
npm install
```

### Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app
```

For local development with the backend running on port 5000:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
npm run start
```

---

## Backend

The backend is a separate project: **RentNest Backend**

It provides a REST API built with Node.js/Express and Prisma ORM. Key endpoints used by this frontend:

| Resource      | Base path                    |
|---------------|------------------------------|
| Auth          | `/api/auth`                  |
| Properties    | `/api/properties`            |
| Categories    | `/api/categories`            |
| Rentals       | `/api/rentals`               |
| Payments      | `/api/payments`              |
| Reviews       | `/api/reviews`               |
| Admin         | `/api/admin`                 |

---

## Test Credentials

| Role     | Email                  | Password   |
|----------|------------------------|------------|
| Tenant   | tenant@test.com        | 123456     |
| Landlord | landlord@test.com      | 123456     |
| Admin    | admin@rentnest.com     | admin123   |

---

## License

MIT
