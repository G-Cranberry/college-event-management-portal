# Campusly — Authentication setup

Campusly now has real sign-in (email + password, Google, password reset).
It works in two modes:

| Mode | When | What you get |
|------|------|--------------|
| **Local** | `firebase-config.js` is `null` (default) | Real password sign-in. Passwords are salted + hashed (PBKDF2). Accounts live **only in the browser** that created them. No Google sign-in / password reset. |
| **Firebase** | You paste your Firebase config | Cloud accounts that work on any device, Google sign-in, password reset emails, email verification. |

Nothing breaks if you skip Firebase — the site just runs in local mode.

## Turn on Firebase (about 10 minutes, free)

1. Go to <https://console.firebase.google.com> → **Add project** (Analytics not needed).
2. **Build → Authentication → Get started**. Under *Sign-in method*, enable **Email/Password** and **Google**.
3. In Authentication → **Settings → Authorized domains**, add `g-cranberry.github.io`
   (`localhost` is already there for testing).
4. **Build → Firestore Database → Create database** (start in production mode), then open the **Rules** tab and paste the contents of `firestore.rules` (in this project) and **Publish**.
   **This step is what makes data save.** Without these rules Firestore rejects every write and registrations/events only live in one browser.

5. **Project settings (gear) → Your apps → Web (`</>`)** → register an app → copy the `firebaseConfig` values.
6. Open `firebase-config.js`, replace `window.CAMPUSLY_FIREBASE = null;` with:

   ```js
   window.CAMPUSLY_FIREBASE = {
     apiKey: "…",
     authDomain: "…firebaseapp.com",
     projectId: "…",
     appId: "…"
   };
   ```
7. Commit and push. The Firebase web config is safe to be public — the security rules above are what protect the data.

## Good to know

- **Organiser accounts are self-selected** at sign-up. For a real deployment, you'd approve organisers manually (e.g. create them with a `pending` role and have an admin flip it).
- Events, registrations, passes, certificates, attendance, gallery, rides, bus bookings and notifications are saved to Firestore (and cached in localStorage), so they follow the account to any device. Shared collections (`shared`, `notifs`) are writable by any signed-in user so organisers and participants can see each other's activity; tighten these rules before a real launch.
- Sign-up collects Roll No, Degree and Year, stored in the user's profile.
- Email is the sign-in identity, so it's read-only in *Edit profile*.
- Test locally with a server (VS Code Live Server or `python3 -m http.server`) — secure password hashing and Google sign-in need `https` or `localhost`, not `file://`.
