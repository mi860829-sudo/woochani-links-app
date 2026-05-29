import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const envKeys = {
  apiKey: "FIREBASE_API_KEY",
  authDomain: "FIREBASE_AUTH_DOMAIN",
  projectId: "FIREBASE_PROJECT_ID",
  storageBucket: "FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "FIREBASE_MESSAGING_SENDER_ID",
  appId: "FIREBASE_APP_ID",
};

const config = {};
const missing = [];

for (const [field, envName] of Object.entries(envKeys)) {
  const value = process.env[envName];
  if (!value || !String(value).trim()) {
    missing.push(envName);
  } else {
    config[field] = String(value).trim();
  }
}

if (missing.length > 0) {
  console.error(
    "Missing Firebase environment variables for Vercel build:\n" +
      missing.map((name) => `  - ${name}`).join("\n") +
      "\n\nAdd them in Vercel: Project → Settings → Environment Variables, then redeploy."
  );
  process.exit(1);
}

const output = `// Generated at build time from Vercel environment variables.\nwindow.FIREBASE_CONFIG = ${JSON.stringify(config, null, 2)};\n`;

writeFileSync(resolve("firebase-config.js"), output, "utf8");
console.log("Wrote firebase-config.js for deployment.");
