async function loadHome() {
  const snapshot = await api("/portfolio");
  const profile = snapshot.profile;

  const heroCopy = document.querySelector("[data-hero]");
  if (heroCopy) {
    heroCopy.innerHTML = `
      <span class="eyebrow">Open to conversation</span>
      <h1>${escapeHtml(profile.full_name)}<br /><span>${escapeHtml(profile.headline)}</span></h1>
      <p class="lede">${escapeHtml(profile.summary)}</p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="${escapeHtml(profile.cv_url)}" target="_blank" rel="noreferrer">Download CV</a>
        <a class="btn btn-ghost" href="/contact">Contact me</a>
      </div>
      <div class="meta-row">
        <span>${escapeHtml(profile.location)}</span>
        <a href="mailto:${escapeHtml(profile.email)}">${escapeHtml(profile.email)}</a>
        <a href="tel:${escapeHtml(profile.phone.replaceAll(" ", ""))}">${escapeHtml(profile.phone)}</a>
      </div>
    `;
  }

  const photo = document.querySelector("[data-photo]");
  if (photo) {
    photo.src = profile.photo_url;
    photo.alt = `Portrait of ${profile.full_name}`;
  }

  const stats = document.querySelector("[data-stats]");
  if (stats) {
    stats.innerHTML = `
      <article class="stat-card"><strong>${profile.years_experience}+</strong><span>Years in production data work</span></article>
      <article class="stat-card"><strong>Aviation</strong><span>Forecasting, leasing models, BigQuery</span></article>
      <article class="stat-card"><strong>Energy</strong><span>ETL, TensorFlow, Power BI</span></article>
      <article class="stat-card"><strong>MSc</strong><span>Business Analytics, Distinction</span></article>
    `;
  }

  const skills = document.querySelector("[data-featured-skills]");
  if (skills) {
    skills.innerHTML = snapshot.featured_skills
      .map((skill) => `<span class="chip">${escapeHtml(skill.name)}</span>`)
      .join("");
  }

  const experience = document.querySelector("[data-latest-experience]");
  if (experience) {
    experience.innerHTML = snapshot.latest_experiences
      .map(
        (role) => `
        <article class="card role">
          <div>
            <div class="tenure">${escapeHtml(role.tenure_label)}</div>
            <span class="pill">${escapeHtml(labelize(role.sector))}</span>
          </div>
          <div>
            <h3>${escapeHtml(role.title)}</h3>
            <p class="muted">${escapeHtml(role.company)} · ${escapeHtml(labelize(role.employment_type))}</p>
            ${highlightList(role.highlights.slice(0, 3))}
          </div>
        </article>`
      )
      .join("");
  }

  const projects = document.querySelector("[data-featured-projects]");
  if (projects) {
    projects.innerHTML = snapshot.featured_projects
      .map(
        (project) => `
        <article class="card">
          <span class="pill">${escapeHtml(labelize(project.kind))} · ${project.year}</span>
          <h3>${escapeHtml(project.title)}</h3>
          <p class="muted">${escapeHtml(project.summary)}</p>
          <p class="muted">${escapeHtml(project.stack_label)}</p>
        </article>`
      )
      .join("");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadHome().catch((error) => {
    const hero = document.querySelector("[data-hero]");
    if (hero) hero.innerHTML = `<p class="loading">${escapeHtml(error.message)}</p>`;
  });
});
