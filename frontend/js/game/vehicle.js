import * as THREE from "three";

export class Vehicle {
  constructor(mesh, colliders) {
    this.mesh = mesh;
    this.colliders = colliders;
    this.speed = 0;
    this.yaw = Math.PI;
    this.spawn = { x: 0, z: 14, yaw: Math.PI };
    this.mesh.position.set(this.spawn.x, 0, this.spawn.z);
    this.mesh.rotation.y = this.yaw;
  }

  get position() {
    return this.mesh.position;
  }

  respawn() {
    this.speed = 0;
    this.yaw = this.spawn.yaw;
    this.mesh.position.set(this.spawn.x, 0, this.spawn.z);
    this.mesh.rotation.y = this.yaw;
  }

  _hits(x, z) {
    const hw = 0.95;
    const hd = 1.5;
    return this.colliders.some(
      (item) => x + hw > item.minX && x - hw < item.maxX && z + hd > item.minZ && z - hd < item.maxZ
    );
  }

  update(dt, inputs) {
    const maxSpeed = inputs.boosting ? 26 : 16;
    if (inputs.throttle !== 0) this.speed += inputs.throttle * 22 * dt;
    else this.speed *= 1 - Math.min(1, 3.2 * dt);
    this.speed = Math.max(-maxSpeed * 0.45, Math.min(maxSpeed, this.speed));
    const turn =
      inputs.steer * 2.35 * (Math.abs(this.speed) / maxSpeed) * Math.sign(this.speed || 1);
    this.yaw += turn * dt;
    const nx = this.mesh.position.x + Math.sin(this.yaw) * this.speed * dt;
    const nz = this.mesh.position.z + Math.cos(this.yaw) * this.speed * dt;
    if (!this._hits(nx, this.mesh.position.z) && Math.abs(nx) < 88) this.mesh.position.x = nx;
    else this.speed *= 0.4;
    if (!this._hits(this.mesh.position.x, nz) && Math.abs(nz) < 88) this.mesh.position.z = nz;
    else this.speed *= 0.4;
    this.mesh.rotation.y = this.yaw;
    this.mesh.userData.wheels?.forEach((wheel) => {
      wheel.rotation.x += this.speed * dt * 1.4;
    });
  }
}
