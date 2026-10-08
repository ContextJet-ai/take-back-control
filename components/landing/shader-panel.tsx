"use client";
import { useEffect, useRef, useState } from "react";
import { canRun3D } from "@/lib/motion-capable";

// The light is decorative, so it must never compete with the page loading. It starts after load and idle,
// renders at a small fraction of the display size (it sits under a soft blur), and is capped in frame rate.
export const SHADER_POLICY = { startDelayMs: 1200, scale: 0.3, fps: 20 } as const;

const VERT = `attribute vec2 position; void main(){ gl_Position = vec4(position, 0.0, 1.0); }`;
const FRAG = `
precision mediump float;
uniform vec2 u_res; uniform float u_time; uniform vec3 u_a; uniform vec3 u_b; uniform vec3 u_c;
void main(){
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  float t = u_time * 0.12;
  vec2 p = uv * 2.6;
  p += 0.55 * vec2(sin(p.y * 1.7 + t), cos(p.x * 1.3 - t));
  p += 0.35 * vec2(sin(p.y * 2.9 - t * 1.3), cos(p.x * 2.3 + t * 0.9));
  float n = 0.5 + 0.5 * sin(p.x + p.y + t);
  float band = smoothstep(0.1, 0.9, n * 0.75 + uv.y * 0.35);
  vec3 col = mix(u_a, u_b, band);
  col = mix(col, u_c, smoothstep(0.62, 1.0, 0.5 + 0.5 * sin(p.x * 1.4 - p.y + t * 0.7)) * 0.4);
  float vignette = smoothstep(1.4, 0.3, distance(uv, vec2(0.5, 0.45)));
  gl_FragColor = vec4(mix(col * 0.92, col, vignette), 1.0);
}`;

function hexToRgb(v: string): [number, number, number] {
  const hex = v.replace("#", "").slice(0, 6);
  return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255) as [number, number, number];
}
function cssColor(name: string, fallback: string): [number, number, number] {
  return hexToRgb(getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback);
}

// Neutral mid grey leaves the photo untouched under soft-light; white and warm cream lift it.
const OVERLAY_COLORS: [string, string, string] = ["#808080", "#ffffff", "#ffe6b0"];

function start(canvas: HTMLCanvasElement, overlay: boolean, onFail: () => void): () => void {
  const gl = canvas.getContext("webgl", { antialias: false, powerPreference: "low-power" });
  if (!gl) { onFail(); return () => {}; }
  const mk = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, mk(gl.VERTEX_SHADER, VERT)); gl.attachShader(prog, mk(gl.FRAGMENT_SHADER, FRAG)); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { onFail(); return () => {}; }
  gl.useProgram(prog);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const pos = gl.getAttribLocation(prog, "position"); gl.enableVertexAttribArray(pos); gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
  const uRes = gl.getUniformLocation(prog, "u_res"), uTime = gl.getUniformLocation(prog, "u_time");
  const setColors = () => {
    const [a, b, c] = overlay
      ? OVERLAY_COLORS.map(hexToRgb)
      : [cssColor("--shader-a", "#0f3f3c"), cssColor("--shader-b", "#45aaa3"), cssColor("--shader-c", "#e9d8b4")];
    gl.uniform3fv(gl.getUniformLocation(prog, "u_a"), a);
    gl.uniform3fv(gl.getUniformLocation(prog, "u_b"), b);
    gl.uniform3fv(gl.getUniformLocation(prog, "u_c"), c);
  };
  setColors();
  const resize = () => {
    const w = Math.max(1, Math.floor(canvas.clientWidth * SHADER_POLICY.scale)), h = Math.max(1, Math.floor(canvas.clientHeight * SHADER_POLICY.scale));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); gl.uniform2f(uRes, w, h); }
  };
  const t0 = performance.now(); const gap = 1000 / SHADER_POLICY.fps;
  let raf = 0, visible = true, last = 0;
  const frame = (now: number) => {
    if (now - last >= gap) { last = now; resize(); gl.uniform1f(uTime, (now - t0) / 1000); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); }
    if (visible) raf = requestAnimationFrame(frame);
  };
  const io = new IntersectionObserver(([e]) => { const was = visible; visible = e.isIntersecting; if (visible && !was) { cancelAnimationFrame(raf); raf = requestAnimationFrame(frame); } }, { threshold: 0.05 });
  io.observe(canvas);
  const mq = window.matchMedia("(prefers-color-scheme: dark)"); const onTheme = () => setColors();
  mq.addEventListener("change", onTheme);
  raf = requestAnimationFrame(frame);
  return () => { cancelAnimationFrame(raf); io.disconnect(); mq.removeEventListener("change", onTheme); gl.getExtension("WEBGL_lose_context")?.loseContext(); };
}

export function ShaderPanel({ className = "", overlay = false }: { className?: string; overlay?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    if (!canRun3D()) { setFailed(true); return; }
    let cancelled = false, stop = () => {};
    const begin = () => { if (!cancelled) stop = start(canvas, overlay, () => setFailed(true)); };
    const whenIdle = () => { if ("requestIdleCallback" in window) window.requestIdleCallback(begin, { timeout: 3000 }); else setTimeout(begin, 500); };
    const onLoad = () => whenIdle();
    const timer = window.setTimeout(() => { if (document.readyState === "complete") whenIdle(); else window.addEventListener("load", onLoad, { once: true }); }, SHADER_POLICY.startDelayMs);
    return () => { cancelled = true; clearTimeout(timer); window.removeEventListener("load", onLoad); stop(); };
  }, [overlay]);

  if (failed && overlay) return null;
  if (failed) return <div className={`bg-[radial-gradient(120%_90%_at_30%_20%,var(--shader-b),var(--shader-a)_70%)] ${className}`} aria-hidden="true" />;
  return <canvas ref={ref} className={`block h-full w-full ${overlay ? "pointer-events-none mix-blend-soft-light opacity-80" : ""} ${className}`} aria-hidden="true" />;
}
