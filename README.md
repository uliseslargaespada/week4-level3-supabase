# React + Vite + Supabase Task Manager

A small authenticated task manager used as the Level 3 Supabase reference
project. Each account can only read and change its own tasks.

## Features

- Email and password registration and login with Supabase Auth
- Protected React Router pages
- Personal task creation, filtering, completion, deletion, and detail pages
- Row Level Security (RLS) policies that isolate each user's tasks
- Responsive SCSS with BEM-style class names
- Netlify single-page-app routing support

## Local setup

1. Install the dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and add the values from your Supabase
   project's API settings:

   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
   ```

   The publishable key is intended for browser apps. Never add the secret or
   service-role key to this project.

3. In the Supabase SQL Editor, run
   `supabase/migrations/001_add_task_ownership_and_rls.sql`.

   Rows created before authentication do not have an owner. The migration
   leaves those old rows in place, but RLS hides them from every signed-in user.

4. In **Authentication → URL Configuration**, set the Site URL for the deployed
   app and add `http://localhost:5173/**` plus the Netlify URL to the allowed
   redirect URLs. Keep the Email provider enabled.

5. Start the app:

   ```bash
   npm run dev
   ```

## Registration behavior

When email confirmation is enabled in Supabase, registration creates the
account and asks the user to check their inbox. When it is disabled, Supabase
starts the session immediately and the app opens `/tasks`.

The display name is saved as `user_metadata.display_name`; tasks use the Auth
user's UUID in `tasks.user_id`.

## Checks

```bash
npm run lint
npm run build
```

The `public/_redirects` file lets Netlify serve React Router paths such as
`/login`, `/register`, and `/tasks/123` after a page refresh.

The GitHub Actions workflow runs both checks for pushes and pull requests to
`main` and `dev`.
