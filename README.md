# Movie Dashboard (Angular 17+)

A clean, modern movie dashboard built with **Angular 17 (standalone & signals)**. It integrates with a Spring Boot backend for **JWT authentication (access + refresh)**, **admin OMDb imports**, **DB movie listing**, **movie details**, and **per-user ratings**. Sleek UI with **toasts**, **SVG icons**, and **fixed pagination**.

**Backend API:** 👉 [Movie Backend-Spring boot](https://github.com/hanin-mohamed/Movie-APP)

---

##  Features

- **Auth & Roles**
  - Login via backend (JWT); automatic refresh on 401 via interceptor
  - Guards: `authGuard` and `roleGuard('ADMIN')`
  - Logout button in Movies toolbar

- **Users**
  - Browse movies from DB with **search + pagination (1-based)**
  - View **movie details** (plot, cast, runtime, etc.)
  - **Rate** a movie (1–5), update or clear rating
  - Subtle **toasts** for success/failure actions

- **Admin**
  - **DB tab:** list movies in DB + **delete** (single)
  - **Import tab:** search **OMDb** (via backend), multi-select, **import selected**; back to DB view
  - Clean, compact **SVG** delete icons; consistent card/table styles

- **UI/UX**
  - Angular **Signals** for state (loading, page, query, data)
  - Standalone components, lightweight CSS, consistent card sizes
  - Pagination footer always pinned visually at bottom area

---

## Tech Stack

- **Angular 17** (Standalone Components, Signals)
- **RxJS**, **Angular Router**
- **HTTP Interceptor** (Bearer token + auto refresh)
- **SCSS** styling
- **Toast** micro-component (no external UI libs required)

> OMDb integration is handled **by the backend**.

---

##  Getting Started

### 1) Prerequisites
- Node.js 18+
- Angular CLI 17+
- Running backend API (see **Movie API (Spring Boot)**)

### 2) Clone
```bash
git clone https://github.com/hanin-mohamed/Movie-APP-Frontend
cd Movie-APP-Frontend
```

### 3) Environment
`src/environment.ts`
```ts
export const environment = {
  apiBaseUrl: 'http://localhost:8080'
};
```

### 4) Install & Run
```bash
npm install
ng serve -o
```
App runs on: `http://localhost:4200`

> Ensure backend CORS allows `http://localhost:4200`.

---

##  Authentication & Roles

- **Login** returns `{ accessToken, refreshToken }`. Tokens are stored in localStorage.
- **Interceptor** attaches `Authorization: Bearer <accessToken>` for all non-auth endpoints.
- On `401 Unauthorized`, the interceptor tries `/auth/refresh` automatically.
- **Guards**:
  - `authGuard` → protects routes from unauthenticated access
  - `roleGuard('ADMIN')` → protects admin-only routes
- **Logout** clears tokens (and calls backend `/auth/logout` for refresh revocation).

---

##  Main Screens

### Movies (Users & Admin)
- Search + pagination of **DB movies**
- Each card links to **movie details**
- If **ADMIN**, a small **delete** SVG icon appears on cards

### Movie Details
- Poster, title, year, genre, runtime, plot, cast, etc.
- **Star rating** (`app-stars`) with live update and **toast** feedback
- Clear my rating button

### Admin Dashboard
- **DB tab**: table of movies in DB with delete
- **Import tab**: search OMDb (via backend), checkbox select, **Import Selected**, then **Back to your movies**
- Fixed small checkboxes and clean card layout

---

##  Configuration Notes

- `apiBaseUrl` must point to your running backend (default `http://localhost:8080`).
- Keep `<app-toast></app-toast>` placed globally (e.g., in `app.component.html`).

---

