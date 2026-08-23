
# CAMPUSLY — College Event Management & Campus Engagement Portal

## 1. Project Overview

**Campusly** is a modern, student-first college event management and campus engagement portal that brings the complete campus-event journey into one connected platform.

Instead of making students search through posters, forms, messaging groups, social media announcements and separate certificate records, Campusly provides one central digital experience for:

* discovering campus events
* viewing event details
* registering individually or as a team
* receiving digital event passes
* accessing QR-based event passes
* tracking attendance and participation
* finding college transport and carpools
* managing registrations
* maintaining a digital event wallet
* viewing certificates
* uploading and managing event memories in a gallery
* tracking event streaks and achievements
* viewing profile activity and campus statistics
* helping organisers manage events, participants and attendance

The goal is simple:

> **One campus. Every experience.**

---

## 2. Problem Statement

College events are often managed across disconnected tools such as:

* registration forms
* messaging groups
* social media announcements
* spreadsheets
* physical attendance
* separate certificate distribution
* event posters and notices

This creates friction for students and additional manual work for organisers.

Students may miss events, forget registrations, struggle with transportation, lose track of their participation history, or have difficulty keeping their event passes and certificates together.

Organisers need a cleaner way to publish events, manage participants, handle registrations and track attendance.

---

## 3. Campusly Solution

Campusly connects the event lifecycle into one digital platform:

**Discover → View → Register → Get Pass → Travel → Check In → Participate → Track → Collect Certificate → Remember**

This creates a more organised experience for both students and organisers.

### For Attendees

Students can:

* browse upcoming campus events
* search events by name
* filter events by category
* view complete event details
* register individually or as a team
* fill event-specific registration forms
* receive a digital event pass
* access a QR code for their pass
* view active passes inside the wallet
* track event registrations
* find college transport
* find carpool options
* track event attendance
* view certificates
* upload event memories to the gallery
* download gallery photos
* track event streaks and badges
* maintain a detailed campus profile

### For Organisers

Organisers can:

* create and publish events
* define event registration requirements
* define individual or team registration
* define team-size limits
* review participant registrations
* manage event information
* use the organiser scanner flow
* validate demo event pass IDs
* mark participant attendance
* track event participation
* manage event records

---

# 4. Main Features

## 4.1 Event Discovery

Campusly provides an interactive event discovery experience.

Events can include categories such as:

* Technical
* Cultural
* Sports
* Academic
* Art
* Music
* Workshops
* Competitions
* Design
* Photography
* Gaming
* Social / Community

Each event can communicate:

* event category
* title
* date
* time
* venue
* organiser
* description
* capacity
* registration count
* seats remaining
* registration state

Users can search and filter events using the Events page.

---

## 4.2 Interactive Event Cards

Event cards are designed as interactive UI components instead of static listings.

Users can:

* hover over event cards
* open event details
* register for events
* cancel registrations
* view registration states
* browse event cards using interactive movement
* use event navigation controls
* access event details through a modal

The interface is intentionally designed to feel like a modern campus product rather than a traditional administration portal.

---

## 4.3 Individual and Team Registration

Campusly supports two registration modes.

### Individual Registration

The attendee can provide information such as:

* full name
* email
* college
* department
* phone number
* event-specific information

### Team Registration

For team-based events, the attendee can provide:

* full name
* email
* college
* department
* team name
* team size
* team members

Organisers can define whether an event supports individual registration or team registration.

Team-size limits can also be defined for eligible events.

### Registration Flow

The registration process follows:

**Open Event → Register → Fill Registration Form → Submit → Registration Confirmed → Pass Generated**

A user is **not** marked as registered simply by pressing the Register button.

The pass is generated only after the registration form has been completed successfully.

---

# 5. Digital Event Wallet

The Campusly wallet is designed as a compact digital event-pass wallet rather than a traditional dashboard.

The wallet contains:

* active event passes
* QR-enabled event passes
* attendee information
* event information
* registration status
* pass ID
* Campusly ID

Each registered event generates its own digital pass.

### Wallet Interaction

The wallet uses a stacked-card interaction:

* passes remain visibly stacked inside the wallet
* the front flap remains visible
* the top of the next passes can be seen
* hovering over the wallet reveals the pass stack
* the user can move through the stack
* a selected pass can move to the front
* clicking a selected pass opens the complete pass
* the full pass can then be used for QR preview and event access

The interaction is designed using CSS and simple Vanilla JavaScript.

---

# 6. QR Pass Preview

Each digital event pass contains a QR section.

The wallet provides a:

**View QR**

interaction.

When clicked:

* a QR preview opens in a popup/modal
* event information is shown
* participant information is shown
* pass ID is displayed
* Campusly ID is displayed
* a generated demo QR pattern is displayed

The QR is designed to visually resemble a realistic event-access QR for demonstration purposes.

The current prototype does not depend on an external QR backend.

---

# 7. Organizer Scanner

Campusly also includes an organiser-side scanner/validation flow.

The organiser can use a pass ID to simulate QR/pass validation.

Example flow:

**Scan / Enter Pass ID → Find Pass → Match Campusly ID → Validate → Mark Attendance**

The prototype can validate demo pass information locally.

A successful validation can update the user's attendance state.

For a production deployment, this layer would be connected to a secure QR validation API and event database.

---

# 8. Event Progress Tracking

Campusly can represent the complete event journey:

**Registration → Check In → Round 1 → Round 2 → Final Round → Certificate**

For multi-round or multi-day events, a participant can track progress through the event lifecycle.

This turns Campusly from a simple event-registration interface into a participation-tracking platform.

---

# 9. Transport & Carpool

Campusly treats transportation as part of the event experience.

Users can view:

* college bus routes
* departure times
* route names
* available seats
* starting points
* event-linked transport
* carpool options

Example:

**North Gate → Main Campus**

Users can reserve demo transport seats.

The prototype provides browser-based interactions without requiring an external transport backend.

---

# 10. Campus Wallet & Certificates

The wallet focuses on **active event passes**.

Certificates are kept separate so that the wallet remains focused on current event access.

The certificate area can contain:

* certificate title
* participation type
* event date
* certificate preview
* digital certificate information

This separation keeps the wallet cleaner and easier to use.

---

# 11. Gallery

Campusly includes a dedicated **Gallery** feature for event memories.

Users can:

* upload photos
* view uploaded images
* download images
* access demo LinkedIn sharing actions
* access demo Instagram sharing actions

The gallery uses local browser storage for the current prototype.

### Gallery Flow

**Upload Photo → Store Locally → Display Image → Download / Share**

Actual social-media publishing would require external platform APIs and authentication in a production version.

---

# 12. Gamification

Campusly adds a lightweight gamification layer to make participation more engaging.

The dashboard can show:

### Events Attended

The total number of attended events.

### Current Streak

The current participation streak.

Example:

**12 Events Attended**

**5 Events Current Streak**

---

# 13. Event Level Badges

Users receive achievement levels based on attendance and participation.

Available levels include:

### Bronze Explorer

Entry-level campus participation badge.

### Silver Explorer

Higher participation milestone.

### Gold Explorer

Strong participation across multiple campus events.

### Campus Legend

High-level participation achievement.

These badges create a simple gamification layer without requiring a complex backend.

---

# 14. Profile

Campusly includes a detailed student profile page.

The profile can show:

* profile name
* email
* college
* department
* year
* Campusly ID
* member-since information
* role
* bio
* interests
* active passes
* registrations
* events attended
* current streak
* certificates
* gallery posts
* profile completion
* achievement level
* recent activity

The profile also includes quick access areas for:

* Events
* Registrations
* Gallery
* Wallet

Users can edit profile information through the demo edit flow.

---

# 15. Sign Up & Login Flow

Campusly provides a simple browser-based account-entry experience.

Users can select:

* **Attendee**
* **Organiser**

The signup flow can then collect information such as:

* name
* email
* college
* role

A simple Google-style signup option can also be presented as a demo interface.

The current prototype does not implement real Google OAuth.

### Demo Signup Flow

**Select Role → Sign Up → Enter Details → Create Account → Enter Portal**

For a production version, authentication would be connected to a secure identity provider.

---

# 16. Profile & Role Management

Campusly supports two main roles:

### Attendee

Attendees can access:

* Home
* Events
* Transport
* Wallet
* Registrations
* Gallery
* Profile

### Organiser

Organisers can access:

* Home
* Events
* Transport
* Create Event
* Manage
* Scanner
* Gallery
* Profile

Role-based navigation is handled in the browser for the prototype.

---

# 17. Navbar & Navigation

The navigation system includes:

* Home
* Events
* Transport
* Wallet
* My Registrations
* Create Event
* Manage
* Gallery
* Profile

The navbar provides:

* active-page highlighting
* profile menu
* notifications
* theme toggle
* smooth navigation
* responsive behaviour

---

# 18. Light & Dark Theme

Campusly supports:

* Light mode
* Dark mode

Theme styling is designed to maintain readability across the complete interface.

The project includes contrast handling for:

* text
* buttons
* cards
* inputs
* forms
* modals
* profile sections
* wallet
* event pages
* transport components
* tables
* filters
* dropdowns

The goal is to avoid light-on-light and dark-on-dark combinations that make content difficult to read.

---

# 19. Animated & Interactive Background

The visual language uses subtle motion to make the interface feel more alive.

The prototype can include:

* animated ambient shapes
* soft moving gradients
* floating elements
* subtle parallax effects
* hero motion
* animated section entrance
* interactive hover states

These animations are intentionally lightweight and remain compatible with the Vanilla JS architecture.

---

# 20. Loading Screen

Campusly includes a branded loading screen for the portal experience.

The loading state can contain:

* Campusly branding
* animated progress/loader
* subtle movement
* portal transition

The loading experience is intentionally lightweight and requires no external framework.

---

# 21. Notifications & Toasts

The prototype includes toast-style feedback for actions such as:

* registration confirmation
* registration cancellation
* transport reservation
* profile actions
* event actions
* successful pass validation
* gallery actions
* demo sharing actions

This provides immediate visual feedback without requiring a backend notification system.

---

# 22. Technology

Current prototype technology:

* **HTML5**
* **CSS3**
* **Vanilla JavaScript**
* **LocalStorage**
* Browser-based UI state
* Local/demo interaction patterns

The project deliberately avoids:

* React
* TypeScript
* large JavaScript frameworks
* unnecessary libraries
* complex frontend architecture

This keeps the prototype easy to:

* understand
* present
* modify
* deploy

---

# 23. Data Storage

For the current prototype, demo data can be stored through browser `localStorage`.

This allows the application to demonstrate:

* registrations
* events
* user information
* certificates
* gallery data
* pass states
* attendance states
* theme preferences

No external database is required for the demo.

---

# 24. Production Architecture

For a real deployment, Campusly can connect to:

* authentication service
* college student database / ERP
* event database
* registration API
* QR validation service
* notification service
* certificate generation service
* transport/carpool service
* image storage
* social sharing integrations

Possible architecture:

```text
Frontend
   ↓
API Layer
   ↓
Database
   ↓
Authentication / Events / Registrations
   ↓
QR / Attendance / Certificates / Gallery
```

---

# 25. Future Scope

## Smart Recommendations

Recommend events based on:

* interests
* previous participation
* departments
* skills
* clubs
* event categories

## Notifications

Send reminders for:

* registration deadlines
* event start times
* transport departure
* round updates
* certificate availability

## Analytics

Organisers could view:

* registration count
* attendance rate
* category popularity
* registration-to-attendance conversion
* team participation
* transport demand
* participation trends

## Campus Integration

Campusly could integrate with:

* college ERP
* student ID systems
* club management
* attendance systems
* digital certificate verification

## Advanced Wallet

Future versions can support:

* verified QR credentials
* pass history
* event attendance records
* digital ID integration
* secure wallet syncing across devices

## Real Social Sharing

Gallery sharing can later integrate with official platform APIs for:

* Instagram
* LinkedIn
* other supported networks

---

# 26. Impact

## Student Impact

* less searching
* easier registration
* better event discovery
* fewer missed events
* easier transportation
* centralised event passes
* easier certificate access
* visible participation history
* stronger campus engagement
* gamified participation

## Organiser Impact

* less manual data collection
* cleaner participant records
* faster check-in
* better event visibility
* easier certificate management
* useful participation analytics

## Institution Impact

Campusly can become a shared digital event layer across:

* departments
* clubs
* societies
* student communities
* college festivals
* campus activities

---

# 27. Why Campusly Is Different

Traditional event portals often stop at:

**Event → Registration**

Campusly aims to cover:

**Event → Registration → Pass → QR → Transport → Check-In → Participation → Certificate → History → Community**

Its main differentiators include:

1. Digital event wallet
2. QR-based event pass
3. Individual + team registration
4. Transport + carpool integration
5. Event progress tracking
6. Gallery and event memories
7. Gamified participation
8. Detailed student profile
9. Attendance and achievement history
10. Organiser-side pass validation

---

# 28. Project Structure

```text
CAMPUSLY/
├── index.html
├── style.css
├── script.js
└── README.md
```

---

# 29. How to Run

## Using VS Code

1. Open the project folder in VS Code.
2. Open `index.html`.
3. Run the project using Live Server for the smoothest experience.
4. Open the application in a browser.

## Direct Browser

The prototype can also be opened directly through `index.html`.

A local server is recommended for a smoother demo experience.

---

# 30. Demo Flow

For a presentation or project demonstration, the recommended sequence is:

1. Open Campusly.
2. Select Attendee or Organiser.
3. Complete the demo signup flow.
4. Enter the portal.
5. Browse the Home page.
6. Open the Events page.
7. Search or filter events.
8. Open an event.
9. Choose Individual or Team registration.
10. Fill and submit the registration form.
11. Show the registration confirmation.
12. Open Wallet.
13. Show the stacked event passes.
14. Select a pass.
15. Open the complete pass.
16. Show the QR preview.
17. Open Transport.
18. Show available routes/carpools.
19. Open Gallery.
20. Upload an event photo.
21. Show download/share actions.
22. Open Profile.
23. Show event streak and achievement badge.
24. Open Scanner as organiser.
25. Validate a demo pass ID.
26. Mark attendance.
27. Show updated event participation.
28. Open certificates.
29. Switch Light/Dark theme.
30. Return to Home.

This creates a complete product story instead of showing isolated static pages.

---

# 31. Prototype vs Production

This repository is a **frontend prototype/demo**.

The prototype intentionally simulates many interactions in the browser so that the complete product journey can be demonstrated without requiring a deployed backend.

For production deployment, the following would need secure backend services:

* real authentication
* Google OAuth
* persistent event database
* persistent registrations
* secure QR validation
* real attendance storage
* cloud image storage
* certificate verification
* real social sharing
* notification services
* institutional integrations

---

# 32. Design Philosophy

Campusly follows a clean, modern, student-focused visual language.

The interface combines:

* modern typography
* soft card layouts
* responsive design
* subtle animation
* interactive controls
* digital pass experiences
* campus-oriented visuals
* light and dark themes

The goal is to make a college event platform feel closer to a modern consumer product than a traditional college administration website.

---

# 33. Closing Statement

Campus life should not feel fragmented.

Events, people, transportation, registrations, participation, memories and achievements already belong to the same student journey.

**Campusly brings them together in one place.**

> **One campus. Every experience.**

---

# Created By

**Shilpa**
**Yuvi**
**Nandita**
