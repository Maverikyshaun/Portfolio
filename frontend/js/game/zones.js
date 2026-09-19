export class Zones {
  constructor(items) {
    this.items = items.map((item) => ({ ...item, isIn: false }));
    this.current = null;
    this.onEnter = null;
    this.onLeave = null;
  }

  update(x, z) {
    let inside = null;
    for (const zone of this.items) {
      const dx = x - zone.x;
      const dz = z - zone.z;
      const inZone = dx * dx + dz * dz <= zone.r * zone.r;
      if (inZone && !zone.isIn) {
        zone.isIn = true;
        this.onEnter?.(zone);
      }
      if (!inZone && zone.isIn) {
        zone.isIn = false;
        this.onLeave?.(zone);
      }
      if (inZone) inside = zone;
    }
    this.current = inside;
    return inside;
  }
}
