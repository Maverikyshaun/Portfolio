async function loadExperience() {
  const roles = await api("/experience");
  const root = document.querySelector("[data-experience]");
  if (!root) return;
  root.innerHTML = roles
    .map(
      (role) => `
      <article class="card role">
        <div>
          <div class="tenure">${escapeHtml(role.tenure_label)}</div>
          <span class="pill">${escapeHtml(labelize(role.sector))}</span>
        </div>
        <div>
          <h3>${escapeHtml(role.title)}</h3>
          <p class="muted">${escapeHtml(role.company)} · ${escapeHtml(role.location)} · ${escapeHtml(labelize(role.employment_type))}</p>
          ${highlightList(role.highlights)}
        </div>
      </article>`
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  loadExperience().catch((error) => {
    const root = document.querySelector("[data-experience]");
    if (root) root.innerHTML = `<p class="loading">${escapeHtml(error.message)}</p>`;
  });
});
