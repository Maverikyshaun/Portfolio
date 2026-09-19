export class Inputs {
  constructor() {
    this.keys = new Set();
    this.orbit = 0;
    this.stick = { x: 0, y: 0 };
    this.locked = false;
    this._dragging = false;
    this._lastX = 0;
    this._bind();
  }

  _typing(event) {
    return ["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName);
  }

  _bind() {
    window.addEventListener("keydown", (event) => {
      if (this._typing(event) || this.locked) return;
      this.keys.add(event.code);
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(event.code)) {
        event.preventDefault();
      }
    });
    window.addEventListener("keyup", (event) => this.keys.delete(event.code));

    window.addEventListener("pointerdown", (event) => {
      if (event.target?.dataset?.canvas === undefined && event.target?.tagName !== "CANVAS") return;
      if (event.target.closest?.("[data-intro], [data-panel], .hud-actions, .stick")) return;
      this._dragging = true;
      this._lastX = event.clientX;
    });
    window.addEventListener("pointerup", () => {
      this._dragging = false;
    });
    window.addEventListener("pointermove", (event) => {
      if (!this._dragging) return;
      this.orbit -= (event.clientX - this._lastX) * 0.005;
      this._lastX = event.clientX;
    });

    const stick = document.querySelector("[data-stick]");
    const knob = document.querySelector("[data-stick-knob]");
    const setStick = (clientX, clientY) => {
      const rect = stick.getBoundingClientRect();
      const dx = clientX - (rect.left + rect.width / 2);
      const dy = clientY - (rect.top + rect.height / 2);
      const max = rect.width / 2 - 18;
      const mag = Math.hypot(dx, dy) || 1;
      const scale = mag > max ? max / mag : 1;
      this.stick.x = (dx * scale) / max;
      this.stick.y = (dy * scale) / max;
      if (knob) knob.style.transform = `translate(${dx * scale}px, ${dy * scale}px)`;
    };
    stick?.addEventListener("pointerdown", (event) => {
      stick.setPointerCapture(event.pointerId);
      setStick(event.clientX, event.clientY);
    });
    stick?.addEventListener("pointermove", (event) => {
      if (event.buttons) setStick(event.clientX, event.clientY);
    });
    stick?.addEventListener("pointerup", () => {
      this.stick.x = 0;
      this.stick.y = 0;
      if (knob) knob.style.transform = "translate(0,0)";
    });
  }

  get throttle() {
    if (this.locked) return 0;
    return (
      (this.keys.has("KeyW") || this.keys.has("ArrowUp") ? 1 : 0) -
      (this.keys.has("KeyS") || this.keys.has("ArrowDown") ? 1 : 0) -
      this.stick.y
    );
  }

  get steer() {
    if (this.locked) return 0;
    return (
      (this.keys.has("KeyA") || this.keys.has("ArrowLeft") ? 1 : 0) -
      (this.keys.has("KeyD") || this.keys.has("ArrowRight") ? 1 : 0) -
      this.stick.x
    );
  }

  get boosting() {
    return !this.locked && (this.keys.has("ShiftLeft") || this.keys.has("ShiftRight"));
  }

  decayOrbit(dt) {
    this.orbit *= 1 - dt * 1.6;
  }
}
