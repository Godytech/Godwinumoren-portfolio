/**
 * One-time seed script to push the initial hardcoded portfolio data to Firestore.
 * Run with: npx tsx scripts/seed.ts
 */
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import * as dotenv from "dotenv";
import { initialPortfolioData } from "../src/data/initialData";

dotenv.config();

const apiKey = process.env.VITE_FIREBASE_API_KEY;
const projectId = process.env.VITE_FIREBASE_PROJECT_ID;

if (!apiKey || !projectId) {
  console.error("Error: VITE_FIREBASE_API_KEY and VITE_FIREBASE_PROJECT_ID must be set in your environment.");
  process.exit(1);
}

const app = initializeApp({
  apiKey,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
});

const db = getFirestore(app);

async function seed() {
  console.log("Starting Firestore migration seed...");

  try {
    // 1. Seed Single Content Docs
    console.log("Seeding /content/hero...");
    await setDoc(doc(db, "content", "hero"), initialPortfolioData.hero);

    console.log("Seeding /content/about...");
    await setDoc(doc(db, "content", "about"), initialPortfolioData.about);

    console.log("Seeding /content/contact...");
    await setDoc(doc(db, "content", "contact"), initialPortfolioData.contact);

    console.log("Seeding /content/footer...");
    await setDoc(doc(db, "content", "footer"), initialPortfolioData.footer);

    // 2. Seed Projects Collection
    console.log("Seeding projects...");
    for (const project of initialPortfolioData.projects) {
      await setDoc(doc(db, "projects", project.id), project);
    }

    // 3. Seed Services Collection
    console.log("Seeding services...");
    for (const service of initialPortfolioData.services) {
      await setDoc(doc(db, "services", service.id), service);
    }

    // 4. Seed Career Timeline
    console.log("Seeding career...");
    for (const event of initialPortfolioData.career) {
      await setDoc(doc(db, "career", event.id), event);
    }

    // 5. Seed Education
    console.log("Seeding education...");
    for (const edu of initialPortfolioData.education) {
      await setDoc(doc(db, "education", edu.id), edu);
    }

    // 6. Seed Skills
    console.log("Seeding skills...");
    for (const skill of initialPortfolioData.skills) {
      await setDoc(doc(db, "skills", skill.id), skill);
    }

    // 7. Seed Testimonials
    console.log("Seeding testimonials...");
    for (const testimonial of initialPortfolioData.testimonials) {
      await setDoc(doc(db, "testimonials", testimonial.id), testimonial);
    }

    console.log("✅ Successfully seeded all portfolio collections to Firestore!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
