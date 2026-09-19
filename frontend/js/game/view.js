import * as THREE from "three";

export class View {
  constructor(camera, vehicle, inputs) {
    this.camera = camera;
    this.vehicle = vehicle;
    this.inputs = inputs;
    this.revealed = 0;
    this._target = new THREE.Vector3();
    this._look = new THREE.Vector3();
    camera.position.set(0, 36, 28);
  }

  reveal() {
    this.revealed = 0.001;
  }

  update(dt) {
    if (this.revealed > 0 && this.revealed < 1) {
      this.revealed = Math.min(1, this.revealed + dt * 0.55);
    }
    const t = this.revealed || 0;
    const back = 9.5 + (1 - t) * 18;
    const height = 4.8 + (1 - t) * 28;
    const yaw = this.vehicle.yaw + this.inputs.orbit;
    this._target.set(
      this.vehicle.position.x - Math.sin(yaw) * back,
      height,
      this.vehicle.position.z - Math.cos(yaw) * back
    );
    this.camera.position.lerp(this._target, Math.min(1, (t ? 5 : 1.2) * dt));
    this._look.set(this.vehicle.position.x, 1.2, this.vehicle.position.z);
    this.camera.lookAt(this._look);
    this.inputs.decayOrbit(dt);
  }
}
