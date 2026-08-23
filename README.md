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
├── scanner.html            # Organiser pass validation demo
├── profile.html            # Student / organiser profile
├── create.html             # Organiser create-event flow
├── manage.html             # Organiser management dashboard
├── style.css               # Shared styling
├── script.js               # Shared Vanilla JS logic
└── README.md
```

## Navigation

Every major page has its own HTML file and uses the same shared navbar. Navigation is handled with normal links between the HTML files rather than replacing all page content inside `index.html`.

## Current prototype

- HTML5
- CSS3
- Vanilla JavaScript
- LocalStorage
- Demo authentication / role selection
- Event search and filters
- Individual/team registration flow
- Digital wallet with QR pass previews
- Organizer pass validation demo
- Gallery uploads and local demo actions
- Event streak / badges
- Profile dashboard
- Light / dark theme
- Animated background
- Compact radial quick navigation inspired by the provided reference video

## Run

Open `index.html` in a browser. A local server such as VS Code Live Server is recommended for the smoothest demo.

## Prototype note

The project is intentionally frontend-only. Real authentication, backend databases, secure QR validation, cloud storage, notifications and production integrations are future scope.
