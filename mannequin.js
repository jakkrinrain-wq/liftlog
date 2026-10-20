// หุ่น 3D สาธิตท่า — เขียนเองทั้งหมด (ไม่ใช้โมเดลของใคร) ใช้ Three.js (MIT)
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

// สัดส่วนร่างกาย (เมตร) ความสูงรวมประมาณ 1.75
const L = { ankle: 0.10, shin: 0.43, thigh: 0.45, spine: 0.52, neck: 0.07, head: 0.115, hipW: 0.11, shW: 0.21 };
const UP = new THREE.Vector3(0, 1, 0);

function capsule(r, len, mat) {
  const m = new THREE.Mesh(new THREE.CapsuleGeometry(r, Math.max(0.001, len - 2 * r), 6, 16), mat);
  m.castShadow = true; return m;
}
const at = (m, v) => (m.position.copy(v), m);
function ball(r, mat) { const m = new THREE.Mesh(new THREE.SphereGeometry(r, 20, 14), mat); m.castShadow = true; return m; }
// แท่งเชื่อมระหว่างจุด a กับ b
function between(a, b, r, mat) {
  const d = new THREE.Vector3().subVectors(b, a), m = capsule(r, d.length(), mat);
  m.position.copy(a).addScaledVector(d, 0.5);
  m.quaternion.setFromUnitVectors(UP, d.normalize());
  return m;
}
const ease = x => 0.5 - Math.cos(Math.PI * x) / 2;

// ท่าทาง: คืนค่าความลึก 0 (ยืน) ถึง 1 (ย่อสุด) ตามเวลา
const MOTIONS = {
  squat: { period: 3.4, depth(t) { // ลง 1.5s · ค้าง 0.2s · ขึ้น 1.2s · พักบน 0.5s
    if (t < 1.5) return ease(t / 1.5);
    if (t < 1.7) return 1;
    if (t < 2.9) return 1 - ease((t - 1.7) / 1.2);
    return 0;
  } },
};

export function mount(el, name = 'squat') {
  const motion = MOTIONS[name];
  const W = () => el.clientWidth || 300, H = () => el.clientHeight || 300;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(W(), H());
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  el.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, W() / H(), 0.1, 50);
  camera.position.set(0, 1.05, 4.6); camera.lookAt(0, 0.82, 0);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x1a2230, 1.2));
  const sun = new THREE.DirectionalLight(0xffffff, 1.8);
  sun.position.set(2.5, 4, 3); sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -1.5, right: 1.5, top: 2.2, bottom: -0.5 }); sun.shadow.radius = 4;
  scene.add(sun);
  const rim = new THREE.DirectionalLight(0xC6FF3D, 1.0); rim.position.set(-3, 2, -2.5); scene.add(rim);

  const floor = new THREE.Mesh(new THREE.CircleGeometry(1.2, 48), new THREE.ShadowMaterial({ opacity: 0.35 }));
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
  const ring = new THREE.Mesh(new THREE.RingGeometry(1.12, 1.16, 72), new THREE.MeshBasicMaterial({ color: 0xC6FF3D, transparent: true, opacity: 0.45 }));
  ring.rotation.x = -Math.PI / 2; ring.position.y = 0.002; scene.add(ring);

  const skin = new THREE.MeshStandardMaterial({ color: 0xdfe3ea, roughness: 0.45, metalness: 0.05 });
  const work = new THREE.MeshStandardMaterial({ color: 0xC6FF3D, roughness: 0.4, emissive: 0x3a5200, emissiveIntensity: 0.5 }); // กล้ามที่ใช้
  const joint = new THREE.MeshStandardMaterial({ color: 0x9aa3b0, roughness: 0.5 });
  const metal = new THREE.MeshStandardMaterial({ color: 0xb8c0cc, metalness: 0.9, roughness: 0.25 });
  const plate = new THREE.MeshStandardMaterial({ color: 0x23272e, roughness: 0.55 });

  // ---------- สร้างหุ่น (หันหน้าไปทาง +z) ----------
  const fig = new THREE.Group(); scene.add(fig);
  const root = new THREE.Group(); fig.add(root);                 // สะโพก
  const pelvis = capsule(0.12, 0.34, work); pelvis.rotation.z = Math.PI / 2; root.add(pelvis); // ก้น

  const spine = new THREE.Group(); root.add(spine);
  const torso = between(new THREE.Vector3(0, 0.08, 0), new THREE.Vector3(0, L.spine - 0.06, 0), 0.15, skin);
  torso.scale.set(1.25, 1, 0.78); spine.add(torso);
  spine.add(at(ball(0.055, joint), new THREE.Vector3(0, L.spine + 0.02, 0)));
  spine.add(at(ball(L.head, skin), new THREE.Vector3(0, L.spine + L.neck + L.head, 0.015)));

  // บาร์เบลวางบนหลังส่วนบน
  const barY = L.spine - 0.03, barZ = -0.12;
  const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 1.7, 12), metal);
  bar.rotation.z = Math.PI / 2; bar.position.set(0, barY, barZ); bar.castShadow = true; spine.add(bar);
  for (const s of [-1, 1]) for (const [x, r] of [[0.62, 0.22], [0.69, 0.17]]) {
    const p = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.05, 32), plate);
    p.rotation.z = Math.PI / 2; p.position.set(s * x, barY, barZ); p.castShadow = true; spine.add(p);
  }
  // แขน: จับบาร์ (ท่าคงที่เทียบกับลำตัว)
  for (const s of [-1, 1]) {
    const sh = new THREE.Vector3(s * L.shW, L.spine - 0.04, 0), el2 = new THREE.Vector3(s * 0.36, L.spine - 0.26, -0.12), hand = new THREE.Vector3(s * 0.43, barY, barZ);
    spine.add(at(ball(0.07, skin), sh));
    spine.add(between(sh, el2, 0.05, skin)); spine.add(between(el2, hand, 0.045, skin));
    spine.add(at(ball(0.045, joint), el2));
    spine.add(at(ball(0.05, skin), hand));
  }
  // ขา: สะโพก → เข่า → ข้อเท้า
  const legs = [-1, 1].map(s => {
    const hip = new THREE.Group(); hip.position.set(s * L.hipW, -0.02, 0); root.add(hip);
    hip.add(between(new THREE.Vector3(), new THREE.Vector3(0, -L.thigh, 0), 0.08, work)); // ต้นขา
    const knee = new THREE.Group(); knee.position.y = -L.thigh; hip.add(knee);
    knee.add(ball(0.06, joint));
    knee.add(between(new THREE.Vector3(), new THREE.Vector3(0, -L.shin, 0), 0.06, skin));
    const ankle = new THREE.Group(); ankle.position.y = -L.shin; knee.add(ankle);
    const foot = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.07, 0.25), skin);
    foot.position.set(0, -0.055, 0.06); foot.castShadow = true; ankle.add(foot);
    return { hip, knee, ankle };
  });

  // จัดท่าตามความลึก d: เท้าติดพื้น คำนวณมุมเข่า/สะโพกด้วย IK สองท่อน
  const hipTop = L.ankle + L.thigh + L.shin - 0.01;
  function pose(d) {
    const hy = hipTop - 0.44 * d, hz = -0.24 * d;                // สะโพกลงและถอยหลัง
    root.position.set(0, hy + 0.02, hz);
    spine.rotation.x = 0.74 * d;                                   // ลำตัวเอนไปข้างหน้า
    const ay = L.ankle, az = 0, L1 = L.thigh, L2 = L.shin;
    let dist = Math.hypot(az - hz, ay - hy); dist = Math.min(dist, L1 + L2 - 1e-4);
    const phi = Math.atan2(ay - hy, az - hz);
    const alpha = Math.acos(Math.max(-1, Math.min(1, (L1 * L1 + dist * dist - L2 * L2) / (2 * L1 * dist))));
    const k1 = [hz + L1 * Math.cos(phi + alpha), hy + L1 * Math.sin(phi + alpha)];
    const k2 = [hz + L1 * Math.cos(phi - alpha), hy + L1 * Math.sin(phi - alpha)];
    const [kz, ky] = k1[0] > k2[0] ? k1 : k2;                     // เข่าพับไปด้านหน้า
    const a1 = Math.atan2(-(kz - hz), -(ky - hy)), a2 = Math.atan2(-(az - kz), -(ay - ky));
    for (const g of legs) { g.hip.rotation.x = a1; g.knee.rotation.x = a2 - a1; g.ankle.rotation.x = -a2; }
  }

  // ลากนิ้วเพื่อหมุนดู
  fig.rotation.y = -0.9; let drag = null, idle = 0;
  const cvs = renderer.domElement;
  cvs.addEventListener('pointerdown', e => { drag = e.clientX; idle = 0; cvs.setPointerCapture(e.pointerId); });
  cvs.addEventListener('pointermove', e => { if (drag !== null) { fig.rotation.y += (e.clientX - drag) * 0.012; drag = e.clientX; } });
  cvs.addEventListener('pointerup', () => drag = null);
  cvs.addEventListener('pointercancel', () => drag = null);

  const ro = new ResizeObserver(() => { renderer.setSize(W(), H()); camera.aspect = W() / H(); camera.updateProjectionMatrix(); });
  ro.observe(el);

  const clock = new THREE.Clock(); let raf;
  (function loop() {
    raf = requestAnimationFrame(loop);
    const t = clock.getElapsedTime();
    pose(motion.depth(t % motion.period));
    work.emissiveIntensity = 0.35 + 0.25 * motion.depth(t % motion.period);
    if (drag === null && (idle += 1 / 60) > 3) fig.rotation.y += 0.003; // หมุนช้าๆ เองถ้าไม่ได้แตะ
    renderer.render(scene, camera);
  })();

  return {
    fig, legs, pose, render: () => renderer.render(scene, camera),
    dispose() {
      cancelAnimationFrame(raf); ro.disconnect();
      scene.traverse(o => { if (o.geometry) o.geometry.dispose(); });
      renderer.dispose(); renderer.forceContextLoss(); cvs.remove();
    },
  };
}
