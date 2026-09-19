import * as THREE from "three";
import { makeJaguar } from "./jaguar.js";

export const ZONE_DEFS = [
  { id: "about", label: "About", x: 0, z: 6, r: 9 },
  { id: "experience", label: "Experience", x: 0, z: -48, r: 12 },
  { id: "projects", label: "Projects", x: 48, z: 0, r: 12 },
  { id: "education", label: "Education", x: 0, z: 48, r: 12 },
  { id: "skills", label: "Skills", x: -48, z: 0, r: 12 },
  { id: "contact", label: "Contact", x: 38, z: 38, r: 10 },
];

const COLORS = {
  night: 0x090c12,
  ground: 0x10151c,
  road: 0x1b2230,
  building: 0x1a2332,
  trim: 0xe8b94a,
  navy: 0x243656,
  glass: 0x7eb8b2,
  cabin: 0x0e141c,
};

function mat(color, extras = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.72,
    metalness: 0.12,
    ...extras,
  });
}

function boxMesh(w, h, d, color, extras) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color, extras));
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.position.y = h / 2;
  return mesh;
}

function labelSprite(text) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "rgba(9, 12, 18, 0.55)";
  ctx.fillRect(40, 70, 944, 120);
  ctx.font = "700 92px Outfit, sans-serif";
  ctx.fillStyle = "#f4cc72";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text.toUpperCase(), 512, 128);
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: new THREE.CanvasTexture(canvas),
      transparent: true,
      depthWrite: false,
    })
  );
  sprite.scale.set(14, 3.5, 1);
  return sprite;
}

export function createCampus(scene, photoUrl) {
  const colliders = [];
  const rings = [];

  scene.fog = new THREE.Fog(COLORS.night, 28, 110);
  scene.add(new THREE.HemisphereLight(0xb9c7d6, 0x1a1208, 0.55));
  const sun = new THREE.DirectionalLight(0xffe3a1, 1.05);
  sun.position.set(-30, 42, 18);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -70;
  sun.shadow.camera.right = 70;
  sun.shadow.camera.top = 70;
  sun.shadow.camera.bottom = -70;
  scene.add(sun);

  const starCount = 900;
  const positions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i += 1) {
    positions[i * 3] = (Math.random() - 0.5) * 260;
    positions[i * 3 + 1] = 18 + Math.random() * 70;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 260;
  }
  const stars = new THREE.BufferGeometry();
  stars.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  scene.add(new THREE.Points(stars, new THREE.PointsMaterial({ color: 0xf4e4b5, size: 0.22 })));

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(220, 220), mat(COLORS.ground));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);
  const roadMat = mat(COLORS.road, { roughness: 0.92 });
  const roadZ = new THREE.Mesh(new THREE.PlaneGeometry(12, 130), roadMat);
  roadZ.rotation.x = -Math.PI / 2;
  roadZ.position.y = 0.02;
  const roadX = new THREE.Mesh(new THREE.PlaneGeometry(130, 12), roadMat);
  roadX.rotation.x = -Math.PI / 2;
  roadX.position.y = 0.021;
  scene.add(roadZ, roadX);

  function obstacle(mesh, padding = 0.4) {
    scene.add(mesh);
    const box = new THREE.Box3().setFromObject(mesh);
    colliders.push({
      minX: box.min.x - padding,
      maxX: box.max.x + padding,
      minZ: box.min.z - padding,
      maxZ: box.max.z + padding,
    });
  }

  function building(x, z, w, h, d, color = COLORS.building) {
    const mesh = boxMesh(w, h, d, color);
    mesh.position.set(x, h / 2, z);
    const band = boxMesh(w + 0.08, 0.18, d + 0.08, COLORS.trim, {
      emissive: COLORS.trim,
      emissiveIntensity: 0.25,
    });
    band.position.set(x, h * 0.62, z);
    obstacle(mesh);
    scene.add(band);
    return mesh;
  }

  function placeLabel(text, x, z, y = 13) {
    const sprite = labelSprite(text);
    sprite.position.set(x, y, z);
    scene.add(sprite);
  }

  function interactiveRing(x, z, radius) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(radius * 0.55, 0.08, 8, 48),
      mat(COLORS.trim, { emissive: COLORS.trim, emissiveIntensity: 0.55 })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.set(x, 0.2, z);
    scene.add(ring);
    rings.push(ring);
  }

  building(0, -52, 16, 9, 10);
  building(-8, -58, 6, 14, 6, COLORS.navy);
  building(8, -58, 6, 11, 6);
  placeLabel("Experience", 0, -48);

  building(52, 0, 10, 8, 16);
  building(58, -8, 5, 13, 5, 0x16343a);
  building(58, 8, 5, 7, 5);
  placeLabel("Projects", 48, 0);

  building(0, 52, 18, 8, 10, 0x1c2838);
  building(-9, 57, 7, 12, 7);
  placeLabel("Education", 0, 48);

  for (let i = 0; i < 5; i += 1) {
    const rack = boxMesh(2.2, 4 + i * 0.6, 1.4, 0x151c27, {
      emissive: 0x7eb8b2,
      emissiveIntensity: 0.08 + i * 0.04,
    });
    rack.position.set(-50 + i * 1.8, rack.position.y, (i % 2) * 3 - 1);
    obstacle(rack);
  }
  building(-58, 0, 8, 10, 12);
  placeLabel("Skills", -48, 0);

  building(40, 42, 8, 6, 8, 0x2a2418);
  const mail = boxMesh(2.2, 2.4, 2.2, COLORS.trim, { emissive: COLORS.trim, emissiveIntensity: 0.2 });
  mail.position.set(36, 1.2, 36);
  obstacle(mail);
  placeLabel("Contact", 38, 38, 11);

  const plaza = new THREE.Mesh(new THREE.CylinderGeometry(9, 9, 0.18, 48), mat(0x171e2a));
  plaza.position.y = 0.1;
  plaza.receiveShadow = true;
  scene.add(plaza);
  placeLabel("Shantanu Soni", 0, 6, 8.5);

  const portrait = new THREE.Mesh(
    new THREE.PlaneGeometry(4.2, 5.2),
    new THREE.MeshStandardMaterial({
      map: new THREE.TextureLoader().load(photoUrl),
      roughness: 0.5,
    })
  );
  portrait.position.set(-5.4, 3.4, 2.62);
  portrait.castShadow = true;
  scene.add(portrait);
  const frame = boxMesh(4.8, 5.8, 0.16, COLORS.trim, { emissive: COLORS.trim, emissiveIntensity: 0.2 });
  frame.position.set(-5.4, 3.4, 2.48);
  scene.add(frame);

  ZONE_DEFS.forEach((zone) => interactiveRing(zone.x, zone.z, zone.r));

  [
    [10, 10],
    [-10, 10],
    [10, -10],
    [-10, -10],
    [18, -30],
    [-18, -30],
    [18, 30],
    [-18, 30],
    [30, 18],
    [-30, 18],
    [30, -18],
    [-30, -18],
  ].forEach(([x, z]) => {
    const group = new THREE.Group();
    const pole = boxMesh(0.16, 4.2, 0.16, 0x2a3140);
    const head = boxMesh(0.7, 0.14, 0.7, COLORS.trim, {
      emissive: COLORS.trim,
      emissiveIntensity: 0.7,
    });
    head.position.y = 4.3;
    group.add(pole, head);
    group.position.set(x, 0, z);
    scene.add(group);
  });

  const car = makeJaguar();
  car.scale.setScalar(1.18);
  scene.add(car);

  return { car, colliders, sun, rings, colors: COLORS };
}
