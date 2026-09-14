import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import {
  initializeFirestore,
  type Firestore,
  doc,
  collection,
  getDocs,
  getDocFromServer,
  writeBatch,
} from "firebase/firestore";

// Read environment variables
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const messagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
const appId = import.meta.env.VITE_FIREBASE_APP_ID;

export const isFirebaseConfigured = Boolean(apiKey && projectId);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (isFirebaseConfigured) {
  try {
    const firebaseConfig = {
      apiKey,
      authDomain,
      projectId,
      messagingSenderId,
      appId,
    };

    app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = initializeFirestore(app, {
      experimentalForceLongPolling: true,
    });

    // Initial connection validation
    getDocFromServer(doc(db, "test", "connection")).catch((err) => {
      if (err instanceof Error && err.message.includes("the client is offline")) {
        console.warn("Firebase client is currently offline or unreachable.");
      }
    });
  } catch (error) {
    console.error("Failed to initialize Firebase:", error);
  }
}

export { app, auth, db };

type PortfolioSource = {
  hero?: object;
  about?: object;
  contact?: object;
  services?: Array<object & { id: string }>;
  projects?: Array<object & { id: string }>;
  career?: Array<object & { id: string }>;
  education?: Array<object & { id: string }>;
  skills?: Array<object & { id: string }>;
  testimonials?: Array<object & { id: string }>;
};

export async function savePortfolioSource(source: PortfolioSource): Promise<void> {
  if (!db) {
    throw new Error("Firebase Firestore is not configured.");
  }

  const batch = writeBatch(db);
  const documents = [
    ["content", "hero", source.hero],
    ["content", "about", source.about],
    ["content", "contact", source.contact],
  ] as const;

  documents.forEach(([collectionName, id, value]) => {
    if (value) {
      batch.set(doc(db, collectionName, id), value, { merge: true });
    }
  });

  const collections = [
    ["services", source.services],
    ["projects", source.projects],
    ["career", source.career],
    ["education", source.education],
    ["skills", source.skills],
    ["testimonials", source.testimonials],
  ] as const;

  collections.forEach(([collectionName, items]) => {
    items?.forEach((item) => {
      batch.set(doc(db, collectionName, item.id), item, { merge: true });
    });
  });

  const existingCollections = await Promise.all(
    collections.map(async ([collectionName]) => [
      collectionName,
      await getDocs(collection(db, collectionName)),
    ] as const)
  );
  existingCollections.forEach(([collectionName, snapshot]) => {
    const incomingIds = new Set(
      (source[collectionName as keyof PortfolioSource] as Array<{ id: string }> | undefined)
        ?.map((item) => item.id) ?? []
    );
    snapshot.forEach((item) => {
      if (!incomingIds.has(item.id)) {
        batch.delete(item.ref);
      }
    });
  });

  await batch.commit();
}

async function imageToFirestoreUrl(file: Blob): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("The selected file is not an image.");
  }

  if (!("createImageBitmap" in window)) {
    if (file.size > 700 * 1024) {
      throw new Error("This browser cannot compress the image. Select an image smaller than 700 KB.");
    }
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("Could not read the selected image."));
      reader.readAsDataURL(file);
    });
  }

  const image = await createImageBitmap(file);
  const maxDimension = 1000;
  const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));
  const context = canvas.getContext("2d");

  if (!context) {
    image.close();
    throw new Error("Could not prepare the image for Firestore.");
  }

  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  image.close();
  const optimized = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", 0.75)
  );

  if (!optimized || optimized.size > 700 * 1024) {
    throw new Error("Image is too large to store in Firestore. Choose a smaller image.");
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read the optimized image."));
    reader.readAsDataURL(optimized);
  });
}

export async function uploadProfileImage(file: Blob): Promise<string> {
  if (!db || !auth?.currentUser) {
    throw new Error("Firebase Firestore requires a signed-in account.");
  }

  if (!auth.currentUser.emailVerified) {
    throw new Error("Please verify your admin email before uploading an image.");
  }

  return imageToFirestoreUrl(file);
}

export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
      isAnonymous: auth?.currentUser?.isAnonymous,
    },
    operationType,
    path,
  };
  console.error("Firestore Error:", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
