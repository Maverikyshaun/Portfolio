import * as THREE from "three";

function bodyPaint() {
  return new THREE.MeshStandardMaterial({
    color: 0x1f6b52,
    metalness: 0.38,
    roughness: 0.28,
    emissive: 0x0a2a20,
    emissiveIntensity: 0.22,
  });
}

function darkPaint() {
  return new THREE.MeshStandardMaterial({
    color: 0x121c18,
    metalness: 0.4,
    roughness: 0.4,
  });
}

function chrome(color = 0xd8d8d4) {
  return new THREE.MeshStandardMaterial({
    color,
    metalness: 0.95,
    roughness: 0.22,
  });
}

function glass() {
  return new THREE.MeshStandardMaterial({
    color: 0x6a8798,
    metalness: 0.7,
    roughness: 0.08,
    transparent: true,
    opacity: 0.42,
  });
}

function add(parent, geo, material, x, y, z, rx = 0, ry = 0, rz = 0) {
  const mesh = new THREE.Mesh(geo, material);
  mesh.position.set(x, y, z);
  mesh.rotation.set(rx, ry, rz);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function makeLeaper() {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0.02);
  shape.quadraticCurveTo(0.08, 0.12, 0.22, 0.16);
  shape.quadraticCurveTo(0.34, 0.2, 0.42, 0.28);
  shape.lineTo(0.5, 0.26);
  shape.quadraticCurveTo(0.46, 0.18, 0.38, 0.1);
  shape.quadraticCurveTo(0.48, 0.08, 0.52, 0.0);
  shape.quadraticCurveTo(0.4, 0.02, 0.28, -0.02);
  shape.quadraticCurveTo(0.2, -0.1, 0.12, -0.08);
  shape.quadraticCurveTo(0.16, 0.0, 0.08, 0.0);
  shape.lineTo(0, 0.02);
  return new THREE.ExtrudeGeometry(shape, { depth: 0.02, bevelEnabled: false });
}

function makeWheel() {
  const wheel = new THREE.Group();
  const tire = new THREE.Mesh(
    new THREE.TorusGeometry(0.35, 0.115, 16, 32),
    new THREE.MeshStandardMaterial({ color: 0x0d0d0d, roughness: 0.82, metalness: 0.06 })
  );
  tire.rotation.y = Math.PI / 2;
  tire.castShadow = true;

  const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.05, 28), chrome(0x8f8f8b));
  disc.rotation.z = Math.PI / 2;
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.15, 20), chrome(0xe8b94a));
  hub.rotation.z = Math.PI / 2;
  const caliper = new THREE.Mesh(
    new THREE.BoxGeometry(0.07, 0.13, 0.15),
    new THREE.MeshStandardMaterial({ color: 0xb8962e, metalness: 0.6, roughness: 0.35 })
  );
  caliper.position.set(0, 0.17, 0);
  wheel.add(tire, disc, hub, caliper);
  for (let i = 0; i < 5; i += 1) {
    const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.44, 0.038), chrome(0xcfcfcb));
    spoke.rotation.z = (i * Math.PI) / 5;
    wheel.add(spoke);
  }
  wheel.userData.spin = tire;
  return wheel;
}

function hullProfile() {
  const profile = new THREE.Shape();
  profile.moveTo(-2.18, 0.15);
  profile.lineTo(-2.28, 0.4);
  profile.quadraticCurveTo(-2.22, 0.66, -1.55, 0.7);
  profile.lineTo(1.05, 0.68);
  profile.quadraticCurveTo(1.85, 0.62, 2.28, 0.5);
  profile.quadraticCurveTo(2.46, 0.42, 2.4, 0.24);
  profile.lineTo(2.26, 0.14);
  profile.lineTo(-2.18, 0.15);
  return profile;
}

export function makeJaguar() {
  const car = new THREE.Group();
  const brg = bodyPaint();
  const dark = darkPaint();
  const black = new THREE.MeshStandardMaterial({ color: 0x090909, roughness: 0.58, metalness: 0.18 });

  const hull = new THREE.Mesh(
    new THREE.ExtrudeGeometry(hullProfile(), {
      depth: 1.7,
      bevelEnabled: true,
      bevelThickness: 0.09,
      bevelSize: 0.08,
      bevelSegments: 5,
      steps: 1,
    }),
    brg
  );
  hull.rotation.y = Math.PI / 2;
  hull.position.set(-0.85, 0.02, 0);
  hull.castShadow = true;
  hull.receiveShadow = true;
  car.add(hull);

  add(car, new THREE.BoxGeometry(1.62, 0.1, 4.22), dark, 0, 0.18, 0.02);
  add(car, new THREE.BoxGeometry(1.52, 0.1, 1.7), brg, 0, 0.66, 1.12);
  add(car, new THREE.BoxGeometry(0.9, 0.06, 1.35), dark, 0, 0.73, 1.18);

  const haunchGeo = new THREE.SphereGeometry(0.58, 18, 14);
  const leftHaunch = add(car, haunchGeo, brg, 0.62, 0.52, -1.12);
  leftHaunch.scale.set(0.62, 0.48, 1.15);
  const rightHaunch = add(car, haunchGeo.clone(), brg, -0.62, 0.52, -1.12);
  rightHaunch.scale.set(0.62, 0.48, 1.15);

  add(car, new THREE.BoxGeometry(1.36, 0.42, 0.72), glass(), 0, 1.02, 0.58, 0.5);
  add(car, new THREE.BoxGeometry(1.28, 0.05, 1.08), glass(), 0, 1.26, -0.14, -0.1);
  add(car, new THREE.BoxGeometry(1.32, 0.34, 0.58), glass(), 0, 1.04, -0.78, -0.42);
  add(car, new THREE.BoxGeometry(0.04, 0.32, 1.05), glass(), 0.7, 1.02, -0.08);
  add(car, new THREE.BoxGeometry(0.04, 0.32, 1.05), glass(), -0.7, 1.02, -0.08);
  add(car, new THREE.BoxGeometry(1.44, 0.03, 0.06), chrome(0xdeded8), 0, 0.84, 0.12);
  add(car, new THREE.BoxGeometry(0.04, 0.28, 1.12), chrome(0xcacac6), 0.72, 1.0, -0.1);
  add(car, new THREE.BoxGeometry(0.04, 0.28, 1.12), chrome(0xcacac6), -0.72, 1.0, -0.1);

  const grille = add(car, new THREE.CylinderGeometry(0.28, 0.34, 0.08, 32), black, 0, 0.46, 2.32, Math.PI / 2);
  grille.scale.set(1.48, 1, 0.66);
  add(car, new THREE.TorusGeometry(0.32, 0.026, 10, 32), chrome(), 0, 0.46, 2.35, Math.PI / 2).scale.set(1.48, 0.66, 1);
  for (let i = -3; i <= 3; i += 1) {
    add(car, new THREE.BoxGeometry(0.016, 0.3, 0.02), chrome(0xb7b7b2), i * 0.07, 0.46, 2.34);
  }
  const leaper = new THREE.Mesh(makeLeaper(), chrome(0xe8b94a));
  leaper.position.set(-0.11, 0.44, 2.38);
  leaper.scale.set(0.4, 0.4, 1);
  leaper.castShadow = true;
  car.add(leaper);

  const lamp = new THREE.MeshStandardMaterial({
    color: 0xfff6de,
    emissive: 0xffe08a,
    emissiveIntensity: 1.5,
    metalness: 0.3,
    roughness: 0.18,
  });
  add(car, new THREE.CapsuleGeometry(0.055, 0.38, 8, 14), lamp, 0.68, 0.5, 2.22, 0, 0.22, Math.PI / 2);
  add(car, new THREE.CapsuleGeometry(0.055, 0.38, 8, 14), lamp, -0.68, 0.5, 2.22, 0, -0.22, Math.PI / 2);
  add(car, new THREE.BoxGeometry(0.2, 0.04, 0.035), lamp, 0.82, 0.42, 2.16, 0, 0.45);
  add(car, new THREE.BoxGeometry(0.2, 0.04, 0.035), lamp, -0.82, 0.42, 2.16, 0, -0.45);

  add(car, new THREE.BoxGeometry(1.66, 0.16, 0.3), dark, 0, 0.26, 2.26);
  add(car, new THREE.BoxGeometry(0.62, 0.07, 0.16), black, 0, 0.2, 2.34);

  const tail = new THREE.MeshStandardMaterial({
    color: 0x7a1218,
    emissive: 0xff2430,
    emissiveIntensity: 1.05,
  });
  add(car, new THREE.BoxGeometry(0.58, 0.08, 0.055), tail, 0.54, 0.58, -2.2);
  add(car, new THREE.BoxGeometry(0.58, 0.08, 0.055), tail, -0.54, 0.58, -2.2);
  add(car, new THREE.BoxGeometry(0.18, 0.045, 0.04), lamp, 0, 0.58, -2.2);
  add(car, new THREE.BoxGeometry(1.5, 0.2, 0.24), dark, 0, 0.3, -2.18);
  add(car, new THREE.BoxGeometry(1.22, 0.05, 0.28), brg, 0, 0.78, -1.92, 0.18);
  add(car, new THREE.CylinderGeometry(0.042, 0.048, 0.13, 12), chrome(), 0.36, 0.2, -2.26, Math.PI / 2);
  add(car, new THREE.CylinderGeometry(0.042, 0.048, 0.13, 12), chrome(), 0.5, 0.2, -2.26, Math.PI / 2);
  add(car, new THREE.CylinderGeometry(0.042, 0.048, 0.13, 12), chrome(), -0.36, 0.2, -2.26, Math.PI / 2);
  add(car, new THREE.CylinderGeometry(0.042, 0.048, 0.13, 12), chrome(), -0.5, 0.2, -2.26, Math.PI / 2);

  add(car, new THREE.BoxGeometry(0.18, 0.14, 0.42), brg, 0.86, 0.92, 0.32);
  add(car, new THREE.BoxGeometry(0.18, 0.14, 0.42), brg, -0.86, 0.92, 0.32);
  add(car, new THREE.BoxGeometry(0.12, 0.08, 0.18), glass(), 0.94, 0.96, 0.32);
  add(car, new THREE.BoxGeometry(0.12, 0.08, 0.18), glass(), -0.94, 0.96, 0.32);
  add(car, new THREE.BoxGeometry(0.07, 0.2, 0.38), dark, 0.86, 0.56, 1.02);
  add(car, new THREE.BoxGeometry(0.07, 0.2, 0.38), dark, -0.86, 0.56, 1.02);
  add(car, new THREE.BoxGeometry(1.74, 0.035, 0.72), chrome(0xb8b8b3), 0, 0.3, 1.58);

  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(1.65, 24),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.3 })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.02;
  shadow.scale.set(1.1, 2.15, 1);
  car.add(shadow);

  const wheels = [];
  [
    [0.9, 0.37, 1.3],
    [-0.9, 0.37, 1.3],
    [0.9, 0.37, -1.26],
    [-0.9, 0.37, -1.26],
  ].forEach((pos, index) => {
    const wheel = makeWheel();
    wheel.position.set(...pos);
    if (index % 2 === 1) wheel.rotation.y = Math.PI;
    car.add(wheel);
    wheels.push(wheel.userData.spin);
  });
  car.userData.wheels = wheels;
  const fill = new THREE.PointLight(0xd7efe4, 0.95, 7, 2);
  fill.position.set(0, 2.3, 0.2);
  car.add(fill);
  return car;
}
