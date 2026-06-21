# Bookshelf Web Application - Angular Client

A personal book library web application built on Angular and Angular Material. Designed to be served by a companion Node.js/Express API and backed by Firebase Authentication.

---

## Features

- **User Authentication**: Complete Sign Up, Sign In, and Password Reset screens integrating Firebase Authentication (supporting Email/Password and Google OAuth).
- **Book Management**: Manage your personal library with full CRUD capabilities (Add, View Details, Update, Delete).
- **Favorites & Carousel**: Highlight favorite books directly on the homepage with an interactive carousel.
- **Search & Filter**: Search your library catalog easily by book titles and key attributes.
- **Seamless HTTP Interceptor**: Automatically attaches the current Firebase auth token to outgoing requests for secure backend communication.
- **Modern Reactivity**: Built using Angular Signals and RxJS observables for high performance and smooth state transitions.

---

## Tech Stack

- **Framework**: [Angular](https://angular.dev/) (utilizing Signals and standalone components)
- **UI Components**: [Angular Material](https://material.angular.io/)
- **Authentication**: [@angular/fire](https://github.com/angular/angularfire) (Firebase SDK integration)
- **Testing**: [Vitest](https://vitest.dev/)
- **Linting & Code Style**: ESLint, Prettier

---

## Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) (v18+) and `npm` installed.

### Installation

1. Navigate to the client directory:

   ```bash
   cd bookshelf-client
   ```

2. Install all dependencies:

   ```bash
   npm install
   ```

### Configuration

You need to update the configuration file at `src/environments/environment.ts` with your backend server URL and Firebase credentials:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api', // Points to your Express API server
  firebase: {
    apiKey: 'YOUR_FIREBASE_API_KEY',
    authDomain: 'YOUR_FIREBASE_AUTH_DOMAIN',
    projectID: 'YOUR_FIREBASE_PROJECT_ID',
    storageBucket: 'YOUR_FIREBASE_STORAGE_BUCKET',
    messagingSenderId: 'YOUR_FIREBASE_MESSAGING_SENDER_ID',
    addId: 'YOUR_FIREBASE_APP_ID',
  },
};
```

---

## Scripts & Development

Inside the project directory, you can run the following commands:

### `npm run start`

Runs the application locally in development mode.
Open [http://localhost:4200](http://localhost:4200) to view it in your browser. The page will reload if you make edits.

### `npm run build`

Builds the client application for production. The build artifacts will be stored in the `dist/` directory.

### `npm run test`

Runs the unit test suite using **Vitest**.

### `npm run lint`

Runs static code analysis using **ESLint** to enforce code quality and styling guidelines.

---

## Project Directory Structure

```text
src/
├── app/
│   ├── books/         # Book-related components (Form, Carousel, Details)
│   ├── components/    # Reusable shared components (Navbar, Footer, Hero)
│   ├── constants/     # Global constant configurations
│   ├── guards/        # Route authentication guards
│   ├── interceptors/  # HTTP interceptors (adds Bearer token headers)
│   ├── pages/         # Page-level route views (Home, Auth, Profile)
│   ├── services/      # Service classes (AuthService, BookService)
│   ├── types/         # TypeScript interface/type definitions
│   ├── app.config.ts  # Application configurations & providers
│   └── app.routes.ts  # Route definitions
└── environments/      # Environment variables
```
