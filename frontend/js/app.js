const API = "/api";

async function api(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const detail = err.detail;
    throw new Error(typeof detail === "string" ? detail : "Request failed");
  }
  return res.json();
}

function labelize(value) {
  const specials = {
    ai: "AI",
    a_level: "A Level",
    gcse: "GCSE",
    open_to_work: "Open to work",
    open_to_conversation: "Open to conversation",
    not_looking: "Not looking",
    full_time: "Full time",
    machine_learning: "Machine learning",
    data_engineering: "Data engineering",
    full_stack: "Full stack",
    ai_engineering: "AI engineering",
    version_control: "Version control",
    hiring_manager: "Hiring manager",
  };
  if (specials[value]) return specials[value];
  return String(value || "")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function highlightList(items) {
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function setActiveNav() {
  const path = window.location.pathname.replace(/\/$/, "") || "/";
  document.querySelectorAll("[data-nav] a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === path || (path === "/" && href === "/")) {
      link.classList.add("is-active");
    }
  });
}

function initHeader() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");
  toggle?.addEventListener("click", () => nav?.classList.toggle("is-open"));
  setActiveNav();
}

document.addEventListener("DOMContentLoaded", initHeader);
