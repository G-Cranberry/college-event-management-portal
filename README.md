# CAMPUSLY — College Event Management Portal

## 1. Project Overview

**Campusly** is a student-first college event management portal that brings the complete campus-event journey into one place.

Instead of making students search through posters, forms, chats and separate certificate records, Campusly provides one connected experience for:

- discovering events
- registering individually or as a team
- receiving event passes
- checking in with QR codes
- tracking attendance/progress
- finding college transport and carpools
- storing participation records and certificates
- helping organisers manage participants and event operations

The goal is simple:

> **One place. Every event.**

---

## 2. Problem

College events are often managed across disconnected tools:

- registration forms
- messaging groups
- social media announcements
- spreadsheets
- physical attendance
- separate certificate distribution

This creates friction for students and additional manual work for organisers.

Students may miss events, forget registrations, struggle with transportation, or lose track of their participation history.

Organisers need a cleaner way to publish events, manage participants and handle attendance.

---

## 3. Campusly Solution

Campusly connects the event lifecycle into one digital platform:

**Discover → Register → Get Pass → Travel → Check In → Participate → Track → Collect Certificate**

This makes the experience more organised for both sides.

### For attendees

- Explore many event categories.
- View event details before registering.
- Register as an individual or team.
- Receive a digital event pass.
- View QR access for entry.
- Track attendance and event progress.
- Find transport and carpool options.
- Keep participation records in a digital wallet.

### For organisers

- Publish and manage events.
- Define registration requirements.
- Collect participant/team information.
- Review registrations.
- Check participants in through QR-based flows.
- Track attendance states.
- Manage certificates and participation records.

---

## 4. Key Product Features

### Event Discovery

Events can cover:

- Technical
- Cultural
- Sports
- Academic
- Workshops
- Competitions
- Dance
- Music
- Cooking
- Design
- Photography
- Entrepreneurship
- Gaming
- Social/community activities

Each listing can communicate the event category, date, time, venue, description, capacity and registration state.

### Individual / Team Registration

The registration experience supports two modes:

**Individual**
- Participant name
- Email
- Student details
- Event-specific information

**Team**
- Team name
- Leader information
- Additional member fields
- Live team-size indication

The important product idea is that the organiser can decide what information is required for a particular event.

### Digital Event Pass

After registration, the participant can access a pass containing:

- Event name
- Participant information
- Pass ID
- Registration state
- Attendance state
- QR access

Pass states can include:

- Pending Verification
- Attended
- Selected For Next Round
- Multi-day progress

Example:

    Day 1 ✓
    Day 2 ✓
    Day 3 ☐

### QR Check-in

The QR flow is designed around fast event entry.

Organizer-side flow:

    Scan Pass
       ↓
    View Participant
       ↓
    Confirm Entry
       ↓
    Mark Attendance / Selection

An attendance history can prevent accidental duplicate check-ins.

### Transport + Carpool

Campusly treats transportation as part of the event experience rather than a separate problem.

Students can view:

- college bus routes
- timings
- event-linked transport
- available carpools
- starting point
- seats
- departure time

Students can also offer a ride to other participants.

### Digital Wallet

The wallet acts as a student's long-term campus participation record.

It can contain:

- registered events
- attended events
- active passes
- QR passes
- certificates
- achievement history
- participation streaks/badges

### Event Progress Tracker

For multi-round or multi-day events:

    Registration ✓
    Check In ✓
    Round 1 ✓
    Round 2 ✓
    Final Round ☐
    Certificate ☐

This turns the portal from a simple registration website into a participation-tracking platform.

---

## 5. Why Campusly Is Different

Most event portals stop at:

**Event → Registration**

Campusly aims to cover:

**Event → Registration → Pass → Transport → Check-in → Participation → Certificate → History**

That makes it more useful throughout the entire event lifecycle.

The strongest differentiators are:

1. **Digital event wallet**
2. **QR-based event pass**
3. **Individual + team registration**
4. **Transport + carpool integration**
5. **Event progress tracking**
6. **Participation history and achievement layer**

---

## 6. Product Experience

Campusly follows a clean, modern campus-oriented visual language.

The interface supports:

- Light mode
- Dark mode
- Responsive layouts
- Interactive event cards
- Digital pass cards
- QR previews
- Registration states
- Animated visual elements
- Student-friendly navigation

The design direction is intentionally more like a modern campus product than a traditional college administration portal.

---

## 7. User Journey

### Student

    Sign In
       ↓
    Explore Events
       ↓
    Open Event
       ↓
    Register
       ↓
    Individual / Team
       ↓
    Receive Pass + QR
       ↓
    Find Transport
       ↓
    Attend Event
       ↓
    QR Check-in
       ↓
    Track Progress
       ↓
    Certificate
       ↓
    Wallet

### Organizer

    Organizer Login
       ↓
    Create Event
       ↓
    Define Registration Fields
       ↓
    Publish
       ↓
    View Registrations
       ↓
    Scan QR
       ↓
    Confirm Attendance
       ↓
    Mark Selection / Progress
       ↓
    Issue Certificates
       ↓
    View Event Data

---

## 8. Technology

Current prototype:

- HTML5
- CSS3
- Vanilla JavaScript
- Browser-based UI state
- Local/demo interaction patterns

The project deliberately avoids a heavy framework so that the prototype remains easy to understand, present and deploy.

---

## 9. Production Architecture

For a production version, the frontend can connect to:

- Authentication service
- College student database / ERP
- Event database
- Registration API
- QR validation service
- Notification service
- Certificate generation service
- Transport/carpool service

Possible production flow:

    Frontend
       ↓
    API Layer
       ↓
    Database
       ↓
    Auth / Events / Registrations
       ↓
    QR / Attendance / Certificates

---

## 10. Future Scope

### Smart Recommendations

Recommend events based on:

- interests
- previous participation
- departments
- skills
- clubs
- event categories

### Notifications

Send reminders for:

- registration deadlines
- event starting times
- transport departure
- round updates
- certificate availability

### Analytics

Organizer dashboard could show:

- registration count
- attendance rate
- category popularity
- conversion from registration to attendance
- team participation
- transport demand

### Campus Integration

Campusly could integrate with:

- college ERP
- student ID systems
- club management
- attendance systems
- digital certificate verification

---

## 11. Impact

### Student Impact

- Less searching
- Easier registration
- Better event discovery
- Fewer missed events
- Easier transportation
- Centralized achievements
- Digital certificate access

### Organizer Impact

- Less manual data collection
- Cleaner participant records
- Faster check-in
- Better event visibility
- Easier certificate management
- Useful event analytics

### Institution Impact

Campusly can become a common event layer across departments, clubs, societies and college festivals.

---

## 12. Business / Institutional Potential

Campusly can be positioned as a campus engagement platform rather than only an event-registration website.

Potential institutional model:

**College / University subscription**

with optional modules for:

- event management
- QR attendance
- certificates
- transport
- analytics
- student engagement

The long-term opportunity is to become the digital layer connecting students with campus activities.

---

## 13. 30-Second Pitch

> **Campusly is a unified college event platform that connects the entire student event journey — from discovering an event and registering, to QR check-in, transportation, participation tracking and digital certificates.**
>
> **Instead of students using multiple forms, chats and scattered records, Campusly puts the complete campus experience in one place while giving organisers a cleaner way to manage participants and events.**

---

## 14. Demo Flow

For a presentation/demo, show this sequence:

1. Open Campusly.
2. Sign in as attendee.
3. Switch light/dark mode.
4. Browse event categories.
5. Open an event.
6. Register as individual or team.
7. Show the event pass.
8. Open/view QR.
9. Show transport/carpool.
10. Open wallet.
11. Show attendance state.
12. Show progress tracker.
13. Show certificate/achievement area.
14. Explain how organizer QR check-in completes the loop.

This gives the reviewer a complete product story instead of only showing static pages.

---

## 15. Prototype vs Production

This repository is a **frontend prototype/demo**.

Some interactions are intentionally simulated in-browser so that the complete product journey can be demonstrated without requiring a deployed backend.

For production deployment, real authentication, persistent database storage, QR validation, notifications and certificate verification should be connected through secure backend APIs.

---

## 16. Project Structure

    CAMPUSLY_FINAL_PROJECT/
    ├── index.html
    ├── style.css
    ├── script.js
    └── README.md

---

## 17. How to Run

No build step is required for the current prototype.

### VS Code

1. Extract the ZIP.
2. Open the folder in VS Code.
3. Open `index.html`.
4. Use a local server such as Live Server for the smoothest experience.

### Direct browser

You can also open `index.html` directly in a browser, although a local server is recommended for a more reliable demo.

---

## 18. Closing Statement

Campusly is built around one simple idea:

> **College life should not feel fragmented.**

Events, people, transport, participation and achievements already belong to the same student journey.

Campusly brings them together.
