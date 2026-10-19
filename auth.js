/* =========================================================
   CAMPUSLY — AUTHENTICATION
   Two providers behind one API (window.CampuslyAuth):
     • firebase — cloud accounts (needs firebase-config.js)
     • local    — PBKDF2-hashed passwords kept in this browser only
   The rest of the app keeps reading `campuslyUser` / `campuslyRole`
   from localStorage; this file keeps them in sync with the session.
   ========================================================= */
(function () {
  const cfg = window.CAMPUSLY_FIREBASE;
  const useFirebase = !!(cfg && cfg.apiKey && cfg.projectId && !/YOUR_/i.test(cfg.apiKey));
  const mode = useFirebase ? "firebase" : "local";
  const FIREBASE_VERSION = "10.12.5";
  const PORTAL_PAGES = ["home", "events", "transport", "wallet", "gallery", "registrations", "certificates", "create", "manage", "scanner", "profile"];

  const store = {
    getUser() { try { return JSON.parse(localStorage.getItem("campuslyUser") || "null"); } catch (e) { return null; } },
    setUser(profile) {
      localStorage.setItem("campuslyUser", JSON.stringify(profile));
      localStorage.setItem("campuslyRole", profile.role || "attendee");
    },
    clear() {
      localStorage.removeItem("campuslyUser");
      localStorage.removeItem("campuslyRole");
    }
  };

  const clean = value => String(value || "").trim();
  const normEmail = value => clean(value).toLowerCase();
  const makeId = () => `CLY-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
  const joinedLabel = () => new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" });
  const fail = message => { const e = new Error(message); e.friendly = true; return e; };

  function validateSignup({ name, email, college, password, role }) {
    if (!clean(name) || !clean(college)) throw fail("Please fill in your name and college.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normEmail(email))) throw fail("Enter a valid email address.");
    if (!password || password.length < 8) throw fail("Password must be at least 8 characters.");
    if (!["attendee", "organiser"].includes(role)) throw fail("Choose a role.");
  }

  /* ------------------------- LOCAL PROVIDER ------------------------- */
  const local = (() => {
    const ACCOUNTS = "campuslyAccounts", SESSION = "campuslySession";
    const accounts = () => { try { return JSON.parse(localStorage.getItem(ACCOUNTS) || "{}"); } catch (e) { return {}; } };
    const save = data => localStorage.setItem(ACCOUNTS, JSON.stringify(data));
    const b64 = buf => btoa(String.fromCharCode(...new Uint8Array(buf)));
    const unb64 = str => Uint8Array.from(atob(str), c => c.charCodeAt(0));

    async function hash(password, saltB64) {
      if (!window.crypto || !crypto.subtle) throw fail("Secure sign-in needs https or localhost. Open the site from GitHub Pages or a local server.");
      const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
      const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: unb64(saltB64), iterations: 150000 }, key, 256);
      return b64(bits);
    }

    return {
      async ready() {
        const email = localStorage.getItem(SESSION);
        const account = email && accounts()[email];
        if (!account) { store.clear(); return null; }
        const cached = store.getUser();
        const profile = cached && cached.uid === email ? cached : { ...account.profile, uid: email };
        store.setUser(profile);
        return profile;
      },
      async signUp(input) {
        validateSignup(input);
        const email = normEmail(input.email), all = accounts();
        if (all[email]) throw fail("An account with this email already exists. Try signing in.");
        const salt = b64(crypto.getRandomValues(new Uint8Array(16)));
        const profile = { name: clean(input.name), email, college: clean(input.college), role: input.role, id: makeId(), joined: joinedLabel() };
        all[email] = { salt, hash: await hash(input.password, salt), profile };
        save(all);
        localStorage.setItem(SESSION, email);
        const session = { ...profile, uid: email };
        store.setUser(session);
        return session;
      },
      async signIn(emailRaw, password) {
        const email = normEmail(emailRaw), account = accounts()[email];
        const check = account ? await hash(password, account.salt) : null;
        if (!account || check !== account.hash) throw fail("Incorrect email or password.");
        localStorage.setItem(SESSION, email);
        const session = { ...account.profile, uid: email };
        store.setUser(session);
        return session;
      },
      async google() { throw fail("Google sign-in needs Firebase. Add your config in firebase-config.js (see SETUP-AUTH.md)."); },
      async reset() { throw fail("Password reset needs Firebase. In local mode, create a new account with another email."); },
      async signOut() { localStorage.removeItem(SESSION); store.clear(); },
      async syncProfile(profile) {
        const email = localStorage.getItem(SESSION), all = accounts();
        if (!email || !all[email]) return;
        const { uid, ...rest } = profile;
        all[email].profile = { ...all[email].profile, ...rest };
        save(all);
      }
    };
  })();

  /* ------------------------ FIREBASE PROVIDER ------------------------ */
  const remote = (() => {
    let auth, db, loading;

    function loadScript(src) {
      return new Promise((resolve, reject) => {
        const el = document.createElement("script");
        el.src = src; el.onload = resolve;
        el.onerror = () => reject(fail("Couldn't load Firebase. Check your internet connection."));
        document.head.appendChild(el);
      });
    }

    function init() {
      if (!loading) {
        const base = `https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/`;
        loading = loadScript(base + "firebase-app-compat.js")
          .then(() => Promise.all([loadScript(base + "firebase-auth-compat.js"), loadScript(base + "firebase-firestore-compat.js")]))
          .then(() => {
            if (!firebase.apps.length) firebase.initializeApp(cfg);
            auth = firebase.auth();
            db = firebase.firestore();
          });
      }
      return loading;
    }

    const toSession = (user, profile) => ({ ...profile, uid: user.uid, email: user.email || profile.email });

    async function loadProfile(user, defaults = {}) {
      const ref = db.collection("users").doc(user.uid);
      const snap = await ref.get();
      if (snap.exists) return toSession(user, snap.data());
      const profile = {
        name: defaults.name || user.displayName || (user.email || "").split("@")[0] || "Campusly Member",
        email: user.email || "",
        college: defaults.college || "",
        role: defaults.role || "attendee",
        id: makeId(),
        joined: joinedLabel()
      };
      await ref.set(profile);
      return toSession(user, profile);
    }

    function friendly(err) {
      const map = {
        "auth/email-already-in-use": "An account with this email already exists. Try signing in.",
        "auth/invalid-email": "Enter a valid email address.",
        "auth/weak-password": "Password must be at least 8 characters.",
        "auth/user-not-found": "Incorrect email or password.",
        "auth/wrong-password": "Incorrect email or password.",
        "auth/invalid-credential": "Incorrect email or password.",
        "auth/invalid-login-credentials": "Incorrect email or password.",
        "auth/too-many-requests": "Too many attempts. Wait a minute and try again.",
        "auth/network-request-failed": "Network error. Check your connection and try again.",
        "auth/popup-closed-by-user": "Google sign-in was cancelled.",
        "auth/cancelled-popup-request": "Google sign-in was cancelled.",
        "auth/popup-blocked": "Your browser blocked the Google sign-in popup. Allow popups and try again.",
        "auth/unauthorized-domain": "This domain isn't authorised in Firebase yet (Authentication → Settings → Authorized domains).",
        "auth/operation-not-allowed": "This sign-in method isn't enabled in Firebase yet.",
        "permission-denied": "Firestore rejected the request. Check the security rules in SETUP-AUTH.md."
      };
      return map[err && err.code] ? fail(map[err.code]) : err;
    }

    const wrap = fn => async (...args) => { try { await init(); return await fn(...args); } catch (err) { throw friendly(err); } };

    return {
      ready: () => init().then(() => new Promise(resolve => {
        let first = true;
        auth.onAuthStateChanged(async user => {
          if (first) {
            first = false;
            if (!user) { store.clear(); resolve(null); return; }
            try { const profile = await loadProfile(user); store.setUser(profile); resolve(profile); }
            catch (e) { store.clear(); resolve(null); }
          } else if (!user) {
            // signed out in another tab
            store.clear();
            if (!window.__campuslyLoggingOut && PORTAL_PAGES.includes(document.body.dataset.page)) window.location.href = "index.html";
          }
        });
      })).catch(() => { store.clear(); return null; }),
      signUp: wrap(async input => {
        validateSignup(input);
        const cred = await auth.createUserWithEmailAndPassword(normEmail(input.email), input.password);
        await cred.user.updateProfile({ displayName: clean(input.name) });
        const profile = { name: clean(input.name), email: normEmail(input.email), college: clean(input.college), role: input.role, id: makeId(), joined: joinedLabel() };
        await db.collection("users").doc(cred.user.uid).set(profile);
        cred.user.sendEmailVerification().catch(() => {});
        const session = toSession(cred.user, profile);
        store.setUser(session);
        return session;
      }),
      signIn: wrap(async (email, password) => {
        const cred = await auth.signInWithEmailAndPassword(normEmail(email), password);
        const session = await loadProfile(cred.user);
        store.setUser(session);
        return session;
      }),
      google: wrap(async defaults => {
        const cred = await auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
        const session = await loadProfile(cred.user, defaults || {});
        store.setUser(session);
        return session;
      }),
      reset: wrap(async email => {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normEmail(email))) throw fail("Enter your email address first.");
        await auth.sendPasswordResetEmail(normEmail(email));
      }),
      signOut: wrap(async () => { await auth.signOut(); store.clear(); }),
      syncProfile: wrap(async profile => {
        const user = auth.currentUser;
        if (!user) return;
        const { uid, role, ...rest } = profile;   // role is never changed after sign-up
        await db.collection("users").doc(user.uid).set(rest, { merge: true });
      })
    };
  })();

  const provider = useFirebase ? remote : local;
  const readyPromise = Promise.resolve().then(() => provider.ready());

  window.CampuslyAuth = {
    mode,
    ready: readyPromise,
    signUp: input => provider.signUp(input),
    signIn: (email, password) => provider.signIn(email, password),
    signInWithGoogle: defaults => (useFirebase ? remote.google(defaults) : local.google()),
    resetPassword: email => provider.reset(email),
    signOut: () => provider.signOut(),
    syncProfile: profile => Promise.resolve(provider.syncProfile(profile)).catch(() => {})
  };
})();
