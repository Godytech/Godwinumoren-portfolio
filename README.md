<div align="center">
<img width="1200" height="475" alt="Portfolio Admin CMS" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Portfolio Admin CMS

This is a React portfolio and admin CMS backed by Firebase Authentication,
Cloud Firestore, and Cloud Storage.

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Copy the Firebase values from [.env.example](.env.example) into `.env.local`
3. Run the app locally:
   `npm run dev`

## Deploy to Vercel

Import the repository into Vercel. Vercel uses the Vite build configuration in
[vercel.json](vercel.json), which builds the app with `npm run build` and serves
the generated `dist` directory.

Add the `VITE_FIREBASE_*` values from [.env.example](.env.example) as Vercel
project environment variables for the Production, Preview, and Development
environments as needed.
