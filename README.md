# FitTracker

FitTracker is a MERN-style fitness portfolio project focused on onboarding, nutrition tracking, and session-aware authentication. The app lets users create an account, complete their profile, choose a goal, and track meals against calorie and macro targets.

## Project Overview

This repository was refactored to make the codebase more maintainable and portfolio-ready without changing the core product idea. The backend now has clearer separation of concerns, stronger validation, centralized error handling, cleaner environment management, and a small backend test suite.

## Tech Stack

- Frontend: React, Vite, React Router, Tailwind CSS, Axios, React Hook Form
- Backend: Node.js, Express, JWT, bcrypt
- Database: MongoDB with Mongoose
- Email/Identity: Gmail OAuth API, Google Sign-In
- Testing: Node test runner, Supertest

## Architecture Overview

- `src/`: React frontend pages and components
- `backend/app.js`: Express app factory
- `backend/server.js`: server bootstrap and database connection
- `backend/routes/`: API route modules
- `backend/controllers/`: request handlers
- `backend/services/`: auth, sessions, profile, nutrition, email, password reset logic
- `backend/middleware/`: authentication, validation, not-found, error middleware
- `backend/models/`: Mongoose models
- `backend/validators/`: lightweight request validation rules
- `backend/utils/`: shared helpers and response utilities
- `backend/tests/`: small backend reliability tests

## Folder Structure

```text
backend/
  config/
  controllers/
  middleware/
  models/
  routes/
  services/
  tests/
  utils/
  validators/
  views/
src/
  components/
  lib/
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env` and fill in the required values.

3. Start the frontend:

```bash
npm run dev
```

4. Start the backend in another terminal:

```bash
npm run start:server
```

## Environment Variables

Required for local development:

- `MONGODB_URI`: MongoDB connection string
- `SECRET_KEY`: access token secret
- `REFRESH`: refresh token secret
- `JWT_VERIFY`: email verification token secret
- `VITE_API_URL`: frontend API base URL

Optional but recommended:

- `SERVER_BASE_URL`: backend base URL used in email links
- `CORS_ORIGINS`: comma-separated allowed frontend origins
- `GOOGLE_CLIENT_ID`: backend Google Sign-In verification client ID
- `VITE_GOOGLE_CLIENT_ID`: frontend Google Sign-In client ID
- `GMAIL_CLIENT_ID`
- `GMAIL_CLIENT_SECRET`
- `GMAIL_REFRESH_TOKEN`
- `GMAIL_SENDER`

## API Overview

Primary route groups:

- `POST /api/auth/register`
- `GET /api/auth/verify/:token`
- `POST /api/auth/signin`
- `POST /api/auth/signin/google`
- `POST /api/auth/refresh`
- `POST /api/auth/forgot-password`
- `POST /api/auth/change-password`
- `GET /api/auth/sessions`
- `DELETE /api/auth/sessions/current`
- `DELETE /api/auth/sessions/:sessionId`
- `GET /api/users/me`
- `PATCH /api/users/me`
- `GET /api/users/me/profile-status`
- `PUT /api/users/me/onboarding/profile`
- `PUT /api/users/me/onboarding/goal`
- `PUT /api/users/me/onboarding/mode`
- `PUT /api/users/me/onboarding/activity`
- `GET /api/users/me/tracker`
- `PUT /api/users/me/tracker`
- `GET /api/foods`
- `GET /api/foods/search`
- `GET /api/foods/paged`

Legacy route aliases are still present so the current frontend keeps working.

## Quality Improvements Included

- Modular backend structure instead of one monolithic server file
- Centralized JSON error format
- Route-level request validation for auth, onboarding, tracker, and food pagination/search
- Safer session validation with consistent auth errors
- Environment-driven configuration and `.env.example`
- Improved Mongoose schema discipline: trimming, enums, defaults, indexes, validation
- Reused model definitions through `backend/models`
- Small backend API test suite for validation and auth flows
- Cleaner frontend handling for standardized API payloads

## Screenshots

Add screenshots here for a stronger portfolio presentation:

- Landing page
- Sign-in / sign-up
- Profile onboarding
- Dashboard / nutrition tracker
- Session management

## Known Limitations

- The frontend still relies heavily on component-local state and could benefit from additional shared hooks.
- Email sending depends on a configured Gmail OAuth setup.
- There is no full integration test environment with a disposable database yet.
- Some older component naming and UI text still need polish.

## Future Improvements

- Add a dedicated API client layer and shared auth hook on the frontend
- Add database-backed integration tests with a disposable test database
- Add rate limiting and account lockout for repeated failed sign-in attempts
- Improve accessibility, empty states, and mobile UX consistency
- Introduce structured logging and request tracing

## Scripts

- `npm run dev`: start the Vite frontend
- `npm run start:server`: start the Express backend
- `npm run build`: build the frontend
- `npm run lint`: run ESLint
- `npm run test`: run backend tests
