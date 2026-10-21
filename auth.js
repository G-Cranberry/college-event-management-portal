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

  const academic = i => ({ rollNo: clean(i.rollNo), degree: clean(i.degree), year: clean(i.year) });

  function validateSignup({ name, email, college, rollNo, degree, year, password, role }) {
    if (!clean(name) || !clean(college)) throw fail("Please fill in your name and college.");
    if (!clean(rollNo)) throw fail("Enter your roll number.");
    if (!clean(degree)) throw fail("Enter your degree.");
    if (!/^[1-9]$/.test(clean(year))) throw fail("Select your year.");
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
        const profile = { name: clean(input.name), email, college: clean(input.college), ...academic(input), role: input.role, id: makeId(), joined: joinedLabel() };
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
        el.src = src;
        el.async = false;   // download in parallel, but execute in insertion order (app must run before auth/firestore)
        el.onload = resolve;
        el.onerror = () => reject(fail("Couldn't load Firebase. Check your internet connection."));
        document.head.appendChild(el);
      });
    }

    function init() {
      if (!loading) {
        const base = `https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/`;
        loading = Promise.all([
          loadScript(base + "firebase-app-compat.js"),
          loadScript(base + "firebase-auth-compat.js"),
          loadScript(base + "firebase-firestore-compat.js")
        ]).then(() => {
          if (!firebase.apps.length) firebase.initializeApp(cfg);
          auth = firebase.auth();
          db = firebase.firestore();
        });
      }
      return loading;
    }

    /* ---- Cloud sync ----
       The app keeps its working data in localStorage. Here every write to a synced key is
       mirrored to Firestore, and everything is pulled back down at sign-in, so data follows
       the account to any browser or device.
         userData/{uid}     → this user's registrations, details, certificates, attendance
         shared/{key}       → events, pass registry, gallery, rides, bus bookings (all users)
         notifs/{uid}       → notifications for a user (organisers write to attendees)  */
    const USER_BASES = ["campuslyRegistrations", "campuslyRegistrationDetails", "campuslyCertificates", "campuslyAttendanceStats", "campuslyAttendanceRecords"];
    const SHARED_KEYS = ["campuslyEvents", "campuslyPassRegistry", "campuslyGalleryItems", "campuslyRides", "campuslyBusBookings"];
    const DIRTY = key => `campuslyCloudDirty:${key}`;
    let cloudUid = null, cloudLive = false, cloudChanged = false;
    const earlyWrites = new Set();   // keys written locally while the cloud copy was still loading
    const rawSet = Storage.prototype.setItem, rawRemove = Storage.prototype.removeItem;

    function target(key) {
      if (SHARED_KEYS.includes(key)) return { ref: db.collection("shared").doc(key), field: "value" };
      let m = key.match(/^(campuslyRegistrations|campuslyRegistrationDetails|campuslyCertificates|campuslyAttendanceStats|campuslyAttendanceRecords):(.+)$/);
      if (m && m[2] === cloudUid) return { ref: db.collection("userData").doc(cloudUid), field: m[1] };
      m = key.match(/^campuslyNotifications:(.+)$/);
      if (m) return { ref: db.collection("notifs").doc(m[1]), field: "value" };
      return null;
    }

    function push(key) {
      const t = target(key);
      if (!t) return Promise.resolve();
      const value = localStorage.getItem(key);
      if (value === null) return Promise.resolve();
      return t.ref.set({ [t.field]: value, updatedAt: Date.now() }, { merge: true })
        .then(() => { if (localStorage.getItem(key) === value) rawRemove.call(localStorage, DIRTY(key)); })
        .catch(err => { console.warn("Campusly: could not save", key, err && err.code); });
    }

    function patchStorage() {
      if (Storage.prototype.setItem !== rawSet) return;
      Storage.prototype.setItem = function (key, value) {
        rawSet.call(this, key, value);
        if (this !== window.localStorage || typeof key !== "string") return;
        if (!cloudLive) { earlyWrites.add(key); return; }
        if (target(key)) {
          rawSet.call(this, DIRTY(key), "1");   // survives page changes until Firestore confirms
          push(key);
        }
      };
    }

    // Pull the account's data down. A key that is still marked dirty was written locally and
    // never confirmed, so that copy wins and gets re-sent instead of being overwritten.
    async function hydrate(uid) {
      cloudUid = uid;
      const get = ref => ref.get().then(s => (s.exists ? s.data() : null)).catch(() => null);
      const [userDoc, notifDoc, ...sharedDocs] = await Promise.all([
        get(db.collection("userData").doc(uid)),
        get(db.collection("notifs").doc(uid)),
        ...SHARED_KEYS.map(k => get(db.collection("shared").doc(k)))
      ]);
      const jobs = [];
      const apply = (key, doc, field) => {
        const remote = doc && typeof doc[field] === "string" ? doc[field] : null;
        const local = localStorage.getItem(key);
        if ((localStorage.getItem(DIRTY(key)) || earlyWrites.has(key)) && local !== null) jobs.push(["push", key]);
        else if (remote !== null) { if (remote !== local) cloudChanged = true; rawSet.call(localStorage, key, remote); }
        else if (local !== null) jobs.push(["push", key]);   // nothing in the cloud yet: upload what this browser has
      };
      USER_BASES.forEach(base => apply(`${base}:${uid}`, userDoc, base));
      apply(`campuslyNotifications:${uid}`, notifDoc, "value");
      SHARED_KEYS.forEach((k, i) => apply(k, sharedDocs[i], "value"));
      cloudLive = true;
      await Promise.all(jobs.map(([, key]) => push(key)));
    }

    patchStorage();

    const toSession = (user, profile) => ({ ...profile, uid: user.uid, email: user.email || profile.email });

    async function loadProfile(user, defaults = {}) {
      const ref = db.collection("users").doc(user.uid);
      const snap = await ref.get();
      if (snap.exists) return toSession(user, snap.data());
      const profile = {
        name: defaults.name || user.displayName || (user.email || "").split("@")[0] || "Campusly Member",
        email: user.email || "",
        college: defaults.college || "",
        rollNo: clean(defaults.rollNo),
        degree: clean(defaults.degree),
        year: clean(defaults.year),
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
        "auth/unauthorized-domain": `Firebase doesn't trust "${location.hostname || "this page"}" yet. In the Firebase console go to Authentication → Settings → Authorized domains, click Add domain, and enter exactly: ${location.hostname || "your site's domain"}`,
        "auth/operation-not-allowed": "This sign-in method isn't enabled in Firebase yet.",
        "auth/user-disabled": "This account has been disabled.",
        "auth/internal-error": "Something went wrong on the sign-in service. Try again.",
        "auth/invalid-api-key": "The Firebase API key in firebase-config.js is invalid.",
        "auth/configuration-not-found": "Authentication isn't set up in this Firebase project yet (Build → Authentication → Get started).",
        "unavailable": "Can't reach Firestore right now. Check your connection and try again.",
        "permission-denied": "Firestore rejected the request. Check the security rules in SETUP-AUTH.md."
      };
      return map[err && err.code] ? fail(map[err.code]) : err;
    }

    const wrap = fn => async (...args) => { try { await init(); return await fn(...args); } catch (err) { throw friendly(err); } };

    return {
      cloudChanged: () => { const c = cloudChanged; cloudChanged = false; return c; },
      ready: () => init().then(() => new Promise(resolve => {
        let first = true;
        auth.onAuthStateChanged(async user => {
          if (first) {
            first = false;
            if (!user) { store.clear(); resolve(null); return; }
            try {
              let profile;
              try { profile = await loadProfile(user); }
              catch (e) {
                // Profile read blocked (e.g. Firestore rules not published yet): keep the user signed in with what we know.
                console.warn("Campusly: could not load profile", e && e.code);
                const cached = store.getUser();
                profile = cached && cached.uid === user.uid ? cached : toSession(user, { name: user.displayName || (user.email || "").split("@")[0] || "Campusly Member", email: user.email || "", college: "", role: "attendee", id: makeId(), joined: joinedLabel() });
              }
              store.setUser(profile);
              try { await hydrate(user.uid); }
              catch (e) { console.warn("Campusly: cloud sync failed", e && (e.code || e.message)); }   // stay signed in; local data still works
              resolve(profile);
            }
            catch (e) { store.clear(); resolve(null); }
          } else if (!user) {
            // signed out in another tab
            store.clear();
            if (!window.__campuslyLoggingOut && PORTAL_PAGES.includes(document.body.dataset.page)) window.location.href = "index.html";
          }
        });
      })).catch(err => {
        // Firebase couldn't load (offline, blocked, bad config). Keep a previously signed-in user working from cache.
        console.warn("Campusly: Firebase unavailable", err && err.message);
        return store.getUser();
      }),
      signUp: wrap(async input => {
        validateSignup(input);
        const cred = await auth.createUserWithEmailAndPassword(normEmail(input.email), input.password);
        await cred.user.updateProfile({ displayName: clean(input.name) });
        const profile = { name: clean(input.name), email: normEmail(input.email), college: clean(input.college), ...academic(input), role: input.role, id: makeId(), joined: joinedLabel() };
        try { await db.collection("users").doc(cred.user.uid).set(profile); }
        catch (err) {
          // Undo the half-created account so the person can simply try again once the problem is fixed.
          await cred.user.delete().catch(() => {});
          await auth.signOut().catch(() => {});
          throw err;
        }
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
        // Google is for signing in only: the account must already exist with its full details.
        const snap = await db.collection("users").doc(cred.user.uid).get();
        if (!snap.exists) {
          await cred.user.delete().catch(() => {});
          await auth.signOut().catch(() => {});
          throw fail("No Campusly account found for this Google account. Please sign up with your details first.");
        }
        const session = toSession(cred.user, snap.data());
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
    syncProfile: profile => Promise.resolve(provider.syncProfile(profile)).catch(() => {}),
    cloudChanged: () => (provider.cloudChanged ? provider.cloudChanged() : false)
  };
})();
