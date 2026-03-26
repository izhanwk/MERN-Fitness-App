# FitTrack App

FitTrack is a full-stack fitness and nutrition tracking app built with React, Express, and MongoDB. It helps users set up their profile, track calorie and nutrition intake, search food data, and manage active sessions across devices.

This project is structured as a real deployed application, not just a frontend demo. It includes authentication, Google sign-in, email-based account flows, session management, onboarding logic, and password reset with OTP protection.

## Highlights

- Email/password authentication with JWT-based access tokens
- Google sign-in support
- Session tracking across devices with remote session revocation
- Onboarding flow for profile completion
- Food search and paginated food browsing
- Persisted user tracking state
- OTP-based password reset with expiry and request limiting
- Resend-based transactional email delivery
- Split backend architecture with routes, controllers, middleware, services, and utils

## Tech Stack

- Frontend: React, React Router, Axios, Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB with Mongoose
- Auth: JWT, bcrypt, Google Identity
- Email: Resend
- Deployment: frontend and backend deployed separately

## Project Structure

```text
src/
  components/
  App.jsx
  main.jsx

backend/
  controllers/
  middleware/
  routes/
  services/
  utils/
  views/
  server.js

Model/
  Registerdata.js
  Foods.js
  Sessions.js
  Otp.js
  OtpRequest.js
```

## Core Features

### Authentication and Sessions

- Sign up with email verification
- Sign in with email/password
- Sign in with Google
- Refresh short-lived access tokens using server-side session state
- View all logged-in sessions
- Revoke other active sessions

### Profile and Onboarding

- Multi-step onboarding for profile completion
- Store physical profile data such as weight, height, activity, and goal
- Track whether onboarding is complete
- Edit profile after signup

### Fitness and Nutrition Tracking

- Browse food data with pagination
- Search foods by name
- Save and restore the user's working nutrition array/state
- Display dashboard data for macros and micros

### Password Reset

- Request OTP by email
- OTP expires automatically after 5 minutes
- OTP requests are limited to 10 per 6 hours per email

## Backend Architecture

The backend was refactored from a single large file into focused modules:

- `routes/`: endpoint registration
- `controllers/`: request handling logic
- `middleware/`: auth/session verification
- `services/`: reusable service logic such as session creation
- `utils/`: helpers for validation, token generation, safe user projections, and profile-completion logic

This keeps `backend/server.js` focused on application bootstrapping, database connection, middleware setup, and route mounting.

## Main API Areas

- Auth: `/signin`, `/signin/google`, `/register`, `/verify/:token`, `/refresh-token`
- Profile: `/getdata`, `/data`, `/mode`, `/activity`, `/goals`, `/editdata`, `/checkData`
- Foods: `/getfood`, `/getfood2`, `/search`, `/store`
- Sessions: `/sessions`, `/logout`, `/logoutsession`
- Password reset: `/forgot-password`, `/change-password`

## Screenshots

### Home

![Home](screenshots/mainpage.png)

### Sign In

![Sign In](screenshots/loginsystem.png)

### Dashboard

![Dashboard](screenshots/dashboard.png)

### Nutrition Detail

![Nutrition Detail](screenshots/macrosandmicros.png)

### Session Management

![Session Management](screenshots/home1.png)

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root and add the variables your local setup needs.

Example:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
SECRET_KEY=your_access_token_secret
REFRESH=your_refresh_token_secret
JWT_VERIFY=your_email_verification_secret
SERVER_BASE_URL=http://localhost:5000

GOOGLE_CLIENT_ID=your_google_client_id

RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=hello@yourdomain.com
RESEND_FROM_NAME=FitTrack App

VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### 3. Start the backend

```bash
npm run start:server
```

### 4. Start the frontend

```bash
npm run dev
```

## Production Notes

- `MONGODB_URI` must be provided in the deployment environment
- Resend must be configured with a verified sending domain
- `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `RESEND_FROM_NAME` are required for email delivery
- Google sign-in requires valid Google client configuration on both frontend and backend

## Security Notes

- Passwords are hashed with bcrypt
- Protected routes require JWT plus session identity
- OTP records expire automatically
- OTP generation is rate-limited per email
- Sensitive user fields are excluded from profile responses

## Areas Improved During Refactor

- Split monolithic backend into modules
- Removed hardcoded database credentials
- Replaced Gmail OAuth email sending with Resend
- Fixed profile completion persistence
- Fixed broken activity route handling
- Added safer input validation utilities
- Reduced accidental exposure of sensitive user fields

## Current Gaps / Next Improvements

- Add automated backend integration tests
- Add frontend flow tests
- Normalize remaining legacy status-code behavior where frontend allows it
- Add centralized API error formatting
- Add `.env.example`
- Remove remaining unused dependencies from `package.json`

## Why This Project Matters

This project demonstrates practical full-stack engineering beyond basic CRUD:

- authentication and session lifecycle management
- frontend/backend coordination
- transactional email flows
- onboarding state management
- deployment-aware environment configuration
- iterative backend refactoring toward cleaner architecture

## Author

Built by Izhan as a production-style portfolio project focused on full-stack product development, auth/session flows, and applied backend architecture.
