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
    registrationMode: "team",
    teamMin: 2,
    teamMax: 4,
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
    registrationMode: "individual",
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
    registrationMode: "team",
    teamMin: 5,
    teamMax: 8,
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
    registrationMode: "individual",
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
    registrationMode: "individual",
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
    registrationMode: "individual",
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1000&q=80"
  }
];

let events = loadData("campuslyEvents", defaultEvents);
let registrations = loadData("campuslyRegistrations", [2, 4]);
let registrationDetails = loadData("campuslyRegistrationDetails", {});
let certificates = loadData("campuslyCertificates", [
  { event: "Web Development Workshop", date: "Jul 18, 2026", type: "Participation" },
  { event: "CodeSprint 2026", date: "Jun 28, 2026", type: "Finalist" }
]);

let attendanceStats = loadData("campuslyAttendanceStats", { attended: 12, streak: 5 });
let attendanceRecords = loadData("campuslyAttendanceRecords", []);
let galleryItems = loadData("campuslyGalleryItems", [
  { id: "demo-1", src: defaultEvents[0].image, title: "Hack the Campus", caption: "Innovation Lab · Tech Society", demo: true },
  { id: "demo-2", src: defaultEvents[1].image, title: "Rang — Cultural Night", caption: "Open Air Theatre · Cultural Committee", demo: true },
  { id: "demo-3", src: defaultEvents[2].image, title: "Campus Cup", caption: "Main Sports Ground · Sports Council", demo: true },
  { id: "demo-4", src: defaultEvents[5].image, title: "Unplugged Sessions", caption: "Student Plaza · Music Society", demo: true }
]);
let scannerResult = null;

let currentRole = "attendee";
let currentPage = "home";
let loadingTimer = null;

function loadData(key, fallback) {
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : fallback;
}

function saveData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function showLoading(duration = 900) {
  const loader = document.getElementById("loadingScreen");
  if (!loader) return;
  loader.classList.remove("is-hidden");
  loader.setAttribute("aria-hidden", "false");
  clearTimeout(loadingTimer);
  loadingTimer = setTimeout(hideLoading, duration);
}

function hideLoading() {
  const loader = document.getElementById("loadingScreen");
  if (!loader) return;
  loader.classList.add("is-hidden");
  loader.setAttribute("aria-hidden", "true");
}

function showLogin() {
  document.getElementById("loginScreen").classList.remove("hidden");
  document.getElementById("app").classList.add("hidden");
  document.querySelector(".role-cards")?.classList.remove("hidden");
  document.querySelector(".auth-switch")?.classList.remove("hidden");
  document.querySelector(".login-note")?.classList.remove("hidden");
  document.querySelector(".login-heading")?.classList.remove("hidden");
  document.getElementById("signupForm")?.classList.add("hidden");
}

function showSignup(role) {
  document.querySelector(".role-cards")?.classList.add("hidden");
  document.querySelector(".auth-switch")?.classList.add("hidden");
  document.querySelector(".login-note")?.classList.add("hidden");
  document.querySelector(".login-heading")?.classList.add("hidden");
  document.getElementById("signupForm")?.classList.remove("hidden");
  if (role) document.getElementById("signupRole").value = role;
  document.getElementById("signupName")?.focus();
}

function demoGoogleSignup() {
  const role = document.getElementById("signupRole").value || "attendee";
  document.getElementById("signupName").value = role === "organiser" ? "Campusly Organizer" : "Campusly Attendee";
  document.getElementById("signupEmail").value = role === "organiser" ? "organizer@campusly.demo" : "student@campusly.demo";
  document.getElementById("signupCollege").value = "Campusly Demo College";
  signupUser({ preventDefault: () => {} });
}

function signupUser(event) {
  event.preventDefault();

  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const college = document.getElementById("signupCollege").value.trim();
  const role = document.getElementById("signupRole").value;

  if (!name || !email || !college) return;

  localStorage.setItem("campuslyUser", JSON.stringify({ name, email, college, role, id: `CLY-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}` }));
  currentRole = role;
  localStorage.setItem("campuslyRole", role);

  document.getElementById("loginScreen").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");
  updateUserInterface();
  showLoading(1100);
  navigate("home");
  showToast(`Welcome to Campusly, ${name.split(" ")[0]}!`);
}

function enterPortal(role) {
  currentRole = role;
  localStorage.setItem("campuslyRole", role);

  document.getElementById("loginScreen").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");

  updateUserInterface();
  showLoading(1100);
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

  const savedUser = JSON.parse(localStorage.getItem("campuslyUser") || "null");
  const name = savedUser?.name || (currentRole === "organiser" ? "Maya" : "Aarav");
  document.getElementById("profileName").textContent = name;
  document.getElementById("profileRole").textContent = currentRole.toUpperCase();
  document.getElementById("profileAvatar").textContent = name.charAt(0);
}

function navigate(page) {
  currentPage = page;
  document.getElementById("profileMenu").classList.remove("show");

  if (currentRole === "attendee" && ["create", "manage", "scanner"].includes(page)) {
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
    gallery: renderGallery,
    registrations: renderRegistrations,
    create: renderCreateEvent,
    manage: renderManage,
    scanner: renderScanner,
    profile: renderProfile
  };

  content.innerHTML = pages[page] ? pages[page]() : renderHome();

  if (page === "events") {
    setupEventFilters();
    setupEventsPageCarousel();
  }

  setupFeaturedCarousel();
  setupEventCardMotion();
  setupWalletInteraction();
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
      <div class="hero-featured" aria-label="Featured events">
        ${renderFeaturedCarousel()}
      </div>
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

    </section>
  `;
}

function renderFeaturedEvents() {
  return renderFeaturedCarousel();
}

function renderFeaturedCarousel() {
  const featured = events.slice(0, Math.min(events.length, 6));
  if (!featured.length) return `<div class="soft-card" style="padding:40px">No events available yet.</div>`;

  return `
    <div class="featured-carousel" id="featuredCarousel" data-active-index="0" tabindex="0" aria-label="Featured events carousel">
      <div class="featured-track" id="featuredTrack">
        ${featured.map((event, index) => featuredCard(event, index)).join("")}
      </div>
      <div class="carousel-controls">
        <button class="carousel-arrow" type="button" onclick="moveFeatured(-1)" aria-label="Previous event">←</button>
        <div class="carousel-dots" id="carouselDots">
          ${featured.map((event, index) => `<button type="button" class="carousel-dot ${index === 0 ? "active" : ""}" onclick="goFeatured(${index})" aria-label="Show ${event.title}"></button>`).join("")}
        </div>
        <button class="carousel-arrow" type="button" onclick="moveFeatured(1)" aria-label="Next event">→</button>
      </div>
      <p class="carousel-hint">Swipe, drag, or use the arrows to browse featured events.</p>
    </div>
  `;
}

function featuredCard(event, index) {
  const isRegistered = registrations.includes(event.id);
  const image = event.image || "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1000&q=80";
  return `
    <article class="featured-card" data-featured-index="${index}" data-event-id="${event.id}">
      <div class="featured-cover" style="background-image: linear-gradient(180deg, rgba(0,0,0,.02), rgba(0,0,0,.78)), url('${image}')">
        <span class="featured-badge">${event.category}</span>
        <span class="featured-live">● LIVE</span>
        <div class="featured-card-content">
          <h3>${event.title}</h3>
          <p>◷ ${event.date} · ${event.time}</p>
          <p>⌖ ${event.venue}</p>
          <button class="btn btn-lime featured-action" type="button" onclick="showEvent(${event.id})">View Details &amp; Register →</button>
          ${isRegistered ? `<span class="featured-registered">Registered ✓</span>` : ""}
        </div>
      </div>
    </article>
  `;
}

let featuredIndex = 0;
let featuredDragStart = null;
let featuredDragDelta = 0;

function updateFeaturedCarousel() {
  const carousel = document.getElementById("featuredCarousel");
  if (!carousel) return;
  const cards = [...carousel.querySelectorAll(".featured-card")];
  if (!cards.length) return;

  featuredIndex = ((featuredIndex % cards.length) + cards.length) % cards.length;
  carousel.dataset.activeIndex = featuredIndex;

  cards.forEach((card, index) => {
    const diff = (index - featuredIndex + cards.length) % cards.length;
    card.classList.remove("is-center", "is-left", "is-right", "is-hidden");
    if (diff === 0) card.classList.add("is-center");
    else if (diff === 1) card.classList.add("is-right");
    else if (diff === cards.length - 1) card.classList.add("is-left");
    else card.classList.add("is-hidden");
  });

  carousel.querySelectorAll(".carousel-dot").forEach((dot, index) => {
    dot.classList.toggle("active", index === featuredIndex);
  });
}

function moveFeatured(direction) {
  const carousel = document.getElementById("featuredCarousel");
  if (!carousel) return;
  const count = carousel.querySelectorAll(".featured-card").length;
  if (!count) return;
  featuredIndex = (featuredIndex + direction + count) % count;
  updateFeaturedCarousel();
}

function goFeatured(index) {
  featuredIndex = index;
  updateFeaturedCarousel();
}

function setupFeaturedCarousel() {
  const carousel = document.getElementById("featuredCarousel");
  if (!carousel || carousel.dataset.ready === "true") return;
  carousel.dataset.ready = "true";
  featuredIndex = 0;
  updateFeaturedCarousel();

  const track = carousel.querySelector(".featured-track");
  track.addEventListener("pointerdown", event => {
    if (event.target.closest("button")) return;
    featuredDragStart = event.clientX;
    featuredDragDelta = 0;
    track.setPointerCapture?.(event.pointerId);
  });
  track.addEventListener("pointermove", event => {
    if (featuredDragStart === null) return;
    featuredDragDelta = event.clientX - featuredDragStart;
  });
  const finishDrag = () => {
    if (featuredDragStart === null) return;
    if (Math.abs(featuredDragDelta) > 55) moveFeatured(featuredDragDelta < 0 ? 1 : -1);
    featuredDragStart = null;
    featuredDragDelta = 0;
  };
  track.addEventListener("pointerup", finishDrag);
  track.addEventListener("pointercancel", finishDrag);
  carousel.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft") moveFeatured(-1);
    if (event.key === "ArrowRight") moveFeatured(1);
  });
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

      ${renderEventsPageCarousel()}

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

function renderEventsPageCarousel() {
  const list = events.slice(0, Math.min(events.length, 6));
  if (!list.length) return "";

  return `
    <div class="events-spotlight" aria-label="Event spotlight carousel">
      <div class="events-spotlight-head">
        <div>
          <p class="eyebrow">EVENT SPOTLIGHT</p>
          <h2>Pick an event.<br><span>Make it yours.</span></h2>
        </div>
        <p class="events-spotlight-copy">Use the arrows, swipe the cards, or click any card to open its details.</p>
      </div>
      <div class="events-page-carousel" id="eventsPageCarousel" tabindex="0">
        <div class="events-page-track">
          ${list.map((event, index) => {
            const image = event.image || "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1000&q=80";
            const registered = registrations.includes(event.id);
            return `
              <article class="events-page-card" data-carousel-index="${index}" data-event-id="${event.id}">
                <div class="events-page-cover" style="background-image:linear-gradient(180deg,rgba(0,0,0,.04),rgba(0,0,0,.82)),url('${image}')">
                  <span class="events-page-category">${event.category}</span>
                  <div class="events-page-content">
                    <span>${event.date} · ${event.time}</span>
                    <h3>${event.title}</h3>
                    <p>⌖ ${event.venue}</p>
                    <button class="btn btn-lime" type="button" onclick="showEvent(${event.id})">View Details →</button>
                    ${registered ? '<small class="events-page-registered">Registered ✓</small>' : ''}
                  </div>
                </div>
              </article>`;
          }).join("")}
        </div>
        <button class="events-page-arrow prev" type="button" onclick="moveEventsPageCarousel(-1)" aria-label="Previous event">←</button>
        <button class="events-page-arrow next" type="button" onclick="moveEventsPageCarousel(1)" aria-label="Next event">→</button>
        <div class="events-page-dots">
          ${list.map((event, index) => `<button class="events-page-dot ${index === 0 ? 'active' : ''}" type="button" onclick="goEventsPageCarousel(${index})" aria-label="Show ${event.title}"></button>`).join("")}
        </div>
      </div>
    </div>`;
}

let eventsPageCarouselIndex = 0;
let eventsPageDragStart = null;
let eventsPageDragDelta = 0;

function updateEventsPageCarousel() {
  const carousel = document.getElementById("eventsPageCarousel");
  if (!carousel) return;
  const cards = [...carousel.querySelectorAll(".events-page-card")];
  const total = cards.length;
  if (!total) return;

  eventsPageCarouselIndex = (eventsPageCarouselIndex + total) % total;
  cards.forEach((card, index) => {
    let offset = index - eventsPageCarouselIndex;
    if (offset > total / 2) offset -= total;
    if (offset < -total / 2) offset += total;
    card.classList.remove("is-center", "is-left", "is-right", "is-hidden");
    if (offset === 0) card.classList.add("is-center");
    else if (offset === -1) card.classList.add("is-left");
    else if (offset === 1) card.classList.add("is-right");
    else card.classList.add("is-hidden");
  });
  carousel.querySelectorAll(".events-page-dot").forEach((dot, i) => dot.classList.toggle("active", i === eventsPageCarouselIndex));
}

function moveEventsPageCarousel(step) {
  eventsPageCarouselIndex += step;
  updateEventsPageCarousel();
}

function goEventsPageCarousel(index) {
  eventsPageCarouselIndex = index;
  updateEventsPageCarousel();
}

function setupEventsPageCarousel() {
  const carousel = document.getElementById("eventsPageCarousel");
  if (!carousel) return;
  eventsPageCarouselIndex = 0;
  updateEventsPageCarousel();

  const track = carousel.querySelector(".events-page-track");
  track.addEventListener("pointerdown", event => {
    if (event.target.closest("button")) return;
    eventsPageDragStart = event.clientX;
    eventsPageDragDelta = 0;
    track.setPointerCapture?.(event.pointerId);
  });
  track.addEventListener("pointermove", event => {
    if (eventsPageDragStart === null) return;
    eventsPageDragDelta = event.clientX - eventsPageDragStart;
  });
  const finish = () => {
    if (eventsPageDragStart === null) return;
    if (Math.abs(eventsPageDragDelta) > 55) moveEventsPageCarousel(eventsPageDragDelta < 0 ? 1 : -1);
    eventsPageDragStart = null;
    eventsPageDragDelta = 0;
  };
  track.addEventListener("pointerup", finish);
  track.addEventListener("pointercancel", finish);
  carousel.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft") moveEventsPageCarousel(-1);
    if (event.key === "ArrowRight") moveEventsPageCarousel(1);
  });
}

function eventCard(event) {
  const isRegistered = registrations.includes(event.id);
  const eventImage = event.image || "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1000&q=80";
  const available = event.seats - event.registered;

  return `
    <article class="event-card is-clickable" data-event-id="${event.id}">
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
            ? `<button class="btn ${isRegistered ? "btn-light" : "btn-dark"}" onclick="${isRegistered ? `cancelRegistration(${event.id})` : `openRegistrationForm(${event.id})`}">${isRegistered ? "Registered ✓" : "Register"}</button>`
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
  const mode = event.registrationMode || "individual";
  const teamText = mode === "team" ? `Team registration · ${event.teamMin || 2}-${event.teamMax || 4} members` : "Individual registration";

  document.getElementById("modalContent").innerHTML = `
    <p class="eyebrow">${event.category} · ${event.organiser}</p>
    <h2>${event.title}</h2>
    <p>${event.description}</p>
    <div class="detail-list">
      <div class="detail-row"><span>Date</span><strong>${event.date}</strong></div>
      <div class="detail-row"><span>Time</span><strong>${event.time}</strong></div>
      <div class="detail-row"><span>Venue</span><strong>${event.venue}</strong></div>
      <div class="detail-row"><span>Registration</span><strong>${teamText}</strong></div>
      <div class="detail-row"><span>Capacity</span><strong>${event.registered} / ${event.seats}</strong></div>
    </div>
    ${currentRole === "attendee"
      ? `<button class="btn ${isRegistered ? "btn-light" : "btn-dark"}" onclick="${isRegistered ? `cancelRegistration(${id});closeModal()` : `openRegistrationForm(${id})`}">${isRegistered ? "Cancel registration" : "Register now ↗"}</button>`
      : ""
    }
  `;
  document.getElementById("modal").classList.remove("hidden");
}

function openRegistrationForm(id) {
  const event = events.find(item => item.id === id);
  if (!event || registrations.includes(id)) return;
  if (event.registered >= event.seats) { showToast("This event is currently full."); return; }

  const mode = event.registrationMode || "individual";
  const teamMin = event.teamMin || 2;
  const teamMax = event.teamMax || 4;
  const saved = registrationDetails[id] || {};

  document.getElementById("modalContent").innerHTML = `
    <p class="eyebrow">REGISTRATION · ${event.category}</p>
    <h2>Join ${event.title}.</h2>
    <p>Form pe details fill karo. Registration submit hone ke baad hi tumhara pass wallet mein generate hoga.</p>
    <form class="registration-form" onsubmit="submitRegistration(event, ${id})">
      <div class="registration-mode-row">
        <button type="button" class="mode-chip ${mode === "individual" ? "active" : ""}" disabled>Individual</button>
        <button type="button" class="mode-chip ${mode === "team" ? "active" : ""}" disabled>Team</button>
      </div>
      <label class="form-field"><span>Full name</span><input id="regName" required value="${saved.name || getUserName()}" placeholder="Your full name"></label>
      <label class="form-field"><span>Email</span><input id="regEmail" type="email" required value="${saved.email || getUserEmail()}" placeholder="you@college.edu"></label>
      <label class="form-field"><span>College / Department</span><input id="regCollege" required value="${saved.college || getUserCollege()}" placeholder="Your college / department"></label>
      ${mode === "team" ? `
        <div class="team-config-note"><strong>Team size: ${teamMin}-${teamMax}</strong><span>Organizer ne is event ko team registration ke liye set kiya hai.</span></div>
        <label class="form-field"><span>Team name</span><input id="regTeamName" required value="${saved.teamName || ""}" placeholder="e.g. Byte Force"></label>
        <label class="form-field"><span>Team size</span><input id="regTeamSize" type="number" min="${teamMin}" max="${teamMax}" required value="${saved.teamSize || teamMin}" placeholder="${teamMin}-${teamMax}"></label>
        <label class="form-field full"><span>Team members</span><textarea id="regMembers" required placeholder="One member per line — name + email">${saved.members || ""}</textarea></label>
      ` : `
        <label class="form-field full"><span>Phone number</span><input id="regPhone" required value="${saved.phone || ""}" placeholder="10 digit mobile number"></label>
      `}
      <div class="registration-actions"><button type="submit" class="btn btn-dark">Submit registration ↗</button><button type="button" class="btn btn-light" onclick="showEvent(${id})">Back</button></div>
    </form>
  `;
}

function getUserName() { return JSON.parse(localStorage.getItem("campuslyUser") || "null")?.name || ""; }
function getUserEmail() { return JSON.parse(localStorage.getItem("campuslyUser") || "null")?.email || ""; }
function getUserCollege() { return JSON.parse(localStorage.getItem("campuslyUser") || "null")?.college || ""; }

function submitRegistration(formEvent, id) {
  formEvent.preventDefault();
  const event = events.find(item => item.id === id);
  if (!event || registrations.includes(id)) return;
  if (event.registered >= event.seats) { showToast("This event is currently full."); return; }

  const mode = event.registrationMode || "individual";
  const data = {
    name: document.getElementById("regName").value.trim(),
    email: document.getElementById("regEmail").value.trim(),
    college: document.getElementById("regCollege").value.trim(),
    mode,
    phone: document.getElementById("regPhone")?.value.trim() || "",
    teamName: document.getElementById("regTeamName")?.value.trim() || "",
    teamSize: Number(document.getElementById("regTeamSize")?.value || 0),
    members: document.getElementById("regMembers")?.value.trim() || ""
  };

  if (mode === "team") {
    const min = event.teamMin || 2, max = event.teamMax || 4;
    if (data.teamSize < min || data.teamSize > max) { showToast(`Team size ${min}-${max} members hona chahiye.`); return; }
    if (!data.teamName || !data.members) { showToast("Team name aur members fill karo."); return; }
  }

  registrationDetails[id] = data;
  registrations.push(id);
  event.registered += 1;
  saveData("campuslyRegistrationDetails", registrationDetails);
  saveData("campuslyRegistrations", registrations);
  saveData("campuslyEvents", events);

  document.getElementById("modalContent").innerHTML = `
    <div class="registration-success">
      <div class="success-mark">✓</div>
      <p class="eyebrow">REGISTRATION CONFIRMED</p>
      <h2>You’re in.</h2>
      <p>${event.title} ke liye registration successfully submit ho gayi. Ab tumhara digital pass Wallet mein available hai.</p>
      <div class="success-actions"><button class="btn btn-dark" onclick="closeModal();navigate('wallet')">Open Wallet ↗</button><button class="btn btn-light" onclick="closeModal();navigate('events')">Back to events</button></div>
    </div>
  `;
  showToast("Registration submitted successfully.");
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
  const activePasses = events.filter(event => registrations.includes(event.id));
  const userName = getUserName() || "Aarav Sharma";
  const userId = getUserId();
  const level = getEventLevel(attendanceStats.attended);

  return `
    <section class="page wallet-page">
      <div class="page-header wallet-heading">
        <div><p class="eyebrow">CAMPUSLY WALLET</p><h1>Your<br><span>passes.</span></h1></div>
        <p>Your confirmed event passes live inside this small wallet. Hover to lift a pass, then click the pass you want to open and scan.</p>
      </div>

      <div class="wallet-gamification">
        <article class="gamification-card streak-card">
          <div class="gamification-icon">↗</div>
          <div><p class="eyebrow">EVENT STREAK</p><strong>${attendanceStats.attended}</strong><span>EVENTS ATTENDED</span></div>
          <div class="streak-badge"><strong>${attendanceStats.streak}</strong><span>CURRENT STREAK</span></div>
        </article>
        <article class="gamification-card level-card ${level.slug}">
          <div class="level-medallion"><span>✦</span></div>
          <div><p class="eyebrow">EVENT LEVEL BADGE</p><strong>${level.name}</strong><span>${level.description}</span></div>
          <small>${level.next}</small>
        </article>
      </div>

      <div class="wallet-case-wrap">
        <div class="wallet-case" tabindex="0" aria-label="Campusly event wallet">
          <div class="wallet-case-top"><span>CAMPUSLY WALLET</span><b>${String(activePasses.length).padStart(2,"0")} PASSES</b></div>
          <div class="wallet-flap" aria-hidden="true"><div class="wallet-flap-logo">C</div><span>CAMPUSLY</span><i></i></div>
          <div class="wallet-cards">
            ${activePasses.length ? activePasses.map((event, index) => renderMiniPass(event, userName, userId, index)).join("") : `
              <div class="wallet-empty-mini"><span class="empty-wallet-icon">◌</span><p class="eyebrow">EMPTY WALLET</p><h2>No pass yet.</h2><button class="btn btn-dark" onclick="navigate('events')">Explore events ↗</button></div>
            `}
          </div>
          <div class="wallet-case-bottom"><span>SWIPE ↑ ↓ TO BROWSE</span><span>CLICK A PASS TO SCAN ↗</span></div>
        </div>
      </div>

      <div class="section-label certificate-heading">CERTIFICATES</div>
      <div class="certificate-list">
        ${certificates.map(certificate => `<article class="soft-card certificate"><div class="certificate-icon">✦</div><div><h3>${certificate.event}</h3><p>${certificate.type} · ${certificate.date}</p></div><button class="btn btn-outline" onclick="showCertificate('${certificate.event}')">View</button></article>`).join("")}
      </div>
    </section>
  `;
}

function getUserId() {
  const user = JSON.parse(localStorage.getItem("campuslyUser") || "null");
  return user?.id || "CLY-2026-042";
}

function qrMarkup(seed) {
  const size = 21;
  const cells = [];
  const finder = (x, y) => {
    for (let r = 0; r < 7; r++) for (let c = 0; c < 7; c++) {
      const edge = r === 0 || r === 6 || c === 0 || c === 6;
      const center = r >= 2 && r <= 4 && c >= 2 && c <= 4;
      cells.push(`<rect x="${(x+c)*10}" y="${(y+r)*10}" width="10" height="10" class="${edge || center ? 'qr-on' : 'qr-off'}"/>`);
    }
  };
  const reserved = (x, y) => (x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12);
  finder(0,0); finder(14,0); finder(0,14);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (reserved(x,y)) continue;
      const on = ((x*17 + y*31 + seed*19 + x*y*7) % 11) < 5;
      cells.push(`<rect x="${x*10}" y="${y*10}" width="10" height="10" class="${on ? 'qr-on' : 'qr-off'}"/>`);
    }
  }
  return `<div class="mini-qr" aria-label="QR code"><svg viewBox="0 0 210 210" role="img" aria-label="Dummy QR code"><rect width="210" height="210" fill="#fff"/>${cells.join("")}</svg></div>`;
}

function renderMiniPass(event, userName, userId, index) {
  const details = registrationDetails[event.id] || {};
  const isTeam = details.mode === "team";
  const passNo = `CP-${String(event.id).padStart(2,"0")}-${String(userId).slice(-3)}`;
  return `
    <button class="wallet-pass-card ${index === 0 ? 'wallet-pass-main' : ''}" style="--pass-index:${index}" onclick="selectWalletPass(this, ${event.id})" aria-label="Open ${event.title} pass">
      <div class="wallet-pass-top"><span>${event.category}</span><b>${isTeam ? 'TEAM' : 'INDIVIDUAL'}</b></div>
      <div class="wallet-pass-content">
        <div class="wallet-pass-copy"><small>CAMPUSLY EVENT PASS</small><h2>${event.title}</h2><p>${event.date} · ${event.time}</p><p>${event.venue}</p></div>
        <div class="wallet-pass-qr-wrap" onclick="event.stopPropagation();showPass(${event.id})" role="button" tabindex="0" aria-label="View QR for ${event.title}">${qrMarkup(event.id)}<span>VIEW QR</span></div>
      </div>
      <div class="wallet-pass-meta"><span>${userName}</span><span>${passNo}</span><span>ACTIVE</span></div>
    </button>
  `;
}

function setupWalletInteraction() {
  const wallet = document.querySelector('.wallet-case');
  if (!wallet) return;

  const cards = Array.from(wallet.querySelectorAll('.wallet-pass-card'));
  if (!cards.length) return;

  let closeTimer = null;
  let activeIndex = Math.max(0, cards.findIndex(card => card.classList.contains('wallet-pass-main')));

  const applyWalletBrowseState = () => {
    cards.forEach((card, index) => {
      card.classList.toggle('wallet-browse-active', index === activeIndex);
      card.setAttribute('aria-current', index === activeIndex ? 'true' : 'false');
    });
  };

  const open = () => {
    clearTimeout(closeTimer);
    wallet.classList.add('wallet-open');
    applyWalletBrowseState();
  };

  const close = () => {
    clearTimeout(closeTimer);
    closeTimer = setTimeout(() => {
      wallet.classList.remove('wallet-open');
      cards.forEach(card => card.classList.remove('wallet-browse-active'));
    }, 180);
  };

  const moveActive = direction => {
    const next = activeIndex + direction;
    if (next < 0 || next >= cards.length) return false;
    activeIndex = next;
    open();
    applyWalletBrowseState();
    return true;
  };

  // Store the controls on the wallet so the global gesture shield can
  // consume wheel/touch gestures without ever letting the page scroll.
  wallet.__campuslyWalletMove = moveActive;
  wallet.__campuslyWalletOpen = open;

  wallet.addEventListener('pointerenter', open);
  wallet.addEventListener('pointerleave', close);
  wallet.addEventListener('focusin', open);
  wallet.addEventListener('focusout', event => {
    if (!wallet.contains(event.relatedTarget)) close();
  });

  wallet.addEventListener('keydown', event => {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      moveActive(-1);
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      moveActive(1);
    }
  });

  applyWalletBrowseState();
  installWalletGestureShield();
}

function installWalletGestureShield() {
  if (window.__campuslyWalletGestureShieldInstalled) return;
  window.__campuslyWalletGestureShieldInstalled = true;

  let wheelAccumulated = 0;
  let wheelLockedUntil = 0;
  let touchStartY = null;
  let touchStartWallet = null;
  let touchHandled = false;

  const getWalletFromTarget = target => {
    if (!(target instanceof Element)) return null;
    return target.closest('.wallet-case');
  };

  // CAPTURE PHASE: wallet wheel events are intercepted before the browser
  // gets a chance to scroll the document. Outside the wallet, nothing is done.
  document.addEventListener('wheel', event => {
    const wallet = getWalletFromTarget(event.target);
    if (!wallet || typeof wallet.__campuslyWalletMove !== 'function') return;

    event.preventDefault();
    event.stopPropagation();

    const now = performance.now();
    wheelAccumulated += event.deltaY;

    // One pass per meaningful wheel gesture rather than jumping several
    // passes during a single high-resolution trackpad scroll.
    if (now < wheelLockedUntil) return;
    if (Math.abs(wheelAccumulated) < 28) return;

    const direction = wheelAccumulated > 0 ? 1 : -1;
    wheelAccumulated = 0;
    wheelLockedUntil = now + 220;
    wallet.__campuslyWalletMove(direction);
  }, { passive: false, capture: true });

  // TOUCH: prevent native document scrolling only while the finger is inside
  // the wallet. Outside the wallet, the site's normal page scroll remains.
  document.addEventListener('touchstart', event => {
    const wallet = getWalletFromTarget(event.target);
    if (!wallet || event.touches.length !== 1) return;
    touchStartY = event.touches[0].clientY;
    touchStartWallet = wallet;
    touchHandled = false;
  }, { passive: false, capture: true });

  document.addEventListener('touchmove', event => {
    if (!touchStartWallet || event.touches.length !== 1) return;
    // Lock native page scrolling for the duration of the wallet gesture.
    event.preventDefault();
    event.stopPropagation();
  }, { passive: false, capture: true });

  document.addEventListener('touchend', event => {
    if (!touchStartWallet || !event.changedTouches.length) return;

    const endY = event.changedTouches[0].clientY;
    const distance = touchStartY - endY;
    const wallet = touchStartWallet;

    touchStartY = null;
    touchStartWallet = null;

    if (Math.abs(distance) < 42) return;
    if (touchHandled) return;
    touchHandled = true;

    event.preventDefault();
    event.stopPropagation();
    wallet.__campuslyWalletMove(distance > 0 ? 1 : -1);
  }, { passive: false, capture: true });
}

function selectWalletPass(card, eventId) {
  const wallet = card.closest(".wallet-case");
  if (!wallet) return;
  wallet.classList.add("wallet-open");
  wallet.querySelectorAll(".wallet-pass-card").forEach(item => item.classList.remove("wallet-browse-active"));
  card.classList.add("wallet-browse-active", "is-selected");
  showPass(eventId);
}

function showPass(id) {
  const event = events.find(item => item.id === Number(id));
  if (!event) return;
  const details = registrationDetails[event.id] || {};
  const userName = getUserName() || "Aarav Sharma";
  const userId = getUserId();
  const isTeam = details.mode === "team";
  const passNo = `CP-${String(event.id).padStart(2,"0")}-${String(userId).slice(-3)}`;
  document.getElementById("modalContent").innerHTML = `
    <div class="scan-pass-modal">
      <div class="scan-pass-head"><div><p class="eyebrow">CAMPUSLY WALLET</p><h2>${event.title}</h2><p>${event.date} · ${event.time} · ${event.venue}</p></div><span class="pass-live">ACTIVE</span></div>
      <div class="scan-pass-body">
        <div class="scan-pass-info"><span>PASS HOLDER</span><strong>${userName}</strong><span>STUDENT ID</span><strong>${userId}</strong><span>PASS NO.</span><strong>${passNo}</strong><span>ENTRY</span><strong>${isTeam ? `TEAM · ${details.teamName || 'REGISTERED'}` : 'INDIVIDUAL'}</strong></div>
        <div class="scan-qr-large">${qrMarkup(event.id + 5)}</div>
      </div>
      <p class="scan-note">Ye QR event entry par scan karne ke liye ready hai. Organizer scanner isi pass ID se match karega.</p>
      <div class="pass-preview-actions"><button class="btn btn-dark" onclick="closeModal();showToast('Pass opened for scanning.')">Ready to scan ↗</button><button class="btn btn-outline" onclick="closeModal();navigate('scanner')">Open scanner ↗</button></div>
    </div>
  `;
  document.getElementById("modal").classList.remove("hidden");
}


function getEventLevel(attended) {
  if (attended >= 20) return { name: "Campus Legend", slug: "legend", description: "Top-tier campus explorer", next: "You are at the top level" };
  if (attended >= 10) return { name: "Gold Explorer", slug: "gold", description: "10+ events completed", next: "8 more for Campus Legend" };
  if (attended >= 5) return { name: "Silver Explorer", slug: "silver", description: "5+ events completed", next: `${10 - attended} more for Gold Explorer` };
  return { name: "Bronze Explorer", slug: "bronze", description: "Your campus journey starts here", next: `${5 - attended} more for Silver Explorer` };
}

function renderGallery() {
  return `
    <section class="page gallery-page">
      <div class="page-header">
        <div><p class="eyebrow">CAMPUS MOMENTS</p><h1>Your<br><span>gallery.</span></h1></div>
        <div class="gallery-header-actions">
          <p>Save your favourite campus moments. Everything is kept locally in this demo, so no backend is required.</p>
          <label class="btn btn-dark upload-photo-btn">Upload Photo<input type="file" id="galleryUpload" accept="image/*" multiple hidden onchange="handleGalleryUpload(event)"></label>
        </div>
      </div>

      <div class="gallery-grid">
        ${galleryItems.map((item, index) => `
          <article class="gallery-card ${index % 3 === 1 ? 'gallery-card-tall' : ''}">
            <div class="gallery-image-wrap"><img src="${item.src}" alt="${item.title}" loading="lazy"><div class="gallery-overlay"><span>${item.caption || 'Campusly moment'}</span></div></div>
            <div class="gallery-info"><div><small>${item.demo ? 'DEMO PHOTO' : 'UPLOADED PHOTO'}</small><h3>${item.title || 'Campus moment'}</h3></div><div class="gallery-actions"><button class="btn btn-outline" onclick="downloadGalleryImage('${item.id}')">Download</button><button class="btn btn-outline" onclick="shareGallery('LinkedIn', '${item.title || 'Campus moment'}')">LinkedIn</button><button class="btn btn-outline" onclick="shareGallery('Instagram', '${item.title || 'Campus moment'}')">Instagram</button></div></div>
          </article>
        `).join('')}
      </div>
    </section>
  `;
}

function handleGalleryUpload(event) {
  const files = Array.from(event.target.files || []);
  if (!files.length) return;

  let pending = files.filter(file => file.type.startsWith('image/'));
  if (!pending.length) return showToast('Please choose an image file.');

  let remaining = pending.length;
  pending.forEach((file, index) => {
    if (file.size > 1500000) {
      showToast('Please keep images under 1.5 MB for this local demo.');
      remaining -= 1;
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      galleryItems.unshift({
        id: `upload-${Date.now()}-${index}`,
        src: reader.result,
        title: file.name.replace(/\.[^/.]+$/, ''),
        caption: 'Uploaded from your device',
        demo: false
      });
      remaining -= 1;
      if (remaining === 0) {
        galleryItems = galleryItems.slice(0, 12);
        saveData('campuslyGalleryItems', galleryItems);
        navigate('gallery');
        showToast('Photo added to your Campusly gallery.');
      }
    };
    reader.readAsDataURL(file);
  });
}

function findGalleryItem(id) {
  return galleryItems.find(item => item.id === id);
}

function downloadGalleryImage(id) {
  const item = findGalleryItem(id);
  if (!item) return;
  if (item.src.startsWith('data:')) {
    const link = document.createElement('a');
    link.href = item.src;
    link.download = `${(item.title || 'campusly-photo').replace(/\s+/g, '-').toLowerCase()}.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    showToast('Photo download started.');
  } else {
    window.open(item.src, '_blank', 'noopener');
    showToast('Demo photo opened in a new tab.');
  }
}

function shareGallery(platform, title) {
  showToast(`${platform} share is ready for “${title}” in this demo.`);
}

function renderScanner() {
  const currentUserId = getUserId();
  const examplePass = `CP-${String(registrations[0] || 2).padStart(2, '0')}-${String(currentUserId).slice(-3)}`;
  return `
    <section class="page scanner-page">
      <div class="page-header">
        <div><p class="eyebrow">ORGANISER TOOL</p><h1>Scan a<br><span>pass.</span></h1></div>
        <p>Enter a pass ID or student ID to simulate the QR validation flow. The demo matches the same ID used on the generated wallet pass.</p>
      </div>

      <div class="scanner-layout">
        <article class="scanner-panel soft-card">
          <div class="scanner-frame"><div class="scanner-corner top-left"></div><div class="scanner-corner top-right"></div><div class="scanner-corner bottom-left"></div><div class="scanner-corner bottom-right"></div><div class="scanner-line"></div><div class="scanner-center">QR</div></div>
          <p class="eyebrow">DEMO SCANNER</p>
          <h2>Verify a Campusly pass</h2>
          <p>Use a pass number like <strong>${examplePass}</strong> to verify the registered attendee.</p>
          <div class="scanner-input-row"><input id="scannerPassId" value="${examplePass}" placeholder="CP-02-042" aria-label="Pass ID"><button class="btn btn-dark" onclick="verifyPass()">Check Pass</button></div>
          <div class="scanner-result" id="scannerResult">${scannerResult ? renderScannerResult(scannerResult) : '<div class="scanner-idle">Waiting for a pass…</div>'}</div>
        </article>

        <aside class="soft-card scanner-info-card">
          <p class="eyebrow">MATCH RULE</p>
          <h3>Pass ID ↔ Student ID</h3>
          <p>The pass format is <strong>CP-[EVENT]-[STUDENT ID]</strong>. It is the same ID shown on the wallet pass and QR preview.</p>
          <div class="scanner-stats"><div><strong>${attendanceStats.attended}</strong><span>ATTENDED</span></div><div><strong>${attendanceStats.streak}</strong><span>STREAK</span></div><div><strong>${getEventLevel(attendanceStats.attended).name}</strong><span>LEVEL</span></div></div>
        </aside>
      </div>
    </section>
  `;
}

function renderScannerResult(result) {
  if (!result) return '';
  if (!result.valid) return `<div class="scanner-result-card invalid"><span>×</span><div><strong>Pass not found</strong><small>${result.message}</small></div></div>`;
  return `<div class="scanner-result-card valid"><span>✓</span><div><strong>${result.event.title}</strong><small>${result.userName} · ${result.passNo} · ${result.already ? 'Already checked in' : 'Attendance marked'}</small></div><b>VALID</b></div>`;
}

function verifyPass() {
  const input = document.getElementById('scannerPassId');
  const value = (input?.value || '').trim().toUpperCase();
  const match = value.match(/^CP-(\d+)-(\d{3})$/);
  if (!match) {
    scannerResult = { valid: false, message: 'Use a pass ID like CP-02-042.' };
    navigate('scanner');
    return;
  }

  const eventId = Number(match[1]);
  const studentSuffix = match[2];
  const event = events.find(item => item.id === eventId);
  const user = JSON.parse(localStorage.getItem('campuslyUser') || 'null') || {};
  const currentSuffix = String(getUserId()).slice(-3);
  if (!event || studentSuffix !== currentSuffix || !registrations.includes(eventId)) {
    scannerResult = { valid: false, message: 'This demo pass does not match a registered Campusly ID on this device.' };
    navigate('scanner');
    return;
  }

  const recordKey = `${eventId}-${studentSuffix}`;
  const already = attendanceRecords.includes(recordKey);
  if (!already) {
    attendanceRecords.push(recordKey);
    attendanceStats.attended += 1;
    attendanceStats.streak += 1;
    saveData('campuslyAttendanceRecords', attendanceRecords);
    saveData('campuslyAttendanceStats', attendanceStats);
  }

  scannerResult = { valid: true, already, event, userName: user.name || getUserName() || 'Aarav Sharma', passNo: value };
  navigate('scanner');
  showToast(already ? 'Pass already checked in.' : 'Attendance marked successfully.');
}

function renderProfile() {
  const user = JSON.parse(localStorage.getItem("campuslyUser") || "null") || {};
  const profile = {
    name: user.name || (currentRole === "organiser" ? "Campusly Organizer" : "Campusly Attendee"),
    email: user.email || "demo@campusly.app",
    college: user.college || "Campusly Demo College",
    department: user.department || (currentRole === "organiser" ? "Student Activities" : "Computer Science"),
    year: user.year || "3rd Year",
    id: user.id || `CLY-2026-${String(Math.floor(100 + Math.random() * 900))}`,
    bio: user.bio || "Campusly member exploring events, communities and campus experiences.",
    interests: user.interests || ["Technology", "Culture", "Design"],
    joined: user.joined || "Aug 2026"
  };

  if (!user.id || !user.joined) {
    const updatedUser = { ...user, id: profile.id, joined: profile.joined };
    localStorage.setItem("campuslyUser", JSON.stringify(updatedUser));
  }

  const activePasses = events.filter(event => registrations.includes(event.id));
  const attendance = Math.max(0, Number(attendanceStats.attended || 0));
  const streak = Math.max(0, Number(attendanceStats.streak || 0));
  const level = attendance >= 25 ? "Campus Legend" : attendance >= 15 ? "Gold Explorer" : attendance >= 8 ? "Silver Explorer" : "Bronze Explorer";
  const levelNext = attendance >= 25 ? "Max level reached" : attendance >= 15 ? `${25 - attendance} more attended events to Campus Legend` : attendance >= 8 ? `${15 - attendance} more attended events to Gold Explorer` : `${8 - attendance} more attended events to Silver Explorer`;
  const completionFields = [profile.name, profile.email, profile.college, profile.department, profile.year, profile.bio];
  const completion = Math.round((completionFields.filter(Boolean).length / completionFields.length) * 100);
  const recent = [
    ...activePasses.slice(0, 2).map(event => ({ label: "Event pass active", title: event.title, meta: `${event.date} · ${event.venue}` })),
    ...certificates.slice(0, 2).map(certificate => ({ label: "Certificate added", title: certificate.event, meta: `${certificate.type} · ${certificate.date}` }))
  ].slice(0, 4);

  return `
    <section class="page profile-page">
      <div class="page-header">
        <div>
          <p class="eyebrow">MY PROFILE</p>
          <h1>Your<br><span>profile.</span></h1>
        </div>
        <p>Your Campusly identity, activity, achievements and event journey — all in one place.</p>
      </div>

      <div class="profile-hero-grid">
        <article class="profile-card-main profile-identity-card">
          <div class="profile-identity-top">
            <div class="profile-big-avatar">${profile.name.charAt(0).toUpperCase()}</div>
            <div class="profile-level-badge">
              <span class="profile-level-dot"></span>
              ${level}
            </div>
          </div>
          <p class="eyebrow">${currentRole.toUpperCase()}</p>
          <h2>${escapeHtml(profile.name)}</h2>
          <p class="profile-bio">${escapeHtml(profile.bio)}</p>
          <div class="profile-info-grid">
            <div><span>EMAIL</span><strong>${escapeHtml(profile.email)}</strong></div>
            <div><span>CAMPUSLY ID</span><strong>${escapeHtml(profile.id)}</strong></div>
            <div><span>COLLEGE</span><strong>${escapeHtml(profile.college)}</strong></div>
            <div><span>DEPARTMENT</span><strong>${escapeHtml(profile.department)}</strong></div>
            <div><span>YEAR</span><strong>${escapeHtml(profile.year)}</strong></div>
            <div><span>MEMBER SINCE</span><strong>${escapeHtml(profile.joined)}</strong></div>
          </div>
          <div class="profile-chip-row">${profile.interests.map(item => `<span>${escapeHtml(item)}</span>`).join("")}</div>
          <div class="profile-actions">
            <button class="btn btn-dark" onclick="openEditProfile()">Edit profile</button>
            <button class="btn btn-outline" onclick="navigate('wallet')">View wallet ↗</button>
          </div>
        </article>

        <div class="profile-right-column">
          <article class="profile-completion-card">
            <div class="profile-card-heading"><div><p class="eyebrow">PROFILE HEALTH</p><h3>${completion}% complete</h3></div><span>${completion >= 90 ? 'READY' : 'ADD DETAILS'}</span></div>
            <div class="profile-progress"><i style="width:${completion}%"></i></div>
            <p>Complete the profile so your event passes and participation records stay consistent.</p>
          </article>

          <div class="profile-stats profile-stat-grid">
            <article><strong>${activePasses.length}</strong><span>ACTIVE PASSES</span></article>
            <article><strong>${registrations.length}</strong><span>REGISTRATIONS</span></article>
            <article><strong>${attendance}</strong><span>EVENTS ATTENDED</span></article>
            <article><strong>${streak}</strong><span>CURRENT STREAK</span></article>
            <article><strong>${certificates.length}</strong><span>CERTIFICATES</span></article>
            <article><strong>${galleryItems.length}</strong><span>GALLERY POSTS</span></article>
          </div>
        </div>
      </div>

      <div class="profile-section-grid">
        <article class="soft-card profile-achievement-card">
          <div class="profile-section-heading"><div><p class="eyebrow">ACHIEVEMENT</p><h3>${level}</h3></div><div class="profile-achievement-icon">✦</div></div>
          <p>Attendance-based campus level earned from your participation history.</p>
          <div class="profile-level-track">
            <div class="profile-level-step ${attendance >= 0 ? 'done' : ''}"><span>Bronze</span></div>
            <div class="profile-level-step ${attendance >= 8 ? 'done' : ''}"><span>Silver</span></div>
            <div class="profile-level-step ${attendance >= 15 ? 'done' : ''}"><span>Gold</span></div>
            <div class="profile-level-step ${attendance >= 25 ? 'done' : ''}"><span>Legend</span></div>
          </div>
          <small>${levelNext}</small>
        </article>

        <article class="soft-card profile-activity-card">
          <div class="profile-section-heading"><div><p class="eyebrow">RECENT ACTIVITY</p><h3>Your campus trail</h3></div></div>
          <div class="profile-activity-list">
            ${recent.length ? recent.map(item => `
              <div class="profile-activity-item">
                <span class="profile-activity-dot"></span>
                <div><small>${escapeHtml(item.label)}</small><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.meta)}</p></div>
              </div>
            `).join("") : `<div class="profile-empty-activity">Start exploring events to build your activity trail.</div>`}
          </div>
        </article>
      </div>

      <div class="profile-section-heading profile-quick-heading"><div><p class="eyebrow">QUICK ACCESS</p><h3>Jump back into Campusly</h3></div></div>
      <div class="profile-quick-actions">
        <button class="soft-card profile-quick-action" onclick="navigate('events')"><span>01</span><strong>Explore events</strong><small>Find something new</small>↗</button>
        <button class="soft-card profile-quick-action" onclick="navigate('registrations')"><span>02</span><strong>My registrations</strong><small>See upcoming events</small>↗</button>
        <button class="soft-card profile-quick-action" onclick="navigate('gallery')"><span>03</span><strong>My gallery</strong><small>Your event moments</small>↗</button>
        <button class="soft-card profile-quick-action" onclick="navigate('wallet')"><span>04</span><strong>My passes</strong><small>Open your QR passes</small>↗</button>
      </div>
    </section>
  `;
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>'"]/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;","\"":"&quot;"}[char]));
}

function openEditProfile() {
  const user = JSON.parse(localStorage.getItem("campuslyUser") || "null") || {};
  const current = {
    name: user.name || (currentRole === "organiser" ? "Campusly Organizer" : "Campusly Attendee"),
    email: user.email || "demo@campusly.app",
    college: user.college || "Campusly Demo College",
    department: user.department || (currentRole === "organiser" ? "Student Activities" : "Computer Science"),
    year: user.year || "3rd Year",
    bio: user.bio || "Campusly member exploring events, communities and campus experiences."
  };
  document.getElementById("modalContent").innerHTML = `
    <p class="eyebrow">PROFILE SETTINGS</p>
    <h2>Edit your profile</h2>
    <form class="profile-edit-form" onsubmit="saveProfile(event)">
      <div class="profile-edit-grid">
        <label><span>Full name</span><input id="profileEditName" value="${escapeHtml(current.name)}" required></label>
        <label><span>Email</span><input id="profileEditEmail" type="email" value="${escapeHtml(current.email)}" required></label>
        <label><span>College</span><input id="profileEditCollege" value="${escapeHtml(current.college)}" required></label>
        <label><span>Department</span><input id="profileEditDepartment" value="${escapeHtml(current.department)}"></label>
        <label><span>Year</span><select id="profileEditYear"><option ${current.year === '1st Year' ? 'selected' : ''}>1st Year</option><option ${current.year === '2nd Year' ? 'selected' : ''}>2nd Year</option><option ${current.year === '3rd Year' ? 'selected' : ''}>3rd Year</option><option ${current.year === '4th Year' ? 'selected' : ''}>4th Year</option><option ${current.year === 'Postgraduate' ? 'selected' : ''}>Postgraduate</option></select></label>
        <label class="full"><span>Bio</span><textarea id="profileEditBio" rows="4">${escapeHtml(current.bio)}</textarea></label>
      </div>
      <button class="btn btn-dark" type="submit">Save profile</button>
    </form>
  `;
  document.getElementById("modal").classList.remove("hidden");
}

function saveProfile(event) {
  event.preventDefault();
  const user = JSON.parse(localStorage.getItem("campuslyUser") || "null") || {};
  const updated = {
    ...user,
    name: document.getElementById("profileEditName").value.trim(),
    email: document.getElementById("profileEditEmail").value.trim(),
    college: document.getElementById("profileEditCollege").value.trim(),
    department: document.getElementById("profileEditDepartment").value.trim(),
    year: document.getElementById("profileEditYear").value,
    bio: document.getElementById("profileEditBio").value.trim() || "Campusly member exploring events, communities and campus experiences.",
    role: currentRole,
    id: user.id || `CLY-2026-${String(Math.floor(100 + Math.random() * 900))}`,
    joined: user.joined || "Aug 2026"
  };
  localStorage.setItem("campuslyUser", JSON.stringify(updated));
  updateUserInterface();
  closeModal();
  navigate("profile");
  showToast("Profile updated successfully.");
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
            <div class="form-field">
              <label>Registration type</label>
              <select id="newRegistrationMode"><option value="individual">Individual</option><option value="team">Team</option></select>
            </div>
            <div class="form-field" id="teamRangeFields">
              <label>Team size</label>
              <input id="newTeamRange" placeholder="2-4" value="2-4">
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
    registrationMode: document.getElementById("newRegistrationMode").value,
    teamMin: Number((document.getElementById("newTeamRange").value.split("-")[0] || 2)),
    teamMax: Number((document.getElementById("newTeamRange").value.split("-")[1] || 4)),
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


/* ---------- SIMPLE CARD + NAV MOTION ---------- */

function setupEventCardMotion() {
  const cards = document.querySelectorAll(".event-card");
  if (!cards.length || window.matchMedia("(pointer: coarse)").matches) return;

  cards.forEach(card => {
    if (card.dataset.motionReady === "true") return;
    card.dataset.motionReady = "true";

    card.addEventListener("pointermove", event => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rotateY = (x - 0.5) * 5;
      const rotateX = (0.5 - y) * 5;

      card.style.setProperty("--card-x", `${x * 100}%`);
      card.style.setProperty("--card-y", `${y * 100}%`);
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-7px) scale(1.012)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });

    card.addEventListener("click", event => {
      if (event.target.closest("button, a, input, select, textarea")) return;
      const id = Number(card.dataset.eventId);
      if (!id) return;

      const ripple = document.createElement("span");
      ripple.className = "card-ripple";
      const rect = card.getBoundingClientRect();
      ripple.style.left = (event.clientX - rect.left) + "px";
      ripple.style.top = (event.clientY - rect.top) + "px";
      card.appendChild(ripple);
      setTimeout(() => ripple.remove(), 550);
      showEvent(id);
    });
  });
}

function setupNavbarMotion() {
  const navbar = document.querySelector(".navbar");
  const progress = document.getElementById("scrollProgress");
  if (!navbar) return;

  const update = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 12);
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const amount = max > 0 ? (window.scrollY / max) * 100 : 0;
      progress.style.width = amount + "%";
    }
  };
  update();
  window.addEventListener("scroll", update, { passive: true });
}

function setupBackgroundMotion() {
  const app = document.getElementById("app");
  if (!app || window.matchMedia("(pointer: coarse)").matches) return;

  let raf = 0;
  document.addEventListener("mousemove", event => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const x = (event.clientX / window.innerWidth - 0.5) * 22;
      const y = (event.clientY / window.innerHeight - 0.5) * 22;
      app.style.setProperty("--mx", `${x}px`);
      app.style.setProperty("--my", `${y}px`);
      document.querySelectorAll(".pin-note, .pin-blob").forEach((el, i) => {
        const depth = (i % 3 + 1) * 0.22;
        el.style.setProperty("--parallax-x", `${x * depth}px`);
        el.style.setProperty("--parallax-y", `${y * depth}px`);
      });
    });
  });
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
  localStorage.removeItem("campuslyRole");
  localStorage.removeItem("campuslyUser");
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
  setupNavbarMotion();
  setupBackgroundMotion();
});



window.addEventListener("load", () => { setTimeout(hideLoading, 700); });
