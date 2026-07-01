# SpendWise - Frontend

React frontend for the SpendWise expense tracker application.

## Tech Stack

- React (Vite)
- React Router
- Axios
- Tailwind CSS
- Recharts

## Features

- **Authentication** — Register and login with JWT. Token stored in localStorage and auto-attached via Axios interceptor. 401 responses clear the token and redirect to login.
- **Dashboard** — Welcome message, total expenses count, total spending, recent expenses list, category spending pie chart (Recharts), and a quick upload button.
- **Expenses Table** — Sortable by date/amount, searchable by merchant/category, filterable by category. Actions include Edit and Delete.
- **Add / Edit Expense** — Manual expense entry form with fields for merchant, amount, category, and purchase date. Uses the same form for adding and editing.
- **Upload Receipt** — Drag-and-drop file upload area (also supports click-to-browse). Shows upload progress, loading spinner, success/error messages, and auto-refreshes to the expenses list on success.
- **Expense Details** — Displays merchant, amount, category, purchase date, and receipt information. Includes an Edit button.
- **Protected Routes** — Unauthenticated users are redirected to the login page.
- **Responsive Design** — Mobile-friendly layout with rounded cards, subtle shadows, and clean spacing.

## Pages

| Route               | Page             |
|---------------------|------------------|
| `/login`            | Login            |
| `/register`         | Register         |
| `/dashboard`        | Dashboard        |
| `/expenses`         | Expenses list    |
| `/expenses/new`     | Add expense      |
| `/expenses/:id`     | Expense details  |
| `/expenses/:id/edit`| Edit expense     |
| `/upload`           | Upload receipt   |

## Setup

```bash
npm install
```

## Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable      | Default | Description                                |
|---------------|---------|--------------------------------------------|
| VITE_API_URL  | (empty) | Backend API URL. Leave empty in development (Vite proxy handles requests). Set to the backend URL in production (e.g. `http://backend:8000`). |

## Development

The Vite dev server proxies `/register`, `/login`, and `/crud` requests to `http://127.0.0.1:8000`, so no CORS configuration is needed.

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Preview

```bash
npm run preview
```

## Project Structure

```
src/
  components/     — Reusable UI components (Navbar, ProtectedRoute)
  pages/          — Route-level page components
  services/       — API client and service functions
  layouts/        — Page layouts (MainLayout)
  hooks/          — Custom React hooks
  utils/          — Utility functions
  assets/         — Static assets
  App.jsx         — Route definitions
  main.jsx        — Entry point
```
