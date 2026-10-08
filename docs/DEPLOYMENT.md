# Deployment

The site needs no environment variables, keys or services. Node 20 or newer builds and serves it.

## Vercel

1. Import the repository in Vercel.
2. Keep the defaults (framework: Next.js). There is nothing to configure.
3. Deploy.

Security headers are applied by Next.js from `next.config.ts`, so they work on Vercel with no extra setup.

## Any Node host

```bash
npm ci
npm run build
npm start        # serves on port 3000; set PORT to change it
```

Put it behind HTTPS. If you use a reverse proxy or CDN, make sure it passes the response headers through unchanged, in particular `Content-Security-Policy` and `Referrer-Policy`.

## Container

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Before going live

- **Choose a host with minimal logging** and tell your own users what it records. The site itself stores nothing, but a host usually logs IP addresses.
- **Use your own domain** with HTTPS only.
- **Review the content for your audience.** Every legal item shows when it was last checked.
- **Branding.** The name and wordmark are in `components/nav.tsx`, `components/footer.tsx` and `app/layout.tsx`. Colours are CSS variables in `app/globals.css`. Images and their records are in `public/`.
- **Add your country** if it is missing: [ADDING-A-COUNTRY.md](ADDING-A-COUNTRY.md).

## Static export

The site is statically generated, but it is configured to run on a Next.js server because the security headers are set there. If you export it to plain static files, you must set the same headers on your host.
