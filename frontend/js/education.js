async function loadEducation() {
  const items = await api("/education");
  const root = document.querySelector("[data-education]");
  if (!root) return;
  root.innerHTML = items
    .map(
      (item) => `
      <article class="card edu">
        <span class="pill">${escapeHtml(labelize(item.level))} · ${item.year}</span>
        <h3>${escapeHtml(item.credential)}</h3>
        <p class="muted">${escapeHtml(item.institution)} · ${escapeHtml(item.location)}</p>
        <p>${escapeHtml(item.field_of_study)}${item.classification ? ` · ${escapeHtml(item.classification)}` : ""}${
          item.score_label ? ` · ${escapeHtml(item.score_label)}` : ""
        }</p>
        ${item.highlights.length ? highlightList(item.highlights) : ""}
      </article>`
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  loadEducation().catch((error) => {
    const root = document.querySelector("[data-education]");
    if (root) root.innerHTML = `<p class="loading">${escapeHtml(error.message)}</p>`;
  });
});
