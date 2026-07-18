import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { canDeactivateGuard } from './guards/can-deactivate.guard';
import { bookTitleResolver } from './resolvers/book-title.resolver';

export const routes: Routes = [
  // home page
  {
    path: '',
    pathMatch: 'full',
    title: 'Home',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/home-page/home-page').then((m) => m.HomePage),
  },
  // about page
  {
    path: 'about',
    title: 'About',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/about-page/about-page').then((m) => m.AboutPage),
  },
  // --- AUTHENTICATION ---
  // signin page
  {
    path: 'signin',
    title: 'Sign In',
    loadComponent: () =>
      import('./pages/signin-page/signin-page').then((m) => m.SignInPage),
  },
  // signup page
  {
    path: 'signup',
    title: 'Sign Up',
    loadComponent: () =>
      import('./pages/signup-page/signup-page').then((m) => m.SignUpPage),
  },
  // forgot password page
  {
    path: 'forgot-password',
    title: 'Forgot Password',
    loadComponent: () =>
      import('./pages/forgot-password-page/forgot-password-page').then(
        (m) => m.ForgotPasswordPage
      ),
  },
  // reset password page
  {
    path: 'reset-password',
    title: 'Reset Password',
    loadComponent: () =>
      import('./pages/reset-password-page/reset-password-page').then(
        (m) => m.ResetPasswordPage
      ),
  },
  // user profile page
  {
    path: 'profile',
    title: 'User Profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/user-profile-page/user-profile-page').then(
        (m) => m.UserProfilePage
      ),
  },
  // --- PROTECTED ADMIN ROUTES ---
  {
    path: 'admin',
    canActivate: [authGuard],
    children: [
      // create book: /admin/book/create
      {
        path: 'books/create',
        title: 'Create Book',
        canDeactivate: [canDeactivateGuard],
        loadComponent: () =>
          import('./pages/book-pages/book-form-page/book-form-page').then(
            (m) => m.BookFormPage,
          ),
      },
      // edit book: /admin/books/:id/edit
      {
        path: 'books/:id/edit',
        title: 'Edit Books',
        canDeactivate: [canDeactivateGuard],
        loadComponent: () =>
          import('./pages/book-pages/book-form-page/book-form-page').then(
            (m) => m.BookFormPage,
          ),
      },
    ],
  },
  // --- BOOK ROUTES ---
  {
    path: 'books',
    children: [
      // book display page
      {
        path: '',
        title: 'Books',
        loadComponent: () =>
          import('./pages/book-pages/book-display-page/book-display-page').then(
            (m) => m.BookDisplayPage,
          ),
      },
      // book details page
      {
        path: ':id',
        title: bookTitleResolver, // dynamic title
        loadComponent: () =>
          import('./pages/book-pages/book-details-page/book-details-page').then(
            (m) => m.BookDetailsPage,
          ),
      },
    ],
  },
  // --- ERROR HANDLING ---
  {
    path: 'error',
    title: 'Error',
    loadComponent: () =>
      import('./pages/error-page/error-page').then((m) => m.ErrorPage),
  },
  // wildcard route - 404 not found page
  {
    path: '**',
    title: 'Page Not Found',
    loadComponent: () =>
      import('./pages/not-found-page/not-found-page').then(
        (m) => m.NotFoundPage,
      ),
  },
];
