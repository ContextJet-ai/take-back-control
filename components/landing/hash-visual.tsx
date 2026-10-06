"use client";
import { useEffect, useRef, useState } from "react";
import { canRun3D } from "@/lib/motion-capable";
import { HashVisualStatic } from "./hash-visual-static";

export function HashVisual() {
  const [mode, setMode] = useState<"pending" | "3d" | "static">("pending");
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canRun3D()) { setMode("static"); return; }
    const el = host.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setMode("3d"); io.disconnect(); } }, { rootMargin: "300px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (mode !== "3d" || !host.current) return;
    let stop = () => {};
    let cancelled = false;
    (async () => {
      const THREE = await import("three");
      if (cancelled || !host.current) return;
      const el = host.current;
      const w = el.clientWidth, h = Math.round(w * 0.75);
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(w, h);
      el.appendChild(renderer.domElement);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
      camera.position.z = 14;
      const accent = new THREE.Color(getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#1f6f6b");
      const N = 8, group = new THREE.Group();
      const geo = new THREE.BoxGeometry(0.9, 0.9, 0.2);
      const mat = new THREE.MeshStandardMaterial({ color: accent, roughness: 0.6 });
      for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
        const m = new THREE.Mesh(geo, mat);
        m.position.set(x - N / 2 + 0.5, y - N / 2 + 0.5, 0);
        group.add(m);
      }
      scene.add(group);
      scene.add(new THREE.AmbientLight(0xffffff, 0.8));
      const key = new THREE.DirectionalLight(0xffffff, 1.2); key.position.set(3, 5, 6); scene.add(key);

      let raf = 0, visible = true, t = 0;
      function loop() {
        if (!visible) return;
        t += 0.008;
        group.children.forEach((c, i) => {
          const phase = (i % N) / N + Math.floor(i / N) / N;
          c.position.z = Math.sin(t * 2 + phase * 6) * 0.6;
          c.rotation.y = Math.sin(t + phase * 3) * 0.4;
        });
        group.rotation.y = Math.sin(t * 0.5) * 0.25;
        renderer.render(scene, camera);
        raf = requestAnimationFrame(loop);
      }
      const io = new IntersectionObserver(([e]) => { const was = visible; visible = e.isIntersecting; if (visible && !was) loop(); }, { threshold: 0.1 });
      io.observe(el);
      loop();
      const onResize = () => { const nw = el.clientWidth, nh = Math.round(nw * 0.75); renderer.setSize(nw, nh); camera.aspect = nw / nh; camera.updateProjectionMatrix(); };
      window.addEventListener("resize", onResize);
      stop = () => { cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener("resize", onResize); renderer.dispose(); geo.dispose(); mat.dispose(); el.innerHTML = ""; };
    })();
    return () => { cancelled = true; stop(); };
  }, [mode]);

  if (mode === "static") return <HashVisualStatic />;
  return <div ref={host} data-testid="hash-3d" className="min-h-[300px] w-full overflow-hidden rounded-card" aria-hidden="true" />;
}
