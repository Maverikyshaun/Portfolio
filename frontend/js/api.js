export const API = "/api";

export async function api(path, options = {}) {
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

export function labelize(value) {
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

export function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function highlightList(items) {
  return `<ul>${(items || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}
