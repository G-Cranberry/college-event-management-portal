/* =========================================================
   CAMPUSLY — VANILLA JAVASCRIPT
   No frameworks. No libraries. Everything is separated
   into small, readable functions.
   ========================================================= */

const defaultEvents = [
  {
    id: 1,
    title: "Hack the Campus",
    category: "Technical",
    date: "Sep 04, 2026",
    time: "10:00 AM",
    venue: "Innovation Lab",
    seats: 120,
    registered: 86,
    description: "A 24-hour product sprint where teams turn campus problems into working digital solutions.",
    cover: "cover-tech",
    organiser: "Tech Society",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 2,
    title: "Rang — Cultural Night",
    category: "Cultural",
    date: "Sep 11, 2026",
    time: "06:30 PM",
    venue: "Open Air Theatre",
    seats: 800,
    registered: 542,
    description: "Music, dance, fashion and performances from across campus in one high-energy evening.",
    cover: "cover-culture",
    organiser: "Cultural Committee",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 3,
    title: "Campus Cup",
    category: "Sports",
    date: "Sep 17, 2026",
    time: "04:00 PM",
    venue: "Main Sports Ground",
    seats: 300,
    registered: 218,
    description: "Inter-department football, basketball and athletics with live points and leaderboards.",
    cover: "cover-sports",
    organiser: "Sports Council",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 4,
    title: "Future of AI",
    category: "Academic",
    date: "Sep 22, 2026",
    time: "11:00 AM",
    venue: "Auditorium 01",
    seats: 450,
    registered: 327,
    description: "A practical talk and panel on how AI is changing products, careers and campus life.",
    cover: "cover-academic",
    organiser: "CSE Department",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 5,
    title: "Frame by Frame",
    category: "Art",
    date: "Sep 26, 2026",
    time: "02:00 PM",
    venue: "Design Studio",
    seats: 90,
    registered: 64,
    description: "A visual storytelling workshop covering photography, composition and short-form filmmaking.",
    cover: "cover-art",
    organiser: "Design Club",
    image: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 6,
    title: "Unplugged Sessions",
    category: "Music",
    date: "Oct 02, 2026",
    time: "07:00 PM",
    venue: "Student Plaza",
    seats: 500,
    registered: 281,
    description: "An intimate open-mic night for singers, musicians, poets and performers.",
    cover: "cover-music",
    organiser: "Music Society",
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1000&q=80"
  }
];

let events = loadData("campuslyEvents", defaultEvents);
let registrations = loadData("campuslyRegistrations", [2, 4]);
let certificates = loadData("campuslyCertificates", [
  { event: "Web Development Workshop", date: "Jul 18, 2026", type: "Participation" },
  { event: "CodeSprint 2026", date: "Jun 28, 2026", type: "Finalist" }
]);

let currentRole = "attendee";
let currentPage = "home";

function loadData(key, fallback) {
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : fallback;
}

function saveData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function showLogin() {
  document.getElementById("loginScreen").classList.remove("hidden");
  document.getElementById("app").classList.add("hidden");
}

function enterPortal(role) {
  currentRole = role;
  localStorage.setItem("campuslyRole", role);

  document.getElementById("loginScreen").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");

  updateUserInterface();
  navigate("home");
}

function updateUserInterface() {
  const attendeeItems = document.querySelectorAll(".attendee-only");
  const organiserItems = document.querySelectorAll(".organiser-only");

  attendeeItems.forEach(item => {
    item.style.display = currentRole === "attendee" ? "" : "none";
  });

  organiserItems.forEach(item => {
    item.style.display = currentRole === "organiser" ? "" : "none";
  });

  const name = currentRole === "organiser" ? "Maya" : "Aarav";
  document.getElementById("profileName").textContent = name;
  document.getElementById("profileRole").textContent = currentRole.toUpperCase();
  document.getElementById("profileAvatar").textContent = name.charAt(0);
}

function navigate(page) {
  currentPage = page;
  document.getElementById("profileMenu").classList.remove("show");

  if (currentRole === "attendee" && ["create", "manage"].includes(page)) {
    page = "home";
  }

  if (currentRole === "organiser" && ["wallet", "registrations"].includes(page)) {
    page = "manage";
  }

  currentPage = page;

  document.querySelectorAll(".main-nav button").forEach(button => {
    button.classList.toggle("active", button.dataset.page === page);
  });

  const content = document.getElementById("pageContent");

  const pages = {
    home: renderHome,
    events: renderEvents,
    transport: renderTransport,
    wallet: renderWallet,
    registrations: renderRegistrations,
    create: renderCreateEvent,
    manage: renderManage
  };

  content.innerHTML = pages[page] ? pages[page]() : renderHome();

  if (page === "events") {
    setupEventFilters();
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ---------- HOME ---------- */

function renderHome() {
  const upcomingCount = events.length;
  const participantCount = events.reduce((sum, event) => sum + event.registered, 0);

  return `
    <section class="hero">
      <div class="hero-content">
        <p class="eyebrow">THE CAMPUS EVENT EXPERIENCE</p>
        <h1>Find your next<br><em>thing to do.</em></h1>
        <p class="hero-copy">
          Discover what is happening around campus, reserve your spot,
          find a ride and keep every achievement with you.
        </p>
        <div class="hero-actions">
          <button class="btn btn-lime" onclick="navigate('events')">Explore events ↗</button>
          <button class="btn btn-light" onclick="navigate('transport')">Find a ride</button>
        </div>
      </div>
      <div class="hero-orbit-word">CAMPUS / COMMUNITY / CREATE</div>
      <div class="hero-bottom">
        <span>${upcomingCount} LIVE EVENT LISTINGS</span>
        <span>${participantCount.toLocaleString()} REGISTRATIONS & COUNTING</span>
      </div>
    </section>

    <section class="page">
      <div class="page-header">
        <div>
          <p class="eyebrow">EVERYTHING CONNECTED</p>
          <h1>Your campus,<br><span>in one place.</span></h1>
        </div>
        <p>Campusly removes the friction between hearing about an event and actually being there. Everything from registration to certificates lives in one simple portal.</p>
      </div>

      <div class="mini-features">
        <article class="mini-feature">
          <div class="feature-number">01</div>
          <h3>Discover</h3>
          <p>Browse technical, cultural, sports, academic and social events.</p>
        </article>
        <article class="mini-feature">
          <div class="feature-number">02</div>
          <h3>Register</h3>
          <p>Reserve a spot in seconds and keep all your registrations together.</p>
        </article>
        <article class="mini-feature">
          <div class="feature-number">03</div>
          <h3>Move</h3>
          <p>Check college bus routes or find a carpool for your event.</p>
        </article>
        <article class="mini-feature">
          <div class="feature-number">04</div>
          <h3>Remember</h3>
          <p>Build a digital record of events, achievements and certificates.</p>
        </article>
      </div>

      <div style="margin-top:80px">
        <div class="section-label">UP NEXT</div>
        ${renderFeaturedEvents()}
      </div>
    </section>
  `;
}

function renderFeaturedEvents() {
  return `
    <div class="events-grid">
      ${events.slice(0, 3).map(event => eventCard(event)).join("")}
    </div>
  `;
}

/* ---------- EVENTS ---------- */

function renderEvents() {
  return `
    <section class="page">
      <div class="page-header">
        <div>
          <p class="eyebrow">DISCOVER</p>
          <h1>What's<br><span>happening?</span></h1>
        </div>
        <p>Search by event name or filter by category. Open any event to see its full details and reserve your place.</p>
      </div>

      <div class="filter-bar">
        <label class="search-box">
          <span>⌕</span>
          <input id="eventSearch" type="search" placeholder="Search events..." autocomplete="off">
        </label>
        <button class="filter-btn active" data-category="All">All</button>
        <button class="filter-btn" data-category="Technical">Technical</button>
        <button class="filter-btn" data-category="Cultural">Cultural</button>
        <button class="filter-btn" data-category="Sports">Sports</button>
        <button class="filter-btn" data-category="Academic">Academic</button>
        <button class="filter-btn" data-category="Art">Art</button>
        <button class="filter-btn" data-category="Music">Music</button>
      </div>

      <div id="eventsGrid" class="events-grid">
        ${events.map(event => eventCard(event)).join("")}
      </div>
    </section>
  `;
}

function eventCard(event) {
  const isRegistered = registrations.includes(event.id);
  const eventImage = event.image || "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1000&q=80";
  const available = event.seats - event.registered;

  return `
    <article class="event-card">
      <div class="event-cover ${event.cover}" style="background-image: linear-gradient(180deg, rgba(0,0,0,.03), rgba(0,0,0,.64)), url('${eventImage}')">
        <div class="event-cover-glass">
          <span>${event.category}</span>
          <strong>${event.title}</strong>
        </div>
        <div class="event-date">${event.date.toUpperCase()} · ${event.time}</div>
      </div>
      <div class="event-info">
        <div class="event-topline">
          <span class="category-pill">${event.category}</span>
          <span style="font-size:10px;color:#999">${available} seats left</span>
        </div>
        <h3>${event.title}</h3>
        <p>${event.description}</p>
        <div class="event-meta">
          <span>◷ ${event.time}</span>
          <span>⌖ ${event.venue}</span>
        </div>
        <div class="event-footer">
          <button class="btn btn-outline" onclick="showEvent(${event.id})">View details</button>
          ${currentRole === "attendee"
            ? `<button class="btn ${isRegistered ? "btn-light" : "btn-dark"}" onclick="${isRegistered ? `cancelRegistration(${event.id})` : `registerEvent(${event.id})`}">${isRegistered ? "Registered ✓" : "Register"}</button>`
            : `<span class="status">${event.registered} registered</span>`
          }
        </div>
      </div>
    </article>
  `;
}

function setupEventFilters() {
  const search = document.getElementById("eventSearch");
  const buttons = document.querySelectorAll(".filter-btn");

  function filterEvents() {
    const term = search.value.toLowerCase().trim();
    const active = document.querySelector(".filter-btn.active").dataset.category;

    const filtered = events.filter(event => {
      const matchesSearch =
        event.title.toLowerCase().includes(term) ||
        event.description.toLowerCase().includes(term) ||
        event.venue.toLowerCase().includes(term);

      const matchesCategory = active === "All" || event.category === active;
      return matchesSearch && matchesCategory;
    });

    document.getElementById("eventsGrid").innerHTML =
      filtered.length
        ? filtered.map(event => eventCard(event)).join("")
        : `<div class="soft-card" style="grid-column:1/-1;padding:45px;text-align:center;color:#777">No events match your search.</div>`;
  }

  search.addEventListener("input", filterEvents);

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      buttons.forEach(item => item.classList.remove("active"));
      button.classList.add("active");
      filterEvents();
    });
  });
}

function showEvent(id) {
  const event = events.find(item => item.id === id);
  if (!event) return;

  const isRegistered = registrations.includes(id);

  document.getElementById("modalContent").innerHTML = `
    <p class="eyebrow">${event.category} · ${event.organiser}</p>
    <h2>${event.title}</h2>
    <p>${event.description}</p>

    <div class="detail-list">
      <div class="detail-row"><span>Date</span><strong>${event.date}</strong></div>
      <div class="detail-row"><span>Time</span><strong>${event.time}</strong></div>
      <div class="detail-row"><span>Venue</span><strong>${event.venue}</strong></div>
      <div class="detail-row"><span>Capacity</span><strong>${event.registered} / ${event.seats}</strong></div>
      <div class="detail-row"><span>Organiser</span><strong>${event.organiser}</strong></div>
    </div>

    ${currentRole === "attendee"
      ? `<button class="btn ${isRegistered ? "btn-light" : "btn-dark"}" onclick="${isRegistered ? `cancelRegistration(${id});closeModal()` : `registerEvent(${id});closeModal()`}">${isRegistered ? "Cancel registration" : "Reserve my spot ↗"}</button>`
      : ""
    }
  `;

  document.getElementById("modal").classList.remove("hidden");
}

function registerEvent(id) {
  const event = events.find(item => item.id === id);
  if (!event || registrations.includes(id)) return;

  if (event.registered >= event.seats) {
    showToast("This event is currently full.");
    return;
  }

  registrations.push(id);
  event.registered += 1;

  saveData("campuslyRegistrations", registrations);
  saveData("campuslyEvents", events);

  showToast(`${event.title} added to your registrations.`);
  navigate(currentPage === "events" ? "events" : "registrations");
}

function cancelRegistration(id) {
  const index = registrations.indexOf(id);
  const event = events.find(item => item.id === id);

  if (index === -1) return;

  registrations.splice(index, 1);
  if (event && event.registered > 0) event.registered -= 1;

  saveData("campuslyRegistrations", registrations);
  saveData("campuslyEvents", events);

  showToast("Registration cancelled.");
  navigate("registrations");
}

/* ---------- REGISTRATIONS ---------- */

function renderRegistrations() {
  const registeredEvents = events.filter(event => registrations.includes(event.id));

  return `
    <section class="page">
      <div class="page-header">
        <div>
          <p class="eyebrow">YOUR ACTIVITY</p>
          <h1>My<br><span>registrations.</span></h1>
        </div>
        <p>Keep track of everything you have signed up for. Your event schedule stays here until the day arrives.</p>
      </div>

      ${registeredEvents.length
        ? `<div class="events-grid">${registeredEvents.map(event => eventCard(event)).join("")}</div>`
        : `<div class="soft-card" style="padding:70px;text-align:center">
            <p class="eyebrow">NOTHING HERE YET</p>
            <h2 style="font-family:'Space Grotesk';font-size:35px;margin:10px 0">Your next event is waiting.</h2>
            <p style="color:#777;margin-bottom:20px">Explore campus events and reserve your first spot.</p>
            <button class="btn btn-dark" onclick="navigate('events')">Explore events ↗</button>
          </div>`
      }
    </section>
  `;
}

/* ---------- TRANSPORT ---------- */

function renderTransport() {
  return `
    <section class="page">
      <div class="page-header">
        <div>
          <p class="eyebrow">GET THERE</p>
          <h1>Move<br><span>together.</span></h1>
        </div>
        <p>Book a college bus seat or find a student carpool heading toward your event. Less stress, fewer empty seats.</p>
      </div>

      <div class="transport-hero">
        <article class="transport-intro">
          <p class="eyebrow" style="color:rgba(255,255,255,.55)">COLLEGE BUS</p>
          <h2>Routes that<br>keep you moving.</h2>
          <p>Check departure points, timings and available seats for upcoming events.</p>
        </article>

        <article class="route-card">
          <span class="eyebrow">NEXT DEPARTURE</span>
          <div class="route-number">07<span style="font-size:28px">:15</span></div>
          <div>
            <div class="route-line">NORTH GATE → MAIN CAMPUS</div>
            <p style="font-size:11px;color:#777">Friday · 04 Sep · 34 seats available</p>
          </div>
        </article>
      </div>

      <div class="transport-grid">
        <article class="soft-card transport-card">
          <p class="eyebrow">01 · BUS FACILITY</p>
          <h3>Reserve a seat.</h3>
          <p>Choose a route for your event and reserve a seat before it fills up.</p>

          <div class="transport-options">
            <div class="transport-option">
              <div><strong>Route A · North Gate</strong><small>07:15 AM · 34 seats</small></div>
              <button class="btn btn-dark" onclick="showToast('Bus seat reserved for Route A.')">Reserve</button>
            </div>
            <div class="transport-option">
              <div><strong>Route B · Hostel Block</strong><small>07:30 AM · 19 seats</small></div>
              <button class="btn btn-dark" onclick="showToast('Bus seat reserved for Route B.')">Reserve</button>
            </div>
            <div class="transport-option">
              <div><strong>Route C · City Centre</strong><small>08:00 AM · 12 seats</small></div>
              <button class="btn btn-dark" onclick="showToast('Bus seat reserved for Route C.')">Reserve</button>
            </div>
          </div>
        </article>

        <article class="soft-card transport-card">
          <p class="eyebrow">02 · CARPOOL</p>
          <h3>Share the ride.</h3>
          <p>Find students going in the same direction or offer an available seat in your car.</p>

          <div class="transport-options">
            <div class="transport-option">
              <div><strong>Aditi → Chandigarh</strong><small>4:45 PM · 2 seats</small></div>
              <button class="btn btn-light" onclick="showToast('Carpool request sent to Aditi.')">Join</button>
            </div>
            <div class="transport-option">
              <div><strong>Rohan → Zirakpur</strong><small>5:15 PM · 1 seat</small></div>
              <button class="btn btn-light" onclick="showToast('Carpool request sent to Rohan.')">Join</button>
            </div>
            <div class="transport-option">
              <div><strong>Mehak → Panchkula</strong><small>6:00 PM · 2 seats</small></div>
              <button class="btn btn-light" onclick="showToast('Carpool request sent to Mehak.')">Join</button>
            </div>
          </div>

          <button class="btn btn-lime" style="margin-top:15px" onclick="showToast('Your carpool listing has been created.')">Offer a seat +</button>
        </article>
      </div>
    </section>
  `;
}

/* ---------- WALLET ---------- */

function renderWallet() {
  return `
    <section class="page">
      <div class="page-header">
        <div>
          <p class="eyebrow">YOUR DIGITAL RECORD</p>
          <h1>Event<br><span>wallet.</span></h1>
        </div>
        <p>Your participation history and certificates, stored digitally so your campus journey stays with you.</p>
      </div>

      <div class="wallet-hero">
        <article class="wallet-card">
          <p class="eyebrow" style="color:rgba(255,255,255,.55)">CAMPUSLY WALLET</p>
          <div class="wallet-name">Aarav Sharma</div>
          <div class="wallet-id">STUDENT ID · CLY-2026-042</div>
        </article>

        <div class="wallet-stats">
          <div class="wallet-stat">
            <span>EVENTS ATTENDED</span>
            <strong>${certificates.length + 3}</strong>
            <span>+2 this semester</span>
          </div>
          <div class="wallet-stat">
            <span>CERTIFICATES</span>
            <strong>${certificates.length}</strong>
            <span>digitally verified</span>
          </div>
        </div>
      </div>

      <div class="section-label">CERTIFICATE VAULT</div>
      <div class="certificate-list">
        ${certificates.map(certificate => `
          <article class="soft-card certificate">
            <div class="certificate-icon">✦</div>
            <div>
              <h3>${certificate.event}</h3>
              <p>${certificate.type} · ${certificate.date}</p>
            </div>
            <button class="btn btn-outline" onclick="showCertificate('${certificate.event}')">View</button>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function showCertificate(name) {
  document.getElementById("modalContent").innerHTML = `
    <p class="eyebrow">DIGITAL CERTIFICATE</p>
    <h2>${name}</h2>
    <p>This demo certificate is stored inside the Campusly wallet. In the full backend version, the organiser can generate and digitally verify the certificate here.</p>
    <div class="soft-card" style="margin-top:22px;padding:35px;text-align:center;background:#e8eddf">
      <div class="eyebrow">CERTIFIED PARTICIPANT</div>
      <div style="font-family:'Space Grotesk';font-size:28px;margin:12px 0">Aarav Sharma</div>
      <div style="font-size:11px;color:#777">CAMPUSLY · 2026</div>
    </div>
  `;
  document.getElementById("modal").classList.remove("hidden");
}

/* ---------- ORGANISER ---------- */

function renderCreateEvent() {
  return `
    <section class="page">
      <div class="page-header">
        <div>
          <p class="eyebrow">ORGANISER STUDIO</p>
          <h1>Create<br><span>an event.</span></h1>
        </div>
        <p>Publish a clean event listing with everything attendees need to know before they register.</p>
      </div>

      <div class="form-shell">
        <form onsubmit="createEvent(event)">
          <div class="form-grid">
            <div class="form-field">
              <label>Event name</label>
              <input id="newTitle" required placeholder="e.g. Design Sprint">
            </div>
            <div class="form-field">
              <label>Category</label>
              <select id="newCategory" required>
                <option value="Technical">Technical</option>
                <option value="Cultural">Cultural</option>
                <option value="Sports">Sports</option>
                <option value="Academic">Academic</option>
                <option value="Art">Art</option>
                <option value="Music">Music</option>
              </select>
            </div>
            <div class="form-field">
              <label>Date</label>
              <input id="newDate" required placeholder="Sep 30, 2026">
            </div>
            <div class="form-field">
              <label>Time</label>
              <input id="newTime" required placeholder="05:00 PM">
            </div>
            <div class="form-field">
              <label>Venue</label>
              <input id="newVenue" required placeholder="Main Auditorium">
            </div>
            <div class="form-field">
              <label>Participant limit</label>
              <input id="newSeats" type="number" min="1" required placeholder="200">
            </div>
            <div class="form-field full">
              <label>Description</label>
              <textarea id="newDescription" required placeholder="Tell students what makes this event worth attending..."></textarea>
            </div>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-dark">Publish event ↗</button>
            <button type="button" class="btn btn-light" onclick="navigate('manage')">Cancel</button>
          </div>
        </form>
      </div>
    </section>
  `;
}

function createEvent(event) {
  event.preventDefault();

  const category = document.getElementById("newCategory").value;
  const coverMap = {
    Technical: "cover-tech",
    Cultural: "cover-culture",
    Sports: "cover-sports",
    Academic: "cover-academic",
    Art: "cover-art",
    Music: "cover-music"
  };

  const newEvent = {
    id: Date.now(),
    title: document.getElementById("newTitle").value,
    category,
    date: document.getElementById("newDate").value,
    time: document.getElementById("newTime").value,
    venue: document.getElementById("newVenue").value,
    seats: Number(document.getElementById("newSeats").value),
    registered: 0,
    description: document.getElementById("newDescription").value,
    cover: coverMap[category],
    organiser: "Campusly Organiser",
    image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1000&q=80"
  };

  events.unshift(newEvent);
  saveData("campuslyEvents", events);

  showToast("Event published successfully.");
  navigate("manage");
}

function renderManage() {
  const totalParticipants = events.reduce((sum, event) => sum + event.registered, 0);
  const totalCapacity = events.reduce((sum, event) => sum + event.seats, 0);

  return `
    <section class="page">
      <div class="page-header">
        <div>
          <p class="eyebrow">ORGANISER DASHBOARD</p>
          <h1>Manage<br><span>the campus.</span></h1>
        </div>
        <button class="btn btn-dark" onclick="navigate('create')">Create new event +</button>
      </div>

      <div class="dashboard-cards">
        <div class="dashboard-card"><span>Total events</span><strong>${events.length}</strong></div>
        <div class="dashboard-card"><span>Registrations</span><strong>${totalParticipants}</strong></div>
        <div class="dashboard-card"><span>Capacity</span><strong>${totalCapacity}</strong></div>
        <div class="dashboard-card"><span>Fill rate</span><strong>${Math.round((totalParticipants / totalCapacity) * 100)}%</strong></div>
      </div>

      <div class="section-label">EVENT CONTROL CENTRE</div>
      <div class="table-shell">
        <table class="data-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Category</th>
              <th>Date</th>
              <th>Registrations</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${events.map(event => `
              <tr>
                <td><strong>${event.title}</strong><br><span style="color:#999;font-size:9px">${event.venue}</span></td>
                <td>${event.category}</td>
                <td>${event.date}</td>
                <td>${event.registered} / ${event.seats}</td>
                <td><span class="status">${event.registered >= event.seats ? "Full" : "Live"}</span></td>
                <td>
                  <button class="btn btn-outline" onclick="showParticipants(${event.id})">Participants</button>
                  <button class="btn btn-light" onclick="showToast('Certificate centre opened for ${event.title}.')">Certificates</button>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function showParticipants(id) {
  const event = events.find(item => item.id === id);
  if (!event) return;

  document.getElementById("modalContent").innerHTML = `
    <p class="eyebrow">PARTICIPANTS · ${event.category}</p>
    <h2>${event.title}</h2>
    <p>${event.registered} students are currently registered out of ${event.seats} available places.</p>
    <div class="detail-list">
      <div class="detail-row"><span>Registration status</span><strong>${event.registered >= event.seats ? "Full" : "Open"}</strong></div>
      <div class="detail-row"><span>Attendance</span><strong>Not marked</strong></div>
      <div class="detail-row"><span>Certificates</span><strong>Pending</strong></div>
    </div>
    <button class="btn btn-dark" onclick="showToast('Attendance manager opened.');closeModal()">Manage attendance ↗</button>
  `;

  document.getElementById("modal").classList.remove("hidden");
}

/* ---------- UTILITY FUNCTIONS ---------- */

function toggleProfileMenu() {
  document.getElementById("profileMenu").classList.toggle("show");
}

function closeModal() {
  document.getElementById("modal").classList.add("hidden");
}

function logout() {
  document.getElementById("profileMenu").classList.remove("show");
  showLogin();
  showToast("You have been logged out.");
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

/* ---------- INITIAL LOAD ---------- */

document.addEventListener("DOMContentLoaded", () => {
  const savedRole = localStorage.getItem("campuslyRole");

  if (savedRole) {
    currentRole = savedRole;
    document.getElementById("loginScreen").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");
    updateUserInterface();
    navigate("home");
  }
});


/* ---------- THEME + MICRO INTERACTIONS ---------- */

function applyTheme(theme) {
  const isDark = theme === "dark";
  document.body.classList.toggle("dark-mode", isDark);

  const icon = document.querySelector(".theme-icon");
  const text = document.querySelector(".theme-text");

  if (icon) icon.textContent = isDark ? "☀" : "☾";
  if (text) text.textContent = isDark ? "Light" : "Dark";

  localStorage.setItem("campuslyTheme", theme);
}

function toggleTheme() {
  const nextTheme = document.body.classList.contains("dark-mode") ? "light" : "dark";
  applyTheme(nextTheme);
  showToast(nextTheme === "dark" ? "Dark mode enabled." : "Light mode enabled.");
}

function setupCursorGlow() {
  const glow = document.getElementById("cursorGlow");
  if (!glow || window.matchMedia("(pointer: coarse)").matches) return;

  document.addEventListener("mousemove", event => {
    glow.style.left = event.clientX + "px";
    glow.style.top = event.clientY + "px";
    glow.style.opacity = "1";
  });

  document.addEventListener("mouseleave", () => {
    glow.style.opacity = "0";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  applyTheme(localStorage.getItem("campuslyTheme") || "light");
  setupCursorGlow();
});
