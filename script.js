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

let events = normalizeEvents(loadData("campuslyEvents", defaultEvents));
let registrations = loadData("campuslyRegistrations", []);
let registrationDetails = loadData("campuslyRegistrationDetails", {});
let certificates = loadData("campuslyCertificates", []);

let attendanceStats = loadData("campuslyAttendanceStats", { attended: 0, streak: 0 });
let attendanceRecords = loadData("campuslyAttendanceRecords", []);
let galleryItems = loadData("campuslyGalleryItems", [
  { id: "demo-1", eventId: 1, src: defaultEvents[0].image, title: "Hack the Campus — Opening", caption: "Innovation Lab · Tech Society", teamMember: "Tech Society Team", demo: true },
  { id: "demo-1b", eventId: 1, src: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1000&q=80", title: "Hack the Campus — Team Huddle", caption: "Innovation Lab", teamMember: "Aarav · Team Lead", demo: true },
  { id: "demo-2", eventId: 2, src: defaultEvents[1].image, title: "Rang — Stage Lights", caption: "Open Air Theatre · Cultural Committee", teamMember: "Cultural Committee", demo: true },
  { id: "demo-2b", eventId: 2, src: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80", title: "Rang — Backstage", caption: "Open Air Theatre", teamMember: "Nandita · Media Team", demo: true },
  { id: "demo-3", eventId: 3, src: defaultEvents[2].image, title: "Campus Cup — Finals", caption: "Main Sports Ground · Sports Council", teamMember: "Sports Council", demo: true },
  { id: "demo-3b", eventId: 3, src: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1000&q=80", title: "Campus Cup — Team Moments", caption: "Main Sports Ground", teamMember: "UV · Sports Media", demo: true },
  { id: "demo-4", eventId: 6, src: defaultEvents[5].image, title: "Unplugged Sessions — Live", caption: "Student Plaza · Music Society", teamMember: "Music Society", demo: true }
]);
let selectedGalleryEventId = Number(localStorage.getItem("campuslyGalleryEventId") || 0) || null;
let scannerResult = null;

let currentRole = "attendee";
let currentPage = "home";
let loadingTimer = null;

// Link legacy gallery demo items to their event albums.
galleryItems = galleryItems.map(item => {
  if (item.eventId) return item;
  const matchingEvent = events.find(event => event.title === item.title || String(item.title || '').includes(event.title));
  return { ...item, eventId: matchingEvent ? matchingEvent.id : events[0]?.id, teamMember: item.teamMember || 'Campusly Team' };
});
saveData("campuslyGalleryItems", galleryItems);
if (selectedGalleryEventId && !events.some(event => event.id === selectedGalleryEventId)) selectedGalleryEventId = null;

/* =========================================================
   MODES · SHARED PASS REGISTRY · NOTIFICATIONS · QR
   ========================================================= */
const PASS_KEY = "campuslyPassRegistry";

function currentUser() { try { return JSON.parse(localStorage.getItem("campuslyUser") || "null") || {}; } catch (e) { return {}; } }
function currentUid() { const u = currentUser(); return u.uid || u.email || "guest"; }
function getMode(session) {
  const saved = localStorage.getItem(`campuslyMode:${currentUid()}`);
  return saved === "organiser" || saved === "attendee" ? saved : (session?.role === "organiser" ? "organiser" : "attendee");
}
function roleLabel(role = currentRole) { return role === "organiser" ? "Organizer" : "Participant"; }
function switchMode(target) {
  const next = typeof target === "string" ? target : (currentRole === "organiser" ? "attendee" : "organiser");
  if (next === currentRole) return;
  localStorage.setItem(`campuslyMode:${currentUid()}`, next);
  showLoading(700);
  window.location.href = "home.html";
}
function isOwnEvent(event) { return !!event.createdBy && event.createdBy === currentUid(); }
let eventsScope = "all";
function visibleEvents() { return currentRole === "organiser" ? [...events.filter(isOwnEvent), ...events.filter(e => !isOwnEvent(e))] : events; }
function scopedEvents() { return currentRole === "organiser" && eventsScope === "mine" ? events.filter(isOwnEvent) : visibleEvents(); }
function galleryEvents() { return currentRole === "organiser" ? events.filter(isOwnEvent) : events.filter(e => registrations.includes(e.id)); }

function readRegistry() { try { return JSON.parse(localStorage.getItem(PASS_KEY) || "[]"); } catch (e) { return []; } }
function writeRegistry(list) { localStorage.setItem(PASS_KEY, JSON.stringify(list)); }
function eventRegistry(eventId) { return readRegistry().filter(r => Number(r.eventId) === Number(eventId)); }
function passNoFor(eventId) { const r = readRegistry().find(r => r.uid === currentUid() && Number(r.eventId) === Number(eventId)); return r ? r.passNo : ""; }
function addRegistryEntry(event, data) {
  const list = readRegistry(), uid = currentUid();
  if (list.some(r => r.uid === uid && r.eventId === event.id)) return;
  const base = `CP-${String(event.id).padStart(2, "0")}-${String(getUserId()).slice(-3)}`;
  let passNo = base, n = 1;
  while (list.some(r => r.passNo === passNo)) passNo = `${base}-${++n}`;
  list.push({ passNo, eventId: event.id, uid, userId: getUserId(), name: data.name, email: data.email, college: data.college, mode: data.mode, teamName: data.teamName || "", registeredAt: new Date().toISOString(), attended: false, attendedAt: null, certificate: null });
  writeRegistry(list);
}
function removeRegistryEntry(eventId) { writeRegistry(readRegistry().filter(r => !(r.uid === currentUid() && r.eventId === eventId))); }

// Participant stats + certificates are derived from the registry, so organiser actions reach the participant.
function syncRecords() {
  const uid = currentUid();
  registrations.forEach(id => {
    const d = registrationDetails[id], ev = events.find(e => e.id === id);
    if (ev && d) addRegistryEntry(ev, d);
  });
  const mine = readRegistry().filter(r => r.uid === uid);
  const attended = mine.filter(r => r.attended).length;
  attendanceStats = { attended, streak: attended };
  certificates = mine.filter(r => r.certificate).map(r => ({ eventId: r.eventId, event: (events.find(e => e.id === r.eventId) || {}).title || "Event", type: r.certificate.type, date: r.certificate.date, passNo: r.passNo }));
}

function setAttendance(passNo, present) {
  const list = readRegistry(), entry = list.find(r => r.passNo === passNo);
  if (!entry) return null;
  entry.attended = present;
  entry.attendedAt = present ? new Date().toISOString() : null;
  writeRegistry(list);
  const ev = events.find(e => e.id === entry.eventId);
  if (present) pushNotification(entry.uid, "attendee", "Attendance marked", `You were checked in to ${ev ? ev.title : "an event"}.`);
  return entry;
}
function issueCertificate(passNo, type) {
  const list = readRegistry(), entry = list.find(r => r.passNo === passNo);
  if (!entry || !entry.attended) return false;
  entry.certificate = { type, date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) };
  writeRegistry(list);
  const ev = events.find(e => e.id === entry.eventId);
  pushNotification(entry.uid, "attendee", "Certificate issued", `Your ${type.toLowerCase()} certificate for ${ev ? ev.title : "an event"} is ready.`);
  return true;
}

/* ---------- Notifications (real events only; the dot shows only when something is unread) ---------- */
function readNotifications(uid = currentUid()) { try { return JSON.parse(localStorage.getItem(`campuslyNotifications:${uid}`) || "[]"); } catch (e) { return []; } }
function pushNotification(uid, mode, title, text) {
  if (!uid) return;
  const list = readNotifications(uid);
  list.unshift({ id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, mode, title, text, time: new Date().toISOString(), read: false });
  localStorage.setItem(`campuslyNotifications:${uid}`, JSON.stringify(list.slice(0, 40)));
  if (uid === currentUid()) renderNotificationBadge();
}
function myNotifications() { return readNotifications().filter(n => n.mode === currentRole); }
function renderNotificationBadge() {
  document.querySelector(".notification-btn")?.classList.toggle("has-unread", myNotifications().some(n => !n.read));
}
function timeAgo(iso) {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  if (mins < 1440) return `${Math.round(mins / 60)} h ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
function toggleNotifications(e) {
  e?.stopPropagation();
  document.getElementById("profileMenu")?.classList.remove("show");
  let panel = document.getElementById("notifPanel");
  if (!panel) { panel = document.createElement("div"); panel.id = "notifPanel"; panel.className = "notif-panel"; document.querySelector(".nav-actions")?.appendChild(panel); }
  if (panel.classList.contains("show")) { panel.classList.remove("show"); return; }
  const mine = myNotifications();
  panel.innerHTML = `<div class="notif-head"><strong>Notifications</strong>${mine.length ? '<button type="button" onclick="clearNotifications()">Clear</button>' : ""}</div>` +
    (mine.length ? mine.map(n => `<div class="notif-item ${n.read ? "" : "unread"}"><strong>${escapeHtml(n.title)}</strong><p>${escapeHtml(n.text)}</p><small>${timeAgo(n.time)}</small></div>`).join("")
      : `<div class="notif-empty">You're all caught up. Registrations, check-ins and certificates will show up here.</div>`);
  panel.classList.add("show");
  const all = readNotifications().map(n => n.mode === currentRole ? { ...n, read: true } : n);
  localStorage.setItem(`campuslyNotifications:${currentUid()}`, JSON.stringify(all));
  renderNotificationBadge();
}
function clearNotifications() {
  localStorage.setItem(`campuslyNotifications:${currentUid()}`, JSON.stringify(readNotifications().filter(n => n.mode !== currentRole)));
  document.getElementById("notifPanel")?.classList.remove("show");
  renderNotificationBadge();
}
document.addEventListener("click", e => { if (!e.target.closest(".notif-panel, .notification-btn")) document.getElementById("notifPanel")?.classList.remove("show"); });

/* ---------- Real, scannable QR code (byte mode, error correction M, versions 1-10) ---------- */
function qrMatrix(text) {
  const bytes = Array.from(new TextEncoder().encode(text));
  const EC = [0, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26], BL = [0, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5];
  const raw = v => { let r = (16 * v + 128) * v + 64; if (v >= 2) { const a = Math.floor(v / 7) + 2; r -= (25 * a - 10) * a - 55; if (v >= 7) r -= 36; } return r; };
  let ver = 1;
  for (; ; ver++) {
    if (ver > 10) throw new Error("QR payload too long");
    if (4 + (ver < 10 ? 8 : 16) + bytes.length * 8 <= (Math.floor(raw(ver) / 8) - EC[ver] * BL[ver]) * 8) break;
  }
  const cap = Math.floor(raw(ver) / 8) - EC[ver] * BL[ver], d = EC[ver];
  const bits = [], put = (v, n) => { for (let i = n - 1; i >= 0; i--) bits.push((v >>> i) & 1); };
  put(4, 4); put(bytes.length, ver < 10 ? 8 : 16); bytes.forEach(b => put(b, 8));
  put(0, Math.min(4, cap * 8 - bits.length)); while (bits.length % 8) bits.push(0);
  for (let p = 0xEC; bits.length < cap * 8; p ^= 0xEC ^ 0x11) put(p, 8);
  const data = []; for (let i = 0; i < bits.length; i += 8) data.push(parseInt(bits.slice(i, i + 8).join(""), 2));
  const mul = (x, y) => { let z = 0; for (let i = 7; i >= 0; i--) { z = (z << 1) ^ ((z >>> 7) * 0x11D); z ^= ((y >>> i) & 1) * x; } return z; };
  const div = new Array(d).fill(0); div[d - 1] = 1; let root = 1;
  for (let i = 0; i < d; i++) { for (let j = 0; j < d; j++) { div[j] = mul(div[j], root); if (j + 1 < d) div[j] ^= div[j + 1]; } root = mul(root, 2); }
  const rs = block => { const r = new Array(d).fill(0); block.forEach(b => { const f = b ^ r.shift(); r.push(0); div.forEach((c, i) => { r[i] ^= mul(c, f); }); }); return r; };
  const nb = BL[ver], rawCw = Math.floor(raw(ver) / 8), shortN = nb - rawCw % nb, shortLen = Math.floor(rawCw / nb), blocks = [];
  for (let i = 0, k = 0; i < nb; i++) { const len = shortLen - d + (i < shortN ? 0 : 1), dat = data.slice(k, k + len); k += len; const ecc = rs(dat); if (i < shortN) dat.push(0); blocks.push(dat.concat(ecc)); }
  const out = []; for (let i = 0; i < blocks[0].length; i++) blocks.forEach((b, j) => { if (i !== shortLen - d || j >= shortN) out.push(b[i]); });
  const size = ver * 4 + 17, grid = () => Array.from({ length: size }, () => new Array(size).fill(false));
  const m = grid(), fn = grid(), set = (x, y, v) => { m[y][x] = v; fn[y][x] = true; };
  for (let i = 0; i < size; i++) { set(6, i, i % 2 === 0); set(i, 6, i % 2 === 0); }
  [[3, 3], [size - 4, 3], [3, size - 4]].forEach(([cx, cy]) => { for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) { const x = cx + dx, y = cy + dy, k = Math.max(Math.abs(dx), Math.abs(dy)); if (x >= 0 && x < size && y >= 0 && y < size) set(x, y, k !== 2 && k !== 4); } });
  if (ver > 1) {
    const na = Math.floor(ver / 7) + 2, step = Math.ceil((ver * 4 + 4) / (na * 2 - 2)) * 2, pos = [6];
    for (let p = size - 7; pos.length < na; p -= step) pos.splice(1, 0, p);
    pos.forEach((px, i) => pos.forEach((py, j) => {
      if ((i === 0 && j === 0) || (i === 0 && j === na - 1) || (i === na - 1 && j === 0)) return;
      for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) set(px + dx, py + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
    }));
  }
  const bit = (v, i) => ((v >>> i) & 1) !== 0;
  const fmt = mask => {
    let r = mask; for (let i = 0; i < 10; i++) r = (r << 1) ^ ((r >>> 9) * 0x537);
    const b = ((mask << 10) | r) ^ 0x5412;
    for (let i = 0; i <= 5; i++) set(8, i, bit(b, i)); set(8, 7, bit(b, 6)); set(8, 8, bit(b, 7)); set(7, 8, bit(b, 8));
    for (let i = 9; i < 15; i++) set(14 - i, 8, bit(b, i));
    for (let i = 0; i < 8; i++) set(size - 1 - i, 8, bit(b, i));
    for (let i = 8; i < 15; i++) set(8, size - 15 + i, bit(b, i));
    set(8, size - 8, true);
  };
  fmt(0);
  if (ver >= 7) { let r = ver; for (let i = 0; i < 12; i++) r = (r << 1) ^ ((r >>> 11) * 0x1F25); const b = (ver << 12) | r; for (let i = 0; i < 18; i++) { const c = bit(b, i), a = size - 11 + i % 3, q = Math.floor(i / 3); set(a, q, c); set(q, a, c); } }
  let bi = 0;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let v = 0; v < size; v++) for (let j = 0; j < 2; j++) {
      const x = right - j, y = ((right + 1) & 2) === 0 ? size - 1 - v : v;
      if (!fn[y][x] && bi < out.length * 8) { m[y][x] = bit(out[bi >>> 3], 7 - (bi & 7)); bi++; }
    }
  }
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) if (!fn[y][x] && (x + y) % 2 === 0) m[y][x] = !m[y][x];
  fmt(0);
  return m;
}
function qrMarkup(text) {
  const m = qrMatrix(text), n = m.length, q = 4;
  let path = "";
  m.forEach((row, y) => row.forEach((on, x) => { if (on) path += `M${x + q} ${y + q}h1v1h-1z`; }));
  return `<div class="mini-qr" aria-label="QR code"><svg viewBox="0 0 ${n + q * 2} ${n + q * 2}" role="img" aria-label="QR code for this pass" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="#fff"/><path d="${path}" fill="#000"/></svg></div>`;
}
const qrPayload = passNo => `CAMPUSLY:${passNo}`;

function normalizeEvents(list) {
  const cleaned = (Array.isArray(list) ? list : defaultEvents).map(item => {
    const base = defaultEvents.find(def => def.id === item.id) || {};
    const mode = item.registrationMode || base.registrationMode || "individual";
    const event = { ...item, registrationMode: mode };
    if (mode === "team") {
      let min = parseInt(item.teamMin ?? base.teamMin, 10);
      let max = parseInt(item.teamMax ?? base.teamMax, 10);
      if (!Number.isFinite(min) || min < 1) min = 2;
      if (!Number.isFinite(max) || max < 1) max = Math.max(min, 4);
      if (min > max) [min, max] = [max, min];
      event.teamMin = min;
      event.teamMax = max;
    }
    return event;
  });
  try { localStorage.setItem("campuslyEvents", JSON.stringify(cleaned)); } catch (e) {}
  return cleaned;
}

function scopedKey(key) {
  const userScoped = ["campuslyRegistrations", "campuslyRegistrationDetails", "campuslyCertificates", "campuslyAttendanceStats", "campuslyAttendanceRecords"];
  if (!userScoped.includes(key)) return key;
  try {
    const user = JSON.parse(localStorage.getItem("campuslyUser") || "null");
    return user && user.uid ? `${key}:${user.uid}` : key;
  } catch (e) { return key; }
}

function loadData(key, fallback) {
  const saved = localStorage.getItem(scopedKey(key));
  return saved ? JSON.parse(saved) : fallback;
}

function saveData(key, value) {
  localStorage.setItem(scopedKey(key), JSON.stringify(value));
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

function setAuthMessage(message, type = "error") {
  const box = document.getElementById("authMessage");
  if (!box) { if (message) showToast(message); return; }
  box.textContent = message || "";
  box.hidden = !message;
  box.classList.toggle("error", type === "error");
}

function setAuthBusy(form, busy) {
  form?.querySelectorAll("button, input, select").forEach(el => { el.disabled = busy; });
}

function goToPortal() {
  showLoading(700);
  window.location.href = "home.html";
}

async function googleAuth() {
  setAuthMessage("");
  try {
    const role = document.getElementById("signupRole")?.value;
    const college = document.getElementById("signupCollege")?.value.trim();
    await CampuslyAuth.signInWithGoogle({ role, college });
    goToPortal();
  } catch (err) { setAuthMessage(err.message || "Google sign-in failed."); }
}

async function signInUser(event) {
  event.preventDefault();
  setAuthMessage("");
  const form = event.target;
  const email = document.getElementById("signinEmail").value.trim();
  const password = document.getElementById("signinPassword").value;
  if (!email || !password) { setAuthMessage("Enter your email and password."); return; }
  setAuthBusy(form, true);
  try {
    await CampuslyAuth.signIn(email, password);
    goToPortal();
  } catch (err) {
    setAuthMessage(err.message || "Couldn't sign you in. Try again.");
    setAuthBusy(form, false);
  }
}

async function signupUser(event) {
  event.preventDefault();
  setAuthMessage("");
  const form = event.target;
  const password = document.getElementById("signupPassword").value;
  if (password !== document.getElementById("signupConfirm").value) { setAuthMessage("The two passwords don't match."); return; }
  setAuthBusy(form, true);
  try {
    await CampuslyAuth.signUp({
      name: document.getElementById("signupName").value,
      email: document.getElementById("signupEmail").value,
      college: document.getElementById("signupCollege").value,
      role: document.getElementById("signupRole").value,
      password
    });
    goToPortal();
  } catch (err) {
    setAuthMessage(err.message || "Couldn't create your account. Try again.");
    setAuthBusy(form, false);
  }
}

async function forgotPassword() {
  setAuthMessage("");
  try {
    await CampuslyAuth.resetPassword(document.getElementById("signinEmail").value);
    setAuthMessage("Password reset email sent. Check your inbox.", "info");
  } catch (err) { setAuthMessage(err.message || "Couldn't send the reset email."); }
}

function updateUserInterface() {
  document.querySelectorAll(".attendee-only").forEach(item => { item.style.display = currentRole === "attendee" ? "" : "none"; });
  document.querySelectorAll(".organiser-only").forEach(item => { item.style.display = currentRole === "organiser" ? "" : "none"; });
  const name = currentUser().name || (currentRole === "organiser" ? "Maya" : "Aarav");
  document.getElementById("profileName").textContent = name;
  document.getElementById("profileRole").textContent = roleLabel().toUpperCase();
  document.getElementById("profileAvatar").textContent = name.charAt(0);
  const menu = document.getElementById("profileMenu");
  if (menu && !document.getElementById("modeSwitchBtn")) {
    const btn = document.createElement("button");
    btn.id = "modeSwitchBtn";
    btn.onclick = () => switchMode();
    menu.insertBefore(btn, menu.querySelector("button"));
  }
  const switchBtn = document.getElementById("modeSwitchBtn");
  if (switchBtn) switchBtn.textContent = currentRole === "organiser" ? "Switch to Participant mode" : "Switch to Organizer mode";
  renderNotificationBadge();
  radialNavIndex = 0;
  renderRadialNav();
}

function navigate(page) {
  const pageMap = {
    home: "home.html",
    events: "events.html",
    transport: "transport.html",
    wallet: "wallet.html",
    gallery: "gallery.html",
    registrations: "registrations.html",
    create: "create.html",
    manage: "manage.html",
    scanner: "scanner.html",
    certificates: "certificates.html",
    profile: "profile.html"
  };

  if (currentRole === "attendee" && ["create", "manage", "scanner"].includes(page)) {
    page = "home";
  }

  if (currentRole === "organiser" && ["wallet", "registrations", "certificates"].includes(page)) {
    page = "manage";
  }

  const target = pageMap[page] || "home.html";
  window.location.href = target;
}

function renderCurrentPage() {
  const page = document.body.dataset.page || "home";
  currentPage = page;

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
    certificates: renderCertificatesPage,
    profile: renderProfile
  };

  const content = document.getElementById("pageContent");
  if (!content) return;
  content.innerHTML = pages[page] ? pages[page]() : renderHome();

  document.querySelectorAll(".main-nav [data-page]").forEach(item => {
    item.classList.toggle("active", item.dataset.page === page);
  });

  if (page === "events") {
    setupEventFilters();
    setupEventsPageCarousel();
  }

  setupFeaturedCarousel();
  setupEventCardMotion();
  setupWalletInteraction();
  if (page === "scanner") setupScanner();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ---------- HOME ---------- */

function renderHome() {
  const org = currentRole === "organiser";
  const list = visibleEvents();
  const regs = org ? list.reduce((sum, e) => sum + eventRegistry(e.id).length, 0) : events.reduce((sum, e) => sum + e.registered, 0);
  const features = org ? [
    ["Discover", "See how the events you publish look to students across campus."],
    ["Create", "Publish an event with venue, capacity and registration type in minutes."],
    ["Move", "Share college bus routes and carpools so people can reach your event."],
    ["Remember", "Mark attendance, issue certificates and keep each event's album."]
  ] : [
    ["Discover", "Browse technical, cultural, sports, academic and social events."],
    ["Register", "Reserve a spot in seconds and keep all your registrations together."],
    ["Move", "Check college bus routes or find a carpool for your event."],
    ["Remember", "Build a digital record of events, achievements and certificates."]
  ];

  return `
    <section class="hero">
      <div class="hero-content">
        <p class="eyebrow">THE CAMPUS EVENT EXPERIENCE</p>
        <h1>${org ? "Create your next<br><em>big event.</em>" : "Find your next<br><em>thing to do.</em>"}</h1>
        <p class="hero-copy">${org
          ? "Publish an event, track registrations, scan passes at the door and issue certificates — all from one place."
          : "Discover what is happening around campus, reserve your spot, find a ride and keep every achievement with you."}</p>
        <div class="hero-actions">
          ${org
            ? `<button class="btn btn-lime" onclick="navigate('create')">Create event ↗</button>
               <button class="btn btn-light" onclick="navigate('manage')">Manage events</button>`
            : `<button class="btn btn-lime" onclick="navigate('events')">Explore events ↗</button>
               <button class="btn btn-light" onclick="navigate('transport')">Find a ride</button>`}
        </div>
      </div>
      <div class="hero-featured" aria-label="Featured events">
        ${renderFeaturedCarousel()}
      </div>
      <div class="hero-bottom">
        <span>${org ? events.filter(isOwnEvent).length : list.length} ${org ? "EVENTS CREATED" : "LIVE EVENT LISTINGS"}</span>
        <span>${regs.toLocaleString()} REGISTRATIONS & COUNTING</span>
      </div>
    </section>

    <section class="page">
      <div class="page-header">
        <div>
          <p class="eyebrow">EVERYTHING CONNECTED</p>
          <h1>Your campus,<br><span>in one place.</span></h1>
        </div>
        <p>${org
          ? "Campusly takes you from idea to certificate: create the event, scan entries, track attendance and issue certificates from one portal."
          : "Campusly removes the friction between hearing about an event and actually being there. Everything from registration to certificates lives in one simple portal."}</p>
      </div>
      <div class="mini-features">
        ${features.map((f, i) => `<article class="mini-feature"><div class="feature-number">0${i + 1}</div><h3>${f[0]}</h3><p>${f[1]}</p></article>`).join("")}
      </div>
    </section>
  `;
}

function renderFeaturedEvents() {
  return renderFeaturedCarousel();
}

function renderFeaturedCarousel() {
  const featured = visibleEvents().slice(0, 6);
  if (!featured.length) return `<div class="soft-card empty-card"><p class="eyebrow">NO EVENTS YET</p><h3>No events available yet.</h3>${currentRole === "organiser" ? `<button class="btn btn-dark" onclick="navigate('create')">Create your first event ↗</button>` : ""}</div>`;

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
          <button class="btn btn-lime featured-action" type="button" onclick="showEvent(${event.id})">${currentRole === "attendee" ? "View details &amp; Register →" : "View details →"}</button>
          ${isRegistered && currentRole === "attendee" ? `<span class="featured-registered">Registered ✓</span>` : ""}
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
  const org = currentRole === "organiser";
  const list = visibleEvents();
  return `
    <section class="page events-page-first">
      ${list.length ? renderEventsPageCarousel() : ""}

      <div class="page-header events-all-header">
        <div>
          <p class="eyebrow">DISCOVER</p>
          <h1>What's<br><span>happening?</span></h1>
        </div>
        <p>${org ? "Every event on campus, with the ones you created shown first and marked. Use the switch below to see only yours." : "Search by event name or filter by category. Open any event to see its full details and reserve your place."}</p>
      </div>

      ${org ? `<div class="scope-toggle" role="group" aria-label="Event scope"><button type="button" class="scope-btn ${eventsScope === "all" ? "active" : ""}" data-scope="all">All events</button><button type="button" class="scope-btn ${eventsScope === "mine" ? "active" : ""}" data-scope="mine">Created by me</button></div>` : ""}
      <div class="filter-bar">
        <label class="search-box">
          <span>⌕</span>
          <input id="eventSearch" type="search" placeholder="Search events..." autocomplete="off">
        </label>
        ${["All", "Technical", "Cultural", "Sports", "Academic", "Art", "Music"].map((c, i) => `<button class="filter-btn ${i === 0 ? "active" : ""}" data-category="${c}">${c}</button>`).join("")}
      </div>

      <div id="eventsGrid" class="events-grid">
        ${scopedEvents().length ? scopedEvents().map(event => eventCard(event)).join("") : emptyEventsCard()}
      </div>
    </section>
  `;
}

function emptyEventsCard() {
  return currentRole === "organiser" && eventsScope === "mine"
    ? `<div class="soft-card empty-card" style="grid-column:1/-1"><p class="eyebrow">NOTHING PUBLISHED YET</p><h3>You haven't created any events.</h3><button class="btn btn-dark" onclick="navigate('create')">Create an event ↗</button></div>`
    : `<div class="soft-card empty-card" style="grid-column:1/-1"><p class="eyebrow">NO EVENTS</p><h3>No events match your search.</h3></div>`;
}

function renderEventsPageCarousel() {
  const list = visibleEvents().slice(0, 6);
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
            const registered = currentRole === "attendee" && registrations.includes(event.id);
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
            ? (isOwnEvent(event)
              ? `<span class="status">Hosted by you</span>`
              : `<button class="btn ${isRegistered ? "btn-light" : "btn-dark"}" onclick="${isRegistered ? `cancelRegistration(${event.id})` : `openRegistrationForm(${event.id})`}">${isRegistered ? "Registered ✓" : "Register"}</button>`)
            : `<span class="status">${isOwnEvent(event) ? "Created by you · " : ""}${event.registered} registered</span>`
          }
        </div>
      </div>
    </article>
  `;
}

function setupEventFilters() {
  const search = document.getElementById("eventSearch");
  const buttons = document.querySelectorAll(".filter-btn");

  if (!search) return;
  function filterEvents() {
    const term = search.value.toLowerCase().trim();
    const active = document.querySelector(".filter-btn.active").dataset.category;

    const filtered = scopedEvents().filter(event => {
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
        : emptyEventsCard();
  }

  search.addEventListener("input", filterEvents);

  document.querySelectorAll(".scope-btn").forEach(btn => btn.addEventListener("click", () => {
    eventsScope = btn.dataset.scope;
    document.querySelectorAll(".scope-btn").forEach(b => b.classList.toggle("active", b === btn));
    filterEvents();
  }));

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
      ? (isOwnEvent(event)
        ? `<p class="scan-note">You created this event, so you can't register for it as a participant.</p>`
        : `<button class="btn ${isRegistered ? "btn-light" : "btn-dark"}" onclick="${isRegistered ? `cancelRegistration(${id});closeModal()` : `openRegistrationForm(${id})`}">${isRegistered ? "Cancel registration" : "Register now ↗"}</button>`)
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
  const leadLine = `${saved.name || getUserName()}${(saved.email || getUserEmail()) ? ", " + (saved.email || getUserEmail()) : ""}`.trim();

  document.getElementById("modalContent").innerHTML = `
    <p class="eyebrow">REGISTRATION · ${event.category}</p>
    <h2>Join ${event.title}.</h2>
    <p>Fill in your details below. Your pass will be generated in your Wallet once the registration is submitted.</p>
    <form class="registration-form" onsubmit="submitRegistration(event, ${id})">
      <div class="registration-mode-row">
        <button type="button" class="mode-chip ${mode === "individual" ? "active" : ""}" disabled>Individual</button>
        <button type="button" class="mode-chip ${mode === "team" ? "active" : ""}" disabled>Team</button>
      </div>
      <label class="form-field"><span>Full name</span><input id="regName" required value="${saved.name || getUserName()}" placeholder="Your full name"></label>
      <label class="form-field"><span>Email</span><input id="regEmail" type="email" required value="${saved.email || getUserEmail()}" placeholder="you@college.edu"></label>
      <label class="form-field"><span>College / Department</span><input id="regCollege" required value="${saved.college || getUserCollege()}" placeholder="Your college / department"></label>
      ${mode === "team" ? `
        <div class="team-config-note"><strong>Team size: ${teamMin}-${teamMax}</strong><span>The organiser has set this event up for team registration.</span></div>
        <label class="form-field"><span>Team name</span><input id="regTeamName" required value="${saved.teamName || ""}" placeholder="e.g. Byte Force"></label>
        <label class="form-field"><span>Team size</span><input id="regTeamSize" type="number" min="${teamMin}" max="${teamMax}" required value="${saved.teamSize || teamMin}" placeholder="${teamMin}-${teamMax}"></label>
        <label class="form-field full"><span>Team members (include yourself)</span><textarea id="regMembers" required placeholder="One member per line: Name, email@college.edu">${saved.members || leadLine}</textarea></label>
      ` : `
        <label class="form-field full"><span>Phone number</span><input id="regPhone" required value="${saved.phone || ""}" placeholder="10 digit mobile number"></label>
      `}
      <div class="registration-actions"><button type="submit" class="btn btn-dark">Submit registration ↗</button><button type="button" class="btn btn-light" onclick="showEvent(${id})">Back</button></div>
    </form>
  `;
  document.getElementById("modal").classList.remove("hidden");
}

function getUserName() { return JSON.parse(localStorage.getItem("campuslyUser") || "null")?.name || ""; }
function getUserEmail() { return JSON.parse(localStorage.getItem("campuslyUser") || "null")?.email || ""; }
function getUserCollege() { return JSON.parse(localStorage.getItem("campuslyUser") || "null")?.college || ""; }

function submitRegistration(formEvent, id) {
  formEvent.preventDefault();
  const event = events.find(item => item.id === id);
  if (!event || registrations.includes(id)) return;
  if (isOwnEvent(event)) { showToast("You created this event, so you can't register for it."); return; }
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
    if (!Number.isInteger(data.teamSize) || data.teamSize < min || data.teamSize > max) { showToast(`Team size must be between ${min} and ${max} members.`); return; }
    if (!data.teamName || !data.members) { showToast("Please enter a team name and list your team members."); return; }

    const lines = data.members.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
    const emailPattern = /[^\s@,;]+@[^\s@,;]+\.[^\s@,;]+/;
    const seen = new Set();
    const memberList = [];
    for (const line of lines) {
      const found = line.match(emailPattern);
      if (!found) { showToast(`Add an email for each member. Missing on: "${line}"`); return; }
      const email = found[0].toLowerCase();
      if (seen.has(email)) { showToast(`${email} is listed more than once.`); return; }
      seen.add(email);
      const name = line.replace(found[0], "").replace(/[,;|\-–—]+\s*$/, "").replace(/^\s*[,;|\-–—]+/, "").trim();
      if (!name) { showToast(`Add a name for ${email}.`); return; }
      memberList.push({ name, email });
    }
    if (memberList.length !== data.teamSize) { showToast(`Team size is ${data.teamSize} but you listed ${memberList.length} member${memberList.length === 1 ? "" : "s"}.`); return; }
    data.memberList = memberList;
  }

  registrationDetails[id] = data;
  registrations.push(id);
  event.registered += 1;
  saveData("campuslyRegistrationDetails", registrationDetails);
  saveData("campuslyRegistrations", registrations);
  saveData("campuslyEvents", events);
  addRegistryEntry(event, data);
  pushNotification(currentUid(), "attendee", "Registration confirmed", `Your pass for ${event.title} is in your Wallet.`);
  if (event.createdBy) pushNotification(event.createdBy, "organiser", "New registration", `${data.name} registered for ${event.title}.`);

  document.getElementById("modalContent").innerHTML = `
    <div class="registration-success">
      <div class="success-mark">✓</div>
      <p class="eyebrow">REGISTRATION CONFIRMED</p>
      <h2>You’re in.</h2>
      <p>Your registration for ${event.title} was submitted successfully. Your digital pass is now available in your Wallet.</p>
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
  removeRegistryEntry(id);
  if (event && event.createdBy) pushNotification(event.createdBy, "organiser", "Registration cancelled", `${getUserName() || "A participant"} cancelled their registration for ${event.title}.`);

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

/* ---------- TRANSPORT: bus reservation + carpool (step-by-step flows) ---------- */
const BUS_ROUTES = [
  { id: "A", name: "Route A · North Gate", time: "07:15 AM", capacity: 40 },
  { id: "B", name: "Route B · Hostel Block", time: "07:30 AM", capacity: 25 },
  { id: "C", name: "Route C · City Centre", time: "08:00 AM", capacity: 20 }
];
let tw = {};

function readList(key) { try { return JSON.parse(localStorage.getItem(key) || "[]"); } catch (e) { return []; } }
function writeList(key, list) { localStorage.setItem(key, JSON.stringify(list)); }
const readBookings = () => readList("campuslyBusBookings");
const readRides = () => readList("campuslyRides");
function myTransport(eventId) {
  const uid = currentUid(), id = Number(eventId), rides = readRides().filter(r => r.eventId === id);
  const bus = readBookings().some(b => b.uid === uid && b.eventId === id);
  const offer = rides.some(r => r.uid === uid);
  const req = rides.some(r => r.requests.some(q => q.uid === uid && q.status !== "declined"));
  return { bus, offer, req, carpool: offer || req, any: bus || offer || req };
}
function transportOptions() { return myRegEvents().filter(e => !myTransport(e.id).any); }
function eventTitle(id) { return (events.find(e => e.id === Number(id)) || {}).title || "Event"; }
function myRegEvents() { return events.filter(e => registrations.includes(e.id)); }
function seatsLeftBus(eventId, routeId) {
  const route = BUS_ROUTES.find(r => r.id === routeId);
  return route.capacity - readBookings().filter(b => b.eventId === Number(eventId) && b.routeId === routeId).length;
}
function rideSeatsLeft(ride) { return ride.seats - ride.requests.filter(r => r.status === "accepted").length; }
function openModal(html) { document.getElementById("modalContent").innerHTML = html; document.getElementById("modal").classList.remove("hidden"); }
function stepper(labels, step) {
  return `<div class="wizard-steps">${labels.map((l, i) => `<span class="${i + 1 === step ? "active" : i + 1 < step ? "done" : ""}"><b>${i + 1 < step ? "✓" : i + 1}</b>${l}</span>`).join("")}</div>`;
}
function validPhone(v) { return /^\d{10}$/.test(String(v).replace(/[\s-]/g, "")); }
function wizardError(msg) { const el = document.getElementById("wizError"); if (el) { el.textContent = msg; el.hidden = !msg; } }
function noEventsHtml(what) {
  const regs = myRegEvents().length;
  return regs
    ? `<p class="eyebrow">${what}</p><h2>Transport is already arranged.</h2><p>Each event allows either a bus seat or a carpool (offering or requesting a ride), not both. Every event you're registered for already has one. Cancel it first if you want to switch.</p><button class="btn btn-dark" onclick="closeModal()">Got it</button>`
    : `<p class="eyebrow">${what}</p><h2>Register for an event first.</h2><p>Transport is arranged per event, so you need to be registered for at least one event.</p><button class="btn btn-dark" onclick="closeModal();navigate('events')">Explore events ↗</button>`;
}

function renderTransport() {
  if (currentRole === "organiser") return renderTransportOrganiser();
  const uid = currentUid();
  const myBookings = readBookings().filter(b => b.uid === uid);
  const rides = readRides();
  const myOffers = rides.filter(r => r.uid === uid);
  const myRequests = rides.flatMap(r => r.requests.filter(q => q.uid === uid).map(q => ({ ride: r, req: q })));
  const regIds = registrations;
  const available = rides.filter(r => r.uid !== uid && regIds.includes(r.eventId) && rideSeatsLeft(r) > 0 && !myTransport(r.eventId).any);
  const next = myBookings[0];
  const nextRoute = next && BUS_ROUTES.find(r => r.id === next.routeId);

  return `
    <section class="page">
      <div class="page-header">
        <div><p class="eyebrow">GET THERE</p><h1>Move<br><span>together.</span></h1></div>
        <p>For each event you're registered for, pick one way to get there: a college bus seat or a carpool (offer a ride or request one).</p>
      </div>

      <div class="transport-hero">
        <article class="transport-intro">
          <p class="eyebrow" style="color:rgba(255,255,255,.55)">COLLEGE BUS</p>
          <h2>Routes that<br>keep you moving.</h2>
          <p>Pick an event, choose a route and confirm your seat.</p>
        </article>
        <article class="route-card">
          <span class="eyebrow">YOUR NEXT BUS</span>
          <div class="route-number" style="font-size:${next ? "" : "42px"}">${nextRoute ? nextRoute.time.slice(0, 5) : "None"}</div>
          <div><div class="route-line">${nextRoute ? nextRoute.name.toUpperCase() : "NO SEAT RESERVED YET"}</div>
          <p style="font-size:11px;color:#777">${next ? escapeHtml(eventTitle(next.eventId)) : "Reserve a seat below."}</p></div>
        </article>
      </div>

      <div class="transport-grid">
        <article class="soft-card transport-card">
          <p class="eyebrow">01 · BUS FACILITY</p>
          <h3>Reserve a seat.</h3>
          <p>Four steps: event → route → your details → confirm.</p>
          <button class="btn btn-dark" onclick="startBus()">Reserve a bus seat ↗</button>
          <div class="transport-options">
            ${myBookings.length ? myBookings.map(b => { const rt = BUS_ROUTES.find(r => r.id === b.routeId); return `<div class="transport-option"><div><strong>${escapeHtml(eventTitle(b.eventId))}</strong><small>${rt.name} · ${rt.time} · ${b.id}</small></div><button class="btn btn-light" onclick="cancelBus('${b.id}')">Cancel</button></div>`; }).join("") : `<p class="muted-note">No bus seats reserved.</p>`}
          </div>
        </article>

        <article class="soft-card transport-card">
          <p class="eyebrow">02 · CARPOOL</p>
          <h3>Share the ride.</h3>
          <p>Request a seat in a classmate's car, or offer your own. Drivers approve each request.</p>
          <button class="btn btn-lime" onclick="startOffer()">Offer a ride +</button>
          <div class="transport-options">
            <p class="eyebrow" style="margin-top:6px">RIDES FOR YOUR EVENTS</p>
            ${available.length ? available.map(r => `<div class="transport-option"><div><strong>${escapeHtml(r.driverName)} · ${escapeHtml(r.from)}</strong><small>${escapeHtml(eventTitle(r.eventId))} · ${escapeHtml(r.time)} · ${rideSeatsLeft(r)} seat${rideSeatsLeft(r) === 1 ? "" : "s"} · ${r.fare ? "₹" + r.fare + "/seat" : "Free"}</small></div><button class="btn btn-light" onclick="startJoin('${r.id}')">Request</button></div>`).join("") : `<p class="muted-note">${myRegEvents().length ? (transportOptions().length ? "No open rides for your events yet." : "Transport is already arranged for your events.") : "Register for an event to see rides."}</p>`}
          </div>
        </article>
      </div>

      <div class="transport-grid">
        <article class="soft-card transport-card">
          <p class="eyebrow">MY RIDE REQUESTS</p>
          <div class="transport-options">
            ${myRequests.length ? myRequests.map(({ ride, req }) => `<div class="transport-option"><div><strong>${escapeHtml(ride.driverName)} → ${escapeHtml(eventTitle(ride.eventId))}</strong><small>${escapeHtml(ride.from)} · ${escapeHtml(ride.time)} · <span class="status ${req.status}">${req.status}</span>${req.status === "accepted" ? " · Driver: " + escapeHtml(ride.phone) : ""}</small></div><button class="btn btn-light" onclick="cancelRequest('${ride.id}')">Cancel</button></div>`).join("") : `<p class="muted-note">You haven't requested any rides.</p>`}
          </div>
        </article>
        <article class="soft-card transport-card">
          <p class="eyebrow">MY RIDE OFFERS</p>
          <div class="transport-options">
            ${myOffers.length ? myOffers.map(r => `<div class="offer-block"><div class="transport-option"><div><strong>${escapeHtml(eventTitle(r.eventId))}</strong><small>${escapeHtml(r.from)} · ${escapeHtml(r.time)} · ${rideSeatsLeft(r)}/${r.seats} seats left</small></div><button class="btn btn-light" onclick="cancelOffer('${r.id}')">Cancel ride</button></div>
              ${r.requests.map(q => `<div class="people-row"><div><strong>${escapeHtml(q.name)}</strong><small>${escapeHtml(q.phone)}${q.note ? " · " + escapeHtml(q.note) : ""}</small></div>${q.status === "pending" ? `<span><button class="btn btn-dark" onclick="answerRequest('${r.id}','${q.uid}',true)">Accept</button> <button class="btn btn-outline" onclick="answerRequest('${r.id}','${q.uid}',false)">Decline</button></span>` : `<span class="status ${q.status}">${q.status}</span>`}</div>`).join("")}</div>`).join("") : `<p class="muted-note">You haven't offered any rides.</p>`}
          </div>
        </article>
      </div>
    </section>
  `;
}

function renderTransportOrganiser() {
  const mine = events.filter(isOwnEvent), bookings = readBookings(), rides = readRides();
  return `
    <section class="page">
      <div class="page-header"><div><p class="eyebrow">GET THERE</p><h1>Transport<br><span>demand.</span></h1></div><p>See how many participants reserved college bus seats or are sharing rides to your events.</p></div>
      ${mine.length ? `<div class="table-shell"><table class="data-table"><thead><tr><th>Event</th>${BUS_ROUTES.map(r => `<th>Bus ${r.id}</th>`).join("")}<th>Carpools</th></tr></thead><tbody>
        ${mine.map(e => `<tr><td><strong>${escapeHtml(e.title)}</strong></td>${BUS_ROUTES.map(r => `<td>${bookings.filter(b => b.eventId === e.id && b.routeId === r.id).length} / ${r.capacity}</td>`).join("")}<td>${rides.filter(r => r.eventId === e.id).length} offered</td></tr>`).join("")}
      </tbody></table></div>` : `<div class="soft-card empty-card"><p class="eyebrow">NO EVENTS YET</p><h3>Create an event to see transport demand.</h3><button class="btn btn-dark" onclick="navigate('create')">Create an event ↗</button></div>`}
    </section>`;
}

/* ----- Bus wizard ----- */
const BUS_STEPS = ["Event", "Route", "Details", "Confirm"];
function startBus() {
  const options = transportOptions();
  if (!options.length) { openModal(noEventsHtml("BUS RESERVATION")); return; }
  const u = currentUser();
  tw = { kind: "bus", step: 1, eventId: options[0].id, routeId: "", name: u.name || "", phone: "" };
  renderBusStep();
}
function busBody() {
  const ev = events.find(e => e.id === tw.eventId);
  if (tw.step === 1) {
    return `<h2>Which event are you travelling to?</h2><p class="muted-note">Only events without a bus seat or carpool are listed.</p><div class="choice-list">${transportOptions().map(e => `<label class="choice"><input type="radio" name="ev" value="${e.id}" ${e.id === tw.eventId ? "checked" : ""}><div><strong>${escapeHtml(e.title)}</strong><small>${escapeHtml(e.date)} · ${escapeHtml(e.time)} · ${escapeHtml(e.venue)}</small></div></label>`).join("")}</div>`;
  }
  if (tw.step === 2) return `<h2>Choose your route</h2><div class="choice-list">${BUS_ROUTES.map(r => { const left = seatsLeftBus(tw.eventId, r.id); return `<label class="choice ${left ? "" : "disabled"}"><input type="radio" name="rt" value="${r.id}" ${tw.routeId === r.id ? "checked" : ""} ${left ? "" : "disabled"}><div><strong>${r.name}</strong><small>Departs ${r.time} · ${left ? left + " seats left" : "Full"}</small></div></label>`; }).join("")}</div>`;
  if (tw.step === 3) return `<h2>Your details</h2><label class="form-field"><span>Full name</span><input id="twName" value="${escapeHtml(tw.name)}" placeholder="Your name"></label><label class="form-field"><span>Phone number</span><input id="twPhone" value="${escapeHtml(tw.phone)}" inputmode="numeric" placeholder="10 digit mobile number"></label>`;
  const rt = BUS_ROUTES.find(r => r.id === tw.routeId);
  return `<h2>Review and confirm</h2><div class="detail-list"><div class="detail-row"><span>Event</span><strong>${escapeHtml(ev.title)}</strong></div><div class="detail-row"><span>Route</span><strong>${rt.name}</strong></div><div class="detail-row"><span>Departure</span><strong>${rt.time}</strong></div><div class="detail-row"><span>Passenger</span><strong>${escapeHtml(tw.name)}</strong></div><div class="detail-row"><span>Phone</span><strong>${escapeHtml(tw.phone)}</strong></div></div>`;
}
function renderBusStep() {
  openModal(`<p class="eyebrow">BUS RESERVATION</p>${stepper(BUS_STEPS, tw.step)}${busBody()}<p class="wizard-error" id="wizError" hidden></p><div class="modal-actions-row">${tw.step > 1 ? `<button class="btn btn-outline" onclick="busBack()">Back</button>` : ""}<button class="btn btn-dark" onclick="busNext()">${tw.step === 4 ? "Confirm reservation ↗" : "Next →"}</button></div>`);
}
function busBack() { tw.step--; renderBusStep(); }
function busNext() {
  if (tw.step === 1) tw.eventId = Number(document.querySelector('input[name=ev]:checked')?.value || tw.eventId);
  if (tw.step === 2) { const v = document.querySelector('input[name=rt]:checked')?.value; if (!v) return wizardError("Choose a route to continue."); tw.routeId = v; }
  if (tw.step === 3) {
    tw.name = document.getElementById("twName").value.trim(); tw.phone = document.getElementById("twPhone").value.trim();
    if (!tw.name) return wizardError("Enter your name."); if (!validPhone(tw.phone)) return wizardError("Enter a valid 10 digit phone number.");
  }
  if (tw.step === 4) return confirmBus();
  tw.step++; renderBusStep();
}
function confirmBus() {
  if (myTransport(tw.eventId).any) { showToast("Transport is already arranged for this event."); closeModal(); return renderCurrentPage(); }
  if (seatsLeftBus(tw.eventId, tw.routeId) < 1) { tw.step = 2; tw.routeId = ""; renderBusStep(); wizardError("That route just filled up. Choose another."); return; }
  const list = readBookings(), id = `BUS-${Date.now().toString().slice(-6)}`;
  list.push({ id, uid: currentUid(), eventId: tw.eventId, routeId: tw.routeId, name: tw.name, phone: tw.phone, createdAt: new Date().toISOString() });
  writeList("campuslyBusBookings", list);
  const rt = BUS_ROUTES.find(r => r.id === tw.routeId);
  pushNotification(currentUid(), "attendee", "Bus seat reserved", `${rt.name} at ${rt.time} for ${eventTitle(tw.eventId)}.`);
  openModal(`<div class="registration-success"><div class="success-mark">✓</div><p class="eyebrow">SEAT RESERVED</p><h2>You're on the bus.</h2><p>${rt.name}, departing ${rt.time}, for ${escapeHtml(eventTitle(tw.eventId))}.</p><p><strong>Booking ID: ${id}</strong></p><div class="success-actions"><button class="btn btn-dark" onclick="closeModal();renderCurrentPage()">Done</button></div></div>`);
}
function cancelBus(id) { writeList("campuslyBusBookings", readBookings().filter(b => b.id !== id)); showToast("Bus reservation cancelled."); renderCurrentPage(); }

/* ----- Carpool: offer wizard ----- */
const OFFER_STEPS = ["Event", "Trip", "Contact", "Publish"];
function startOffer() {
  const options = transportOptions();
  if (!options.length) { openModal(noEventsHtml("OFFER A RIDE")); return; }
  tw = { kind: "offer", step: 1, eventId: options[0].id, from: "", time: "", seats: 2, fare: 0, name: currentUser().name || "", phone: "", vehicle: "" };
  renderOfferStep();
}
function offerBody() {
  if (tw.step === 1) return `<h2>Which event are you driving to?</h2><p class="muted-note">Only events without a bus seat or carpool are listed.</p><div class="choice-list">${transportOptions().map(e => `<label class="choice"><input type="radio" name="ev" value="${e.id}" ${e.id === tw.eventId ? "checked" : ""}><div><strong>${escapeHtml(e.title)}</strong><small>${escapeHtml(e.date)} · ${escapeHtml(e.venue)}</small></div></label>`).join("")}</div>`;
  if (tw.step === 2) return `<h2>Trip details</h2><label class="form-field"><span>Pickup area</span><input id="twFrom" value="${escapeHtml(tw.from)}" placeholder="e.g. Sarabha Nagar"></label><label class="form-field"><span>Departure time</span><input id="twTime" type="time" value="${tw.time}"></label><label class="form-field"><span>Seats available</span><select id="twSeats">${[1, 2, 3, 4, 5, 6].map(n => `<option ${n === tw.seats ? "selected" : ""}>${n}</option>`).join("")}</select></label><label class="form-field"><span>Cost share per seat (₹, 0 for free)</span><input id="twFare" type="number" min="0" max="2000" value="${tw.fare}"></label>`;
  if (tw.step === 3) return `<h2>Contact details</h2><p class="muted-note">Shared only with riders you accept.</p><label class="form-field"><span>Your name</span><input id="twName" value="${escapeHtml(tw.name)}"></label><label class="form-field"><span>Phone number</span><input id="twPhone" value="${escapeHtml(tw.phone)}" inputmode="numeric" placeholder="10 digit mobile number"></label><label class="form-field"><span>Vehicle (optional)</span><input id="twVehicle" value="${escapeHtml(tw.vehicle)}" placeholder="e.g. White Swift, PB10 AB 1234"></label>`;
  return `<h2>Review and publish</h2><div class="detail-list"><div class="detail-row"><span>Event</span><strong>${escapeHtml(eventTitle(tw.eventId))}</strong></div><div class="detail-row"><span>Pickup</span><strong>${escapeHtml(tw.from)}</strong></div><div class="detail-row"><span>Departure</span><strong>${escapeHtml(tw.time)}</strong></div><div class="detail-row"><span>Seats</span><strong>${tw.seats}</strong></div><div class="detail-row"><span>Cost share</span><strong>${tw.fare ? "₹" + tw.fare + " per seat" : "Free"}</strong></div><div class="detail-row"><span>Contact</span><strong>${escapeHtml(tw.name)} · ${escapeHtml(tw.phone)}</strong></div></div>`;
}
function renderOfferStep() {
  openModal(`<p class="eyebrow">CARPOOL · OFFER A RIDE</p>${stepper(OFFER_STEPS, tw.step)}${offerBody()}<p class="wizard-error" id="wizError" hidden></p><div class="modal-actions-row">${tw.step > 1 ? `<button class="btn btn-outline" onclick="tw.step--;renderOfferStep()">Back</button>` : ""}<button class="btn btn-dark" onclick="offerNext()">${tw.step === 4 ? "Publish ride ↗" : "Next →"}</button></div>`);
}
function offerNext() {
  if (tw.step === 1) tw.eventId = Number(document.querySelector('input[name=ev]:checked')?.value || tw.eventId);
  if (tw.step === 2) {
    tw.from = document.getElementById("twFrom").value.trim(); tw.time = document.getElementById("twTime").value; tw.seats = Number(document.getElementById("twSeats").value); tw.fare = Math.max(0, Number(document.getElementById("twFare").value) || 0);
    if (!tw.from) return wizardError("Enter a pickup area."); if (!tw.time) return wizardError("Choose a departure time.");
  }
  if (tw.step === 3) {
    tw.name = document.getElementById("twName").value.trim(); tw.phone = document.getElementById("twPhone").value.trim(); tw.vehicle = document.getElementById("twVehicle").value.trim();
    if (!tw.name) return wizardError("Enter your name."); if (!validPhone(tw.phone)) return wizardError("Enter a valid 10 digit phone number.");
  }
  if (tw.step === 4) {
    const list = readRides();
    list.unshift({ id: `RIDE-${Date.now().toString().slice(-6)}`, uid: currentUid(), driverName: tw.name, phone: tw.phone, vehicle: tw.vehicle, eventId: tw.eventId, from: tw.from, time: tw.time, seats: tw.seats, fare: tw.fare, requests: [] });
    writeList("campuslyRides", list);
    pushNotification(currentUid(), "attendee", "Ride published", `Your ride to ${eventTitle(tw.eventId)} is open for requests.`);
    openModal(`<div class="registration-success"><div class="success-mark">✓</div><p class="eyebrow">RIDE PUBLISHED</p><h2>Your ride is live.</h2><p>Classmates registered for ${escapeHtml(eventTitle(tw.eventId))} can now request a seat. You'll be notified and can accept or decline each request.</p><div class="success-actions"><button class="btn btn-dark" onclick="closeModal();renderCurrentPage()">Done</button></div></div>`);
    return;
  }
  tw.step++; renderOfferStep();
}

/* ----- Carpool: request wizard ----- */
const JOIN_STEPS = ["Ride", "Your details", "Send"];
function startJoin(rideId) {
  const ride = readRides().find(r => r.id === rideId);
  if (!ride || rideSeatsLeft(ride) < 1) { showToast("This ride is no longer available."); return; }
  const t = myTransport(ride.eventId);
  if (t.bus) { showToast("You've reserved a bus seat for this event. Cancel it to carpool instead."); return; }
  if (t.carpool) { showToast("You've already arranged a carpool for this event."); return; }
  tw = { kind: "join", step: 1, rideId, name: currentUser().name || "", phone: "", note: "" };
  renderJoinStep();
}
function joinBody(ride) {
  if (tw.step === 1) return `<h2>Ride details</h2><div class="detail-list"><div class="detail-row"><span>Driver</span><strong>${escapeHtml(ride.driverName)}</strong></div><div class="detail-row"><span>Event</span><strong>${escapeHtml(eventTitle(ride.eventId))}</strong></div><div class="detail-row"><span>Pickup</span><strong>${escapeHtml(ride.from)}</strong></div><div class="detail-row"><span>Departure</span><strong>${escapeHtml(ride.time)}</strong></div><div class="detail-row"><span>Seats left</span><strong>${rideSeatsLeft(ride)}</strong></div><div class="detail-row"><span>Cost share</span><strong>${ride.fare ? "₹" + ride.fare + " per seat" : "Free"}</strong></div>${ride.vehicle ? `<div class="detail-row"><span>Vehicle</span><strong>${escapeHtml(ride.vehicle)}</strong></div>` : ""}</div>`;
  if (tw.step === 2) return `<h2>Your details</h2><label class="form-field"><span>Your name</span><input id="twName" value="${escapeHtml(tw.name)}"></label><label class="form-field"><span>Phone number</span><input id="twPhone" value="${escapeHtml(tw.phone)}" inputmode="numeric" placeholder="10 digit mobile number"></label><label class="form-field"><span>Note to driver (optional)</span><input id="twNote" value="${escapeHtml(tw.note)}" placeholder="e.g. I'll wait at the main gate"></label>`;
  return `<h2>Send your request</h2><p>${escapeHtml(ride.driverName)} will review it. You'll get a notification when they accept or decline, and you'll see their phone number once accepted.</p><div class="detail-list"><div class="detail-row"><span>You</span><strong>${escapeHtml(tw.name)} · ${escapeHtml(tw.phone)}</strong></div>${tw.note ? `<div class="detail-row"><span>Note</span><strong>${escapeHtml(tw.note)}</strong></div>` : ""}</div>`;
}
function renderJoinStep() {
  const ride = readRides().find(r => r.id === tw.rideId); if (!ride) return closeModal();
  openModal(`<p class="eyebrow">CARPOOL · REQUEST A SEAT</p>${stepper(JOIN_STEPS, tw.step)}${joinBody(ride)}<p class="wizard-error" id="wizError" hidden></p><div class="modal-actions-row">${tw.step > 1 ? `<button class="btn btn-outline" onclick="tw.step--;renderJoinStep()">Back</button>` : ""}<button class="btn btn-dark" onclick="joinNext()">${tw.step === 3 ? "Send request ↗" : "Next →"}</button></div>`);
}
function joinNext() {
  if (tw.step === 2) {
    tw.name = document.getElementById("twName").value.trim(); tw.phone = document.getElementById("twPhone").value.trim(); tw.note = document.getElementById("twNote").value.trim();
    if (!tw.name) return wizardError("Enter your name."); if (!validPhone(tw.phone)) return wizardError("Enter a valid 10 digit phone number.");
  }
  if (tw.step === 3) {
    const list = readRides(), ride = list.find(r => r.id === tw.rideId);
    if (!ride || rideSeatsLeft(ride) < 1 || myTransport(ride.eventId).any) { showToast("This ride is no longer available to you."); closeModal(); return renderCurrentPage(); }
    if (!ride.requests.some(q => q.uid === currentUid())) ride.requests.push({ uid: currentUid(), name: tw.name, phone: tw.phone, note: tw.note, status: "pending" });
    writeList("campuslyRides", list);
    pushNotification(ride.uid, "attendee", "New ride request", `${tw.name} asked for a seat to ${eventTitle(ride.eventId)}.`);
    openModal(`<div class="registration-success"><div class="success-mark">✓</div><p class="eyebrow">REQUEST SENT</p><h2>Waiting for ${escapeHtml(ride.driverName)}.</h2><p>Track the status under "My ride requests".</p><div class="success-actions"><button class="btn btn-dark" onclick="closeModal();renderCurrentPage()">Done</button></div></div>`);
    return;
  }
  tw.step++; renderJoinStep();
}
function answerRequest(rideId, uid, accept) {
  const list = readRides(), ride = list.find(r => r.id === rideId), q = ride && ride.requests.find(x => x.uid === uid);
  if (!q || q.status !== "pending") return;
  if (accept && rideSeatsLeft(ride) < 1) { showToast("No seats left."); return; }
  q.status = accept ? "accepted" : "declined";
  writeList("campuslyRides", list);
  pushNotification(uid, "attendee", accept ? "Ride request accepted" : "Ride request declined", `${ride.driverName} ${accept ? "accepted" : "declined"} your request for ${eventTitle(ride.eventId)}.`);
  renderCurrentPage();
}
function cancelRequest(rideId) {
  const list = readRides(), ride = list.find(r => r.id === rideId); if (!ride) return;
  ride.requests = ride.requests.filter(q => q.uid !== currentUid());
  writeList("campuslyRides", list); showToast("Ride request cancelled."); renderCurrentPage();
}
function cancelOffer(rideId) {
  const ride = readRides().find(r => r.id === rideId); if (!ride) return;
  ride.requests.filter(q => q.status !== "declined").forEach(q => pushNotification(q.uid, "attendee", "Ride cancelled", `${ride.driverName} cancelled the ride to ${eventTitle(ride.eventId)}.`));
  writeList("campuslyRides", readRides().filter(r => r.id !== rideId)); showToast("Ride cancelled."); renderCurrentPage();
}

/* ---------- WALLET ---------- */

function renderWallet() {
  const activePasses = events.filter(event => registrations.includes(event.id));
  const userName = getUserName() || "Participant";
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
        ${certificates.length === 0 ? `<div class="soft-card" style="padding:28px;text-align:center"><p class="eyebrow">NO CERTIFICATES YET</p><p style="color:#777;margin-top:8px">Certificates you earn at events will appear here.</p></div>` : ""}
        ${certificates.map(certificate => `<article class="soft-card certificate"><div class="certificate-icon">✦</div><div><h3>${certificate.event}</h3><p>${certificate.type} · ${certificate.date}</p></div><button class="btn btn-outline" onclick="showCertificate(${certificate.eventId})">View</button></article>`).join("")}
      </div>
    </section>
  `;
}

function getUserId() {
  const user = JSON.parse(localStorage.getItem("campuslyUser") || "null");
  return user?.id || "CLY-2026-042";
}


function renderMiniPass(event, userName, userId, index) {
  const details = registrationDetails[event.id] || {};
  const isTeam = details.mode === "team";
  const passNo = passNoFor(event.id);
  return `
    <button class="wallet-pass-card ${index === 0 ? 'wallet-pass-main' : ''}" style="--pass-index:${index}" onclick="selectWalletPass(this, ${event.id})" aria-label="Open ${event.title} pass">
      <div class="wallet-pass-top"><span>${event.category}</span><b>${isTeam ? 'TEAM' : 'INDIVIDUAL'}</b></div>
      <div class="wallet-pass-content">
        <div class="wallet-pass-copy"><small>CAMPUSLY EVENT PASS</small><h2>${event.title}</h2><p>${event.date} · ${event.time}</p><p>${event.venue}</p></div>
        <div class="wallet-pass-qr-wrap" onclick="event.stopPropagation();showPass(${event.id})" role="button" tabindex="0" aria-label="View QR for ${event.title}">${qrMarkup(qrPayload(passNo))}<span>VIEW QR</span></div>
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
  const passNo = passNoFor(event.id);
  document.getElementById("modalContent").innerHTML = `
    <div class="scan-pass-modal">
      <div class="scan-pass-head"><div><p class="eyebrow">CAMPUSLY WALLET</p><h2>${event.title}</h2><p>${event.date} · ${event.time} · ${event.venue}</p></div><span class="pass-live">ACTIVE</span></div>
      <div class="scan-pass-body">
        <div class="scan-pass-info"><span>PASS HOLDER</span><strong>${userName}</strong><span>STUDENT ID</span><strong>${userId}</strong><span>PASS NO.</span><strong>${passNo}</strong><span>ENTRY</span><strong>${isTeam ? `TEAM · ${details.teamName || 'REGISTERED'}` : 'INDIVIDUAL'}</strong></div>
        <div class="scan-qr-large">${qrMarkup(qrPayload(passNo))}</div>
      </div>
      <p class="scan-note">Show this QR at event entry. The organizer scans it to mark your attendance. If scanning fails, they can type your pass ID instead.</p>
      <div class="pass-preview-actions"><button class="btn btn-dark" onclick="closeModal()">Done</button></div>
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
  const org = currentRole === "organiser";
  const allowed = galleryEvents();
  const selectedEvent = selectedGalleryEventId ? allowed.find(event => event.id === selectedGalleryEventId) : null;

  if (selectedEvent) {
    return renderGalleryEventAlbum(selectedEvent);
  }

  return `
    <section class="page gallery-page">
      <div class="page-header">
        <div><p class="eyebrow">CAMPUS MOMENTS</p><h1>Event<br><span>gallery.</span></h1></div>
        <div class="gallery-header-actions">
          <p>${org ? "Albums for the events you created." : "Albums for the events you have registered for."} Open one to upload moments or download photos.</p>
        </div>
      </div>

      ${allowed.length ? "" : `<div class="soft-card empty-card"><p class="eyebrow">NO ALBUMS YET</p><h3>${org ? "Albums appear once you create an event." : "Albums appear once you register for an event."}</h3><button class="btn btn-dark" onclick="navigate('${org ? "create" : "events"}')">${org ? "Create an event" : "Explore events"} ↗</button></div>`}
      <div class="gallery-event-grid">
        ${allowed.map((event, index) => {
          const count = galleryItems.filter(item => Number(item.eventId) === Number(event.id)).length;
          return `
            <button class="gallery-event-card ${index % 3 === 1 ? 'gallery-event-card-tall' : ''}" onclick="openGalleryEvent(${event.id})">
              <div class="gallery-event-cover">
                <img src="${event.image}" alt="${event.title}" loading="lazy">
                <div class="gallery-event-shade"></div>
                <span class="gallery-event-category">${event.category}</span>
                <strong>${event.title}</strong>
              </div>
              <div class="gallery-event-info">
                <div><small>${event.date} · ${event.venue}</small><p>${count} ${count === 1 ? 'moment' : 'moments'} in this album</p></div>
                <span class="gallery-event-arrow">↗</span>
              </div>
            </button>
          `;
        }).join('')}
      </div>
    </section>
  `;
}

function renderGalleryEventAlbum(event) {
  const photos = galleryItems.filter(item => Number(item.eventId) === Number(event.id));

  return `
    <section class="page gallery-page gallery-album-page">
      <div class="gallery-album-top">
        <button class="btn btn-outline" onclick="closeGalleryEvent()">← All events</button>
        <div class="gallery-album-actions">
          <button class="btn btn-outline" onclick="downloadEventPoster(${event.id})">Download poster</button>
          <label class="btn btn-dark upload-photo-btn">Upload team photo<input type="file" id="galleryAlbumUpload" accept="image/*" multiple hidden onchange="handleGalleryUpload(event, ${event.id})"></label>
        </div>
      </div>

      <div class="gallery-event-hero">
        <div class="gallery-event-hero-image"><img src="${event.image}" alt="${event.title}"></div>
        <div class="gallery-event-hero-copy">
          <p class="eyebrow">${event.category} · ${event.organiser}</p>
          <h1>${event.title}</h1>
          <p>${event.description}</p>
          <div class="gallery-event-meta">
            <span>${event.date}</span><span>${event.time}</span><span>${event.venue}</span>
          </div>
          <div class="gallery-event-team-note"><strong>${photos.length}</strong><span>${photos.length === 1 ? 'photo' : 'photos'} shared by the event/team members</span></div>
        </div>
      </div>

      <div class="gallery-album-heading">
        <div><p class="eyebrow">EVENT ALBUM</p><h2>What happened at <span>${event.title}</span></h2></div>
        <p>Photos uploaded for this event stay linked to this album in the local demo.</p>
      </div>

      <div class="gallery-grid gallery-album-grid">
        ${photos.length ? photos.map((item, index) => `
          <article class="gallery-card ${index % 3 === 1 ? 'gallery-card-tall' : ''}">
            <div class="gallery-image-wrap"><img src="${item.src}" alt="${item.title}" loading="lazy"><div class="gallery-overlay"><span>${item.caption || 'Campusly moment'}</span></div></div>
            <div class="gallery-info">
              <div><small>${item.demo ? 'TEAM MOMENT' : 'UPLOADED BY TEAM MEMBER'}</small><h3>${item.title || 'Campus moment'}</h3><p class="gallery-uploader">Uploaded by ${item.teamMember || 'Team member'}</p></div>
              <div class="gallery-actions"><button class="btn btn-outline" onclick="downloadGalleryImage('${item.id}')">Download</button>${canDeletePhoto(item, event) ? `<button class="btn btn-outline btn-danger" onclick="deleteGalleryItem('${item.id}')">Delete</button>` : ""}<button class="btn btn-outline" onclick="shareGallery('LinkedIn', '${(item.title || 'Campus moment').replace(/'/g, "\\'")}')">LinkedIn</button><button class="btn btn-outline" onclick="shareGallery('Instagram', '${(item.title || 'Campus moment').replace(/'/g, "\\'")}')">Instagram</button></div>
            </div>
          </article>
        `).join('') : `
          <div class="gallery-empty-state soft-card"><p class="eyebrow">NO PHOTOS YET</p><h3>Start this event album.</h3><p>Upload the team photos from ${event.title} to build its event memory wall.</p></div>
        `}
      </div>
    </section>
  `;
}

function openGalleryEvent(eventId) {
  selectedGalleryEventId = Number(eventId);
  localStorage.setItem('campuslyGalleryEventId', String(selectedGalleryEventId));
  navigate('gallery');
}

function closeGalleryEvent() {
  selectedGalleryEventId = null;
  localStorage.removeItem('campuslyGalleryEventId');
  navigate('gallery');
}

function handleGalleryUpload(event, eventId = null) {
  const files = Array.from(event.target.files || []);
  if (!files.length) return;

  const targetEventId = Number(eventId || selectedGalleryEventId || 0);
  if (!targetEventId) {
    showToast('Open an event album before uploading a team photo.');
    return;
  }

  if (!galleryEvents().some(item => item.id === targetEventId)) { showToast('You can only add photos to your own events.'); return; }
  const teamMember = getUserName() || 'Campusly member';
  const pending = files.filter(file => file.type.startsWith('image/'));
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
      const targetEvent = events.find(item => item.id === targetEventId);
      galleryItems.unshift({
        id: `upload-${Date.now()}-${index}`,
        eventId: targetEventId,
        src: reader.result,
        title: file.name.replace(/\.[^/.]+$/, ''),
        caption: targetEvent ? `${targetEvent.title} · Team upload` : 'Uploaded from your device',
        teamMember,
        uid: currentUid(),
        demo: false
      });
      remaining -= 1;
      if (remaining === 0) {
        galleryItems = galleryItems.slice(0, 40);
        saveData('campuslyGalleryItems', galleryItems);
        renderCurrentPage();
        showToast('Team photo added to this event album.');
      }
    };
    reader.readAsDataURL(file);
  });
}

function canDeletePhoto(item, event) {
  if (item.demo) return false;
  return !item.uid || item.uid === currentUid() || isOwnEvent(event);
}

function deleteGalleryItem(id) {
  const item = findGalleryItem(id), event = item && events.find(e => e.id === Number(item.eventId));
  if (!item || !event || !galleryEvents().some(e => e.id === event.id) || !canDeletePhoto(item, event)) { showToast("You can't delete this photo."); return; }
  if (!confirm("Delete this photo from the album? This can't be undone.")) return;
  galleryItems = galleryItems.filter(g => g.id !== id);
  saveData("campuslyGalleryItems", galleryItems);
  renderCurrentPage();
  showToast("Photo deleted.");
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

function downloadEventPoster(eventId) {
  const event = events.find(item => item.id === Number(eventId));
  if (!event) return;

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#171713"/><stop offset="1" stop-color="#596052"/></linearGradient>
  </defs>
  <rect width="1080" height="1350" fill="url(#g)"/>
  <circle cx="860" cy="220" r="260" fill="#a8bd9f" opacity=".22"/>
  <circle cx="180" cy="1180" r="320" fill="#c99b6b" opacity=".18"/>
  <text x="72" y="110" fill="#d7dfd0" font-family="Arial" font-size="26" letter-spacing="7">CAMPUSLY EVENT POSTER</text>
  <text x="72" y="640" fill="#f7f4eb" font-family="Arial" font-size="88" font-weight="700">${escapeSvg(event.title)}</text>
  <text x="72" y="710" fill="#c7f36a" font-family="Arial" font-size="30">${escapeSvg(event.category)}</text>
  <text x="72" y="790" fill="#f7f4eb" font-family="Arial" font-size="36">${escapeSvg(event.date)} · ${escapeSvg(event.time)}</text>
  <text x="72" y="845" fill="#f7f4eb" font-family="Arial" font-size="30">${escapeSvg(event.venue)}</text>
  <text x="72" y="1220" fill="#d8ddd5" font-family="Arial" font-size="22">Organised by ${escapeSvg(event.organiser)}</text>
  <text x="72" y="1260" fill="#9da59c" font-family="Arial" font-size="18">One campus. Every experience.</text>
</svg>`;

  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${event.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-poster.svg`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  showToast('Event poster downloaded.');
}

function escapeSvg(value) {
  return String(value || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function shareGallery(platform, title) {
  showToast(`${platform} share is ready for “${title}” in this demo.`);
}

function renderScanner() {
  return `
    <section class="page scanner-page">
      <div class="page-header">
        <div><p class="eyebrow">ORGANIZER TOOL</p><h1>Scan a<br><span>pass.</span></h1></div>
        <p>Point the camera at a participant's QR pass, upload a picture of it, or type the pass ID. Passes for events you created and for campus-run events are accepted; a valid scan marks attendance.</p>
      </div>
      <div class="scanner-layout">
        <article class="scanner-panel soft-card">
          <div class="scanner-frame"><video id="scannerVideo" playsinline muted></video><div class="scanner-corner top-left"></div><div class="scanner-corner top-right"></div><div class="scanner-corner bottom-left"></div><div class="scanner-corner bottom-right"></div><div class="scanner-line"></div><div class="scanner-center" id="scannerIdleMark">QR</div></div>
          <p class="eyebrow">PASS SCANNER</p>
          <h2>Verify a Campusly pass</h2>
          <div class="scanner-input-row"><button class="btn btn-outline" id="scannerCamBtn" onclick="toggleScannerCamera()">Start camera</button><button class="btn btn-outline" onclick="document.getElementById('scannerFile').click()">Scan QR image</button><input type="file" id="scannerFile" accept="image/*" hidden onchange="scanImageFile(this)"></div>
          <p class="scanner-status" id="scannerStatus">Camera is off.</p>
          <div class="scanner-input-row"><input id="scannerPassId" placeholder="Enter pass ID" aria-label="Pass ID" onkeydown="if(event.key==='Enter')verifyPass()"><button class="btn btn-dark" onclick="verifyPass()">Check pass</button></div>
          <div class="scanner-result" id="scannerResult">${scannerResult ? renderScannerResult(scannerResult) : '<div class="scanner-idle">Waiting for a pass…</div>'}</div>
        </article>
        <aside class="soft-card scanner-info-card" id="scannerSide">${renderScannerSide()}</aside>
      </div>
    </section>
  `;
}

function canScan(event) { return isOwnEvent(event) || !event.createdBy; }

function renderScannerSide() {
  const mine = events.filter(e => isOwnEvent(e) || (canScan(e) && eventRegistry(e.id).length));
  const rows = mine.map(e => { const r = eventRegistry(e.id); return { e, total: r.length, done: r.filter(x => x.attended).length }; });
  const recent = readRegistry().filter(r => r.attended && mine.some(e => e.id === r.eventId)).sort((a, b) => (b.attendedAt || "").localeCompare(a.attendedAt || "")).slice(0, 5);
  return `
    <p class="eyebrow">CHECK-INS</p>
    <h3>Your events</h3>
    ${rows.length ? rows.map(x => `<div class="detail-row"><span>${escapeHtml(x.e.title)}</span><strong>${x.done} / ${x.total}</strong></div>`).join("") : "<p>Create an event to start checking people in.</p>"}
    <p class="eyebrow" style="margin-top:22px">RECENT</p>
    ${recent.length ? recent.map(r => `<div class="detail-row"><span>${escapeHtml(r.name)}</span><strong>${timeAgo(r.attendedAt)}</strong></div>`).join("") : "<p>No check-ins yet.</p>"}
  `;
}

function renderScannerResult(result) {
  if (!result) return '';
  if (!result.valid) return `<div class="scanner-result-card invalid"><span>×</span><div><strong>Pass not accepted</strong><small>${escapeHtml(result.message)}</small></div></div>`;
  return `<div class="scanner-result-card valid"><span>✓</span><div><strong>${escapeHtml(result.event.title)}</strong><small>${escapeHtml(result.userName)} · ${escapeHtml(result.passNo)} · ${result.already ? 'Already checked in' : 'Attendance marked'}</small></div><b>VALID</b></div>`;
}

let scannerStream = null, scannerTimer = null, scannerLast = { text: "", at: 0 };

function setScannerStatus(text) { const el = document.getElementById("scannerStatus"); if (el) el.textContent = text; }

function setupScanner() { window.addEventListener("pagehide", stopScannerCamera); }

function loadJsQr() {
  if (window.jsQR) return Promise.resolve();
  const urls = ["https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js", "https://cdnjs.cloudflare.com/ajax/libs/jsQR/1.4.0/jsQR.min.js"];
  return urls.reduce((chain, url) => chain.catch(() => new Promise((resolve, reject) => {
    const el = document.createElement("script");
    el.src = url; el.onload = () => (window.jsQR ? resolve() : reject()); el.onerror = reject;
    document.head.appendChild(el);
  })), Promise.reject());
}

// Returns decode(source, width, height) -> text. Uses the browser's native detector when present, else jsQR.
async function getQrDecoder() {
  if ("BarcodeDetector" in window) {
    try {
      const formats = await BarcodeDetector.getSupportedFormats();
      if (formats.includes("qr_code")) { const d = new BarcodeDetector({ formats: ["qr_code"] }); return async src => (await d.detect(src))[0]?.rawValue || ""; }
    } catch (e) {}
  }
  await loadJsQr();
  const canvas = document.createElement("canvas"), ctx = canvas.getContext("2d", { willReadFrequently: true });
  return async (src, w, h) => {
    if (!w || !h) return "";
    const scale = Math.min(1, 800 / Math.max(w, h));
    canvas.width = Math.round(w * scale); canvas.height = Math.round(h * scale);
    ctx.drawImage(src, 0, 0, canvas.width, canvas.height);
    const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const r = window.jsQR(img.data, canvas.width, canvas.height);
    return r ? r.data : "";
  };
}

async function toggleScannerCamera() {
  if (scannerStream) { stopScannerCamera(); return; }
  if (!navigator.mediaDevices?.getUserMedia) { setScannerStatus("Camera access needs https or localhost. You can still upload a QR image or type the pass ID."); return; }
  try {
    setScannerStatus("Starting camera…");
    const decode = await getQrDecoder();
    scannerStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } } });
    const video = document.getElementById("scannerVideo");
    video.srcObject = scannerStream;
    await video.play();
    video.classList.add("live");
    document.getElementById("scannerIdleMark")?.classList.add("hidden");
    document.getElementById("scannerCamBtn").textContent = "Stop camera";
    setScannerStatus("Scanning… hold the QR inside the frame.");
    scannerTimer = setInterval(async () => {
      try {
        const text = await decode(video, video.videoWidth, video.videoHeight);
        if (text && (text !== scannerLast.text || Date.now() - scannerLast.at > 3000)) { scannerLast = { text, at: Date.now() }; processScan(text); }
      } catch (e) {}
    }, 350);
  } catch (err) {
    stopScannerCamera();
    setScannerStatus(err && err.name === "NotAllowedError" ? "Camera permission was denied. Allow it in the browser, or type the pass ID."
      : err && err.name === "NotFoundError" ? "No camera found on this device. Upload a QR image or type the pass ID."
      : "Couldn't start the scanner (the QR reader library may be blocked offline). Upload a QR image or type the pass ID.");
  }
}

async function scanImageFile(input) {
  const file = input.files && input.files[0]; input.value = "";
  if (!file) return;
  try {
    const decode = await getQrDecoder(), bmp = await createImageBitmap(file);
    const text = await decode(bmp, bmp.width, bmp.height);
    if (text) processScan(text); else { setScannerStatus("No QR code found in that image. Try a clearer picture or type the pass ID."); showToast("No QR code found."); }
  } catch (e) { setScannerStatus("Couldn't read that image. Type the pass ID instead."); }
}

function stopScannerCamera() {
  clearInterval(scannerTimer); scannerTimer = null;
  if (scannerStream) scannerStream.getTracks().forEach(t => t.stop());
  scannerStream = null;
  const video = document.getElementById("scannerVideo");
  if (video) { video.srcObject = null; video.classList.remove("live"); }
  document.getElementById("scannerIdleMark")?.classList.remove("hidden");
  const btn = document.getElementById("scannerCamBtn"); if (btn) btn.textContent = "Start camera";
  setScannerStatus("Camera is off.");
}

function verifyPass() { processScan(document.getElementById("scannerPassId")?.value || ""); }

function processScan(raw) {
  const value = String(raw).trim().replace(/^CAMPUSLY:/i, "").trim().toUpperCase();
  if (!value) { showToast("Enter or scan a pass ID first."); return; }
  const entry = readRegistry().find(r => r.passNo.toUpperCase() === value);
  const event = entry && events.find(e => e.id === entry.eventId);
  if (!entry || !event) scannerResult = { valid: false, message: "No registration matches this pass ID." };
  else if (!canScan(event)) scannerResult = { valid: false, message: `This pass is for "${event.title}", which another organizer created.` };
  else {
    const already = entry.attended;
    if (!already) setAttendance(entry.passNo, true);
    scannerResult = { valid: true, already, event, userName: entry.name, passNo: entry.passNo };
  }
  document.getElementById("scannerResult").innerHTML = renderScannerResult(scannerResult);
  document.getElementById("scannerSide").innerHTML = renderScannerSide();
  if (scannerResult.valid) { showToast(scannerResult.already ? "Pass already checked in." : "Attendance marked."); const i = document.getElementById("scannerPassId"); if (i) i.value = ""; }
  else showToast("Pass not accepted.");
}



function renderProfile() {
  const user = JSON.parse(localStorage.getItem("campuslyUser") || "null") || {};
  const profile = {
    name: user.name || (currentRole === "organiser" ? "Campusly Organizer" : "Campusly Attendee"),
    email: user.email || "demo@campusly.app",
    college: user.college || "Campusly Demo College",
    id: user.id || `CLY-2026-${String(Math.floor(100 + Math.random() * 900))}`,
    joined: user.joined || "Aug 2026"
  };

  if (!user.id || !user.joined) {
    const updatedUser = { ...user, id: profile.id, joined: profile.joined };
    localStorage.setItem("campuslyUser", JSON.stringify(updatedUser));
  }

  const org = currentRole === "organiser";
  const mine = events.filter(isOwnEvent);
  const regsIn = mine.flatMap(e => eventRegistry(e.id));
  const activePasses = events.filter(event => registrations.includes(event.id));
  const attendance = Math.max(0, Number(attendanceStats.attended || 0));
  const streak = Math.max(0, Number(attendanceStats.streak || 0));
  const level = attendance >= 25 ? "Campus Legend" : attendance >= 15 ? "Gold Explorer" : attendance >= 8 ? "Silver Explorer" : "Bronze Explorer";
  const levelNext = attendance >= 25 ? "Max level reached" : attendance >= 15 ? `${25 - attendance} more attended events to Campus Legend` : attendance >= 8 ? `${15 - attendance} more attended events to Gold Explorer` : `${8 - attendance} more attended events to Silver Explorer`;
  const recent = org ? mine.slice(0, 4).map(event => ({ label: "Event created", title: event.title, meta: `${event.date} · ${eventRegistry(event.id).length} registered` })) : [
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
              ${org ? "Organizer" : level}
            </div>
          </div>
          <p class="eyebrow">${roleLabel().toUpperCase()}</p>
          <h2>${escapeHtml(profile.name)}</h2>
          <div class="profile-info-grid">
            <div><span>EMAIL</span><strong>${escapeHtml(profile.email)}</strong></div>
            <div><span>CAMPUSLY ID</span><strong>${escapeHtml(profile.id)}</strong></div>
            <div><span>COLLEGE</span><strong>${escapeHtml(profile.college)}</strong></div>
            <div><span>MEMBER SINCE</span><strong>${escapeHtml(profile.joined)}</strong></div>
          </div>
          <div class="profile-actions">
            <button class="btn btn-dark" onclick="openEditProfile()">Edit profile</button>
            ${org ? `<button class="btn btn-outline" onclick="navigate('manage')">Manage events ↗</button>` : `<button class="btn btn-outline" onclick="navigate('wallet')">View wallet ↗</button>`}
          </div>
          <div class="mode-switch" role="group" aria-label="Switch mode">
            <span>USING CAMPUSLY AS</span>
            <button class="${org ? "" : "active"}" onclick="switchMode('attendee')">Participant</button>
            <button class="${org ? "active" : ""}" onclick="switchMode('organiser')">Organizer</button>
          </div>
        </article>

        <div class="profile-right-column">
          <div class="profile-stats profile-stat-grid">
            ${org ? `
            <article><strong>${mine.length}</strong><span>EVENTS CREATED</span></article>
            <article><strong>${regsIn.length}</strong><span>REGISTRATIONS</span></article>
            <article><strong>${regsIn.filter(r => r.attended).length}</strong><span>CHECKED IN</span></article>
            <article><strong>${regsIn.filter(r => r.certificate).length}</strong><span>CERTIFICATES ISSUED</span></article>` : `
            <article><strong>${activePasses.length}</strong><span>ACTIVE PASSES</span></article>
            <article><strong>${registrations.length}</strong><span>REGISTRATIONS</span></article>
            <article><strong>${attendance}</strong><span>EVENTS ATTENDED</span></article>
            <article><strong>${streak}</strong><span>CURRENT STREAK</span></article>
            <article><strong>${certificates.length}</strong><span>CERTIFICATES</span></article>`}
            <article><strong>${galleryItems.filter(i => galleryEvents().some(e => e.id === Number(i.eventId))).length}</strong><span>GALLERY PHOTOS</span></article>
          </div>
        </div>
      </div>

      <div class="profile-section-grid">
        ${org ? "" : `<article class="soft-card profile-achievement-card">
          <div class="profile-section-heading"><div><p class="eyebrow">ACHIEVEMENT</p><h3>${level}</h3></div><div class="profile-achievement-icon">✦</div></div>
          <p>Attendance-based campus level earned from your participation history.</p>
          <div class="profile-level-track">
            <div class="profile-level-step ${attendance >= 0 ? 'done' : ''}"><span>Bronze</span></div>
            <div class="profile-level-step ${attendance >= 8 ? 'done' : ''}"><span>Silver</span></div>
            <div class="profile-level-step ${attendance >= 15 ? 'done' : ''}"><span>Gold</span></div>
            <div class="profile-level-step ${attendance >= 25 ? 'done' : ''}"><span>Legend</span></div>
          </div>
          <small>${levelNext}</small>
        </article>`}

        <article class="soft-card profile-activity-card">
          <div class="profile-section-heading"><div><p class="eyebrow">${org ? "YOUR EVENTS" : "RECENT ACTIVITY"}</p><h3>${org ? "Recently created" : "Your campus trail"}</h3></div></div>
          <div class="profile-activity-list">
            ${recent.length ? recent.map(item => `
              <div class="profile-activity-item">
                <span class="profile-activity-dot"></span>
                <div><small>${escapeHtml(item.label)}</small><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.meta)}</p></div>
              </div>
            `).join("") : `<div class="profile-empty-activity">${org ? "Create an event to see it here." : "Start exploring events to build your activity trail."}</div>`}
          </div>
        </article>
      </div>

      <div class="profile-section-heading profile-quick-heading"><div><p class="eyebrow">QUICK ACCESS</p><h3>Jump back into Campusly</h3></div></div>
      <div class="profile-quick-actions">
        ${org ? `
        <button class="soft-card profile-quick-action" onclick="navigate('events')"><span>01</span><strong>My events</strong><small>Events you created</small>↗</button>
        <button class="soft-card profile-quick-action" onclick="navigate('create')"><span>02</span><strong>Create event</strong><small>Publish a new listing</small>↗</button>
        <button class="soft-card profile-quick-action" onclick="navigate('scanner')"><span>03</span><strong>Scanner</strong><small>Check passes at the door</small>↗</button>
        <button class="soft-card profile-quick-action" onclick="navigate('manage')"><span>04</span><strong>Manage</strong><small>Attendance &amp; certificates</small>↗</button>` : `
        <button class="soft-card profile-quick-action" onclick="navigate('events')"><span>01</span><strong>Explore events</strong><small>Find something new</small>↗</button>
        <button class="soft-card profile-quick-action" onclick="navigate('registrations')"><span>02</span><strong>My registrations</strong><small>See upcoming events</small>↗</button>
        <button class="soft-card profile-quick-action" onclick="navigate('gallery')"><span>03</span><strong>My gallery</strong><small>Your event moments</small>↗</button>
        <button class="soft-card profile-quick-action" onclick="navigate('wallet')"><span>04</span><strong>My passes</strong><small>Open your QR passes</small>↗</button>`}
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
  };
  document.getElementById("modalContent").innerHTML = `
    <p class="eyebrow">PROFILE SETTINGS</p>
    <h2>Edit your profile</h2>
    <form class="profile-edit-form" onsubmit="saveProfile(event)">
      <div class="profile-edit-grid">
        <label><span>Full name</span><input id="profileEditName" value="${escapeHtml(current.name)}" required></label>
        <label><span>Email</span><input id="profileEditEmail" type="email" value="${escapeHtml(current.email)}" readonly title="Your sign-in email can't be changed here"></label>
        <label><span>College</span><input id="profileEditCollege" value="${escapeHtml(current.college)}" required></label>
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
    email: user.email || document.getElementById("profileEditEmail").value.trim(),
    college: document.getElementById("profileEditCollege").value.trim(),
    role: user.role || "attendee",
    id: user.id || `CLY-2026-${String(Math.floor(100 + Math.random() * 900))}`,
    joined: user.joined || "Aug 2026"
  };
  localStorage.setItem("campuslyUser", JSON.stringify(updated));
  if (window.CampuslyAuth) CampuslyAuth.syncProfile(updated);
  updateUserInterface();
  closeModal();
  navigate("profile");
  showToast("Profile updated successfully.");
}

function showCertificate(eventId) {
  const cert = certificates.find(c => Number(c.eventId) === Number(eventId));
  if (!cert) return;
  const ev = events.find(e => e.id === Number(eventId)) || {};
  document.getElementById("modalContent").innerHTML = `
    <p class="eyebrow">DIGITAL CERTIFICATE</p>
    <h2>${escapeHtml(cert.event)}</h2>
    <div class="soft-card" style="margin-top:22px;padding:35px;text-align:center;background:#e8eddf;color:#171613">
      <div class="eyebrow">CERTIFICATE OF ${escapeHtml(cert.type).toUpperCase()}</div>
      <div style="font-family:'Space Grotesk';font-size:28px;margin:12px 0">${escapeHtml(getUserName() || "Participant")}</div>
      <div style="font-size:12px">${escapeHtml(cert.event)}${ev.organiser ? " · by " + escapeHtml(ev.organiser) : ""}</div>
      <div style="font-size:11px;color:#777;margin-top:8px">Issued ${escapeHtml(cert.date)} · ${escapeHtml(cert.passNo)}</div>
    </div>
  `;
  document.getElementById("modal").classList.remove("hidden");
}

function renderCertificatesPage() {
  return `
    <section class="page">
      <div class="page-header"><div><p class="eyebrow">ACHIEVEMENTS</p><h1>Your<br><span>certificates.</span></h1></div><p>Certificates issued by event organizers after you were checked in appear here.</p></div>
      <div class="certificate-list">
        ${certificates.length ? certificates.map(c => `<article class="soft-card certificate"><div class="certificate-icon">✦</div><div><h3>${escapeHtml(c.event)}</h3><p>${escapeHtml(c.type)} · ${escapeHtml(c.date)}</p></div><button class="btn btn-outline" onclick="showCertificate(${c.eventId})">View</button></article>`).join("") : `<div class="soft-card empty-card"><p class="eyebrow">NO CERTIFICATES YET</p><h3>Attend an event to earn one.</h3></div>`}
      </div>
    </section>
  `;
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
        <form onsubmit="publishEvent(event)">
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
              <select id="newRegistrationMode" onchange="toggleTeamRange()"><option value="individual">Individual</option><option value="team">Team</option></select>
            </div>
            <div class="form-field hidden" id="teamRangeFields">
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

function toggleTeamRange() {
  const isTeam = document.getElementById("newRegistrationMode")?.value === "team";
  document.getElementById("teamRangeFields")?.classList.toggle("hidden", !isTeam);
}

function publishEvent(event) {
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

  const mode = document.getElementById("newRegistrationMode").value;
  let range = { min: 2, max: 4 };
  if (mode === "team") {
    const raw = document.getElementById("newTeamRange").value.trim();
    const pair = raw.match(/^(\d+)\s*(?:-|–|—|to)\s*(\d+)$/i);
    const single = raw.match(/^(\d+)$/);
    if (pair) range = { min: Number(pair[1]), max: Number(pair[2]) };
    else if (single) range = { min: Number(single[1]), max: Number(single[1]) };
    else { showToast("Enter the team size as a range like 2-4."); return; }
    if (range.min < 1 || range.min > range.max) { showToast("Team size range is invalid. Use a range like 2-4."); return; }
  }

  const newEvent = {
    id: Date.now(),
    title: document.getElementById("newTitle").value,
    category,
    date: document.getElementById("newDate").value,
    time: document.getElementById("newTime").value,
    venue: document.getElementById("newVenue").value,
    seats: Number(document.getElementById("newSeats").value),
    registered: 0,
    registrationMode: mode,
    ...(mode === "team" ? { teamMin: range.min, teamMax: range.max } : {}),
    description: document.getElementById("newDescription").value,
    cover: coverMap[category],
    organiser: getUserName() || "Campusly Organizer",
    createdBy: currentUid(),
    image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1000&q=80"
  };

  events.unshift(newEvent);
  saveData("campuslyEvents", events);
  pushNotification(currentUid(), "organiser", "Event published", `${newEvent.title} is now live for registrations.`);

  showToast("Event published successfully.");
  navigate("manage");
}

function renderManage() {
  return `
    <section class="page">
      <div class="page-header">
        <div>
          <p class="eyebrow">ORGANIZER DASHBOARD</p>
          <h1>Manage<br><span>your events.</span></h1>
        </div>
        <button class="btn btn-dark" onclick="navigate('create')">Create new event +</button>
      </div>
      <div id="manageBody">${renderManageBody()}</div>
    </section>
  `;
}

function renderManageBody() {
  const mine = events.filter(isOwnEvent);
  if (!mine.length) return `<div class="soft-card empty-card"><p class="eyebrow">NOTHING TO MANAGE YET</p><h3>Events you create will appear here.</h3><button class="btn btn-dark" onclick="navigate('create')">Create an event ↗</button></div>`;
  const regs = mine.flatMap(e => eventRegistry(e.id));
  const capacity = mine.reduce((sum, e) => sum + e.seats, 0);
  return `
    <div class="dashboard-cards">
      <div class="dashboard-card"><span>Total events</span><strong>${mine.length}</strong></div>
      <div class="dashboard-card"><span>Registrations</span><strong>${regs.length}</strong></div>
      <div class="dashboard-card"><span>Checked in</span><strong>${regs.filter(r => r.attended).length}</strong></div>
      <div class="dashboard-card"><span>Fill rate</span><strong>${capacity ? Math.round((regs.length / capacity) * 100) : 0}%</strong></div>
    </div>
    <div class="section-label">EVENT CONTROL CENTRE</div>
    <div class="table-shell">
      <table class="data-table">
        <thead><tr><th>Event</th><th>Date</th><th>Registered</th><th>Checked in</th><th>Certificates</th><th>Actions</th></tr></thead>
        <tbody>
          ${mine.map(event => { const r = eventRegistry(event.id); return `
            <tr>
              <td><strong>${escapeHtml(event.title)}</strong><br><span style="color:#999;font-size:9px">${escapeHtml(event.category)} · ${escapeHtml(event.venue)}</span></td>
              <td>${escapeHtml(event.date)}</td>
              <td>${r.length} / ${event.seats}</td>
              <td>${r.filter(x => x.attended).length}</td>
              <td>${r.filter(x => x.certificate).length}</td>
              <td>
                <button class="btn btn-outline" onclick="showParticipants(${event.id})">Participants</button>
                <button class="btn btn-outline" onclick="showAttendance(${event.id})">Attendance</button>
                <button class="btn btn-light" onclick="showCertificates(${event.id})">Certificates</button>
              </td>
            </tr>`; }).join("")}
        </tbody>
      </table>
    </div>`;
}

function refreshManage() { const el = document.getElementById("manageBody"); if (el) el.innerHTML = renderManageBody(); }

function manageGuard(id) {
  const event = events.find(item => item.id === id);
  return event && isOwnEvent(event) ? event : null;
}

function peopleRows(list, action) {
  return list.length ? `<div class="people-list">${list.map(r => `
    <div class="people-row"><div><strong>${escapeHtml(r.name)}</strong><small>${escapeHtml(r.email)}${r.teamName ? " · Team " + escapeHtml(r.teamName) : ""} · ${escapeHtml(r.passNo)}</small></div>${action(r)}</div>`).join("")}</div>`
    : `<div class="soft-card empty-card"><p class="eyebrow">NO REGISTRATIONS YET</p><p>Participants will show up here as they register.</p></div>`;
}

function showParticipants(id) {
  const event = manageGuard(id); if (!event) return;
  const list = eventRegistry(id);
  document.getElementById("modalContent").innerHTML = `
    <p class="eyebrow">PARTICIPANTS · ${escapeHtml(event.category)}</p>
    <h2>${escapeHtml(event.title)}</h2>
    <p>${list.length} registered out of ${event.seats} places.</p>
    ${peopleRows(list, r => `<span class="status">${r.attended ? "Checked in" : "Registered"}</span>`)}
  `;
  document.getElementById("modal").classList.remove("hidden");
}

function showAttendance(id) {
  const event = manageGuard(id); if (!event) return;
  const list = eventRegistry(id), done = list.filter(r => r.attended).length;
  document.getElementById("modalContent").innerHTML = `
    <p class="eyebrow">ATTENDANCE · ${escapeHtml(event.category)}</p>
    <h2>${escapeHtml(event.title)}</h2>
    <p>${done} of ${list.length} checked in. You can also scan passes from the Scanner page.</p>
    ${list.length ? `<div class="modal-actions-row"><button class="btn btn-dark" onclick="markAllAttendance(${id})">Mark everyone present</button><button class="btn btn-outline" onclick="closeModal();navigate('scanner')">Open scanner ↗</button></div>` : ""}
    ${peopleRows(list, r => `<button class="btn ${r.attended ? "btn-light" : "btn-outline"}" onclick="toggleAttendance('${r.passNo}', ${id})">${r.attended ? "Present ✓ (undo)" : "Mark present"}</button>`)}
  `;
  document.getElementById("modal").classList.remove("hidden");
}

function toggleAttendance(passNo, id) {
  const entry = readRegistry().find(r => r.passNo === passNo);
  if (!entry || !manageGuard(entry.eventId)) return;
  setAttendance(passNo, !entry.attended);
  refreshManage(); showAttendance(id);
}

function markAllAttendance(id) {
  if (!manageGuard(id)) return;
  eventRegistry(id).filter(r => !r.attended).forEach(r => setAttendance(r.passNo, true));
  refreshManage(); showAttendance(id); showToast("Everyone is marked present.");
}

function showCertificates(id) {
  const event = manageGuard(id); if (!event) return;
  const list = eventRegistry(id), ready = list.filter(r => r.attended && !r.certificate).length;
  document.getElementById("modalContent").innerHTML = `
    <p class="eyebrow">CERTIFICATES · ${escapeHtml(event.category)}</p>
    <h2>${escapeHtml(event.title)}</h2>
    <p>Certificates can be issued to participants who were checked in. ${list.filter(r => r.certificate).length} issued so far.</p>
    <div class="modal-actions-row">
      <select id="certType" class="cert-type"><option>Participation</option><option>Winner</option><option>Runner-up</option><option>Volunteer</option></select>
      ${ready ? `<button class="btn btn-dark" onclick="issueAllCertificates(${id})">Issue to all checked-in (${ready})</button>` : ""}
    </div>
    ${peopleRows(list, r => r.certificate ? `<span class="status">${escapeHtml(r.certificate.type)} ✓</span>` : r.attended ? `<button class="btn btn-outline" onclick="issueOne('${r.passNo}', ${id})">Issue</button>` : `<span class="status muted">Not checked in</span>`)}
  `;
  document.getElementById("modal").classList.remove("hidden");
}

function issueOne(passNo, id) {
  const entry = readRegistry().find(r => r.passNo === passNo);
  if (!entry || !manageGuard(entry.eventId)) return;
  issueCertificate(passNo, document.getElementById("certType")?.value || "Participation");
  refreshManage(); showCertificates(id);
}

function issueAllCertificates(id) {
  if (!manageGuard(id)) return;
  const type = document.getElementById("certType")?.value || "Participation";
  eventRegistry(id).filter(r => r.attended && !r.certificate).forEach(r => issueCertificate(r.passNo, type));
  refreshManage(); showCertificates(id); showToast("Certificates issued.");
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

/* ---------- COMPACT RADIAL / SCROLLABLE NAV ---------- */

let radialNavPreviousOverflow = "";
let radialNavIndex = 0;
let radialNavTouchStartY = 0;
let radialNavTouchStartX = 0;
let radialNavWheelLock = 0;

function getRadialLinks() {
  const nav = document.getElementById("radialNav");
  return nav ? Array.from(nav.querySelectorAll(".radial-link")).filter(link => {
    const styles = getComputedStyle(link);
    return styles.display !== "none";
  }) : [];
}

function renderRadialNav() {
  const nav = document.getElementById("radialNav");
  if (!nav) return;
  const links = getRadialLinks();
  const total = links.length;
  if (!total) return;

  // Exactly three visible page buttons at a time.
  // They sit on a small arc around the toggle and rotate as the user wheels/swipes.
  // Keep all three visible buttons safely inside the viewport while preserving a radial arc.
  const radius = window.innerWidth <= 760 ? 72 : 84;
  const slots = [
    { angle: -158, scale: .88, opacity: .58, z: 20 },
    { angle: -112, scale: 1.00, opacity: 1.00, z: 30 },
    { angle: -66,  scale: .88, opacity: .58, z: 20 }
  ];

  links.forEach((link, i) => {
    let delta = i - radialNavIndex;
    if (delta > total / 2) delta -= total;
    if (delta < -total / 2) delta += total;

    const slotIndex = delta + 1;
    if (nav.classList.contains("is-open") && slotIndex >= 0 && slotIndex < slots.length) {
      const slot = slots[slotIndex];
      const angle = slot.angle * Math.PI / 180;
      link.style.setProperty("--slot-x", `${Math.cos(angle) * radius}px`);
      link.style.setProperty("--slot-y", `${Math.sin(angle) * radius}px`);
      link.style.setProperty("--slot-scale", String(slot.scale));
      link.style.setProperty("--slot-opacity", String(slot.opacity));
      link.style.zIndex = String(slot.z);
      link.style.pointerEvents = "auto";
      link.dataset.slotDelta = String(delta);
    } else {
      link.style.setProperty("--slot-x", "0px");
      link.style.setProperty("--slot-y", "0px");
      link.style.setProperty("--slot-scale", ".55");
      link.style.setProperty("--slot-opacity", "0");
      link.style.zIndex = "0";
      link.style.pointerEvents = "none";
      link.dataset.slotDelta = "hidden";
    }

    const label = link.querySelector(".radial-label");
    if (label) label.textContent = link.getAttribute("aria-label") || "";
  });
}

function stepRadialNav(direction) {
  const links = getRadialLinks();
  if (!links.length) return;
  radialNavIndex = (radialNavIndex + direction + links.length) % links.length;
  renderRadialNav();
}

function setRadialNav(open) {
  const nav = document.getElementById("radialNav");
  if (!nav) return;
  const nextState = typeof open === "boolean" ? open : !nav.classList.contains("is-open");
  nav.classList.toggle("is-open", nextState);
  const toggle = nav.querySelector(".radial-toggle");

  if (nextState) {
    radialNavPreviousOverflow = document.body.style.overflow;
    document.body.classList.add("nav-locked");
    document.body.style.overflow = "hidden";
    renderRadialNav();
    if (toggle) {
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close navigation");
    }
  } else {
    document.body.classList.remove("nav-locked");
    document.body.style.overflow = radialNavPreviousOverflow;
    if (toggle) {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open navigation");
    }
    renderRadialNav();
  }
}

function toggleRadialNav(forceState) {
  setRadialNav(forceState);
}

function setupRadialNav() {
  const nav = document.getElementById("radialNav");
  if (!nav) return;
  const backdrop = nav.querySelector(".nav-backdrop");

  renderRadialNav();

  backdrop?.addEventListener("click", () => setRadialNav(false));

  document.addEventListener("keydown", event => {
    if (!nav.classList.contains("is-open")) return;
    if (event.key === "Escape") {
      event.preventDefault();
      setRadialNav(false);
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      stepRadialNav(1);
    }
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      stepRadialNav(-1);
    }
  });

  // While the radial navbar is open, wheel input rotates the 3 visible page buttons.
  // The page behind it stays locked.
  nav.addEventListener("wheel", event => {
    if (!nav.classList.contains("is-open")) return;
    event.preventDefault();
    event.stopPropagation();
    const now = Date.now();
    if (now - radialNavWheelLock < 260) return;
    radialNavWheelLock = now;

    const delta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
    // Match the expected scroll direction: wheel down moves the radial wheel back,
    // wheel up advances it forward.
    if (delta > 0) stepRadialNav(-1);
    else if (delta < 0) stepRadialNav(1);
  }, { passive: false, capture: true });

  nav.addEventListener("touchstart", event => {
    if (!nav.classList.contains("is-open")) return;
    radialNavTouchStartY = event.touches[0].clientY;
    radialNavTouchStartX = event.touches[0].clientX;
  }, { passive: true });

  nav.addEventListener("touchmove", event => {
    if (!nav.classList.contains("is-open")) return;
    event.preventDefault();
    event.stopPropagation();
  }, { passive: false, capture: true });

  nav.addEventListener("touchend", event => {
    if (!nav.classList.contains("is-open")) return;
    const touch = event.changedTouches[0];
    const dy = touch.clientY - radialNavTouchStartY;
    const dx = touch.clientX - radialNavTouchStartX;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
    const dominant = Math.abs(dy) >= Math.abs(dx) ? dy : dx;
    // Swipe direction follows the same visual direction as the wheel.
    stepRadialNav(dominant > 0 ? 1 : -1);
  }, { passive: true });

  getRadialLinks().forEach(link => {
    link.addEventListener("click", () => setRadialNav(false));
  });

  window.addEventListener("resize", renderRadialNav);
  window.addEventListener("pagehide", () => {
    document.body.classList.remove("nav-locked");
    document.body.style.overflow = radialNavPreviousOverflow;
  });
}

/* ---------- UTILITY FUNCTIONS ---------- */

function toggleProfileMenu() {
  document.getElementById("notifPanel")?.classList.remove("show");
  document.getElementById("profileMenu").classList.toggle("show");
}

function closeModal() {
  document.getElementById("modal").classList.add("hidden");
}

async function logout() {
  window.__campuslyLoggingOut = true;
  document.getElementById("profileMenu")?.classList.remove("show");
  try { await CampuslyAuth.signOut(); } catch (e) {}
  localStorage.removeItem("campuslyRole");
  localStorage.removeItem("campuslyUser");
  window.location.href = "index.html";
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

document.addEventListener("DOMContentLoaded", async () => {
  const page = document.body.dataset.page || "home";
  const portalPages = ["home", "events", "transport", "wallet", "gallery", "registrations", "certificates", "create", "manage", "scanner", "profile"];
  const isAuthPage = page === "login" || page === "signup";
  if (!isAuthPage && !portalPages.includes(page)) return;

  if (isAuthPage) {
    const note = document.getElementById("authModeNote");
    if (CampuslyAuth.mode === "local") {
      document.querySelector(".signup-provider-row")?.classList.add("hidden");
      if (note) note.textContent = "Local mode · accounts are stored only in this browser. Add your Firebase config to enable cloud accounts.";
    } else if (note) {
      note.textContent = "Passwords are handled securely by Firebase Authentication.";
    }
  }

  const session = await CampuslyAuth.ready;

  if (isAuthPage) {
    if (session) { window.location.href = "home.html"; return; }
    if (page === "signup") {
      const role = new URLSearchParams(window.location.search).get("role");
      const roleSelect = document.getElementById("signupRole");
      if (role && roleSelect && ["attendee", "organiser"].includes(role)) roleSelect.value = role;
    }
    hideLoading();
    return;
  }

  if (!session) {
    window.location.href = "index.html";
    return;
  }

  currentRole = getMode(session);
  const organiserPages = ["create", "manage", "scanner"], participantPages = ["wallet", "registrations", "certificates"];
  if ((currentRole === "attendee" && organiserPages.includes(page)) || (currentRole === "organiser" && participantPages.includes(page))) {
    window.location.replace("home.html");
    return;
  }
  // Events published before ownership tracking belong to the first organizer account that opens the app.
  if (session.role === "organiser") {
    let claimed = false;
    events.forEach(e => { if (!e.createdBy && e.organiser === "Campusly Organiser" && String(e.id).length >= 13) { e.createdBy = currentUid(); claimed = true; } });
    if (claimed) saveData("campuslyEvents", events);
  }
  syncRecords();
  updateUserInterface();
  renderCurrentPage();

  window.addEventListener("storage", e => {
    if (!e.key) return;
    if (e.key.startsWith("campuslyNotifications")) renderNotificationBadge();
    if (!["campuslyRides", "campuslyBusBookings", "campuslyPassRegistry", "campuslyEvents"].includes(e.key)) return;
    if (e.key === "campuslyEvents") events = normalizeEvents(loadData("campuslyEvents", defaultEvents));
    if (!["transport", "manage", "wallet", "registrations"].includes(page)) return;
    if (!document.getElementById("modal").classList.contains("hidden") || /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName || "")) return;
    const y = window.scrollY;
    syncRecords();
    renderCurrentPage();
    window.scrollTo(0, y);
  });
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
  setupRadialNav();
  setupBackgroundMotion();
});



window.addEventListener("load", () => { setTimeout(hideLoading, 700); });
