import * as THREE from "three";
import { UI } from "./ui.js";
import { Ticker } from "./game/ticker.js";
import { Inputs } from "./game/inputs.js";
import { Vehicle } from "./game/vehicle.js";
import { View } from "./game/view.js";
import { Zones } from "./game/zones.js";
import { createCampus, ZONE_DEFS } from "./game/campus.js";

export async function startGame() {
  const canvas = document.querySelector("[data-canvas]");
  const minimap = document.querySelector("[data-minimap]");
  const mapCtx = minimap?.getContext("2d");
  let quality = "high";
  let applyQuality = () => {};
  let vehicle;
  let zones;

  const ui = new UI({
    onRespawn: () => {
      vehicle.respawn();
      ui.closePanel();
    },
    onToggleQuality: () => {
      quality = quality === "high" ? "low" : "high";
      applyQuality();
      return quality;
    },
    getZone: () => zones.current,
  });
  ui.bind();
  const data = await ui.load();
  await ui.prefetchLists();

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setClearColor(0x090c12, 1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 200);
  const { car, colliders, sun, rings } = createCampus(scene, data.profile.photo_url);

  const ticker = new Ticker();
  const inputs = new Inputs();
  vehicle = new Vehicle(car, colliders);
  const view = new View(camera, vehicle, inputs);
  zones = new Zones(ZONE_DEFS);
  zones.onEnter = (zone) => ui.setPrompt(zone);
  zones.onLeave = () => ui.setPrompt(null);

  applyQuality = () => {
    renderer.setPixelRatio(quality === "high" ? Math.min(window.devicePixelRatio, 1.75) : 1);
    renderer.shadowMap.enabled = quality === "high";
    sun.castShadow = quality === "high";
  };

  function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    camera.aspect = window.innerWidth / Math.max(window.innerHeight, 1);
    camera.updateProjectionMatrix();
    applyQuality();
  }
  window.addEventListener("resize", resize);
  resize();

  ui.onPlay = () => {
    inputs.locked = false;
    view.reveal();
  };
  inputs.locked = true;
  ui.markReady();

  const startZone = document.body.dataset.startZone;
  if (startZone && startZone !== "about") {
    ui.dismissIntro();
    view.reveal();
    inputs.locked = false;
    ui.open(startZone);
  }

  ticker.on((dt, elapsed) => {
    inputs.locked = ui.isBlocking();
    vehicle.update(dt, inputs);
    view.update(dt);
    const zone = zones.update(vehicle.position.x, vehicle.position.z);
    if (!ui.panel.classList.contains("is-open")) ui.setPrompt(zone);

    rings.forEach((ring, index) => {
      ring.rotation.z = elapsed * 0.6 + index;
      const pulse = 1 + Math.sin(elapsed * 2 + index) * 0.04;
      ring.scale.set(pulse, pulse, pulse);
    });

    renderer.render(scene, camera);

    if (!mapCtx || !minimap) return;
    const { width, height } = minimap;
    mapCtx.fillStyle = "#0c1118";
    mapCtx.fillRect(0, 0, width, height);
    mapCtx.strokeStyle = "#273044";
    mapCtx.strokeRect(0.5, 0.5, width - 1, height - 1);
    const scale = 1.15;
    const toX = (x) => width / 2 + x * scale;
    const toY = (z) => height / 2 + z * scale;
    mapCtx.fillStyle = "#1b2230";
    mapCtx.fillRect(toX(-6), toY(-65), 12 * scale, 130 * scale);
    mapCtx.fillRect(toX(-65), toY(-6), 130 * scale, 12 * scale);
    ZONE_DEFS.forEach((item) => {
      mapCtx.fillStyle = item.id === zone?.id ? "#f4cc72" : "#7eb8b2";
      mapCtx.beginPath();
      mapCtx.arc(toX(item.x), toY(item.z), 4, 0, Math.PI * 2);
      mapCtx.fill();
    });
    mapCtx.save();
    mapCtx.translate(toX(vehicle.position.x), toY(vehicle.position.z));
    mapCtx.rotate(vehicle.yaw);
    mapCtx.fillStyle = "#e8b94a";
    mapCtx.beginPath();
    mapCtx.moveTo(0, -7);
    mapCtx.lineTo(4, 5);
    mapCtx.lineTo(-4, 5);
    mapCtx.closePath();
    mapCtx.fill();
    mapCtx.restore();
  });

  ticker.start();
}
