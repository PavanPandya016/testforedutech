# EduTech Backend

Complete Node.js backend for EduTech platform.

## Setup

1. Install dependencies:
```
npm install
```

2. Create .env:
```
copy .env.example .env
```

3. Edit .env with your MongoDB URI and JWT secret

4. Start server:
```
npm run dev
```

Server runs on http://localhost:5000

## API Endpoints

See documentation for complete API reference.

## API Overview (for frontend)

**Base URL (backend)**: `http://localhost:5000` in development  
In production this will be something like `https://your-backend-domain.com`.

**CORS**: Allowed origin is controlled via the `FRONTEND_URL` env variable (see `.env.example`).  
Set it to your React app URL, for example:

```env
FRONTEND_URL=http://localhost:3000
```

### Auth (`/api/auth`)

- **POST** `/api/auth/register`  
  - **Body**: `{ username, email, password, firstName?, lastName? }`  
  - **Response**: `{ success, token, user }` where `token` is a JWT and `user` is a public profile.

- **POST** `/api/auth/login`  
  - **Body**: `{ email, password }`  
  - **Response**: `{ success, token, user }`.

- **GET** `/api/auth/profile` (auth required)  
  - **Headers**: `Authorization: Bearer <token>`  
  - **Response**: `{ success, user }`.

- **PUT** `/api/auth/profile` (auth required)  
  - **Headers**: `Authorization: Bearer <token>`  
  - **Body** (any subset of): `firstName, lastName, phone, address, gender, dateOfBirth`  
  - **Response**: `{ success, user }`.

- **POST** `/api/auth/logout` (auth required)  
  - Stateless logout; simply returns `{ success, message }`.

### Courses (`/api/courses`)

- **GET** `/api/courses`  
  - **Query**: `search?`, `type?` (`free`/`paid`), `page?`, `limit?`  
  - **Response**: `{ success, courses, total, page, pages }`.

- **GET** `/api/courses/featured`  
  - **Response**: `{ success, courses }` (featured & active).

- **GET** `/api/courses/my/courses` (auth required)  
  - **Headers**: `Authorization: Bearer <token>`  
  - **Response**: `{ success, enrollments }` (each enrollment includes populated `course`).

- **GET** `/api/courses/:id`  
  - Returns a single course with populated `modules` and `materials`  
  - **Response**: `{ success, course }` or `404`.

- **POST** `/api/courses/:id/enroll` (auth required)  
  - **Headers**: `Authorization: Bearer <token>`  
  - **Response**: `{ success, enrollment }` or error (`Already enrolled`, `Course not found`).

### Events (`/api/events`)

- **GET** `/api/events`  
  - **Query**: `type?`, `page?`, `limit?`  
  - Only upcoming, active events are returned  
  - **Response**: `{ success, events, total, page, pages }`.

- **GET** `/api/events/featured`  
  - **Response**: `{ success, events }` (featured upcoming events).

- **GET** `/api/events/my/events` (auth required)  
  - **Headers**: `Authorization: Bearer <token>`  
  - **Response**: `{ success, registrations }` with populated `event`.

- **GET** `/api/events/:id`  
  - **Response**: `{ success, event }` or `404`.

- **POST** `/api/events/:id/register` (auth required)  
  - **Headers**: `Authorization: Bearer <token>`  
  - **Response**: `{ success, registration }` or error (`Already registered`, `Event is full`).

### Blog (`/api/blog`)

- **GET** `/api/blog`  
  - **Query**: `search?`, `page?`, `limit?`  
  - Only `published` posts returned  
  - **Response**: `{ success, posts, total, page, pages }`.

- **GET** `/api/blog/featured`  
  - **Response**: `{ success, posts }` (featured published posts).

- **GET** `/api/blog/categories`  
  - **Response**: `{ success, categories }`.

- **GET** `/api/blog/tags`  
  - **Response**: `{ success, tags }`.

- **GET** `/api/blog/:slug`  
  - Returns a single published post and increments its `viewCount`  
  - **Response**: `{ success, post }` or `404`.

### File uploads (`/upload`)

- **POST** `/upload`  
  - **Content-Type**: `multipart/form-data` with field name `file`  
  - **Response**: `{ success: true, filepath }` where `filepath` is a server-relative path like `uploads/123-file.png`.  
  - React can build a full URL as: `const url = API_URL + '/' + filepath;`.

### Admin API (`/admin`)

These endpoints are intended for your internal admin panel (Basic Auth using `ADMIN_EMAIL`/`ADMIN_PASSWORD` in `.env`):

- **GET** `/admin` – dashboard stats and admin endpoint map  
- **/admin/users`** – CRUD for users  
- **/admin/courses`** – CRUD for courses  
- **/admin/events`** – CRUD for events  
- **/admin/posts`** – CRUD for blog posts  

Your React frontend will normally not use these directly; they are for the HTML admin panel at `/admin-panel`.

---

## Using this backend from React

### 1. Frontend env configuration

Ask your frontend partner to configure a single **API base URL** env variable pointing to this backend, e.g.:

- For Create React App: `REACT_APP_API_URL=http://localhost:5000`
- For Vite: `VITE_API_URL=http://localhost:5000`

In React code they can then do something like:

```js
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
```

### 2. Authentication flow (JWT)

1. **Registration**: call `POST /api/auth/register` with `username`, `email`, and `password`.  
2. **Login**: call `POST /api/auth/login`; on success, store `token` and `user` on the client (e.g. in `localStorage` or React context).  
3. For any protected endpoint, include:

```http
Authorization: Bearer <token>
```

4. To get current user details, call `GET /api/auth/profile` with that header.  
5. To update profile, call `PUT /api/auth/profile` with body fields to change.

Example React helper (pseudo‑code):

```js
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export async function login(email, password) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.error || 'Login failed');
  localStorage.setItem('token', data.token);
  return data.user;
}

export function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}
```

### 3. Typical React API calls

- **List courses**: `GET /api/courses?search=js&type=free&page=1&limit=12`  
- **Course detail**: `GET /api/courses/:id`  
- **Enroll in course** (logged‑in user): `POST /api/courses/:id/enroll` with `Authorization: Bearer <token>`  
- **My courses**: `GET /api/courses/my/courses` with auth header  
- **List events**: `GET /api/events` or `GET /api/events/featured`  
- **Register for event**: `POST /api/events/:id/register` with auth header  
- **Blog listing**: `GET /api/blog` / `GET /api/blog/featured`  
- **Blog detail**: `GET /api/blog/:slug`

For each of these, the React app can:

1. Call the endpoint using `fetch` or `axios`.  
2. Check `data.success` and handle errors using `data.error` or HTTP status.  
3. Map the returned arrays (`courses`, `events`, `posts`) to UI components.

### 4. Frontend file uploads

To upload a file (for example, from a React form), send `FormData` to `/upload`:

```js
export async function uploadFile(file) {
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const form = new FormData();
  form.append('file', file);

  const res = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    body: form,
  });

  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.error || 'Upload failed');
  return `${API_URL}/${data.filepath}`; // full URL to use in <img>, etc.
}
```

If you later want uploads to be authenticated, you can add the JWT `Authorization` header on the frontend and wrap the `/upload` route with the `protect` middleware.

---

## GitHub: pushing this backend

From PowerShell:

```bash
cd C:\Users\Administrator\Desktop\edutech-backend
git init
git add .
git commit -m "Initial commit: EduTech backend"
```

Then on GitHub:

1. Create a new empty repository (no README) – for example `edutech-backend`.  
2. Follow the instructions GitHub shows, essentially:

```bash
git remote add origin https://github.com/<your-username>/edutech-backend.git
git branch -M main
git push -u origin main
```

Notes:

- **Do not commit `.env`** – it is already ignored via `.gitignore`.  
- Share the repo URL with your React partner; they just need your base API URL and the endpoint list above to integrate smoothly.

