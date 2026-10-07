"use client";
import { useEffect, useRef, useState } from "react";

const VERT = `attribute vec2 position; void main(){ gl_Position = vec4(position, 0.0, 1.0); }`;
const FRAG = `
precision highp float;
uniform vec2 u_res; uniform float u_time; uniform vec3 u_a; uniform vec3 u_b; uniform vec3 u_c;
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec2 mod289(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}
vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}
float snoise(vec2 v){
  const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
  vec2 i=floor(v+dot(v,C.yy)); vec2 x0=v-i+dot(i,C.xx);
  vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
  vec4 x12=x0.xyxy+C.xxzz; x12.xy-=i1; i=mod289(i);
  vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
  vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0); m=m*m; m=m*m;
  vec3 x=2.0*fract(p*C.www)-1.0; vec3 h=abs(x)-0.5; vec3 ox=floor(x+0.5); vec3 a0=x-ox;
  m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
  vec3 g; g.x=a0.x*x0.x+h.x*x0.y; g.yz=a0.yz*x12.xz+h.yz*x12.yw; return 130.0*dot(m,g);
}
void main(){
  vec2 uv=gl_FragCoord.xy/u_res.xy; float t=u_time*0.05;
  float n1=snoise(uv*1.6+vec2(t,-t*0.7));
  float n2=snoise(uv*3.2-vec2(t*0.6,t*0.4)+n1*0.5);
  float band=smoothstep(-0.6,0.9,n1*0.7+n2*0.3+uv.y*0.4-0.2);
  vec3 col=mix(u_a,u_b,band);
  col=mix(col,u_c,smoothstep(0.55,1.0,n2)*0.35);
  float vignette=smoothstep(1.4,0.3,distance(uv,vec2(0.5,0.45)));
  col=mix(col*0.92,col,vignette);
  gl_FragColor=vec4(col,1.0);
}`;

function cssColor(name: string, fallback: string): [number, number, number] {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
  const hex = v.replace("#", "").slice(0, 6);
  return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255) as [number, number, number];
}

export function ShaderPanel({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const gl = canvas.getContext("webgl", { antialias: false, powerPreference: "low-power" });
    if (!gl) { setFailed(true); return; }
    const mk = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const prog = gl.createProgram()!; gl.attachShader(prog, mk(gl.VERTEX_SHADER, VERT)); gl.attachShader(prog, mk(gl.FRAGMENT_SHADER, FRAG)); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { setFailed(true); return; }
    gl.useProgram(prog);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(prog, "position"); gl.enableVertexAttribArray(pos); gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(prog, "u_res"), uTime = gl.getUniformLocation(prog, "u_time");
    const setColors = () => {
      gl.uniform3fv(gl.getUniformLocation(prog, "u_a"), cssColor("--shader-a", "#0f3f3c"));
      gl.uniform3fv(gl.getUniformLocation(prog, "u_b"), cssColor("--shader-b", "#45aaa3"));
      gl.uniform3fv(gl.getUniformLocation(prog, "u_c"), cssColor("--shader-c", "#e9d8b4"));
    };
    setColors();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const resize = () => { const w = Math.floor(canvas.clientWidth * dpr), h = Math.floor(canvas.clientHeight * dpr); if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); gl.uniform2f(uRes, w, h); } };
    let raf = 0, visible = true, start = performance.now();
    const frame = () => { resize(); gl.uniform1f(uTime, reduce ? 40 : (performance.now() - start) / 1000); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); if (!reduce && visible) raf = requestAnimationFrame(frame); };
    const io = new IntersectionObserver(([e]) => { const was = visible; visible = e.isIntersecting; if (visible && !was && !reduce) frame(); }, { threshold: 0.05 });
    io.observe(canvas);
    const mq = window.matchMedia("(prefers-color-scheme: dark)"); const onTheme = () => { setColors(); if (reduce) frame(); };
    mq.addEventListener("change", onTheme); window.addEventListener("resize", resize);
    frame();
    return () => { cancelAnimationFrame(raf); io.disconnect(); mq.removeEventListener("change", onTheme); window.removeEventListener("resize", resize); gl.getExtension("WEBGL_lose_context")?.loseContext(); };
  }, []);

  if (failed) return <div className={`bg-[radial-gradient(120%_90%_at_30%_20%,var(--shader-b),var(--shader-a)_70%)] ${className}`} aria-hidden="true" />;
  return <canvas ref={ref} className={`block h-full w-full ${className}`} aria-hidden="true" />;
}
