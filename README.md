# Portfolio

Modern static portfolio site with bilingual content, responsive layout, animated sections, and a secure Supabase-backed contact flow.

## Highlights

- Single-page portfolio with hero, about, skills, projects, and contact sections
- English / Turkish language switch with persisted preference
- Responsive layout built with Tailwind CSS and custom styling
- Contact form that saves messages through a Supabase Edge Function
- Anti-spam protections with honeypot, minimum submit delay, and optional Turnstile verification

## Tech Stack

- HTML, CSS, JavaScript
- Tailwind CSS CDN
- Font Awesome, AOS, Typed.js, SweetAlert2
- Supabase Edge Functions and PostgreSQL

## Local Development

Run the site locally with Python:

```bash
python -m http.server 8000
```

Then open `http://127.0.0.1:8000/` in your browser.

## GitHub Pages Deployment

This repository is set up so the development and published versions use the same static files.

1. Push the repository to GitHub.
2. Open **Settings > Pages** in GitHub.
3. Set **Build and deployment** to **GitHub Actions**.
4. Keep the workflow at [.github/workflows/deploy.yml](.github/workflows/deploy.yml).

Every push to `main` will publish the current site automatically.

## Secure Contact Form Setup

The contact form no longer writes directly to the `contacts` table from the browser. It sends messages to a Supabase Edge Function instead.

### 1. Supabase secrets

Add these secrets in your Supabase project:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `TURNSTILE_SECRET_KEY` if you enable Cloudflare Turnstile
- `ALLOWED_ORIGIN` if you want to restrict CORS to your GitHub Pages domain

### 2. Frontend config

Update these values in [assets/js/contact.js](assets/js/contact.js):

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `TURNSTILE_SITE_KEY`

### 3. Database schema

Run [supabase-setup.sql](supabase-setup.sql) in the Supabase SQL editor. RLS stays enabled and anonymous table inserts are not granted.

### 4. Edge Function

Deploy [supabase/functions/contact/index.ts](supabase/functions/contact/index.ts) with the configured secrets.

## Anti-Spam Protections

- Honeypot field
- Minimum submit delay
- Turnstile verification when configured

## Project Structure

```text
index.html
supabase-setup.sql
README.md
assets/
	css/
		style.css
	img/
		logo.svg
		logo-white.svg
	js/
		app.js
		contact.js
		translations.js
supabase/
	functions/
		contact/
			index.ts
			config.toml
```
