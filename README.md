# CAMPUSLY — Multi-Page College Event Management Portal

Campusly is a frontend-only college event management and campus engagement prototype built with plain HTML5, CSS3, Vanilla JavaScript and LocalStorage.

## Multi-page structure

```text
CAMPUSLY/
├── index.html              # Sign in / role selection
├── signup.html             # Attendee / organiser signup
├── home.html               # Home dashboard
├── events.html             # Event discovery + event cards
├── transport.html          # Bus / carpool experience
├── wallet.html             # Digital event wallet + QR passes
├── registrations.html      # My registrations
├── gallery.html            # Event photo gallery
├── scanner.html            # Organizer pass scanner
├── profile.html            # Student / organiser profile
├── create.html             # Organiser create-event flow
├── manage.html             # Organiser management dashboard
├── style.css               # Shared styling
├── script.js               # Shared Vanilla JS logic
├── auth.js                 # Authentication (Firebase or local mode)
├── firebase-config.js      # Paste your Firebase config here
├── SETUP-AUTH.md           # How to enable cloud accounts + Google sign-in
└── README.md
```

## Navigation

Every major page has its own HTML file and uses the same shared navbar. Navigation is handled with normal links between the HTML files rather than replacing all page content inside `index.html`.

## Current prototype

- HTML5
- CSS3
- Vanilla JavaScript
- LocalStorage
- Real authentication: email + password, Google sign-in and password reset (see SETUP-AUTH.md)
- Event search and filters
- Individual/team registration flow
- Digital wallet with QR pass previews
- Real QR passes + organizer scanner (camera via BarcodeDetector, or type the pass ID)
- One account, two modes: switch between Participant and Organizer from the profile menu
- Organizer attendance and certificate tools, notifications for real activity
- Gallery uploads and local demo actions
- Event streak / badges
- Profile dashboard
- Light / dark theme
- Animated background
- Compact radial quick navigation inspired by the provided reference video

## Run

Open `index.html` in a browser, create an account, then sign in. A local server such as VS Code Live Server is recommended for the smoothest demo.

## Prototype note

The project is intentionally frontend-only. Registrations, attendance and certificates are shared between accounts through localStorage, so they only work between accounts used in the same browser until a backend is added. Cloud storage of events and registrations, secure QR validation, cloud storage, notifications and production integrations are future scope.
