
import * as THREE from "three";

const $ = id => document.getElementById(id);

const lobby = $("lobby");
const hud = $("hud");
const settings = $("settings");
const pause = $("pause");
const toast = $("toast");

let renderer, scene, camera, clock;
let running = false, paused = false, started = false;
let selectedCharacter = 0;
let sensitivity = 1;
let soundOn = true;
let mobileOn = true;
let ammo = 30, reserve = 120, health = 100, kills = 0;
let reloading = false, lastShot = 0, yaw = 0, pitch = 0;
let jumpVelocity = 0, playerY = 1.7;
let hitTimeout, toastTimeout;
const keys = {};
const bots = [];
const obstacles = [];
const raycaster = new THREE.Raycaster();
const moveInput = { x: 0, y: 0 };
const velocity = new THREE.Vector3();
const forward = new THREE.Vector3();
const right = new THREE.Vector3();
const direction = new THREE.Vector3();
const cameraTarget = new THREE.Vector3();
const arenaBounds = 19;

const colors = [0x8855ff, 0xff713f, 0x30c8ff];

function notify(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove("show"), 2300);
}

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x91a9c5);
  scene.fog = new THREE.Fog(0x91a9c5, 35, 100);

  camera = new THREE.PerspectiveCamera(
    75, innerWidth / innerHeight, 0.1, 150
  );
  camera.position.set(0, 1.7, 7);

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: "high-performance"
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
  renderer.setSize(innerWidth, innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  $("game").appendChild(renderer.domElement);

  clock = new THREE.Clock();
  buildArena();
  createPlayerGun();
  createBots();
  camera.position.set(0, playerY, 9);
  camera.rotation.order = "YXZ";

  window.addEventListener("resize", resize);
  document.addEventListener("keydown", e => {
    keys[e.code] = true;
    if (e.code === "Escape" && started && !paused) showPause();
    if (e.code === "KeyR" && started && !paused) reload();
    if (e.code === "Space" && started && !paused) jump();
  });
  document.addEventListener("keyup", e => keys[e.code] = false);

  renderer.domElement.addEventListener("click", () => {
    if (started && !paused && !isMobile()) {
      renderer.domElement.requestPointerLock?.();
    }
  });
  document.addEventListener("mousemove", e => {
    if (document.pointerLockElement === renderer.domElement && started && !paused) {
      yaw -= e.movementX * 0.002 * sensitivity;
      pitch -= e.movementY * 0.002 * sensitivity;
      pitch = THREE.MathUtils.clamp(pitch, -1.35, 1.35);
    }
  });
  document.addEventListener("mousedown", e => {
    if (e.button === 0 && started && !paused && !isMobile()) shoot();
  });

  setupUI();
  animate();
}

function isMobile() {
  return matchMedia("(max-width: 760px)").matches;
}

function material(color, roughness = 0.85) {
  return new THREE.MeshStandardMaterial({ color, roughness });
}

function box(x, y, z, sx, sy, sz, color, collidable = true) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(sx, sy, sz),
    material(color)
  );
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);
  if (collidable) obstacles.push({ x, z, hx: sx / 2, hz: sz / 2 });
  return mesh;
}

function buildArena() {
  scene.add(new THREE.HemisphereLight(0xdce9ff, 0x353047, 2.1));
  const sun = new THREE.DirectionalLight(0xffe5c4, 3);
  sun.position.set(-10, 22, 8);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  scene.add(sun);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(44, 44),
    material(0x525d6b)
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  const grid = new THREE.GridHelper(44, 44, 0x6d83a0, 0x778396);
  grid.position.y = 0.012;
  scene.add(grid);

  // Industrial arena perimeter
  box(0, 2, -21, 44, 4, 1, 0x444b59);
  box(0, 2, 21, 44, 4, 1, 0x444b59);
  box(-21, 2, 0, 1, 4, 44, 0x444b59);
  box(21, 2, 0, 1, 4, 44, 0x444b59);

  // Shipping containers and cover
  const containerColors = [0x315a75, 0x744c55, 0x53646b, 0x384c65];
  [
    [-8, -8, 5, 2.5, 5], [7, -10, 5, 2.5, 5],
    [-11, 1, 3, 2.5, 6], [10, 4, 4, 2.5, 5],
    [0, -13, 4, 2.5, 3], [0, 7, 5, 2, 2],
    [-5, 12, 3, 2.5, 4], [8, 13, 4, 2.5, 3],
    [-2, -2, 2.5, 1.7, 2.5], [4, 1, 2.5, 1.7, 2.5]
  ].forEach((o, i) => box(o[0], o[3] / 2, o[1], o[2], o[3], o[4], containerColors[i % 4]));

  // Distant warehouse silhouettes
  for (let i = 0; i < 8; i++) {
    const x = -18 + i * 5;
    const b = new THREE.Mesh(
      new THREE.BoxGeometry(3, 5 + (i % 3), 3),
      material(i % 2 ? 0x6b7181 : 0x505a70)
    );
    b.position.set(x, 2.5, -19);
    scene.add(b);
  }

  const glow = new THREE.PointLight(0x7957ff, 45, 24);
  glow.position.set(-10, 5, -8);
  scene.add(glow);
  const glow2 = new THREE.PointLight(0xff633e, 35, 22);
  glow2.position.set(10, 5, 4);
  scene.add(glow2);
}

function createPlayerGun() {
  // Stylized first-person weapon model
  const gun = new THREE.Group();
  const dark = new THREE.MeshStandardMaterial({ color: 0x202633, metalness: 0.65, roughness: 0.35 });
  const barrelMat = new THREE.MeshStandardMaterial({ color: 0x0a0d13, metalness: 0.8, roughness: 0.25 });

  const body = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.16, 0.48), dark);
  body.position.set(0, 0, 0);
  gun.add(body);

  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.04, 0.36, 10), barrelMat);
  barrel.rotation.x = Math.PI / 2;
  barrel.position.set(0, 0.025, -0.36);
  gun.add(barrel);

  const grip = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.2, 0.13), dark);
  grip.position.set(0, -0.14, 0.06);
  grip.rotation.x = -0.2;
  gun.add(grip);

  const accent = new THREE.Mesh(
    new THREE.BoxGeometry(0.07, 0.018, 0.2),
    new THREE.MeshBasicMaterial({ color: colors[selectedCharacter] })
  );
  accent.position.set(0, 0.087, -0.02);
  gun.add(accent);

  gun.position.set(0.28, -0.25, -0.48);
  camera.add(gun);
  scene.add(camera);
}

function createBots() {
  bots.length = 0;
  for (let i = 0; i < 5; i++) {
    const group = new THREE.Group();
    const suit = material(i % 2 ? 0x963d53 : 0x33384a);
    const skin = material(0xcca68d);
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.95, 0.4), suit);
    body.position.y = 0.8;
    group.add(body);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.23, 12, 10), skin);
    head.position.y = 1.48;
    group.add(head);

    const helmet = new THREE.Mesh(
      new THREE.SphereGeometry(0.25, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2),
      material(0x222739)
    );
    helmet.position.y = 1.57;
    group.add(helmet);

    const gun = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.13, 0.7),
      material(0x141820, 0.3)
    );
    gun.position.set(0.35, 0.9, -0.28);
    group.add(gun);

    group.position.set((i % 3 - 1) * 9, 0, -5 - Math.floor(i / 3) * 9);
    group.userData = {
      alive: true,
      hp: 100,
      phase: Math.random() * 6,
      homeX: group.position.x,
      homeZ: group.position.z,
      hitMeshes: []
    };
    group.traverse(child => {
      if (child.isMesh) {
        child.userData.bot = group;
        group.userData.hitMeshes.push(child);
      }
    });
    scene.add(group);
    bots.push(group);
  }
}

function updateBots(dt, time) {
  bots.forEach(bot => {
    if (!bot.userData.alive) return;
    const u = bot.userData;
    bot.position.x = u.homeX + Math.sin(time * 0.7 + u.phase) * 1.5;
    bot.position.z = u.homeZ + Math.cos(time * 0.5 + u.phase) * 0.9;
    bot.rotation.y = Math.atan2(
      camera.position.x - bot.position.x,
      camera.position.z - bot.position.z
    );

    // Training bots deal light damage at close range.
    const distance = bot.position.distanceTo(camera.position);
    if (distance < 4 && Math.random() < dt * 0.12) {
      health = Math.max(0, health - 3);
      updateHUD();
      if (health <= 0) endMission();
    }
  });
}

function shoot() {
  const now = performance.now();
  if (now - lastShot < 160 || reloading || ammo <= 0) {
    if (ammo <= 0 && !reloading) reload();
    return;
  }
  lastShot = now;
  ammo--;
  updateHUD();

  raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
  const targets = bots.filter(b => b.userData.alive).flatMap(b => b.userData.hitMeshes);
  const hits = raycaster.intersectObjects(targets, false);

  if (hits.length) {
    const bot = hits[0].object.userData.bot;
    bot.userData.hp -= 34;
    $("hitMarker").classList.add("show");
    clearTimeout(hitTimeout);
    hitTimeout = setTimeout(() => $("hitMarker").classList.remove("show"), 140);

    if (bot.userData.hp <= 0 && bot.userData.alive) {
      bot.userData.alive = false;
      scene.remove(bot);
      kills++;
      $("kills").textContent = String(kills).padStart(2, "0");
      notify("TARGET ELIMINATED +100 XP");
      if (bots.every(b => !b.userData.alive)) {
        notify("ARENA CLEAR — MISSION COMPLETE!");
        setTimeout(endMission, 1500);
      }
    }
  }
}

function reload() {
  if (reloading || ammo === 30 || reserve <= 0) return;
  reloading = true;
  notify("RELOADING...");
  setTimeout(() => {
    const amount = Math.min(30 - ammo, reserve);
    ammo += amount;
    reserve -= amount;
    reloading = false;
    updateHUD();
  }, 1100);
}

function jump() {
  if (playerY <= 1.71) jumpVelocity = 5.5;
}

function updateHUD() {
  $("healthText").textContent = health;
  $("healthBar").style.width = health + "%";
  $("ammo").innerHTML = `${ammo} <span>/ ${reserve}</span>`;
}

function resize() {
  if (!renderer || !camera) return;
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
}

function setupUI() {
  document.querySelectorAll(".character").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".character").forEach(b => b.classList.remove("selected"));
      button.classList.add("selected");
      selectedCharacter = Number(button.dataset.character);
      notify(button.querySelector("strong").textContent + " selected");
    });
  });

  $("startBtn").onclick = startGame;
  $("settingsBtn").onclick = () => settings.classList.remove("hidden");
  $("closeSettings").onclick = () => settings.classList.add("hidden");
  $("saveSettings").onclick = () => {
    sensitivity = Number($("sensitivity").value);
    soundOn = $("sound").checked;
    mobileOn = $("mobileEnabled").checked;
    settings.classList.add("hidden");
    notify("SETTINGS SAVED");
  };
  $("sensitivity").oninput = e => {
    $("sensValue").textContent = Number(e.target.value).toFixed(1) + "×";
  };
  $("pauseBtn").onclick = showPause;
  $("resumeBtn").onclick = () => {
    paused = false;
    pause.classList.add("hidden");
    clock.getDelta();
  };
  $("restartBtn").onclick = () => {
    pause.classList.add("hidden");
    resetMission();
  };
  $("exitBtn").onclick = exitLobby;
  $("homeBtn").onclick = e => { e.preventDefault(); exitLobby(); };
  $("reloadBtn").onclick = reload;
  $("jumpBtn").onclick = jump;
  $("fireBtn").addEventListener("pointerdown", e => {
    e.preventDefault();
    if (started && !paused && mobileOn) shoot();
  });

  // Left virtual joystick
  const moveStick = $("moveStick");
  const stick = moveStick.querySelector(".stick");
  let movePointer = null;
  moveStick.addEventListener("pointerdown", e => {
    movePointer = e.pointerId;
    moveStick.setPointerCapture(e.pointerId);
    moveStick.dataset.startX = e.clientX;
    moveStick.dataset.startY = e.clientY;
  });
  moveStick.addEventListener("pointermove", e => {
    if (e.pointerId !== movePointer) return;
    const dx = e.clientX - Number(moveStick.dataset.startX);
    const dy = e.clientY - Number(moveStick.dataset.startY);
    const max = 36;
    const x = THREE.MathUtils.clamp(dx, -max, max);
    const y = THREE.MathUtils.clamp(dy, -max, max);
    stick.style.transform = `translate(${x}px,${y}px)`;
    moveInput.x = x / max;
    moveInput.y = y / max;
  });
  const stopMove = e => {
    if (e.pointerId !== movePointer) return;
    movePointer = null;
    moveInput.x = moveInput.y = 0;
    stick.style.transform = "";
  };
  moveStick.addEventListener("pointerup", stopMove);
  moveStick.addEventListener("pointercancel", stopMove);

  // Right touch pad for looking around
  const lookPad = $("lookPad");
  let lookPointer = null, lastX = 0, lastY = 0;
  lookPad.addEventListener("pointerdown", e => {
    lookPointer = e.pointerId;
    lastX = e.clientX;
    lastY = e.clientY;
    lookPad.setPointerCapture(e.pointerId);
  });
  lookPad.addEventListener("pointermove", e => {
    if (e.pointerId !== lookPointer || !started || paused || !mobileOn) return;
    yaw -= (e.clientX - lastX) * 0.008 * sensitivity;
    pitch -= (e.clientY - lastY) * 0.008 * sensitivity;
    pitch = THREE.MathUtils.clamp(pitch, -1.35, 1.35);
    lastX = e.clientX;
    lastY = e.clientY;
  });
  const stopLook = e => { if (e.pointerId === lookPointer) lookPointer = null; };
  lookPad.addEventListener("pointerup", stopLook);
  lookPad.addEventListener("pointercancel", stopLook);
}

function startGame() {
  started = true;
  running = true;
  paused = false;
  lobby.classList.add("hidden");
  settings.classList.add("hidden");
  pause.classList.add("hidden");
  hud.classList.remove("hidden");
  $("mobileControls").style.display = mobileOn && isMobile() ? "block" : "none";
  $("desktopTip").style.display = isMobile() ? "none" : "block";
  resetMission(false);
  notify("MISSION STARTED — GOOD LUCK");
}

function resetMission(rebuild = true) {
  health = 100;
  ammo = 30;
  reserve = 120;
  kills = 0;
  reloading = false;
  yaw = 0;
  pitch = 0;
  playerY = 1.7;
  jumpVelocity = 0;
  velocity.set(0, 0, 0);
  camera.position.set(0, playerY, 9);
  camera.rotation.set(0, 0, 0);
  $("kills").textContent = "00";
  updateHUD();

  if (rebuild) {
    bots.forEach(bot => scene.remove(bot));
    createBots();
  } else {
    bots.forEach(bot => {
      bot.visible = true;
      bot.userData.alive = true;
      bot.userData.hp = 100;
    });
  }
  running = true;
  paused = false;
  started = true;
  clock.getDelta();
}

function showPause() {
  paused = true;
  pause.classList.remove("hidden");
  if (document.pointerLockElement) document.exitPointerLock();
}

function endMission() {
  running = false;
  paused = true;
  pause.classList.remove("hidden");
  pause.querySelector("h2").textContent = health <= 0 ? "MISSION FAILED" : "ARENA CLEAR";
  pause.querySelector("small").textContent = `ELIMINATIONS: ${kills}`;
}

function exitLobby() {
  started = false;
  running = false;
  paused = false;
  hud.classList.add("hidden");
  pause.classList.add("hidden");
  settings.classList.add("hidden");
  lobby.classList.remove("hidden");
  if (document.pointerLockElement) document.exitPointerLock();
}

function updatePlayer(dt) {
  if (!started || paused || !running) return;

  camera.rotation.order = "YXZ";
  camera.rotation.set(pitch, yaw, 0);

  forward.set(-Math.sin(yaw), 0, -Math.cos(yaw));
  right.set(Math.cos(yaw), 0, -Math.sin(yaw));

  direction.set(0, 0, 0);
  if (keys.KeyW || keys.ArrowUp) direction.add(forward);
  if (keys.KeyS || keys.ArrowDown) direction.sub(forward);
  if (keys.KeyD || keys.ArrowRight) direction.add(right);
  if (keys.KeyA || keys.ArrowLeft) direction.sub(right);

  direction.addScaledVector(right, moveInput.x);
  direction.addScaledVector(forward, -moveInput.y);

  if (direction.lengthSq() > 0) {
    direction.normalize();
    velocity.copy(direction).multiplyScalar(7.0 * dt);
    const nx = camera.position.x + velocity.x;
    const nz = camera.position.z + velocity.z;

    if (Math.abs(nx) < arenaBounds && !collides(nx, camera.position.z)) camera.position.x = nx;
    if (Math.abs(nz) < arenaBounds && !collides(camera.position.x, nz)) camera.position.z = nz;
  }

  jumpVelocity -= 14 * dt;
  playerY += jumpVelocity * dt;
  if (playerY < 1.7) {
    playerY = 1.7;
    jumpVelocity = 0;
  }
  camera.position.y = playerY;
}

function collides(x, z) {
  return obstacles.some(o =>
    Math.abs(x - o.x) < o.hx + 0.35 &&
    Math.abs(z - o.z) < o.hz + 0.35
  );
}

function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.04);
  if (started && !paused && running) {
    updatePlayer(dt);
    updateBots(dt, clock.elapsedTime);
  }
  renderer.render(scene, camera);
}

init();
}

init();