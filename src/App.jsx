import { useState, useRef, useEffect } from "react";
import * as THREE from "three";

const INK = "#05070f", PANEL = "#0d1b33", AMBER = "#F5B43C", BONE = "#EDE7D8",
      MUTE = "#7d8ba3", GREEN = "#4ADE80", RED = "#F87171", DIM = "#22365a";

// Real land mask: 360x180 grid (1° cells) from a geographic land dataset
const LAND_W = 360, LAND_H = 180;
const LAND_B64 = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP//8AFb///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA///+x/////76fAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/gD/p////////AAAAAAAAAACxBwAAAAHgAAAAAAAAAAAAAAAAAAAAAAAAAAA///uAf//////+AAAABrvwAAAAAAAAAAH8AAAAAAAAAAAAAAAAAAAAAAAAeHznn/h////////4AAAABXsAAAAAAAAAAAAD4AAAAAAAAAAAAAAAAAAAAAAEcIA5MfAI///////8AAAAAPFAAAAAAAAAAAAAcAAAAAAAAAAAAAAAAAAAAABoCGc8X/AH///////4AAAAAAAAAAAAAB4AAAAB9+AAAAAAAAAAAAAAAAAAAAAD/wMzz8AAAP/////2AAAAAAAAAAAAD4AAAA////AAAB/oAAAAAAAAAAAAAACAwACAcAAAAP/////+AAAAAAAAAAAAMAAAAX///6AAAAAAAAAAAAAAAAAAAAP+Ac8+M/gAAD////+8AAAAAAAAAAAA4AAAH///+O+HAAHAAAAAAAAAAAAAAAf/+4/Y/94AAD////+wAAAAAAAAAAABwAHhH///////8AHwAAAAAwAAAAAAAAON/8E4//9AADf////gAAAAAAAAAAABwAPZ+///////4nv/gAAAAAAAH8gAAAAAP+A8f//8AA3///ogAAAAAABtgAAAAAfv/////////////8AAAAAB///+B/2H/+DnDxf8AAz////AAAAAAA//wAAAA8Pv//////////////9H8wAP////////QsDPzwD8AAf///wAAAAAAG///wIBe/3+/////////////////+AD////////+//fz4Y/wA7//4AAAAAAAD///+I////v//////////////////4EP///////////5gD/8A///gAAAAAAAf//5+P///8//////////////////7w/////////////qAD+QAP/wABr8AAAAf8f+D///////////////////////AwAf///////////zwx/AAP/wAAP8AAAB/4/+f//////////////////////4AMAf//////////+DBAbwAH/AAADAAAAN/j/////////////////////////+AAH///////////4AwgHQAD/AAAAAAAAf/H///////////////////////n/6AAP///////////wAA/AAAB+AAAAAAAB/+H//////////////////////jP+AAAH/9z////////gAA/wAAAMAAAAAACB//D7////////////////////+A/YAAAA/xAD///////gAA/wQAAAAAAAAAAB9/Ab///////////////////+ODgAAAAAB0AAX//////4AA/94AAAAAAAAAYA5+C///////////////////4AAHQAAAAABcAAP//////8AAf/+AAAAAAAAB8AA+i///////////////////wAAfgAAAAAMAAAC///////wAf/+AAAAAAAAAYAOeH///////////////////AAA/gAAAABQAAADf//////8Af//AAAAAAAAAcAPQH//////////////////8AAA/AAAAAEAAAAAP///////z///4AAAAAAADuAEDv//////////////////+AAA+AAAAAAAAAABP///////x///8AAAAAAAPHAf/////////////////////4AA8AAAAAAAAAAAn///////x///8AAAAAAAPPx//////////////////////6AA4AAAAAAAAAAAD///////////6AAAAAAAAPH//////////////////////6AAwAAAAAAAAAAAC///////////kAAAAAAAAQP//////////////////////zAAAAAAAAAAAAAABv////////+MMAAAAAAAAC///////////////////////7AAAAAAAAAAAAAAAL////////7wPgAAAAAAAf///////////////////////yAAAAAAAAAAAAAAAP/////////gCgAAAAAAAD///////////////////////iAAAAAAAAAAAAAAAP/////////pAAAAAAAAAD/////vP////////////////BAAAAAAAAAAAAAAAP/////////+AAAAAAAAAB//v//GP///////////////+AAAAAAAAAAAAAAAAP////////8wAAAAAAAAAB//P/+EP///////////////8CAAAAAAAAAAAAAAAP////////wgAAAAAAAADj/jz/+AD///////////////4HgAAAAAAAAAAAAAAP////////gAAAAAAAAAH/4Fw/4AA//////////////+ACAAAAAAAAAAAAAAAP////////gAAAAAAAAAH/wAcP8PA//////////////8AAAAAAAAAAAAAAAAAP///////8AAAAAAAAAAH/gMHfV///////////////v4AMAAAAAAAAAAAAAAAP///////8AAAAAAAAAAH/IMCOH//////////////+ZwAMAAAAAAAAAAAAAAAH///////oAAAAAAAQAAH/AACGP//////////////8BwAMAAAAAAAAAAAAAAAH///////wAAAAAAAAAAH+AAYDH//////////////+g4AYAAAAAAAAAAAAAAAD///////wAAAAAAAAAAAgf+AABs//////////////g4D4AAAAAAAAAAAAAAAB///////wAAAAAAAAAAAh/+AAAA//////////////A4fwAAAAAAAAAAAAAAAB///////gAAAAAAAAAAB//8AAAA//////////////Ah2AAAAAAAAAAAAAAAAAP/////+AAAAAAAAAAAD//+AAAB//////////////gjwAAAAAAAAAAAAAAAAAH/////4AAAAAAAAAAQH///4GAB//////////////gBAAAAAAAAAAAAAAAAAAG/////4AAAAAAAAAAAP///8PwD//////////////gCAAAAAAAAAAAAAAAAAACf////4AAAAAAAAAAAP////v////////////////gAAAAAAAAAAAAAAAAAAABv//xAYAAAAAAAAAAAP//////3//H///////////gAAAAAAAAAAAAAAAAAAAAv//AAYAAAAAAAAAAAf/////////H///////////wAAAAAAAAAAAAAAAAAAAB3/+AAcAAAAAAAAAAB///////8//h///////////gAAAAAAAAAAAAAAAAAAAAZ/+AAMAAAAAAAAAAD///////8//wH//////////AAAAAAAAAAAAAAAAAAAAAJ/+AAEAAAAAAAAAAH///////+f/wB/f////////AAAAAAAAAAAAAAAAAAAAAI/8AAAAAAAAAAAAAH///////+f/44Af///////8QAAAAAAAAAAAAAAAAAAAACf8AAAAAAAAAAAAAP///////+H//+AP///////4gAAAAAAAAAAAAAAAAAAAAAP8AAvAAAAAAAAAAP////////H///AD///////ggAAAAAAAAAAAAAAAAAAAAAH8AQBggAAAAAAAAf////////n//+ADf/4P//YAAAAAAAAAAAAAAAAAAAAAAAH+A4AYAAAAAAAAAP////////j//+AAf/4H/+IAAAAAAAAAAAAAAAgAAAAAAAH/B4ABwAAAAAAAAP////////h//8AAf/gD/8YAAAAAAAAAAAAAAAAAAAAAAAD/lwAD8AAAAAAAAP////////x//4AAf/AD/8QAAAAAAAAAAAAAAAAAAAAAAAAf/wAAAAAAAAAAAP////////4//gAAf+AB/+AAwAAAAAAAAAAAAAAAAAAAAAAH/wAAAAAAAAAAAP////////4f+AAAf8AD//AAwAAAAAAAAAAAAAAAAAAAAAAAH/AAAAAAAAAAAf////////8/8AAAPwAAP/gAgAAAAAAAAAAAAAAAAAAAAAAAD/gAAAAAAAAAAf////////+fgAAAPwAAP/gAwAAAAAAAAAAAAAAAAAAAAAAAA/AAAAAAAAAAAf/////////eAAAAHwAAP/gAsAAAAAAAAAAAAAAAAAAAAAAAAHAAAAAAAAAAAf/////////gBAAAHwAAM/gAKAAAAAAAAAAAAAAAAAAAAAAAADABIAAAAAAAAH/////////gIAAADwAAEfgALAAAAAAAAAAAAAAAAAAAAAAAADgPfIAAAAAAAH/////////34AAADwAAIPABIAAAAAAAAAAAAAAAAAAAAAAAAAyPf+AAAAAAAD//////////4AAADoAAIEACBAAAAAAAAAAAAAAAAAAAAAAAAA8///AAAAAAAB//////////wAAABIAAMAAEHAAAAAAAAAAAAAAAAAAAAAAAAAE///gAAAAAAB//////////wAAAAMAAEAAADgIAAAAAAAAAAAAAAAAAAAAAAAAf//wAAAAAAAf/////////gAAAAMAADAAMDAAAAAAAAAAAAAAAAAAAAAAAAAA////gAAAAAAP/B///////gAAAAAABDgAeAAAAAAAAAAAAAAAAAAAAAAAAAAAf///wAAAAAACAA3//////AAAAAAAAxgA+AAAAAAAAAAAAAAAAAAAAAAAAAAAf///4AAAAAAAAAD/////+AAAAAAAAZgB8BAAAAAAAAAAAAAAAAAAAAAAAAAB////4AAAAAAAAAD/////8AAAAAAAAMwH8AIAAAAAAAAAAAAAAAAAAAAAAAAB////8AAAAAAAAAD/////wAAAAAAAAHQf8AIAAAAAAAAAAAAAAAAAAAAAAAAD////4AAAAAAAAAH/////gAAAAAAAAHgf8cIAAAAAAAAAAAAAAAAAAAAAAAAD/////AAAAAAAAAH/////AAAAAAAAAD4f8ASgAAAAAAAAAAAAAAAAAAAAAAAH////+4AAAAAAAAH/////AAAAAAAAABwP50QwAAAAAAAAAAAAAAAAAAAAAAAH/////+AAAAAAAAD////+AAAAAAAAAB8P5wAL4AgAAAAAAAAAAAAAAAAAAAAD//////4AAAAAAAB////8AAAAAAAAAA8AxQif/AAAAAAAAAAAAAAAAAAAAAAH//////8AAAAAAAA////4AAAAAAAAAAcAAQAD/gAAAAAAAAAAAAAAAAAAAAAH///////gAAAAAAA////4AAAAAAAAAAMABAAI/ywAAAAAAAAAAAAAAAAAAAAD///////gAAAAAAA////4AAAAAAAAAADgAAAIf8BAAAAAAAAAAAAAAAAAAAAD///////gAAAAAAAf///4AAAAAAAAAAB+AABA/4AAAAAAAAAAAAAAAAAAAAAB///////gAAAAAAAf///4AAAAAAAAAAAAfsgAOMAAAAAAAAAAAAAAAAAAAAAA///////AAAAAAAAf///8AAAAAAAAAAAABCAAAGgAAAAAAAAAAAAAAAAAAAAA///////AAAAAAAAP///+AAAAAAAAAAAAAAAAAAgBAAAAAAAAAAAAAAAAAAAAf/////+AAAAAAAAP///8AAAAAAAAAAAAAACgCAEAAAAAAAAAAAAAAAAAAAAAf/////8AAAAAAAAf///8AQAAAAAAAAAAAAB+CAAAAAAAQAAAAAAAAAAAAAAAP/////4AAAAAAAAf///+AQAAAAAAAAAAAAD8DAAAAAAAAAAAAAAAAAAAAAAAP/////4AAAAAAAA////+AwAAAAAAAAAAAA38DgAAAAAAAAAAAAAAAAAAAAAAH/////4AAAAAAAA////+BwAAAAAAAAAAAD/8HgAAAAAAAAAAAAAAAAAAAAAAB/////4AAAAAAAA////8PwAAAAAAAAAAAH//XgAABABAAAAAgAAAAAAAAAAAAf////4AAAAAAAA////wPgAAAAAAAAAAAP//3wAAAAAAAAAAAAAAAAAAAAAAAP////wAAAAAAAA////gPgAAAAAAAAAAAP///wAAAAAAAAAAAAAAAAAAAAAAAP////wAAAAAAAAf//+APgAAAAAAAAAAAf///8AAAAAAAAAAAAAAAAAAAAAAAP////wAAAAAAAAf//+APgEAAAAAAAAAD////+AAIAAAAAAAAAIAAAAAAAAAAP////gAAAAAAAAP//+AfAAAAAAAAAAAf////+AAEAAAAAAAAAAAAAAAAAAAAP////AAAAAAAAAP///AfAAAAAAAAAAA//////AAAAAAAAAAAAAAAAAAAAAAAP///4AAAAAAAAAP//+APAAAAAAAAAAA//////gAAAAAAAAAAAAAAAAAAAAAAf///gAAAAAAAAAH//+AOAAAAAAAAAAB//////wAAAAAAAAAAAAAAAAAAAAAAf//+AAAAAAAAAAH//4AEAAAAAAAAAAA//////4AAAAAAAAAAAAAAAAAAAAAAf//+AAAAAAAAAAH//4AAAAAAAAAAAAB//////4AAAAAAAAAAAAAAAAAAAAAAf///AAAAAAAAAAH//4AAAAAAAAAAAAA//////8AAAAAAAAAAAAAAAAAAAAAAf//+AAAAAAAAAAD//wAAAAAAAAAAAAAf/////8AAAAAAAAAAAAAAAAAAAAAAf//8AAAAAAAAAAB//gAAAAAAAAAAAAAf/////4AAAAAAAAAAAAAAAAAAAAAA///8AAAAAAAAAAB//gAAAAAAAAAAAAAf/////4AAAAAAAAAAAAAAAAAAAAAA///wAAAAAAAAAAA//AAAAAAAAAAAAAAP/////4AAAAAAAAAAAAAAAAAAAAAAf//wAAAAAAAAAAA/+AAAAAAAAAAAAAAP/AP//wAAAAAAAAAAAAAAAAAAAAAA//vgAAAAAAAAAAA/4AAAAAAAAAAAAAAP8AG//gAAAAAAAAAAAAAAAAAAAAAA//3AAAAAAAAAAAAQAAAAAAAAAAAAAAAOAAF//gAAAAAAAAAAAAAAAAAAAAAB//4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//AAABAAAAAAAAAAAAAAAAAAB//4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/AAAAgAAAAAAAAAAAAAAAAAD//4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/AAAAQAAAAAAAAAAAAAAAAAD//wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABYAAAAcAAAAAAAAAAAAAAAAAB/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAD/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYAAAAAAAAAAAAAAAAAD/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcAAADQAAAAAAAAAAAAAAAAAD/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcAAAHAAAAAAAAAAAAAAAAAAB/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAOAAAAAAAAAAAAAAAAAAF/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAH+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB4AAAAAAAAAAAAAAAAAAH+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwAAAAAAAAAAAAAAAAAAD/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8AAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4AwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/AAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwAAAAAAAAAAAAAAAAAAP4AAAAAAL+HgBj/AAAAAAAAAAAAAAAAAAAAAAAAAHAAAAAAAAAAAAAAAAAADf/gAAB//////////AAAAAAAAAAAAAAAAAAAAAAAABoAAAAAAAAAAAAAAAAB////8A////////////mAAAAAAAAAAAAAAAAAAAAAB38AAAAAAAAAAAAAAAGD////4D/////////////4AAAAAAAAAAAAAAAAAAAAAb+AAAAAAAAAAAM/gB//////4//////////////+gAAAAAAAAAAAAAAAAAAAD/8AAAAAAAA7+///////////5////////////////4AAAAAAAAAAAAAAHQABh5+AAAAAAAA//////////////////////////////gAAAAAAAAABgAAAP/+Gl/8AAAAAAAf/////////////////////////////+AAAAAAAAAAiARsAv/////+AAAAAAA//////////////////////////////sAAAAAAAAX////////////wAAAAAAF//////////////////////////////gAAAAAAAX///////////PwAAAAAAf///////////////////////////////gAAAAAD+P///////////8AAAAAAP////////////////////////////////zgAAAAAP///////////fgCAAD8A/////////////////////////////////+AAAAD4B///////////7wwAAD+AB///////////////////////////////+AAAAAAAA////////////wAAA/wAH///////////////////////////////+AAAAAAAP//////////////AAAA/////////////////////////////////+AAAAAAAH//////////////4D/n//////////////////////////////////8AAAAAH//////////////////////////////////////////////////////8A/wAP////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////";

const AIRPORTS = {
  AMD: { name: "Ahmedabad", lat: 23.07, lon: 72.63 },
  BOM: { name: "Mumbai", lat: 19.09, lon: 72.87 },
  DEL: { name: "Delhi", lat: 28.56, lon: 77.1 },
  BLR: { name: "Bengaluru", lat: 13.2, lon: 77.71 },
  MAA: { name: "Chennai", lat: 12.99, lon: 80.17 },
  CCU: { name: "Kolkata", lat: 22.65, lon: 88.45 },
  HKG: { name: "Hong Kong", lat: 22.31, lon: 113.91 },
  SIN: { name: "Singapore", lat: 1.36, lon: 103.99 },
  DXB: { name: "Dubai", lat: 25.25, lon: 55.36 },
  DOH: { name: "Doha", lat: 25.27, lon: 51.61 },
  LHR: { name: "London", lat: 51.47, lon: -0.45 },
  CDG: { name: "Paris", lat: 49.01, lon: 2.55 },
  FRA: { name: "Frankfurt", lat: 50.04, lon: 8.56 },
  JFK: { name: "New York", lat: 40.64, lon: -73.78 },
  LAX: { name: "Los Angeles", lat: 33.94, lon: -118.41 },
  SFO: { name: "San Francisco", lat: 37.62, lon: -122.38 },
  NRT: { name: "Tokyo", lat: 35.77, lon: 140.39 },
  ICN: { name: "Seoul", lat: 37.46, lon: 126.44 },
  SYD: { name: "Sydney", lat: -33.95, lon: 151.18 },
  JNB: { name: "Johannesburg", lat: -26.14, lon: 28.25 },
  GRU: { name: "São Paulo", lat: -23.44, lon: -46.47 },
  IST: { name: "Istanbul", lat: 41.26, lon: 28.74 },
  BKK: { name: "Bangkok", lat: 13.69, lon: 100.75 },
  KUL: { name: "Kuala Lumpur", lat: 2.75, lon: 101.71 },
};
const HUB_KEYS = Object.keys(AIRPORTS);

const TRAFFIC = [
  ["DEL", "LHR"], ["BOM", "DXB"], ["AMD", "BOM"], ["DEL", "HKG"], ["HKG", "SFO"],
  ["SIN", "SYD"], ["DXB", "JFK"], ["LHR", "JFK"], ["BOM", "SIN"], ["HKG", "NRT"],
  ["IST", "CDG"], ["DEL", "BKK"], ["BLR", "DOH"], ["FRA", "GRU"], ["ICN", "LAX"],
  ["MAA", "KUL"], ["CCU", "SIN"], ["DXB", "JNB"], ["AMD", "DEL"], ["HKG", "LHR"],
];

const R = 1;
function llToVec(lat, lon, r = R) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  );
}
function arcPoints(a, b, lift = 0.25, segs = 96) {
  const va = llToVec(a.lat, a.lon).normalize();
  const vb = llToVec(b.lat, b.lon).normalize();
  const angle = va.angleTo(vb);
  const pts = [];
  for (let i = 0; i <= segs; i++) {
    const t = i / segs;
    const sinA = Math.sin(angle);
    const p = sinA < 1e-6 ? va.clone()
      : va.clone().multiplyScalar(Math.sin((1 - t) * angle) / sinA)
          .add(vb.clone().multiplyScalar(Math.sin(t * angle) / sinA));
    p.normalize().multiplyScalar(R + lift * Math.sin(Math.PI * t) * Math.min(1, angle));
    pts.push(p);
  }
  return pts;
}
function landBits() {
  const bin = atob(LAND_B64);
  const bits = [];
  for (let i = 0; i < bin.length; i++) {
    const v = bin.charCodeAt(i);
    for (let b = 7; b >= 0; b--) bits.push((v >> b) & 1);
  }
  return bits;
}
function inr(n) { return n == null ? "—" : "₹" + Number(n).toLocaleString("en-IN"); }

const LOADING_LINES = ["Reading command…", "Searching booking platforms…", "Checking route weather…", "Plotting the route…"];

export default function GlobeFlightFinder() {
  const mountRef = useRef(null);
  const sceneRef = useRef({});
  const [cmd, setCmd] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadLine, setLoadLine] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const mount = mountRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 500);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    mount.appendChild(renderer.domElement);

    // ── orbit camera: dragging swings the VIEW so Sun & Moon come into frame ──
    const orbit = { yaw: 2.6, pitch: 0.15, dist: 3.4, autoYaw: 0.0011 };
    const applyOrbit = () => {
      orbit.pitch = Math.max(-1.25, Math.min(1.25, orbit.pitch));
      camera.position.set(
        orbit.dist * Math.cos(orbit.pitch) * Math.sin(orbit.yaw),
        orbit.dist * Math.sin(orbit.pitch),
        orbit.dist * Math.cos(orbit.pitch) * Math.cos(orbit.yaw)
      );
      camera.lookAt(0, 0, 0);
    };
    const fit = () => {
      const w = mount.clientWidth || 1, h = mount.clientHeight || 1;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      const fovV = (camera.fov * Math.PI) / 180;
      const fovH = 2 * Math.atan(Math.tan(fovV / 2) * camera.aspect);
      orbit.dist = (R * 1.45) / Math.tan(Math.min(fovV, fovH) / 2);
      camera.updateProjectionMatrix();
      applyOrbit();
    };

    const world = new THREE.Group();
    scene.add(world);

    // stars
    {
      const n = 1800, pos = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) {
        const u = Math.random() * 2 - 1, th = Math.random() * Math.PI * 2;
        const rxy = Math.sqrt(1 - u * u), d = 70 + Math.random() * 160;
        pos[i * 3] = rxy * Math.cos(th) * d;
        pos[i * 3 + 1] = u * d;
        pos[i * 3 + 2] = rxy * Math.sin(th) * d;
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      scene.add(new THREE.Points(g, new THREE.PointsMaterial({ color: 0xcfdcff, size: 0.3, sizeAttenuation: true, transparent: true, opacity: 0.85 })));
    }

    // ── SUN: big, bright, lights the Earth ──
    const sunPos = new THREE.Vector3(10, 4.5, -14);
    {
      const sun = new THREE.Mesh(new THREE.SphereGeometry(1.6, 28, 28),
        new THREE.MeshBasicMaterial({ color: 0xfff0b8 }));
      sun.position.copy(sunPos); scene.add(sun);
      const cv = document.createElement("canvas"); cv.width = cv.height = 256;
      const c = cv.getContext("2d");
      const gr = c.createRadialGradient(128, 128, 8, 128, 128, 128);
      gr.addColorStop(0, "rgba(255,244,200,1)");
      gr.addColorStop(0.3, "rgba(255,205,110,0.55)");
      gr.addColorStop(1, "rgba(255,170,60,0)");
      c.fillStyle = gr; c.fillRect(0, 0, 256, 256);
      const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(cv), transparent: true, depthWrite: false }));
      halo.scale.set(14, 14, 1); halo.position.copy(sunPos); scene.add(halo);
      const dl = new THREE.DirectionalLight(0xfff0cf, 1.4);
      dl.position.copy(sunPos); scene.add(dl);
      scene.add(new THREE.AmbientLight(0x8093b8, 0.55));
    }

    // ── MOON: cratered, orbiting close enough to spot ──
    let moonMat;
    {
      const cv = document.createElement("canvas"); cv.width = 256; cv.height = 128;
      const c = cv.getContext("2d");
      c.fillStyle = "#bdbdc8"; c.fillRect(0, 0, 256, 128);
      for (let i = 0; i < 260; i++) {
        c.fillStyle = `rgba(72,72,86,${0.1 + Math.random() * 0.28})`;
        c.beginPath();
        c.arc(Math.random() * 256, Math.random() * 128, 1 + Math.random() * 7, 0, 7);
        c.fill();
      }
      moonMat = new THREE.MeshPhongMaterial({ map: new THREE.CanvasTexture(cv), shininess: 3 });
    }
    const moon = new THREE.Mesh(new THREE.SphereGeometry(0.34, 28, 28), moonMat);
    scene.add(moon);

    // ── EARTH ──
    world.add(new THREE.Mesh(
      new THREE.SphereGeometry(R, 64, 64),
      new THREE.MeshPhongMaterial({ color: 0x0a2148, emissive: 0x051430, shininess: 28 })
    ));
    // continents: 1° dot-matrix, coloured by climate band
    {
      const bits = landBits();
      const pts = [], cols = [];
      const c1 = new THREE.Color();
      for (let j = 0; j < LAND_H; j++) {
        const lat = 89.5 - j;
        for (let i = 0; i < LAND_W; i++) {
          if (bits[j * LAND_W + i]) {
            const lon = -179.5 + i;
            const v = llToVec(lat, lon, R + 0.003);
            pts.push(v.x, v.y, v.z);
            const a = Math.abs(lat);
            if (a > 64) c1.setHex(0xe8eef5);        // polar snow
            else if (a > 45) c1.setHex(0x6f9e6a);   // boreal
            else if (a > 30) c1.setHex(0x83b276);   // temperate
            else if (a > 18) c1.setHex(0xb9a25f);   // arid belt
            else c1.setHex(0x4f9e63);               // tropics
            cols.push(c1.r, c1.g, c1.b);
          }
        }
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(pts), 3));
      g.setAttribute("color", new THREE.BufferAttribute(new Float32Array(cols), 3));
      world.add(new THREE.Points(g, new THREE.PointsMaterial({ vertexColors: true, size: 0.011, sizeAttenuation: true, transparent: true, opacity: 0.96 })));
    }
    // drifting cloud shell
    let cloudMesh;
    {
      const cv = document.createElement("canvas"); cv.width = 512; cv.height = 256;
      const c = cv.getContext("2d");
      for (let i = 0; i < 85; i++) {
        const x = Math.random() * 512, y = 30 + Math.random() * 196, r = 8 + Math.random() * 26;
        const gr = c.createRadialGradient(x, y, 1, x, y, r);
        gr.addColorStop(0, "rgba(255,255,255,0.30)");
        gr.addColorStop(1, "rgba(255,255,255,0)");
        c.fillStyle = gr; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill();
      }
      cloudMesh = new THREE.Mesh(new THREE.SphereGeometry(R * 1.018, 48, 48),
        new THREE.MeshLambertMaterial({ map: new THREE.CanvasTexture(cv), transparent: true, opacity: 0.5, depthWrite: false }));
      world.add(cloudMesh);
    }
    // atmosphere rim
    world.add(new THREE.Mesh(new THREE.SphereGeometry(R * 1.05, 48, 48),
      new THREE.MeshBasicMaterial({ color: 0x2a64c8, transparent: true, opacity: 0.09, side: THREE.BackSide })));

    // airports
    const beaconGeo = new THREE.SphereGeometry(0.011, 10, 10);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0xf5b43c });
    Object.entries(AIRPORTS).forEach(([code, a]) => {
      const m = new THREE.Mesh(beaconGeo, beaconMat);
      m.position.copy(llToVec(a.lat, a.lon, R + 0.005));
      world.add(m);
      const cv = document.createElement("canvas"); cv.width = 128; cv.height = 40;
      const c = cv.getContext("2d");
      c.font = "bold 22px monospace"; c.fillStyle = "#d8e6ff"; c.textAlign = "center";
      c.fillText(code, 64, 26);
      const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(cv), transparent: true, opacity: 0.9, depthWrite: false }));
      spr.scale.set(0.14, 0.044, 1);
      spr.position.copy(llToVec(a.lat, a.lon, R + 0.055));
      world.add(spr);
    });

    // simulated traffic
    const planes = [];
    TRAFFIC.forEach(([f, t], i) => {
      const pts = arcPoints(AIRPORTS[f], AIRPORTS[t], 0.13);
      world.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineBasicMaterial({ color: 0x3b6fd4, transparent: true, opacity: 0.3 })));
      const dot = new THREE.Mesh(new THREE.SphereGeometry(0.01, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0x9cc6ff }));
      world.add(dot);
      planes.push({ pts, dot, t: (i * 0.05) % 1, speed: 0.0009 + (i % 5) * 0.0003 });
    });

    const routeGroup = new THREE.Group();
    world.add(routeGroup);

    // drag = orbit the camera
    let dragging = false, px = 0, py = 0, velX = 0, velY = 0;
    const gx = (e) => e.clientX ?? e.touches?.[0]?.clientX;
    const gy = (e) => e.clientY ?? e.touches?.[0]?.clientY;
    const onDown = (e) => { dragging = true; px = gx(e); py = gy(e); };
    const onMove = (e) => {
      if (!dragging) return;
      const x = gx(e), y = gy(e);
      velX = (x - px) * 0.005; velY = (y - py) * 0.003; px = x; py = y;
      orbit.yaw -= velX; orbit.pitch += velY; applyOrbit();
    };
    const onUp = () => { dragging = false; };
    renderer.domElement.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    renderer.domElement.addEventListener("touchstart", onDown, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onUp);

    let raf, t0 = Date.now();
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = (Date.now() - t0) * 0.001;
      if (!dragging) {
        orbit.yaw -= velX; orbit.pitch += velY;
        velX *= 0.96; velY *= 0.96;
        orbit.yaw += orbit.autoYaw;
        applyOrbit();
      }
      world.rotation.y += 0.0006;                 // Earth spin
      cloudMesh.rotation.y += 0.0011;             // cloud drift
      moon.position.set(Math.cos(t * 0.08) * 3.6, 0.9 + Math.sin(t * 0.06) * 0.35, Math.sin(t * 0.08) * 3.6);
      moon.rotation.y = t * 0.05;
      planes.forEach((p) => { p.t = (p.t + p.speed) % 1; p.dot.position.copy(p.pts[(p.t * (p.pts.length - 1)) | 0]); });
      const rg = sceneRef.current.routePlane;
      if (rg) {
        rg.t = (rg.t + 0.0028) % 1;
        rg.dot.position.copy(rg.pts[(rg.t * (rg.pts.length - 1)) | 0]);
        rg.pulse.material.opacity = 0.5 + 0.4 * Math.sin(Date.now() * 0.005);
      }
      renderer.render(scene, camera);
    };
    fit(); animate();
    const ro = new ResizeObserver(fit);
    ro.observe(mount);
    window.addEventListener("resize", fit);
    sceneRef.current = {
      world, routeGroup,
      aimOrbit: (yaw, pitch) => { orbit.yaw = yaw; orbit.pitch = pitch; applyOrbit(); },
    };

    return () => {
      cancelAnimationFrame(raf); ro.disconnect();
      window.removeEventListener("resize", fit);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  function drawRoute(fromCode, toCode) {
    const { world, routeGroup, aimOrbit } = sceneRef.current;
    const a = AIRPORTS[fromCode], b = AIRPORTS[toCode];
    if (!a || !b || !routeGroup) return;
    while (routeGroup.children.length) routeGroup.remove(routeGroup.children[0]);
    const pts = arcPoints(a, b, 0.3, 128);
    routeGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),
      new THREE.LineBasicMaterial({ color: 0xf5b43c })));
    routeGroup.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(pts.map((p) => p.clone().multiplyScalar(1.002))),
      new THREE.LineBasicMaterial({ color: 0xffe9b0, transparent: true, opacity: 0.35 })));
    const mk = (code, col) => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.02, 12, 12), new THREE.MeshBasicMaterial({ color: col }));
      m.position.copy(llToVec(AIRPORTS[code].lat, AIRPORTS[code].lon, R + 0.006));
      routeGroup.add(m); return m;
    };
    mk(fromCode, 0x4ade80);
    const pulse = mk(toCode, 0xf5b43c);
    pulse.material.transparent = true;
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.017, 10, 10), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    routeGroup.add(dot);
    sceneRef.current.routePlane = { pts, dot, t: 0, pulse };
    // swing the camera to face the route midpoint (accounting for Earth's spin)
    const mid = pts[(pts.length / 2) | 0].clone()
      .applyAxisAngle(new THREE.Vector3(0, 1, 0), world.rotation.y).normalize();
    if (aimOrbit) aimOrbit(Math.atan2(mid.x, mid.z), Math.asin(mid.y) * 0.85);
  }

  useEffect(() => {
    let iv;
    if (loading) iv = setInterval(() => setLoadLine((i) => (i + 1) % LOADING_LINES.length), 2200);
    else setLoadLine(0);
    return () => clearInterval(iv);
  }, [loading]);

  async function runSearch(text) {
    const command = (text ?? cmd).trim();
    if (!command || loading) return;
    setLoading(true); setError(null); setResult(null);
    const prompt = `Flight-deal agent. Today: ${new Date().toDateString()}. User near Ahmedabad, India. Currency INR.
COMMAND: "${command}"
1. Parse origin/destination/date. Map cities to nearest IATA code ONLY from: ${HUB_KEYS.join(",")}.
2. Web-search current one-way economy fares (Google Flights, Skyscanner, MakeMyTrip, Cleartrip). Include IndiGo, Air India; Cathay Pacific only if it truly serves the route.
3. Web-search current weather for both cities and active weather on the route (storms, monsoon, fog).
Reply ONLY raw JSON, no fences, short strings, under 550 tokens:
{"from":"AMD","to":"HKG","date":"12 Jul 2026","flights":[{"airline":"IndiGo","platform":"MakeMyTrip","price_inr":18999,"duration":"6h 40m","stops":"1 stop"}],"weather":{"from":"34°C haze","to":"Rain 27°C","enroute":"Monsoon band over Bay of Bengal — expect turbulence"},"insight":"one short booking-timing sentence"}
Max 5 flights cheapest first, integer prices, from/to from the list.`;
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      const txt = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n");
      const clean = txt.replace(/```json|```/g, "").trim();
      const a = clean.indexOf("{"), z = clean.lastIndexOf("}");
      if (a === -1) throw new Error("no json");
      const parsed = JSON.parse(clean.slice(a, z + 1));
      if (!parsed.flights?.length || !AIRPORTS[parsed.from] || !AIRPORTS[parsed.to]) throw new Error("bad data");
      parsed.flights.sort((x, y) => x.price_inr - y.price_inr);
      setResult(parsed);
      drawRoute(parsed.from, parsed.to);
    } catch (e) {
      console.error(e);
      setError("Couldn't plot that one. Use two cities I track (Ahmedabad, Mumbai, Delhi, Hong Kong, London, Dubai, Singapore, New York…) and retry.");
    } finally { setLoading(false); }
  }

  const cheapest = result?.flights?.[0];

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: INK, color: BONE, fontFamily: "'Inter','Segoe UI',sans-serif", overflow: "hidden" }}>
      <style>{`.mono{font-family:'IBM Plex Mono',monospace} input::placeholder{color:#5d6b85}
        @keyframes up{from{opacity:0;transform:translateY(8px)}to{opacity:1}} .up{animation:up .35s ease both}
        *{box-sizing:border-box}`}</style>

      <div style={{ padding: "14px 18px", borderBottom: `1px solid ${DIM}`, display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", flexShrink: 0 }}>
        <div style={{ minWidth: 170 }}>
          <div className="mono" style={{ color: AMBER, fontSize: 9, letterSpacing: "0.35em" }}>FARE CONTROL · ORBIT VIEW</div>
          <div style={{ fontWeight: 800, fontSize: 17 }}>Global Flight Finder</div>
        </div>
        <div style={{ flex: 1, minWidth: 240, display: "flex", gap: 8 }}>
          <input value={cmd} onChange={(e) => setCmd(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && runSearch()}
            placeholder='"cheapest Ahmedabad to Hong Kong in July"'
            style={{ flex: 1, background: PANEL, border: `1px solid ${DIM}`, borderRadius: 9, padding: "10px 13px", color: BONE, fontSize: 14, outline: "none" }} />
          <button onClick={() => runSearch()} disabled={loading}
            style={{ background: loading ? "#8a6a2a" : AMBER, color: INK, fontWeight: 800, border: "none", borderRadius: 9, padding: "0 18px", cursor: loading ? "wait" : "pointer" }}>
            {loading ? "…" : "Find"}
          </button>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        <div ref={mountRef} style={{ flex: "1 1 60%", position: "relative", cursor: "grab", minWidth: 0 }}>
          {loading && (
            <div className="mono" style={{ position: "absolute", top: 12, left: 14, color: AMBER, fontSize: 12, letterSpacing: "0.12em", zIndex: 2 }}>
              ▮▮ {LOADING_LINES[loadLine]}
            </div>
          )}
          <div className="mono" style={{ position: "absolute", bottom: 8, left: 14, color: "#41557d", fontSize: 9, letterSpacing: "0.1em", zIndex: 2 }}>
            DRAG TO ORBIT — SWING LEFT/RIGHT TO FIND THE SUN & MOON · GOLD = YOUR ROUTE
          </div>
        </div>

        <div style={{ flex: "0 1 340px", minWidth: 280, borderLeft: `1px solid ${DIM}`, padding: 16, overflowY: "auto" }}>
          {error && <div style={{ background: "#33121a", border: `1px solid ${RED}`, color: "#fecaca", borderRadius: 9, padding: 12, fontSize: 13 }}>{error}</div>}

          {!result && !error && (
            <div style={{ color: MUTE, fontSize: 13, lineHeight: 1.7 }}>
              Give a command. The AI searches real platforms for the cheapest fare, checks live route weather, and draws the gold path over real continents — green origin, pulsing destination, white dot flying.
              <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                {["Cheapest Ahmedabad to Hong Kong in July", "Delhi to London, cheapest next month", "Mumbai → Singapore under ₹15,000"].map((ex) => (
                  <button key={ex} onClick={() => { setCmd(ex); runSearch(ex); }}
                    style={{ textAlign: "left", background: PANEL, border: `1px solid ${DIM}`, color: BONE, borderRadius: 8, padding: "9px 12px", fontSize: 12, cursor: "pointer" }}>
                    ✈ {ex}
                  </button>
                ))}
              </div>
            </div>
          )}

          {result && (
            <div className="up">
              <div className="mono" style={{ color: MUTE, fontSize: 10, letterSpacing: "0.25em" }}>ROUTE</div>
              <div style={{ fontWeight: 800, fontSize: 17, margin: "4px 0 2px" }}>
                {AIRPORTS[result.from].name} <span style={{ color: AMBER }}>→</span> {AIRPORTS[result.to].name}
              </div>
              <div style={{ color: MUTE, fontSize: 12 }}>{result.date}</div>

              {cheapest && (
                <div style={{ marginTop: 12, background: "#0e2b1c", border: `1px solid ${GREEN}`, borderRadius: 10, padding: 13 }}>
                  <div className="mono" style={{ color: GREEN, fontSize: 10, letterSpacing: "0.25em" }}>CHEAPEST</div>
                  <div className="mono" style={{ color: GREEN, fontSize: 23, fontWeight: 800, margin: "3px 0" }}>{inr(cheapest.price_inr)}</div>
                  <div style={{ fontSize: 13 }}>{cheapest.airline} · {cheapest.stops} · {cheapest.duration}</div>
                  <div style={{ color: MUTE, fontSize: 12 }}>via {cheapest.platform}</div>
                </div>
              )}

              {result.weather && (
                <div style={{ marginTop: 12, background: PANEL, border: `1px solid ${DIM}`, borderRadius: 10, padding: 13, fontSize: 13 }}>
                  <div className="mono" style={{ color: "#7fb6ff", fontSize: 10, letterSpacing: "0.25em", marginBottom: 6 }}>ROUTE WEATHER · LIVE</div>
                  <div>🛫 {AIRPORTS[result.from].name}: {result.weather.from}</div>
                  <div style={{ marginTop: 3 }}>🛬 {AIRPORTS[result.to].name}: {result.weather.to}</div>
                  <div style={{ marginTop: 6, color: "#ffd28a" }}>⚠ {result.weather.enroute}</div>
                </div>
              )}

              <div style={{ marginTop: 12, padding: "9px 12px", borderLeft: `3px solid ${AMBER}`, background: PANEL, borderRadius: 7, fontSize: 13 }}>
                {result.insight}
              </div>

              <div className="mono" style={{ color: AMBER, fontSize: 10, letterSpacing: "0.25em", margin: "16px 0 6px" }}>ALL FARES</div>
              {result.flights.map((f, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 2px", borderBottom: `1px solid ${DIM}`, fontSize: 13 }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{f.airline}{i === 0 && <span className="mono" style={{ color: GREEN, fontSize: 9, marginLeft: 6 }}>★BEST</span>}</div>
                    <div style={{ color: MUTE, fontSize: 11 }}>{f.stops} · {f.duration} · {f.platform}</div>
                  </div>
                  <div className="mono" style={{ fontWeight: 800, color: i === 0 ? GREEN : AMBER }}>{inr(f.price_inr)}</div>
                </div>
              ))}
              <div style={{ color: MUTE, fontSize: 11, marginTop: 10 }}>
                Fares & weather are live web-search results — confirm before booking. Blue arcs = simulated traffic on real routes.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
