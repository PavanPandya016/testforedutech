# Full-Stack Vercel Deployment Guide

This project is configured to be deployed as **two fully separate serverless applications on Vercel** — one for the Frontend (React/Vite) and one for the Backend (Node.js/Express).

This decoupled architecture ensures maximum scalability and independent deployment cycles.

---

## 🏗️ 1. Deploying the Backend (Vercel Serverless)

The backend exposes Serverless Functions and must be deployed as its own Vercel project.

### Steps:
1. Push your entire repository to GitHub.
2. Go to your [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New... > Project**.
3. Import your GitHub repository.
4. **Important Configuration:**
   - **Project Name:** `edutech-backend` (or similar)
   - **Framework Preset:** `Other` (or leave default)
   - **Root Directory:** Edit this and select the **`backend`** folder. By telling Vercel the root is `backend`, it knows to look at `backend/vercel.json` and `backend/index.js`.
5. **Environment Variables:** Add the following securely:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: `mongodb+srv://edutech_web:edutech@cluster0.yjwj5yv.mongodb.net/edutech?retryWrites=true&w=majority` (use your actual password/URL here).
   - `JWT_SECRET`: Your secure random string (e.g., `my-super-secret-jwt-key`).
   - `FRONTEND_URL`: Leave this blank for now, we will come back and fill this in after deploying the frontend!
6. Click **Deploy**.
7. Once finished, Vercel will give you a backend domain (e.g., `https://edutech-backend.vercel.app`). **Copy this URL**.

---

## 🎨 2. Deploying the Frontend (Vercel Static)

The frontend is a Vite SPA. It needs to know how to talk to your newly deployed backend.

### Steps:
1. Go back to your [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New... > Project**.
2. Import the *exact same GitHub repository* again.
3. **Important Configuration:**
   - **Project Name:** `edutech-frontend`
   - **Framework Preset:** `Vite`
   - **Root Directory:** Edit this and select the **`frontend`** folder.
4. **Environment Variables:**
   - `VITE_API_BASE_URL`: Paste the backend URL you copied earlier, appending `/api` to it. (Example: `https://edutech-backend.vercel.app/api`).
5. Click **Deploy**.
6. Once finished, Vercel will give you a frontend domain (e.g., `https://edutech-frontend.vercel.app`). **Copy this URL**.

---

## 🔗 3. Final Linking (CORS & Cookies)

Because your apps are on different subdomains, the backend needs explicit permission to accept cookies and API requests from the frontend.

1. Go to your **Backend Project** in Vercel.
2. Go to **Settings > Environment Variables**.
3. Add or update the `FRONTEND_URL` variable to exactly match your frontend domain (e.g., `https://edutech-frontend.vercel.app` - no trailing slash).
4. Go to the **Deployments** tab and click **Redeploy** so the backend picks up the new `FRONTEND_URL`.

🎉 **You are completely done!** The frontend will talk securely to the backend using Serverless functions and HTTP-Only cookies.
