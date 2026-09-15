"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

const TEXT = "PAULORGDC.DEV";

function easeOutBack(t: number) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

export default function Hero3D({ onExplore }: { onExplore: () => void }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0a0503, 16, 50);

    const camera = new THREE.PerspectiveCamera(
      42,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 2.2, 23);
    camera.lookAt(0, -0.6, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    mount.appendChild(renderer.domElement);

    // Reflexos reais: sem um mapa de ambiente o material fica "chapado".
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;

    scene.add(new THREE.AmbientLight(0xffffff, 0.18));

    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(-7, 9, 11);
    scene.add(key);

    const fillLight = new THREE.DirectionalLight(0xbcd2ff, 0.5);
    fillLight.position.set(8, -1, 7);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 1.6);
    rimLight.position.set(2, 5, -12);
    scene.add(rimLight);

    const forgeGlow = new THREE.PointLight(0xff5a1f, 2.2, 34, 2);
    forgeGlow.position.set(0, -4.5, 6);
    scene.add(forgeGlow);

    const emberRim = new THREE.DirectionalLight(0xff7a2f, 0.5);
    emberRim.position.set(-8, -3, -6);
    scene.add(emberRim);

    const group = new THREE.Group();
    scene.add(group);
    const lineGroup = new THREE.Group();
    group.add(lineGroup);

    let frameId = 0;
    const mouse = { x: 0, y: 0 };

    type Letter = {
      mesh: THREE.Mesh;
      target: THREE.Vector3;
      start: THREE.Vector3;
      startRot: THREE.Euler;
      delay: number;
      duration: number;
    };
    const letters: Letter[] = [];
    let settleAt = 1600;
    let readyTimeout = 0;
    let cancelled = false;
    let animStartTime = performance.now();

    const loader = new FontLoader();
    loader.load("/fonts/audiowide.typeface.json", (font) => {
      if (cancelled) return;
      const size = 2.6;
      const depth = size * 0.42;
      const scale = size / font.data.resolution;

      const whiteMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xeef0f3,
        roughness: 0.28,
        metalness: 0.0,
        clearcoat: 1,
        clearcoatRoughness: 0.06,
        envMapIntensity: 1.15,
      });
      const accentMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x8f0d06,
        roughness: 0.2,
        metalness: 0.0,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
        envMapIntensity: 0.65,
        emissive: 0x5c0603,
        emissiveIntensity: 0.55,
      });
      const accentStartIndex = TEXT.indexOf(".");

      let cursorX = 0;
      for (let i = 0; i < TEXT.length; i++) {
        const ch = TEXT[i];
        if (ch === " ") {
          cursorX += size * 0.6;
          continue;
        }
        const geo = new TextGeometry(ch, {
          font,
          size,
          depth,
          curveSegments: 14,
          bevelEnabled: true,
          bevelThickness: size * 0.05,
          bevelSize: size * 0.032,
          bevelSegments: 6,
        });
        const material = i >= accentStartIndex ? accentMaterial : whiteMaterial;
        const mesh = new THREE.Mesh(geo, material);
        mesh.position.x = cursorX;
        lineGroup.add(mesh);

        if (ch === "P" && i === 0) {
          geo.computeBoundingBox();
          const gbox = geo.boundingBox!;
          const gw = gbox.max.x - gbox.min.x;
          const centerX = gbox.min.x + gw * 0.5;

          // Real wraparound-sunglasses silhouette: thick black frame, red
          // translucent lenses, bridge and angled temple arms. Facing the
          // camera, resting on the P's top edge like it's wearing them.
          const frameMat = new THREE.MeshPhysicalMaterial({
            color: 0x0c0c0f,
            roughness: 0.22,
            metalness: 0.1,
            clearcoat: 1,
            clearcoatRoughness: 0.04,
            envMapIntensity: 1.6,
          });
          const lensMat = new THREE.MeshPhysicalMaterial({
            color: 0xc4121c,
            roughness: 0.06,
            metalness: 0,
            transmission: 0.55,
            thickness: 0.4,
            ior: 1.5,
            clearcoat: 1,
            clearcoatRoughness: 0.03,
            envMapIntensity: 1.8,
            transparent: true,
            opacity: 0.92,
          });

          const lensW = gw * 0.32;
          const lensH = lensW * 0.58;
          const frameThickness = lensW * 0.16;
          const lensDepth = lensW * 0.22;
          const bridgeGap = lensW * 0.22;
          const cornerRadius = lensW * 0.16;

          const frameGeo = new RoundedBoxGeometry(
            lensW + frameThickness * 2,
            lensH + frameThickness * 2,
            lensDepth,
            3,
            cornerRadius
          );
          const lensGeo = new RoundedBoxGeometry(
            lensW,
            lensH,
            lensDepth * 0.7,
            3,
            cornerRadius * 0.75
          );

          const glassesGroup = new THREE.Group();

          for (const side of [-1, 1]) {
            const eye = new THREE.Group();
            const frame = new THREE.Mesh(frameGeo, frameMat);
            const lens = new THREE.Mesh(lensGeo, lensMat);
            lens.position.z = lensDepth * 0.22;
            eye.add(frame, lens);
            eye.position.x = side * (lensW / 2 + bridgeGap / 2 + frameThickness / 2);
            glassesGroup.add(eye);
          }

          const bridgeGeo = new THREE.BoxGeometry(
            bridgeGap + frameThickness,
            frameThickness * 0.6,
            lensDepth * 0.55
          );
          const bridge = new THREE.Mesh(bridgeGeo, frameMat);
          bridge.position.set(0, lensH * 0.12, 0);
          glassesGroup.add(bridge);

          const armLength = lensW * 0.55;
          const armGeo = new THREE.BoxGeometry(
            armLength,
            frameThickness * 0.55,
            frameThickness * 0.55
          );
          const eyeOuterX = lensW / 2 + bridgeGap / 2 + frameThickness / 2 + lensW / 2 + frameThickness / 2;
          for (const side of [-1, 1]) {
            const arm = new THREE.Mesh(armGeo, frameMat);
            arm.position.set(side * (eyeOuterX + (armLength / 2) * 0.75), 0, -lensDepth * 0.4);
            arm.rotation.y = side * Math.PI * 0.16;
            glassesGroup.add(arm);
          }

          const glassesHeight = lensH + frameThickness * 2;
          glassesGroup.position.set(centerX, gbox.max.y + glassesHeight * 0.62, depth * 0.7);

          mesh.add(glassesGroup);
        }

        const glyph = font.data.glyphs[ch] ?? font.data.glyphs["?"];
        cursorX += (glyph?.ha ?? 600) * scale;

        letters.push({
          mesh,
          target: new THREE.Vector3(mesh.position.x, 0, 0),
          start: new THREE.Vector3(),
          startRot: new THREE.Euler(),
          delay: Math.random() * 500,
          duration: 900 + Math.random() * 500,
        });
      }

      const box = new THREE.Box3().setFromObject(lineGroup);
      const center = box.getCenter(new THREE.Vector3());

      for (const letter of letters) {
        letter.target.x -= center.x;
        letter.target.y -= center.y;
      }

      const lineWidth = box.max.x - box.min.x;
      const fovRad = (camera.fov * Math.PI) / 180;
      const visibleHeight = 2 * Math.tan(fovRad / 2) * camera.position.z;
      const visibleWidth = visibleHeight * camera.aspect;
      const fit = Math.min((visibleWidth * 0.74) / lineWidth, 1.35);
      group.scale.set(fit, fit * 1.2, fit);

      dropLetters();
    });

    function dropLetters() {
      for (const letter of letters) {
        letter.start.set(
          letter.target.x + (Math.random() - 0.5) * 6,
          letter.target.y + 14 + Math.random() * 6,
          (Math.random() - 0.5) * 4
        );
        letter.startRot.set(
          (Math.random() - 0.5) * 3,
          (Math.random() - 0.5) * 3,
          (Math.random() - 0.5) * 3
        );
        letter.mesh.position.copy(letter.start);
        letter.mesh.rotation.copy(letter.startRot);
        letter.delay = Math.random() * 500;
        letter.duration = 900 + Math.random() * 500;
      }
      animStartTime = performance.now();
      setReady(false);
      window.clearTimeout(readyTimeout);
      settleAt = Math.max(...letters.map((l) => l.delay + l.duration)) + 200;
      readyTimeout = window.setTimeout(() => setReady(true), settleAt);
    }

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMouseMove);

    // Easter egg: clicar nas letras 3D refaz a queda.
    const raycaster = new THREE.Raycaster();
    const hoverPointer = new THREE.Vector2();
    const onClick = (e: MouseEvent) => {
      if (letters.length === 0) return;
      const rect = mount.getBoundingClientRect();
      const pointer = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(letters.map((l) => l.mesh), false);
      if (hits.length > 0) dropLetters();
    };
    renderer.domElement.style.pointerEvents = "auto";
    renderer.domElement.addEventListener("click", onClick);

    const render = () => {
      const now = performance.now();

      for (const letter of letters) {
        const elapsed = now - animStartTime - letter.delay;
        const t = Math.min(Math.max(elapsed / letter.duration, 0), 1);
        const eased = easeOutBack(t);
        letter.mesh.position.lerpVectors(letter.start, letter.target, eased);
        letter.mesh.rotation.x = letter.startRot.x * (1 - eased);
        letter.mesh.rotation.y = letter.startRot.y * (1 - eased);
        letter.mesh.rotation.z = letter.startRot.z * (1 - eased);
      }

      forgeGlow.intensity = 1.2 + Math.sin(now * 0.004) * 0.25 + Math.sin(now * 0.011) * 0.12;

      // Respiração sutil: o bloco nunca fica totalmente parado.
      lineGroup.position.y = Math.sin(now * 0.0009) * 0.14;
      lineGroup.rotation.y = Math.sin(now * 0.0006) * 0.035;

      camera.position.x += (mouse.x * 2.2 - camera.position.x) * 0.04;
      camera.position.y += (2.2 - mouse.y * 1.3 - camera.position.y) * 0.04;
      camera.lookAt(0, -0.6, 0);
      renderer.render(scene, camera);

      if (letters.length > 0) {
        hoverPointer.set(mouse.x, mouse.y);
        raycaster.setFromCamera(hoverPointer, camera);
        const hovering = raycaster.intersectObjects(letters.map((l) => l.mesh), false).length > 0;
        mount.style.cursor = hovering ? "pointer" : "default";
      }

      frameId = requestAnimationFrame(render);
    };
    render();

    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelled = true;
      window.clearTimeout(readyTimeout);
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", onMouseMove);
      renderer.domElement.removeEventListener("click", onClick);
      window.removeEventListener("resize", onResize);
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      envRT.texture.dispose();
      pmrem.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-[#0a0503]">
      <div ref={mountRef} className="absolute inset-0" />

      <div
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-[16vh] md:translate-y-[18vh] flex flex-col items-center gap-8 text-center px-6 transition-all duration-700 ${
          ready ? "opacity-100 translate-y-[16vh] md:translate-y-[18vh]" : "opacity-0 translate-y-[calc(16vh+12px)]"
        }`}
      >
        <p className="text-base md:text-lg font-semibold text-white max-w-md">
          Estudante de Engenharia de Software com foco em desenvolvimento full-stack.
        </p>
        <button
          onClick={onExplore}
          className="fire-border rounded-full bg-white px-9 py-4 text-sm md:text-base font-semibold text-black hover:text-[#ff3b30] transition-colors"
        >
          Quem é paulorgdc.dev?
        </button>
      </div>
    </section>
  );
}
