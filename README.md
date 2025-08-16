This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Frontend project setup
Setting environment variables is necessary for running the frontend project
1- Add `.env` file in the backend folder with these variables:
PORT=5050
JWT_SECRET=PASTE_ACCESS_SECRET
JWT_REFRESH_SECRET=PASTE_REFRESH_SECRET
GOOGLE_CLIENT_ID=GOOGLE_CLIENT_ID
ACCESS_TOKEN_EXPIRES=15m
REFRESH_TOKEN_EXPIRES=7d

2- Start the backend
```bash
npm install
npm run start
```

2- Add `.env.local` file in the root folder with:
GOOGLE_CLIENT_ID=GOOGLE_CLIENT_ID

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)
Open backend: http://localhost:5050

## TECH STACK

Frontend
- Next.js (App Router), React
- State: React Context (UserContext, SignupContext) + local useState
- Styling: CSS modules + component CSS + global CSS
- Data layer: src/utils/api.js (fetch)
- Features: Debounced search, AbortController, client-side image overrides via localStorage + custom event
- OAuth: Google Identity Services (frontend button)

Backend
- Node.js, Express (modular: routes, controllers, services, models, middleware)
- Auth: JWT (jsonwebtoken), cookie-parser
- OAuth verify: google-auth-library
- Rate limiting: express-rate-limit (bypassed in dev)
- Data stores (in-memory): User, Follow, Notification
- Notifications: generated on follow, listed via /notifications
- Port: 5050; CORS enabled
- Passwords: bcrypt
- IDs: uuid


## FRONTEND ARCHITECTURE
- **Pattern:** Next.js App Router with a modular, feature-oriented structure.
- **Composition:** `app/layout.js` wraps pages with `UserProvider`, `SignupProvider`, and `AppShell` for a 3-column UI (Sidebar, main content, RightSidebar).
- **Data layer:** Thin service module `src/utils/api.js` for all HTTP calls (auth, users, search, follows, notifications).
- **Separation:**
  - UI components in `src/components/*`
  - Routes/pages in `src/app/*`
  - Cross-cutting state in `src/context/*`
  - Styling via CSS modules and local CSS files.

## FRONTEND IMPLEMENTATION DETAILS
- App Root: app/layout.js wraps pages with UserProvider, SignupProvider, and AppShell
- UserContext: manages auth/session and normalized user profile
- SignupContext: stores multi-step signup state
- Global Layout (3-column): AppShell renders Sidebar, main content, and RightSidebar
- Pages (App Router)
- Follow lists: via FollowConnections
- Auth flows: via AuthModal, GoogleSignIn, SignupFlowModal
- Data & Services: src/utils/api.js centralizes API calls — auth, user, profile, search, follow/unfollow, followers/following, notifications
- localStorage:
  - access_token
  - profile_overrides_{userId} for avatar/banner local-only overrides
- Custom event: user-profile-local-images used by profile modals; UserContext listens and applies overrides
- Data flow highlights:
  - Components invoke api.js
  - UserContext loads /me, stores token, normalizes user, and applies local overrides
