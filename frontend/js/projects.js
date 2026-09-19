let allProjects = [];

function renderProjects(kind) {
  const root = document.querySelector("[data-projects]");
  const items = kind ? allProjects.filter((project) => project.kind === kind) : allProjects;
  if (!items.length) {
    root.innerHTML = `<p class="empty">No projects in this category yet.</p>`;
    return;
  }
  root.innerHTML = items
    .map(
      (project) => `
      <article class="card project">
        <span class="pill">${escapeHtml(labelize(project.kind))} · ${project.year}</span>
        <h3>${escapeHtml(project.title)}</h3>
        <p class="muted">${escapeHtml(project.summary)}</p>
        <p class="muted">${escapeHtml(project.stack_label)}</p>
        ${highlightList(project.highlights)}
      </article>`
    )
    .join("");
}

function setFilter(kind) {
  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.filter === (kind || "all"));
  });
  renderProjects(kind);
}

async function loadProjects() {
  const [projects, enums] = await Promise.all([api("/projects"), api("/meta/enums")]);
  allProjects = projects;
  const filters = document.querySelector("[data-filters]");
  filters.innerHTML = [
    `<button class="filter-btn is-active" data-filter="all" type="button">All</button>`,
    ...enums.project_kind.map(
      (item) =>
        `<button class="filter-btn" data-filter="${escapeHtml(item.value)}" type="button">${escapeHtml(item.label)}</button>`
    ),
  ].join("");
  filters.addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;
    const kind = button.dataset.filter === "all" ? "" : button.dataset.filter;
    setFilter(kind);
  });
  renderProjects("");
}

document.addEventListener("DOMContentLoaded", () => {
  loadProjects().catch((error) => {
    const root = document.querySelector("[data-projects]");
    if (root) root.innerHTML = `<p class="loading">${escapeHtml(error.message)}</p>`;
  });
});
