function skillCard(group) {
  return `
    <article class="card">
      <span class="pill">${escapeHtml(labelize(group.category))}</span>
      <div class="chip-row" style="margin-top:1rem">
        ${group.items
          .map(
            (skill) =>
              `<span class="chip">${escapeHtml(skill.name)} · ${escapeHtml(labelize(skill.proficiency))}</span>`
          )
          .join("")}
      </div>
    </article>`;
}

async function loadSkills() {
  const groups = await api("/skills/groups");
  const root = document.querySelector("[data-skills]");
  if (!root) return;
  root.innerHTML = groups.map(skillCard).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  loadSkills().catch((error) => {
    const root = document.querySelector("[data-skills]");
    if (root) root.innerHTML = `<p class="loading">${escapeHtml(error.message)}</p>`;
  });
});
