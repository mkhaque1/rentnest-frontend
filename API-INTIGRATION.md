# API Integration — RentNest Frontend

This document maps every frontend route/component to the backend endpoint(s) it consumes, per the assignment's mandatory documentation requirement.

**Backend base URL:** set via `NEXT_PUBLIC_API_URL` in `.env.local` / Vercel environment variables.

**Auth mechanism:** JWT access token stored in a `sameSite=strict` cookie (`accessToken`), attached automatically to every request via an axios request interceptor (`src/lib/api-client.ts`). Next.js Middleware (`src/middleware.ts`) additionally decodes the token (without verifying signature, since the secret never leaves the backend) to protect `/dashboard/*` routes and redirect based on role. The backend remains the sole source of truth for authorization — the frontend checks are UX only.

**Response shape assumed everywhere:** `{ success: boolean, message: string, data: T, meta?: {...} }`, matching the backend's `sendResponse` utility. Errors follow `{ success: false, message: string, data: null, errorDetails?: unknown }`.

---

## Auth

| Frontend Route / Component               | Backend Endpoint          | Notes                                                                                                                                                          |
| ---------------------------------------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/auth/register` → `RegisterForm`        | `POST /api/auth/register` | Zod-validated client-side (`registerSchema`) before submit. On success, stores tokens via `AuthProvider.login()` and redirects to the role-specific dashboard. |
| `/auth/login` → `LoginForm`              | `POST /api/auth/login`    | Respects `?redirect=` query param set by middleware, so users land back where they were headed after signing in.                                               |
| `AuthProvider` (app-wide, on every load) | `GET /api/auth/me`        | Re-validates the stored token against the live database on every fresh app load — populates the global `user` object consumed by `useAuth()`.                  |
| Navbar dropdown → "Log out"              | _(no backend call)_       | Clears cookies and local auth state client-side only; JWTs are stateless, so there's nothing to invalidate server-side.                                        |

## Properties (Public)

| Frontend Route / Component                | Backend Endpoint                                                      | Notes                                                                                                |
| ----------------------------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `/` (home) → `getFeaturedProperties()`    | `GET /api/properties`                                                 | Server Component, `fetch` with `next: { revalidate: 300 }` (5 min ISR cache). Shows first 6 results. |
| `/properties` → `useProperties()` hook    | `GET /api/properties?location=&minPrice=&maxPrice=&type=&categoryId=` | Client Component using React Query; refetches automatically as filter state changes.                 |
| `/properties/[id]` → `getProperty(id)`    | `GET /api/properties/:id`                                             | Server Component, `fetch` with `revalidate: 60`. Calls `notFound()` on a `404`/failed fetch.         |
| Property filter bar → categories dropdown | `GET /api/categories`                                                 | Public, no auth required.                                                                            |

## Properties (Landlord — protected)

| Frontend Route / Component                                  | Backend Endpoint                                                     | Notes                                                                                             |
| ----------------------------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `/dashboard/landlord` → `useMyProperties()`                 | `GET /api/properties/my/listings`                                    | Requires `Authorization: Bearer <token>`, backend enforces `restrictTo("LANDLORD")`.              |
| `/dashboard/landlord/properties/new` → `PropertyForm`       | `POST /api/properties`                                               | Amenities input (comma-separated string) is split into an array client-side before submit.        |
| `/dashboard/landlord/properties/[id]/edit` → `PropertyForm` | `GET /api/properties/:id` (prefill) then `PATCH /api/properties/:id` | Backend enforces ownership (`property.landlordId === req.user.id`) independently of the frontend. |
| `MyPropertyRow` → delete (trash icon)                       | `DELETE /api/properties/:id`                                         | Confirmed via `AlertDialog` before firing; backend also enforces ownership.                       |

## Rental Requests

| Frontend Route / Component                              | Backend Endpoint                                                       | Notes                                                                                                                                                                         |
| ------------------------------------------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Property details → `RequestRentalButton` dialog         | `POST /api/rentals`                                                    | Redirects unauthenticated visitors to `/auth/login?redirect=...`; blocks non-tenant roles client-side with a toast (backend `restrictTo("TENANT")` is the real gate).         |
| `/dashboard/tenant` (Rentals tab) → `useMyRentals()`    | `GET /api/rentals`                                                     | Tenant's own request history, with `RentalStatusBadge` reflecting `PENDING/APPROVED/REJECTED/ACTIVE/COMPLETED`.                                                               |
| `/dashboard/landlord/requests` → `useLandlordRentals()` | `GET /api/rentals/landlord/requests`                                   | All requests across the landlord's properties.                                                                                                                                |
| Approve / Reject buttons                                | `PATCH /api/rentals/:id/status` `{ status: "APPROVED" \| "REJECTED" }` | Implemented with a React Query optimistic update (`onMutate`/`onError` rollback/`onSettled` refetch) so the badge updates instantly, before the network round-trip completes. |
| "Mark completed" button (on `ACTIVE` rentals)           | `PATCH /api/rentals/:id/status` `{ status: "COMPLETED" }`              | Same optimistic-update hook, reused.                                                                                                                                          |

## Payments (Stripe)

| Frontend Route / Component                             | Backend Endpoint                                                      | Notes                                                                                                                                                                                                                                                         |
| ------------------------------------------------------ | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/dashboard/tenant/requests/[id]/pay`                  | `GET /api/rentals/:id` (load rental) then `POST /api/payments/create` | On success, browser is redirected with `window.location.href = checkoutUrl` — a full navigation to Stripe's hosted Checkout page, not client-side routing.                                                                                                    |
| `/payment/success`                                     | _(no direct call)_                                                    | Cosmetic confirmation page only. Actual payment confirmation happens server-to-server via the backend's `POST /api/payments/webhook` (Stripe → backend), which is what actually flips `Payment.status` to `COMPLETED` and `RentalRequest.status` to `ACTIVE`. |
| `/payment/cancel`                                      | _(no direct call)_                                                    | Cosmetic only — shown if the user abandons Stripe Checkout.                                                                                                                                                                                                   |
| `/dashboard/tenant` (Payments tab) → `useMyPayments()` | `GET /api/payments`                                                   | Full payment history for the logged-in tenant.                                                                                                                                                                                                                |

## Reviews

| Frontend Route / Component                                              | Backend Endpoint                        | Notes                                                                                                                                        |
| ----------------------------------------------------------------------- | --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `RentalRow` → `ReviewDialog` (shown only when `status === "COMPLETED"`) | `POST /api/reviews`                     | Backend independently enforces the rental is `COMPLETED` and not already reviewed; frontend hides the trigger otherwise as a UX nicety only. |
| _(not yet surfaced on property details page)_                           | `GET /api/reviews/property/:propertyId` | Public endpoint exists on the backend; property details page does not yet render existing reviews — noted as a possible enhancement.         |

## Admin

| Frontend Route / Component                         | Backend Endpoint                                                | Notes                                                                                                                                                                        |
| -------------------------------------------------- | --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/dashboard/admin` (Users tab) → `useAdminUsers()` | `GET /api/admin/users`                                          | Requires `restrictTo("ADMIN")` on the backend; middleware also blocks non-admins from reaching this route client-side.                                                       |
| Ban / Unban button                                 | `PATCH /api/admin/users/:id` `{ status: "ACTIVE" \| "BANNED" }` | Optimistic update, same pattern as rental status changes. Hidden entirely for rows where `role === "ADMIN"`, mirroring the backend's own guard against banning other admins. |
| `/dashboard/admin` (Properties tab)                | `GET /api/admin/properties`                                     | Read-only oversight view — no mutation actions currently wired on this tab.                                                                                                  |
| `/dashboard/admin` (Rentals tab)                   | `GET /api/admin/rentals`                                        | Read-only oversight view — no mutation actions currently wired on this tab.                                                                                                  |

## Route Protection Summary

| Path pattern                                      | Protection                                                         |
| ------------------------------------------------- | ------------------------------------------------------------------ |
| `/`, `/properties`, `/properties/[id]`, `/auth/*` | Public, no middleware interference                                 |
| `/dashboard/tenant/**`                            | Middleware requires valid, non-expired token with `role: TENANT`   |
| `/dashboard/landlord/**`                          | Middleware requires valid, non-expired token with `role: LANDLORD` |
| `/dashboard/admin/**`                             | Middleware requires valid, non-expired token with `role: ADMIN`    |

Middleware decodes the JWT payload locally (`jwt-decode`) to read `role` and `exp` for routing purposes only — it does not verify the token's cryptographic signature, since the signing secret is intentionally never exposed outside the backend. All real authorization is enforced server-side via the backend's `authenticate` + `restrictTo` middleware on every request.

## Known Gaps / Future Improvements

- `Property` model has no `images` field yet on the backend — property cards currently render a placeholder visual instead of real photos.
- Reviews are not yet displayed on the property details page (submission works; display does not, yet).
- No refresh-token rotation flow implemented — access tokens are re-used until expiry, at which point the user is redirected to log in again via middleware.
