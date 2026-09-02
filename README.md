# Ganavi — Professional Portfolio

A responsive recruiter-facing portfolio built with **Next.js, React and modern CSS**.

## Features

- Responsive mobile/desktop layout
- Dark/light mode
- Hero, About, Skills, Projects, Resume and Contact sections
- SEO metadata
- Sitemap and robots configuration
- Accessible navigation and form labels
- Project showcase with GitHub links
- Contact form that prepares an email through the visitor's default mail app
- Ready for Vercel or another Next.js deployment

## Tech stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Lucide React

## Run locally

```bash
git clone <your-repository-url>
cd ganavi-portfolio
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build for production

```bash
npm run build
npm start
```

## Personalize before deployment

Update:

- `lib/data.ts` — project links and social links
- `components/Portfolio.tsx` — portfolio copy
- `app/layout.tsx` — metadata and site URL
- `public/resume.pdf` — replace with your latest real resume
- `socials.linkedin` — replace the placeholder LinkedIn URL with your profile

## Deploy

### Vercel

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Keep the default Next.js build settings.
4. Deploy.
5. Add a custom domain later if desired.

## Important

The contact form uses `mailto:` so it works without storing visitor data. For true server-side email notifications, connect the form to an email provider/API and keep credentials in environment variables.

## Suggested GitHub repository name

`ganavi-portfolio`
