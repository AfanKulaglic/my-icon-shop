/**
 * OrderModelViewer — standalone 3D preview used in the admin Orders panel.
 *
 * Accepts modelId, shirtColor, and textureURLs as props.
 * Does NOT read from useEditorStore so it never pollutes the live editor.
 * Uses the identical cotton-weave material + shader-baked decal system
 * as ShirtCanvas.jsx.
 */
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Environment, Center, Bounds, Html } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { getModel, getModelWithOverrides, loadOverrides, loadCameraOverride } from "../../utils/models.js";
import { products } from "../../utils/products.js";

const SIDES = ["front", "back", "sleeves"];
const MAX_DECALS = 3;

// ---------------------------------------------------------------------------
// resolveSeed — identical to ShirtCanvas; resolves a decal seed → {point, normal, size, rotation}
// ---------------------------------------------------------------------------
function resolveSeed(mesh, seed) {
  mesh.geometry.computeBoundingBox();
  const bb = mesh.geometry.boundingBox;
  const { min, max } = bb;
  const sx = max.x - min.x, sy = max.y - min.y, sz = max.z - min.z;
  const u = seed.uv?.[0] ?? 0.5;
  const v = seed.uv?.[1] ?? 0.5;
  const pad = Math.max(sx, sy, sz);
  let origin, dir;
  switch (seed.axis) {
    case "+z": origin = new THREE.Vector3(min.x + u * sx, min.y + v * sy, max.z + pad); dir = new THREE.Vector3(0, 0, -1); break;
    case "-z": origin = new THREE.Vector3(min.x + u * sx, min.y + v * sy, min.z - pad); dir = new THREE.Vector3(0, 0,  1); break;
    case "+x": origin = new THREE.Vector3(max.x + pad, min.y + v * sy, min.z + u * sz); dir = new THREE.Vector3(-1, 0, 0); break;
    case "-x": origin = new THREE.Vector3(min.x - pad, min.y + v * sy, min.z + u * sz); dir = new THREE.Vector3( 1, 0, 0); break;
    case "+y": origin = new THREE.Vector3(min.x + u * sx, max.y + pad, min.z + v * sz); dir = new THREE.Vector3(0, -1, 0); break;
    case "-y": origin = new THREE.Vector3(min.x + u * sx, min.y - pad, min.z + v * sz); dir = new THREE.Vector3(0,  1, 0); break;
    default:   origin = new THREE.Vector3((min.x+max.x)/2, (min.y+max.y)/2, max.z + pad); dir = new THREE.Vector3(0, 0, -1);
  }
  const ray = new THREE.Raycaster(origin, dir.normalize(), 0, pad * 4);
  const saved = mesh.matrixWorld.clone();
  mesh.matrixWorld.identity();
  const hits = ray.intersectObject(mesh, false);
  mesh.matrixWorld.copy(saved);
  let point, normal;
  if (hits.length > 0) {
    point  = hits[0].point.clone();
    normal = hits[0].face?.normal?.clone().normalize() || dir.clone().negate();
  } else {
    point  = origin.clone().addScaledVector(dir, pad);
    normal = dir.clone().negate();
  }
  const sw = (seed.size?.[0] || 0.3) * Math.max(sx, sy, sz);
  const sh = (seed.size?.[1] || 0.3) * Math.max(sx, sy, sz);
  return { point, normal, size: [sw, sh], rotation: seed.rotation || 0 };
}

// ---------------------------------------------------------------------------
// ShirtMesh — the actual 3D mesh with cotton material + decal shader
// ---------------------------------------------------------------------------
function ShirtMesh({ model, shirtColor, textureURLs }) {
  const meshRef = useRef(null);
  const obj = useLoader(OBJLoader, model.obj);

  // Procedural cotton weave normal map (same as ShirtCanvas)
  const cottonNormalMap = useMemo(() => {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext("2d");
    const imageData = ctx.createImageData(size, size);
    const d = imageData.data;
    const T = 5;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const tx = Math.floor(x / T), ty = Math.floor(y / T);
        const fx = (x % T) / T, fy = (y % T) / T;
        const isWarp = (tx + ty) % 2 === 0;
        let nx = 0, ny = 0;
        if (isWarp) nx = Math.sin((fx - 0.5) * Math.PI) * 0.35;
        else        ny = Math.sin((fy - 0.5) * Math.PI) * 0.35;
        const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
        const i = (y * size + x) * 4;
        d[i]   = Math.round((nx * 0.5 + 0.5) * 255);
        d[i+1] = Math.round((ny * 0.5 + 0.5) * 255);
        d[i+2] = Math.round(nz * 255);
        d[i+3] = 255;
      }
    }
    ctx.putImageData(imageData, 0, 0);
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(50, 50);
    return tex;
  }, []);

  // Decal uniforms
  const decalUniforms = useRef({
    uDecalActive:    { value: new Float32Array(MAX_DECALS) },
    uDecalAnchor:    { value: Array.from({ length: MAX_DECALS }, () => new THREE.Vector3()) },
    uDecalAxisX:     { value: Array.from({ length: MAX_DECALS }, () => new THREE.Vector3(1, 0, 0)) },
    uDecalAxisY:     { value: Array.from({ length: MAX_DECALS }, () => new THREE.Vector3(0, 1, 0)) },
    uDecalAxisZ:     { value: Array.from({ length: MAX_DECALS }, () => new THREE.Vector3(0, 0, 1)) },
    uDecalSize:      { value: Array.from({ length: MAX_DECALS }, () => new THREE.Vector2(1, 1)) },
    uDecalFrameRGBA: { value: Array.from({ length: MAX_DECALS }, () => new THREE.Vector4(0, 0, 0, 0)) },
    uDecalTex0:      { value: null },
    uDecalTex1:      { value: null },
    uDecalTex2:      { value: null },
  }).current;

  // Body material with full decal shader (identical to ShirtCanvas)
  const bodyMaterial = useMemo(() => {
    const m = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(shirtColor || "#ffffff"),
      roughness: 0.82,
      metalness: 0.0,
      envMapIntensity: 0.9,
      normalMap: cottonNormalMap,
      normalScale: new THREE.Vector2(0.45, 0.45),
      sheen: 0.25,
      sheenRoughness: 0.75,
      sheenColor: new THREE.Color(shirtColor || "#ffffff"),
    });
    m.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, decalUniforms);
      shader.vertexShader = shader.vertexShader
        .replace("#include <common>",
          `#include <common>
varying vec3 vDecalLocalPos;
varying vec3 vDecalLocalNormal;`)
        .replace("#include <begin_vertex>",
          `#include <begin_vertex>
vDecalLocalPos = position;
vDecalLocalNormal = normal;`);
      shader.fragmentShader = shader.fragmentShader
        .replace("#include <common>",
          `#include <common>
varying vec3 vDecalLocalPos;
varying vec3 vDecalLocalNormal;
vec4 vDecalAccumRGBA;
uniform float uDecalActive[${MAX_DECALS}];
uniform vec3  uDecalAnchor[${MAX_DECALS}];
uniform vec3  uDecalAxisX[${MAX_DECALS}];
uniform vec3  uDecalAxisY[${MAX_DECALS}];
uniform vec3  uDecalAxisZ[${MAX_DECALS}];
uniform vec2  uDecalSize[${MAX_DECALS}];
uniform vec4  uDecalFrameRGBA[${MAX_DECALS}];
uniform sampler2D uDecalTex0;
uniform sampler2D uDecalTex1;
uniform sampler2D uDecalTex2;
vec4 sampleDecalTex(int i, vec2 uv) {
  if (i == 0) return texture2D(uDecalTex0, uv);
  if (i == 1) return texture2D(uDecalTex1, uv);
  return texture2D(uDecalTex2, uv);
}
vec4 sampleDecal(int i, vec3 surfNormal) {
  vec3 d = vDecalLocalPos - uDecalAnchor[i];
  float u = dot(d, uDecalAxisX[i]) / uDecalSize[i].x;
  float v = dot(d, uDecalAxisY[i]) / uDecalSize[i].y;
  if (abs(u) > 0.5 || abs(v) > 0.5) return vec4(0.0);
  float facing = dot(surfNormal, uDecalAxisZ[i]);
  if (facing < 0.05) return vec4(0.0);
  float edge = smoothstep(0.5, 0.46, max(abs(u), abs(v)));
  vec2 uv2 = vec2(u + 0.5, v + 0.5);
  vec4 c = sampleDecalTex(i, uv2);
  c.a *= edge;
  return c;
}`)
        .replace("#include <map_fragment>",
          `#include <map_fragment>
{
  vec3 surfN = normalize(vDecalLocalNormal);
  vDecalAccumRGBA = vec4(0.0);
  for (int i = 0; i < ${MAX_DECALS}; i++) {
    if (uDecalActive[i] < 0.5) continue;
    vec4 dc = sampleDecal(i, surfN);
    diffuseColor.rgb = mix(diffuseColor.rgb, dc.rgb, dc.a);
    vDecalAccumRGBA.rgb = mix(vDecalAccumRGBA.rgb, dc.rgb, dc.a);
    vDecalAccumRGBA.a = max(vDecalAccumRGBA.a, dc.a);
  }
}`);
    };
    m.customProgramCacheKey = () => "order-viewer-decal-v1";
    return m;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shirtColor, cottonNormalMap]);

  // Update color reactively when prop changes
  useEffect(() => {
    bodyMaterial.color.set(shirtColor || "#ffffff");
    bodyMaterial.sheenColor.set(shirtColor || "#ffffff");
    bodyMaterial.needsUpdate = true;
  }, [bodyMaterial, shirtColor]);

  // Clone obj + apply material
  const cloned = useMemo(() => {
    const c = obj.clone(true);
    let best = null, bestCount = 0;
    c.traverse((child) => {
      if (child.isMesh) {
        child.material = bodyMaterial;
        const count = child.geometry?.attributes?.position?.count || 0;
        if (count > bestCount) { best = child; bestCount = count; }
      }
    });
    meshRef.current = best;
    return c;
  }, [obj, bodyMaterial]);

  // Resolve seed decals once mesh is loaded
  const [resolved, setResolved] = useState(null);
  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    mesh.updateMatrixWorld(true);
    const next = {};
    for (const side of SIDES) {
      const seed = model.printDecals?.[side];
      if (!seed) continue;
      if (Array.isArray(seed.point) && Array.isArray(seed.normal)) {
        next[side] = {
          point:    new THREE.Vector3(...seed.point),
          normal:   new THREE.Vector3(...seed.normal).normalize(),
          size:     seed.size || [0.3, 0.3],
          rotation: seed.rotation || 0,
        };
        continue;
      }
      const r = resolveSeed(mesh, seed);
      if (r) next[side] = r;
    }
    setResolved(next);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cloned, JSON.stringify(model.printDecals)]);

  // Load textures from the data-URL strings saved with the order
  const [decalTextures, setDecalTextures] = useState({});
  useEffect(() => {
    let cancelled = false;
    const updates = {};
    let pending = 0;
    SIDES.forEach((side) => {
      const url = textureURLs?.[side];
      if (!url) { updates[side] = null; return; }
      pending++;
      new THREE.TextureLoader().load(url, (t) => {
        if (cancelled) return;
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = 8;
        t.needsUpdate = true;
        updates[side] = t;
        pending--;
        if (pending === 0) setDecalTextures((prev) => ({ ...prev, ...updates }));
      });
    });
    if (pending === 0) setDecalTextures((prev) => ({ ...prev, ...updates }));
    return () => { cancelled = true; };
  }, [textureURLs]);

  // Push decal data into uniforms
  useEffect(() => {
    if (!resolved) return;
    const u = decalUniforms;
    SIDES.forEach((side, i) => {
      const r = resolved[side];
      const tex = decalTextures[side];
      if (!r) { u.uDecalActive.value[i] = 0; u.uDecalFrameRGBA.value[i].set(0,0,0,0); return; }
      const n = r.normal.clone().normalize();
      let up = new THREE.Vector3(0, 1, 0);
      if (Math.abs(up.dot(n)) > 0.95) up = new THREE.Vector3(1, 0, 0);
      const right   = new THREE.Vector3().crossVectors(up, n).normalize();
      const trueUp  = new THREE.Vector3().crossVectors(n, right).normalize();
      const rot = r.rotation || 0;
      const cs = Math.cos(rot), sn = Math.sin(rot);
      const ax = right.clone().multiplyScalar(cs).addScaledVector(trueUp,  sn);
      const ay = right.clone().multiplyScalar(-sn).addScaledVector(trueUp, cs);
      u.uDecalAnchor.value[i].copy(r.point);
      u.uDecalAxisX.value[i].copy(ax);
      u.uDecalAxisY.value[i].copy(ay);
      u.uDecalAxisZ.value[i].copy(n);
      u.uDecalSize.value[i].set(r.size[0] || 0.3, r.size[1] || 0.3);
      const slot = ["uDecalTex0","uDecalTex1","uDecalTex2"][i];
      u[slot].value = tex || null;
      u.uDecalActive.value[i] = tex ? 1 : 0;
      u.uDecalFrameRGBA.value[i].set(0, 0, 0, 0);
    });
  }, [resolved, decalTextures, decalUniforms]);

  // Gentle idle rotation
  const groupRef = useRef();
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.25) * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={cloned} />
    </group>
  );
}

function LoadingSpinner() {
  return (
    <Html center>
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        gap: "12px", pointerEvents: "none", userSelect: "none",
      }}>
        {/* Spinning ring with shirt silhouette */}
        <div style={{ position: "relative", width: "52px", height: "52px" }}>
          {/* Track ring */}
          <div style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            border: "2px solid rgba(255,255,255,0.07)",
          }} />
          {/* Accent arc */}
          <div
            className="animate-spin"
            style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              border: "2px solid transparent",
              borderTopColor: "#6366F1",
              borderRightColor: "rgba(99,102,241,0.25)",
            }}
          />
          {/* Shirt icon */}
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
              stroke="rgba(255,255,255,0.28)" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.38 8.57l-1.23 1.85a8 8 0 0 1-.22 7.58H5.07A8 8 0 0 1 15.58 6.85l1.85-1.23A10 10 0 0 0 3.35 19a2 2 0 0 0 1.72 1h13.85a2 2 0 0 0 1.74-1 10 10 0 0 0-.27-10.44z" />
              <path d="M10.59 15.41a2 2 0 0 0 2.83 0l5.66-8.49-8.49 5.66a2 2 0 0 0 0 2.83z" />
            </svg>
          </div>
        </div>
        <p style={{
          margin: 0, color: "rgba(255,255,255,0.38)",
          fontSize: "11px", fontWeight: 500,
          letterSpacing: "0.06em", whiteSpace: "nowrap",
        }}>
          Loading 3D model…
        </p>
      </div>
    </Html>
  );
}

// ---------------------------------------------------------------------------
// Public component
// ---------------------------------------------------------------------------
export default function OrderModelViewer({ productId, shirtColor, textureURLs }) {
  const [modelError, setModelError] = useState(false);
  const [model, setModel] = useState(null);
  const [cameraDefault, setCameraDefault] = useState(null);
  const orbitRef = useRef();

  const modelIdMap = {
    "man-polo":      "man-polo-shirt",
    "women-polo":    "women-polo-shirt",
    "man-hoodie":    "man-hoodie",
    "man-tshirt":    "man-tshirt",
    "women-tshirt":  "women-tshirt",
    "baseball-cap":  "baseball-cap",
  };
  // Prefer the map, then fall back to the products array, then use productId as-is
  const productEntry = products.find((p) => p.id === productId);
  const modelId = modelIdMap[productId] || productEntry?.modelId || productId;

  // Load the same Firebase overrides the editor uses so decal positions match
  useEffect(() => {
    Promise.all([
      loadOverrides().catch(() => ({})),
      loadCameraOverride(modelId).catch(() => null),
    ]).then(([overrides, cam]) => {
      setModel(getModelWithOverrides(modelId, overrides));
      setCameraDefault(cam);
    }).catch(() => setModel(getModel(modelId)));
  }, [modelId]);

  // Apply saved camera position once controls mount
  useEffect(() => {
    if (!cameraDefault?.position || !orbitRef.current) return;
    const id = requestAnimationFrame(() => {
      if (!orbitRef.current) return;
      const [x, y, z] = cameraDefault.position;
      const [tx, ty, tz] = cameraDefault.target || [0, 0, 0];
      orbitRef.current.object.position.set(x, y, z);
      orbitRef.current.target.set(tx, ty, tz);
      orbitRef.current.update();
    });
    return () => cancelAnimationFrame(id);
  }, [cameraDefault, model]); // re-run when model is ready too

  if (modelError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-white/3 rounded-xl border border-white/10">
        <p className="text-white/30 text-xs">3D preview unavailable</p>
      </div>
    );
  }

  if (!model) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-white/3 rounded-xl">
        <div className="w-5 h-5 border-2 border-white/20 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-full" onError={() => setModelError(true)}>
      <Canvas
        camera={{ position: [0, 0, model.cameraZ || 2.6], fov: 35 }}
        gl={{ antialias: true }}
        style={{ borderRadius: "0.75rem" }}
      >
        <Environment preset="studio" background={false} />
        <ambientLight intensity={0.35} />
        <directionalLight position={[4, 6, 3]} intensity={1.0} />
        <Suspense fallback={<LoadingSpinner />}>
          <Bounds fit clip observe margin={1.2}>
            <Center>
              <ShirtMesh
                model={model}
                shirtColor={shirtColor}
                textureURLs={textureURLs}
              />
            </Center>
          </Bounds>
        </Suspense>
        <OrbitControls ref={orbitRef} enablePan={false} minDistance={1.2} maxDistance={6} enableDamping />
      </Canvas>
    </div>
  );
}
