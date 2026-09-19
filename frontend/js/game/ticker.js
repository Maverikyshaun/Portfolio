export class Ticker {
  constructor() {
    this.elapsed = 0;
    this.delta = 1 / 60;
    this.maxDelta = 1 / 30;
    this.listeners = [];
  }

  on(fn) {
    this.listeners.push(fn);
  }

  start() {
    const loop = (now) => {
      const seconds = now / 1000;
      this.delta = Math.min(Math.max(seconds - this.elapsed, 0), this.maxDelta);
      this.elapsed = seconds;
      for (const fn of this.listeners) fn(this.delta, this.elapsed);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
}
