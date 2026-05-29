# Vercel Environment Variables (exact steps)

Production URL: https://woochani-links-app.vercel.app  
Allowed Google account: **mi860829@gmail.com** only (enforced in `auth.js`)

## Where to add values

1. Open https://vercel.com/dashboard
2. Click project **woochani-links-app**
3. **Settings** → **Environment Variables**
4. For each row below, click **Add New**:
   - **Key** = name in the left column
   - **Value** = matching field from Firebase `firebaseConfig`
   - **Environments** = check **Production** (and **Preview** if you use preview URLs)
5. Click **Save**
6. Go to **Deployments** → latest deployment → **⋯** → **Redeploy**

## Copy this mapping

| Vercel Key (paste exactly) | Firebase `firebaseConfig` field |
|----------------------------|----------------------------------|
| `FIREBASE_API_KEY` | `apiKey` |
| `FIREBASE_AUTH_DOMAIN` | `authDomain` |
| `FIREBASE_PROJECT_ID` | `projectId` |
| `FIREBASE_STORAGE_BUCKET` | `storageBucket` |
| `FIREBASE_MESSAGING_SENDER_ID` | `messagingSenderId` |
| `FIREBASE_APP_ID` | `appId` |

Example: if Firebase shows `"apiKey": "AIzaSyAbc..."`, create variable `FIREBASE_API_KEY` with value `AIzaSyAbc...`.

## Do not put config in Git

- Do **not** commit real keys to `firebase-config.js` (it is gitignored).
- Vercel runs `npm run build`, which generates `firebase-config.js` during deploy.

## Firebase (required once)

**Authentication → Settings → Authorized domains** → add:

```
woochani-links-app.vercel.app
```

**Authentication → Sign-in method → Google** → Enabled.

## Verify after redeploy

These URLs must return **200** (not 404):

- https://woochani-links-app.vercel.app/auth.js
- https://woochani-links-app.vercel.app/firebase-config.js

Sign in with **mi860829@gmail.com** → home visible. Any other Google account → blocked message.
