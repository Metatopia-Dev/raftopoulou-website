"use client";

import { useEffect, useRef } from "react";
import { Flowmap, Mesh, Program, Renderer, Texture, Triangle } from "ogl";
import { cn } from "@/lib/utils";

type HeroVideoRippleProps = {
  src: string;
  className?: string;
};

const vertexShader = `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const renderFragmentShader = `
precision highp float;

uniform sampler2D uTexture;
uniform sampler2D uFlow;
uniform float uTime;
uniform float uHover;
uniform vec2 uResolution;
varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  mat2 rot = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 4; i++) {
    value += amplitude * noise(p);
    p = rot * p * 1.32;
    amplitude *= 0.52;
  }
  return value;
}

float ridge(float x) {
  return 1.0 - abs(x * 2.0 - 1.0);
}

void main() {
  vec2 uv = vUv;
  vec2 texel = 1.0 / uResolution;
  vec3 flowTex = texture2D(uFlow, uv).rgb;
  vec2 flow = flowTex.xy;
  float pressure = flowTex.z;
  float flowLen = length(flow);
  vec2 lensDirection = normalize(flow + vec2(0.000001, 0.0001));
  vec2 anisUv = uv * vec2(uResolution.x / max(1.0, uResolution.y), 1.0);

  // Crushed-ice body: broad field + torn noisy silhouette.
  float body = smoothstep(0.02, 0.44, pressure + flowLen * 1.05);
  float shapeNoiseA = fbm(anisUv * 6.5 + vec2(uTime * 0.03, -uTime * 0.05));
  float shapeNoiseB = fbm(anisUv * 11.5 + vec2(-uTime * 0.08, uTime * 0.04));
  float shapeNoise = shapeNoiseA * 0.62 + shapeNoiseB * 0.38;
  float jaggedSilhouette = ridge(shapeNoise);
  float coreMask = body * (0.74 + jaggedSilhouette * 0.92);

  // Edge breakup with powdery frost texture.
  float edgeBand = smoothstep(0.18, 0.66, coreMask) - smoothstep(0.5, 0.95, coreMask);
  float frostNoise = fbm(anisUv * 36.0 + vec2(-uTime * 0.22, uTime * 0.18));
  float powder = smoothstep(0.34, 0.9, frostNoise);
  float tornEdge = edgeBand * (0.5 + powder * 1.35);

  float iceMask = clamp(coreMask + tornEdge * 0.56, 0.0, 1.0) * uHover;

  // Distortion vector: directional drag + noisy internal shearing.
  float shearNoise = fbm(anisUv * 18.0 + lensDirection * 3.2 + vec2(uTime * 0.16));
  vec2 shear = vec2(
    (shearNoise - 0.5),
    (fbm(anisUv * 19.0 + vec2(1.3, -0.6) + vec2(-uTime * 0.14, uTime * 0.11)) - 0.5)
  );

  float flowEnergy = clamp(flowLen * 1.85 + pressure * 1.35, 0.0, 1.0);
  vec2 drag = flow * (0.056 + pressure * 0.044);
  vec2 refractVec = (drag + shear * (0.028 + coreMask * 0.028)) * (0.58 + iceMask * 1.15);
  vec2 refractedUv = uv + refractVec - lensDirection * (0.007 + flowEnergy * 0.013) * iceMask;

  // Smear along velocity so moving footage "lags" in the ice.
  vec2 smear = lensDirection * (0.0024 + pressure * 0.0036 + flowLen * 0.003);
  vec3 delayed = vec3(0.0);
  delayed += texture2D(uTexture, refractedUv + smear * 1.2).rgb;
  delayed += texture2D(uTexture, refractedUv + smear * 0.72).rgb;
  delayed += texture2D(uTexture, refractedUv - smear * 0.42).rgb;
  delayed += texture2D(uTexture, refractedUv - smear * 0.94).rgb;
  delayed *= 0.25;

  // Chromatic micro-split (tiny, but visible under stronger distortion).
  vec2 ca = lensDirection * (0.00035 + flowEnergy * 0.0011) * iceMask;
  vec3 refracted = vec3(
    texture2D(uTexture, refractedUv + ca).r,
    texture2D(uTexture, refractedUv).g,
    texture2D(uTexture, refractedUv - ca).b
  );

  float delayMix = (0.28 + flowEnergy * 0.34) * iceMask;
  vec3 mixed = mix(refracted, delayed, delayMix);

  // Cold grade inside the lens: slightly brighter highs + cooler/desaturated mids.
  float lum = dot(mixed, vec3(0.2126, 0.7152, 0.0722));
  vec3 cool = mix(mixed, vec3(lum) * vec3(0.83, 0.93, 1.13), 0.24 * iceMask);
  cool = mix(vec3(dot(cool, vec3(0.299, 0.587, 0.114))), cool, 1.0 - 0.2 * iceMask);
  mixed = cool;

  // Specular-style highlights from local flow gradients.
  float flowL = length(texture2D(uFlow, uv - vec2(texel.x, 0.0)).xy);
  float flowR = length(texture2D(uFlow, uv + vec2(texel.x, 0.0)).xy);
  float flowD = length(texture2D(uFlow, uv - vec2(0.0, texel.y)).xy);
  float flowU = length(texture2D(uFlow, uv + vec2(0.0, texel.y)).xy);
  vec2 grad = vec2(flowR - flowL, flowU - flowD);
  vec3 normal = normalize(vec3(-grad * 5.0, 1.0));
  vec3 lightDir = normalize(vec3(-0.42, 0.55, 0.72));
  vec3 viewDir = vec3(0.0, 0.0, 1.0);
  vec3 reflected = reflect(-lightDir, normal);
  float specular = pow(max(dot(reflected, viewDir), 0.0), 34.0);
  float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);
  float highlight = (specular * 0.34 + fresnel * 0.15) * (0.22 + flowEnergy * 0.78) * iceMask;
  mixed += vec3(highlight);

  // Grainy fringe at the boundary, like frosted particles.
  mixed += vec3(0.11, 0.13, 0.16) * tornEdge * uHover;

  // Tiny unpredictable glints (brief and sparse).
  float glintSeed = hash(floor((uv + vec2(uTime * 0.17, -uTime * 0.13)) * uResolution * 0.2));
  float glintPulse = step(0.9946, glintSeed + flowEnergy * 0.02);
  float glint = glintPulse * smoothstep(0.6, 0.96, coreMask) * smoothstep(0.45, 0.95, flowEnergy) * uHover;
  mixed += vec3(0.34, 0.38, 0.43) * glint;

  vec3 baseColor = texture2D(uTexture, uv).rgb;
  vec3 finalColor = mix(baseColor, mixed, clamp(iceMask * 1.2, 0.0, 1.0));

  gl_FragColor = vec4(finalColor, 1.0);
}
`;

export function HeroVideoRipple({ src, className }: HeroVideoRippleProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!wrapperRef.current || !canvasRef.current || !videoRef.current) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) {
      return;
    }

    const testCanvas = document.createElement("canvas");
    const supportsWebGL = Boolean(
      testCanvas.getContext("webgl2") || testCanvas.getContext("webgl"),
    );

    if (!supportsWebGL) {
      return;
    }

    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const renderer = new Renderer({
      canvas,
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio, 2),
    });
    const gl = renderer.gl;
    const initialRect = wrapper.getBoundingClientRect();
    const flowSize = Math.max(
      512,
      Math.min(
        1024,
        Math.floor(
          Math.max(initialRect.width, initialRect.height) *
            Math.min(window.devicePixelRatio, 2),
        ),
      ),
    );

    const texture = new Texture(gl, { generateMipmaps: false });
    texture.image = video;
    const flowmap = new Flowmap(gl, {
      size: flowSize,
      falloff: 0.2,
      alpha: 0.29,
      dissipation: 0.984,
    });

    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: renderFragmentShader,
      uniforms: {
        uTexture: { value: texture },
        uFlow: flowmap.uniform,
        uTime: { value: 0 },
        uHover: { value: 0 },
        uResolution: { value: [1, 1] },
      },
    });

    const geometry = new Triangle(gl);
    const mesh = new Mesh(gl, { geometry, program });

    let rafId = 0;
    let isHovering = false;
    let hoverValue = 0;
    let rawPointerX = 0.5;
    let rawPointerY = 0.5;
    let targetPointerX = 0.5;
    let targetPointerY = 0.5;
    let pointerX = 0.5;
    let pointerY = 0.5;
    let pointerSpeed = 0;

    const resize = () => {
      if (!wrapperRef.current) {
        return;
      }

      const { width, height } = wrapperRef.current.getBoundingClientRect();
      renderer.setSize(Math.max(1, width), Math.max(1, height));
      flowmap.aspect = width / Math.max(1, height);
      program.uniforms.uResolution.value = [
        Math.max(1, width),
        Math.max(1, height),
      ];
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = wrapper.getBoundingClientRect();
      if (!rect.width || !rect.height) {
        return;
      }

      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const isInside = x >= 0 && x <= 1 && y >= 0 && y <= 1;

      isHovering = isInside;
      if (!isInside) {
        return;
      }

      const nextPointerX = x;
      const nextPointerY = 1 - y;
      const dx = nextPointerX - rawPointerX;
      const dy = nextPointerY - rawPointerY;
      const movement = Math.sqrt(dx * dx + dy * dy);

      pointerSpeed = Math.min(1.1, pointerSpeed + movement * 12);
      rawPointerX = nextPointerX;
      rawPointerY = nextPointerY;
    };

    const onPointerLeaveWindow = () => {
      isHovering = false;
    };

    const animate = (timeMs: number) => {
      // Bail if the WebGL context was lost (e.g. tab backgrounded, GPU reset,
      // or too many live contexts). Rendering on a lost context throws.
      if (gl.isContextLost()) {
        rafId = window.requestAnimationFrame(animate);
        return;
      }

      const time = timeMs * 0.001;

      // Input filtering to avoid a hard lock to cursor position.
      targetPointerX += (rawPointerX - targetPointerX) * 0.08;
      targetPointerY += (rawPointerY - targetPointerY) * 0.08;

      pointerX += (targetPointerX - pointerX) * 0.045;
      pointerY += (targetPointerY - pointerY) * 0.045;
      hoverValue +=
        ((isHovering ? 1 : 0) - hoverValue) * (isHovering ? 0.095 : 0.05);
      pointerSpeed *= 0.82;

      flowmap.mouse.set(pointerX, pointerY);
      const hoverSpeed = pointerSpeed * (0.34 + hoverValue * 0.58);
      const swirl = Math.sin(time * 0.62) * 0.008;
      const targetVelocityX =
        (targetPointerX - pointerX) * hoverSpeed * 14 + swirl;
      const targetVelocityY =
        (targetPointerY - pointerY) * hoverSpeed * 14 - swirl;
      flowmap.velocity.x += (targetVelocityX - flowmap.velocity.x) * 0.035;
      flowmap.velocity.y += (targetVelocityY - flowmap.velocity.y) * 0.035;
      flowmap.update();

      if (video.readyState >= video.HAVE_CURRENT_DATA) {
        texture.needsUpdate = true;
      }

      program.uniforms.uTime.value = time;
      program.uniforms.uHover.value = hoverValue;
      renderer.render({ scene: mesh });
      rafId = window.requestAnimationFrame(animate);
    };

    // Keep the animation loop alive across a context loss/restore cycle so the
    // canvas recovers instead of staying frozen.
    const onContextLost = (event: Event) => {
      event.preventDefault();
    };

    const observer = new ResizeObserver(resize);
    observer.observe(wrapper);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeaveWindow);
    canvas.addEventListener("webglcontextlost", onContextLost);

    resize();
    rafId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeaveWindow);
      canvas.removeEventListener("webglcontextlost", onContextLost);
    };
  }, []);

  return (
    <div ref={wrapperRef} className={cn("absolute inset-0", className)}>
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover object-bottom"
        src={src}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden="true"
      />
    </div>
  );
}
