import { api, escapeHtml, highlightList, labelize } from "./api.js";

export class UI {
  constructor({ onRespawn, onToggleQuality, getZone }) {
    this.onRespawn = onRespawn;
    this.onToggleQuality = onToggleQuality;
    this.getZone = getZone;
    this.data = null;
    this.activeZone = null;
    this.intro = document.querySelector("[data-intro]");
    this.prompt = document.querySelector("[data-prompt]");
    this.panel = document.querySelector("[data-panel]");
    this.panelBody = document.querySelector("[data-panel-body]");
    this.panelTitle = document.querySelector("[data-panel-title]");
    this.status = document.querySelector("[data-load-status]");
    this.ready = false;
    this.wantedPlay = false;
    this.playing = false;
    this.enterBtn = document.querySelector("[data-enter]");
    this.onPlay = null;
    if (window.__pendingPlay || document.body.classList.contains("is-want-play")) {
      this.wantedPlay = true;
    }
  }

  bind() {
    const requestPlay = (event) => {
      event?.preventDefault?.();
      event?.stopPropagation?.();
      this.requestPlay();
    };
    this.enterBtn?.addEventListener("pointerdown", requestPlay, { capture: true });
    this.enterBtn?.addEventListener("click", requestPlay, { capture: true });
    this.enterBtn?.addEventListener("keydown", (event) => {
      if (event.code === "Enter" || event.code === "Space") requestPlay(event);
    });
    this.intro?.addEventListener("pointerdown", (event) => {
      if (event.target.closest("a")) return;
      if (event.target.closest("[data-close-panel]")) return;
      this.requestPlay();
    });
    document.querySelector("[data-close-panel]")?.addEventListener("click", () => this.closePanel());
    document.querySelector("[data-respawn]")?.addEventListener("click", () => this.onRespawn?.());
    document.querySelector("[data-quality]")?.addEventListener("click", (event) => {
      const next = this.onToggleQuality?.();
      event.currentTarget.textContent = next === "high" ? "Quality: High" : "Quality: Low";
    });
    document.querySelector("[data-interact]")?.addEventListener("click", () => this.tryOpen());
    window.addEventListener("keydown", (event) => {
      const typing = ["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName);
      if (event.code === "Enter" || event.code === "KeyE" || event.key === "Enter" || event.key === "e" || event.key === "E") {
        if (!this.playing) {
          this.requestPlay();
          return;
        }
        if (!typing && !this.panel?.classList.contains("is-open")) this.tryOpen();
      }
      if (event.code === "Escape") this.closePanel();
      if (!typing && event.code === "KeyR") this.onRespawn?.();
    });
  }

  async load() {
    this.data = await api("/portfolio");
    this.enums = await api("/meta/enums");
    if (this.status) this.status.textContent = "";
    return this.data;
  }

  markReady() {
    this.ready = true;
    document.body.classList.add("is-ready");
    if (this.status && !this.wantedPlay) this.status.textContent = "Ready — click Enter the campus.";
    this.flushPlay();
  }

  isBlocking() {
    return !this.playing || Boolean(this.panel?.classList.contains("is-open"));
  }

  requestPlay() {
    this.wantedPlay = true;
    if (!this.ready) {
      if (this.status) this.status.textContent = "Starting as soon as the world is ready…";
      if (this.enterBtn) this.enterBtn.textContent = "Starting…";
      return;
    }
    this.flushPlay();
  }

  flushPlay() {
    if (!this.wantedPlay || this.playing || !this.ready) return;
    this.playing = true;
    this.intro?.classList.add("is-hidden");
    this.intro?.setAttribute("aria-hidden", "true");
    document.body.classList.add("is-playing");
    this.onPlay?.();
  }

  dismissIntro() {
    this.requestPlay();
  }

  setPrompt(zone) {
    if (!this.prompt) return;
    if (!zone || this.panel?.classList.contains("is-open")) {
      this.prompt.classList.add("is-hidden");
      this.prompt.textContent = "";
      return;
    }
    this.prompt.classList.remove("is-hidden");
    this.prompt.innerHTML = `Press <kbd>Enter</kbd> — ${escapeHtml(zone.label)}`;
  }

  tryOpen() {
    const zone = this.getZone?.();
    if (zone) this.open(zone.id);
  }

  open(id) {
    if (!this.data) return;
    this.activeZone = id;
    const title = {
      about: "About",
      experience: "Experience",
      projects: "Projects",
      skills: "Skills",
      education: "Education",
      contact: "Contact",
    }[id];
    this.panelTitle.textContent = title;
    this.panelBody.innerHTML = this.render(id);
    this.panel.classList.add("is-open");
    this.setPrompt(null);
    this.bindPanelEvents(id);
  }

  closePanel() {
    this.panel?.classList.remove("is-open");
    this.activeZone = null;
  }

  render(id) {
    const { profile, featured_skills, latest_experiences, featured_projects, education } = this.data;
    if (id === "about") {
      return `
        <div class="about-grid">
          <img class="about-photo" src="${escapeHtml(profile.photo_url)}" alt="${escapeHtml(profile.full_name)}" />
          <div>
            <p class="eyebrow">${escapeHtml(labelize(profile.availability))}</p>
            <h3>${escapeHtml(profile.full_name)}</h3>
            <p class="muted">${escapeHtml(profile.headline)}</p>
            <p>${escapeHtml(profile.summary)}</p>
            <p class="muted">${escapeHtml(profile.location)} · ${escapeHtml(profile.phone)}</p>
            <div class="hero-actions">
              <a class="btn btn-primary" href="${escapeHtml(profile.cv_url)}" target="_blank" rel="noreferrer">Download CV</a>
              <a class="btn btn-ghost" href="mailto:${escapeHtml(profile.email)}">${escapeHtml(profile.email)}</a>
            </div>
          </div>
        </div>`;
    }
    if (id === "experience") {
      return this._experience(this._experienceCache);
    }
    if (id === "projects") {
      return this._projects(this._allProjects());
    }
    if (id === "skills") {
      return this._skills();
    }
    if (id === "education") {
      return `
        <div class="grid-2 overlay-grid">
          ${education
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
            .join("")}
        </div>`;
    }
    if (id === "contact") {
      const options = (this.enums?.inquiry_type || [])
        .map((item) => `<option value="${escapeHtml(item.value)}">${escapeHtml(item.label)}</option>`)
        .join("");
      return `
        <p class="muted">Recruiters and hiring managers can leave a note here. It is validated before it is stored.</p>
        <form class="form" data-contact-form>
          <label>Name <input type="text" name="name" minlength="2" maxlength="120" required /></label>
          <label>Work email <input type="email" name="email" required /></label>
          <label>Company <input type="text" name="company" maxlength="160" /></label>
          <label>Inquiry type <select name="inquiry_type" required>${options}</select></label>
          <label>Message <textarea name="message" minlength="20" maxlength="3000" required></textarea></label>
          <button class="btn btn-primary" type="submit">Send message</button>
          <p class="form-status" data-form-status></p>
        </form>`;
    }
    return "";
  }

  _allExperience() {
    return this._experienceCache;
  }

  _allProjects() {
    return this._projectCache;
  }

  async prefetchLists() {
    const [experience, projects, skillGroups] = await Promise.all([
      api("/experience"),
      api("/projects"),
      api("/skills/groups"),
    ]);
    this._experienceCache = experience;
    this._projectCache = projects;
    this._skillGroups = skillGroups;
  }

  _experience(roles) {
    return `
      <div class="timeline">
        ${(roles || [])
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
          .join("")}
      </div>`;
  }

  _projects(projects) {
    const kinds = this.enums?.project_kind || [];
    return `
      <div class="filters" data-project-filters>
        <button class="filter-btn is-active" type="button" data-kind="">All</button>
        ${kinds
          .map(
            (item) =>
              `<button class="filter-btn" type="button" data-kind="${escapeHtml(item.value)}">${escapeHtml(item.label)}</button>`
          )
          .join("")}
      </div>
      <div class="grid-2 overlay-grid" data-project-grid>
        ${this._projectCards(projects)}
      </div>`;
  }

  _projectCards(projects) {
    return (projects || [])
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

  _skills() {
    return `
      <div class="grid-2 overlay-grid">
        ${(this._skillGroups || [])
          .map(
            (group) => `
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
          </article>`
          )
          .join("")}
      </div>`;
  }

  bindPanelEvents(id) {
    if (id === "projects") {
      this.panelBody.querySelector("[data-project-filters]")?.addEventListener("click", (event) => {
        const button = event.target.closest("[data-kind]");
        if (!button) return;
        const kind = button.dataset.kind;
        this.panelBody.querySelectorAll("[data-kind]").forEach((item) => {
          item.classList.toggle("is-active", item === button);
        });
        const rows = kind ? this._projectCache.filter((project) => project.kind === kind) : this._projectCache;
        this.panelBody.querySelector("[data-project-grid]").innerHTML = this._projectCards(rows);
      });
    }
    if (id === "contact") {
      const form = this.panelBody.querySelector("[data-contact-form]");
      form?.addEventListener("submit", async (event) => {
        event.preventDefault();
        const status = form.querySelector("[data-form-status]");
        const payload = {
          name: form.name.value,
          email: form.email.value,
          company: form.company.value || null,
          inquiry_type: form.inquiry_type.value,
          message: form.message.value,
        };
        status.classList.remove("is-error");
        status.textContent = "Sending…";
        try {
          await api("/inquiries", { method: "POST", body: JSON.stringify(payload) });
          form.reset();
          status.textContent = "Thanks — I will get back to you shortly.";
        } catch (error) {
          status.classList.add("is-error");
          status.textContent = error.message;
        }
      });
    }
  }
}
