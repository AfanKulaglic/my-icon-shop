import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Center, Bounds, Html, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useEditorStore } from "../../store/editorStore.js";
import { getModelWithOverrides, SIDES } from "../../utils/models.js";
import { usePrintAreasOverride } from "../../hooks/usePrintAreasOverride.js";

// Use Google's CDN for the Draco decoder — avoids version-mismatch hangs.
// Decoder path + preloads are set in App.jsx so they fire immediately on
// app start, not after the lazy Editor chunk downloads.

const SIDE_COLORS = {
  front: "#ff6a00",
  back: "#00b4ff",
  sleeves: "#00ff8c",
};

const MAX_DECALS = 3; // front, back, sleeves

/**
 * 3D shirt preview with **shader-baked** print decals.
 *
 * The user's design for each side is sampled in the body material's own
 * fragment shader at render time:
 *
 *   - position+normal of every shaded fragment is checked against the
 *     decal's local-space box (after rotation around the surface normal)
 *   - if the fragment is inside the box AND its surface normal points
 *     roughly the same way as the decal's projection axis, the decal
 *     texture is sampled and blended on top of the base diffuse
 *
 * Because this happens **per visible pixel**, with the actual shaded
 * normal, the decal can't bleed through to the other side of the
 * shirt, leak across folds, or get cut off on curving regions. The UV
 * layout of the mesh is irrelevant.
 */
export default function ShirtCanvas({ modelId, editable = false, editingSide = null, initialCamera = null, orbitRef = null }) {
  // eslint-disable-next-line no-unused-vars
  const [overrides, _version] = usePrintAreasOverride();
  const model = getModelWithOverrides(modelId, overrides);
  const selectedSide = useEditorStore((s) => s.selectedSide);
  const debugZones = useEditorStore((s) => s.debugZones);
  const cameraTargetRef = useRef(null);

  const defaultPos = initialCamera?.position || [0, 0, model.cameraZ || 2.6];

  return (
    <div className="relative w-full h-full">
      <Canvas
        camera={{ position: defaultPos, fov: 35 }}
        gl={{ preserveDrawingBuffer: true, antialias: true }}
      >
        {/* IBL — soft studio env map drives realistic reflections at low intensity */}
        <Environment preset="studio" background={false} />
        {/* Soft base fill so unlit areas aren't pure black */}
        <ambientLight intensity={0.35} />
        {/* Single key light — upper-right front, moderate intensity */}
        <directionalLight position={[4, 6, 3]} intensity={1.0} />
        <Suspense fallback={<LoadingBox />}>
          <Bounds fit clip observe margin={1.2}>
            <Center>
              <Shirt 
                model={model} 
                editable={editable} 
                editingSide={editingSide} 
                selectedSide={selectedSide}
                cameraTargetRef={cameraTargetRef}
                debugZones={debugZones}
              />
            </Center>
          </Bounds>
        </Suspense>
        <CameraController 
          selectedSide={selectedSide} 
          editable={editable}
          cameraTargetRef={cameraTargetRef}
          initialCamera={initialCamera}
          orbitRef={orbitRef}
        />
      </Canvas>
    </div>
  );
}

// Camera controller that smoothly rotates to show the selected side's decal
function CameraController({ selectedSide, editable, cameraTargetRef, initialCamera, orbitRef }) {
  const localRef = useRef();
  const controlsRef = orbitRef || localRef;
  const currentTarget = useRef(new THREE.Vector3(0, 0, 2.6));
  const previousSide = useRef(selectedSide);
  const isAnimating = useRef(false);
  const animationProgress = useRef(0);
  const startPosition = useRef(new THREE.Vector3());
  const hasInitialized = useRef(false);

  // Apply saved camera position when initialCamera loads from Firebase
  useEffect(() => {
    if (!initialCamera?.position) return;
    // defer one frame so the camera object is ready
    const id = requestAnimationFrame(() => {
      if (!controlsRef.current) return;
      const [x, y, z] = initialCamera.position;
      const [tx, ty, tz] = initialCamera.target || [0, 0, 0];
      controlsRef.current.object.position.set(x, y, z);
      controlsRef.current.target.set(tx, ty, tz);
      controlsRef.current.update();
      // Stop any ongoing auto-rotation animation so it doesn't override the saved angle
      isAnimating.current = false;
    });
    return () => cancelAnimationFrame(id);
  }, [initialCamera]);

  // Initialize the camera target ref
  useEffect(() => {
    if (cameraTargetRef && !cameraTargetRef.current) {
      cameraTargetRef.current = new THREE.Vector3(0, 0, 2.6);
    }
  }, [cameraTargetRef]);
  
  // Detect side change and trigger animation
  useEffect(() => {
    if (previousSide.current !== selectedSide && !editable) {
      isAnimating.current = true;
      animationProgress.current = 0;
      previousSide.current = selectedSide;
    }
  }, [selectedSide, editable]);
  
  // Initial rotation to front zone on mount
  useEffect(() => {
    if (!editable && cameraTargetRef?.current && !hasInitialized.current) {
      hasInitialized.current = true;
      // Trigger initial animation to front zone
      isAnimating.current = true;
      animationProgress.current = 0;
    }
  }, [editable, cameraTargetRef]);
  
  useFrame((state) => {
    if (!controlsRef.current || editable || !cameraTargetRef?.current) return;
    
    const controls = controlsRef.current;
    
    // Only animate when side changes, not continuously
    if (isAnimating.current) {
      // Store start position on first frame of animation
      if (animationProgress.current === 0) {
        startPosition.current.copy(state.camera.position);
        
        // Normalize both positions to same distance to prevent zoom
        const currentDistance = startPosition.current.length();
        const targetDistance = cameraTargetRef.current.length();
        
        // Ensure target is at the same distance as current camera
        if (Math.abs(currentDistance - targetDistance) > 0.01) {
          cameraTargetRef.current.normalize().multiplyScalar(currentDistance);
        }
      }
      
      animationProgress.current += 0.05;
      
      // Smoothly interpolate using spherical interpolation to maintain distance
      const t = Math.min(animationProgress.current, 1);
      
      // Normalize vectors for spherical interpolation
      const start = startPosition.current.clone().normalize();
      const end = cameraTargetRef.current.clone().normalize();
      const distance = state.camera.position.length();
      
      // Spherical linear interpolation (slerp)
      const dot = start.dot(end);
      const theta = Math.acos(Math.max(-1, Math.min(1, dot)));
      
      if (theta > 0.001) {
        const sinTheta = Math.sin(theta);
        const a = Math.sin((1 - t) * theta) / sinTheta;
        const b = Math.sin(t * theta) / sinTheta;
        
        currentTarget.current.copy(start).multiplyScalar(a).addScaledVector(end, b);
      } else {
        currentTarget.current.copy(start);
      }
      
      // Scale back to original distance
      currentTarget.current.multiplyScalar(distance);
      
      // Apply to camera
      state.camera.position.copy(currentTarget.current);
      state.camera.lookAt(0, 0, 0);
      controls.update();
      
      // Stop animating when complete
      if (animationProgress.current >= 1) {
        isAnimating.current = false;
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      minDistance={1.2}
      maxDistance={6}
      enableDamping
    />
  );
}

function LoadingBox() {
  return (
    <Html center>
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        gap: "12px", pointerEvents: "none", userSelect: "none",
      }}>
        <div style={{ position: "relative", width: "52px", height: "52px" }}>
          <div style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            border: "2px solid rgba(255,255,255,0.07)",
          }} />
          <div
            className="animate-spin"
            style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              border: "2px solid transparent",
              borderTopColor: "#6366F1",
              borderRightColor: "rgba(99,102,241,0.25)",
            }}
          />
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

function Shirt({ model, editable, editingSide, selectedSide, cameraTargetRef, debugZones }) {
  const groupRef = useRef();
  const meshRef = useRef(null);

  // GLB geometry (Draco-compressed, decoded via useGLTF)
  const gltf = useGLTF(model.glb);

  // Load PBR texture maps if the model provides them, otherwise fall back to procedural cotton
  const diffuseMap = useMemo(() => {
    if (!model.maps?.diffuse) return null;
    const tex = new THREE.TextureLoader().load(model.maps.diffuse);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [model.maps?.diffuse]);

  const roughnessMap = useMemo(() => {
    if (!model.maps?.roughness) return null;
    const tex = new THREE.TextureLoader().load(model.maps.roughness);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, [model.maps?.roughness]);

  const metallicMap = useMemo(() => {
    if (!model.maps?.metallic) return null;
    const tex = new THREE.TextureLoader().load(model.maps.metallic);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, [model.maps?.metallic]);

  const externalNormalMap = useMemo(() => {
    if (!model.maps?.normal) return null;
    const tex = new THREE.TextureLoader().load(model.maps.normal);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, [model.maps?.normal]);

  // Procedural cotton weave normal map — generated once from a canvas,
  // no image file needed. Simulates the cross-section bump of warp/weft threads.
  const cottonNormalMap = useMemo(() => {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.createImageData(size, size);
    const d = imageData.data;
    const T = 5; // thread width in pixels
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const tx = Math.floor(x / T);
        const ty = Math.floor(y / T);
        const fx = (x % T) / T; // 0..1 within thread
        const fy = (y % T) / T;
        const isWarp = (tx + ty) % 2 === 0;
        // Thread cross-section: sinusoidal bump
        let nx = 0, ny = 0;
        if (isWarp) {
          nx = Math.sin((fx - 0.5) * Math.PI) * 0.35;
        } else {
          ny = Math.sin((fy - 0.5) * Math.PI) * 0.35;
        }
        const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
        const i = (y * size + x) * 4;
        d[i]     = Math.round((nx * 0.5 + 0.5) * 255);
        d[i + 1] = Math.round((ny * 0.5 + 0.5) * 255);
        d[i + 2] = Math.round(nz * 255);
        d[i + 3] = 255;
      }
    }
    ctx.putImageData(imageData, 0, 0);
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(50, 50); // fine cotton scale
    return tex;
  }, []);

  // Editor state
  const textureURLs = useEditorStore((s) => s.textureURLs);
  const textureVersion = useEditorStore((s) => s.textureVersion);
  const shirtColor = useEditorStore((s) => s.shirtColor);
  const setComposedDiffuseGetter = useEditorStore((s) => s.setComposedDiffuseGetter);
  const dropDecal = useEditorStore((s) => s.dropDecal);

  // No texture configuration needed - using plain cotton material

  // Decal uniforms — kept in a ref so we can mutate them in-place
  // without rebuilding the material (uniform updates are cheap; shader
  // recompiles are not).
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

  // Fabric material — MeshPhysicalMaterial with gentle sheen.
  // roughness 0.7: diffuse highlight visible when rotating but not shiny.
  // sheen 0.25: subtle retroreflective rim typical of woven fabric.
  // envMapIntensity 0.9: IBL contributes realistic indirect reflections.
  const bodyMaterial = useMemo(() => {
    const m = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(shirtColor),
      map: diffuseMap || null,
      roughness: roughnessMap ? 1.0 : 0.82,
      roughnessMap: roughnessMap || null,
      metalness: metallicMap ? 1.0 : 0.0,
      metalnessMap: metallicMap || null,
      envMapIntensity: 0.9,
      normalMap: cottonNormalMap,
      normalScale: new THREE.Vector2(0.45, 0.45),
      sheen: 0.25,
      sheenRoughness: 0.75,
      sheenColor: new THREE.Color(shirtColor),
    });
    m.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, decalUniforms);

      shader.vertexShader = shader.vertexShader
        .replace(
          "#include <common>",
          `#include <common>
varying vec3 vDecalLocalPos;
varying vec3 vDecalLocalNormal;`
        )
        .replace(
          "#include <begin_vertex>",
          `#include <begin_vertex>
vDecalLocalPos = position;
vDecalLocalNormal = normal;`
        );

      shader.fragmentShader = shader.fragmentShader
        .replace(
          "#include <common>",
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
  vec2 uv = vec2(u + 0.5, v + 0.5);
  vec4 c = sampleDecalTex(i, uv);
  c.a *= edge;
  return c;
}`
        )
        .replace(
          "#include <map_fragment>",
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

    if (uDecalFrameRGBA[i].a > 0.0) {
      vec3 d2 = vDecalLocalPos - uDecalAnchor[i];
      float u = dot(d2, uDecalAxisX[i]) / uDecalSize[i].x;
      float v = dot(d2, uDecalAxisY[i]) / uDecalSize[i].y;
      float facing = dot(surfN, uDecalAxisZ[i]);
      if (abs(u) <= 0.5 && abs(v) <= 0.5 && facing >= 0.05) {
        float edgeDist = 0.5 - max(abs(u), abs(v));
        float ring = smoothstep(0.018, 0.012, edgeDist) * (1.0 - smoothstep(0.0, 0.006, edgeDist));
        diffuseColor.rgb = mix(diffuseColor.rgb, uDecalFrameRGBA[i].rgb, ring * uDecalFrameRGBA[i].a);
      }
    }
  }
}`
        )
        .replace(
          "#include <emissivemap_fragment>",
          `#include <emissivemap_fragment>`
        );
    };
    // Force fresh shader compile when the material changes.
    m.customProgramCacheKey = () => "shirt-decal-physical-v3";
    return m;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shirtColor, cottonNormalMap, diffuseMap, roughnessMap, metallicMap]);

  useEffect(() => {
    bodyMaterial.color.set(shirtColor);
    bodyMaterial.sheenColor.set(shirtColor);
    bodyMaterial.needsUpdate = true;
  }, [bodyMaterial, shirtColor]);

  // Apply body material + capture the largest sub-mesh as the click
  // target.
  const cloned = useMemo(() => {
    const c = gltf.scene.clone(true);
    let best = null;
    let bestCount = 0;
    c.traverse((child) => {
      if (child.isMesh) {
        // Clone geometry so we don't mutate the cached original, then
        // (re)compute smooth vertex normals. obj2gltf drops normals when
        // the MTL is missing, so without this the custom lighting shader
        // sees zero normals and the mesh renders flat gray.
        child.geometry = child.geometry.clone();
        child.geometry.computeVertexNormals();
        child.material = bodyMaterial;
        const count = child.geometry?.attributes?.position?.count || 0;
        if (count > bestCount) {
          best = child;
          bestCount = count;
        }
      }
    });
    meshRef.current = best;
    return c;
  }, [gltf, bodyMaterial]);

  // Phase-2 baker not yet implemented — export still uses per-side
  // PNGs + decal manifest.
  useEffect(() => {
    setComposedDiffuseGetter(() => null);
    return () => setComposedDiffuseGetter(null);
  }, [setComposedDiffuseGetter]);

  // Resolve seed decals → concrete `{ point, normal, size, rotation }`.
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
          point: new THREE.Vector3(...seed.point),
          normal: new THREE.Vector3(...seed.normal).normalize(),
          size: seed.size || [0.3, 0.3],
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

  // Per-side decal textures. We re-load a fresh THREE.Texture every
  // time the data URL changes so colorspace + flipY are correct.
  const [decalTextures, setDecalTextures] = useState({});
  useEffect(() => {
    let cancelled = false;
    const updates = {};
    let pending = 0;
    SIDES.forEach((side) => {
      const url = textureURLs?.[side];
      if (!url) {
        updates[side] = null;
        return;
      }
      pending++;
      const loader = new THREE.TextureLoader();
      loader.load(url, (t) => {
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
    return () => {
      cancelled = true;
    };
  }, [textureURLs, textureVersion]);

  // Push decal data into the shader uniforms whenever resolved/textures
  // /editing state change.
  useEffect(() => {
    if (!resolved) return;
    const u = decalUniforms;
    SIDES.forEach((side, i) => {
      const r = resolved[side];
      const tex = decalTextures[side];
      const isFrameSide = (editable && side === editingSide) || debugZones;

      if (!r) {
        u.uDecalActive.value[i] = 0;
        u.uDecalFrameRGBA.value[i].set(0, 0, 0, 0);
        return;
      }

      // Build orthonormal basis around the surface normal, with user
      // rotation applied around it.
      const n = r.normal.clone().normalize();
      let up = new THREE.Vector3(0, 1, 0);
      if (Math.abs(up.dot(n)) > 0.95) up = new THREE.Vector3(1, 0, 0);
      const right = new THREE.Vector3().crossVectors(up, n).normalize();
      const trueUp = new THREE.Vector3().crossVectors(n, right).normalize();
      const rot = r.rotation || 0;
      const cs = Math.cos(rot);
      const sn = Math.sin(rot);
      const ax = right.clone().multiplyScalar(cs).addScaledVector(trueUp, sn);
      const ay = right.clone().multiplyScalar(-sn).addScaledVector(trueUp, cs);

      u.uDecalAnchor.value[i].copy(r.point);
      u.uDecalAxisX.value[i].copy(ax);
      u.uDecalAxisY.value[i].copy(ay);
      u.uDecalAxisZ.value[i].copy(n);
      u.uDecalSize.value[i].set(r.size[0] || 0.3, r.size[1] || 0.3);

      const slot = ["uDecalTex0", "uDecalTex1", "uDecalTex2"][i];
      u[slot].value = tex || null;
      // A side becomes "active" if it has a texture OR a frame to show.
      u.uDecalActive.value[i] = tex || isFrameSide ? 1 : 0;

      if (isFrameSide) {
        const c = new THREE.Color(SIDE_COLORS[side]);
        const alpha = debugZones ? 0.85 : 1.0;
        u.uDecalFrameRGBA.value[i].set(c.r, c.g, c.b, alpha);
      } else {
        u.uDecalFrameRGBA.value[i].set(0, 0, 0, 0);
      }
    });
  }, [resolved, decalTextures, editable, editingSide, debugZones, decalUniforms]);

  // Update camera target based on selected side's decal normal
  useEffect(() => {
    if (!resolved || !selectedSide || !cameraTargetRef) return;
    
    const r = resolved[selectedSide];
    if (!r) return;

    // Use the decal's normal to determine camera rotation direction
    // Keep the camera at a fixed distance from origin (no zoom)
    const normal = r.normal.clone().normalize();
    const distance = 2.6; // Fixed camera distance - no zoom
    
    // Position camera along the normal direction at fixed distance from origin
    // This ensures we only rotate, not zoom
    const cameraPos = normal.clone().multiplyScalar(distance);
    
    if (cameraTargetRef.current) {
      cameraTargetRef.current.copy(cameraPos);
    }
  }, [resolved, selectedSide, cameraTargetRef]);

  // Gentle idle motion (skip in editor mode to allow camera control).
  useFrame((state) => {
    if (!groupRef.current) return;
    // Only apply idle motion on non-editor pages (like product page)
    if (!editable && !selectedSide) {
      groupRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.3) * 0.12;
    }
  });

  // Click-to-place handler for /mash.
  const onShirtClick = (e) => {
    if (!editable || !editingSide) return;
    e.stopPropagation();
    const mesh = meshRef.current;
    if (!mesh) return;
    mesh.updateMatrixWorld(true);
    const localPoint = mesh.worldToLocal(e.point.clone());
    const localNormal =
      e.face?.normal?.clone().normalize() || new THREE.Vector3(0, 0, 1);
    dropDecal?.(editingSide, {
      point: [localPoint.x, localPoint.y, localPoint.z],
      normal: [localNormal.x, localNormal.y, localNormal.z],
    });
  };

  return (
    <group ref={groupRef}>
      <primitive
        object={cloned}
        onPointerDown={editable ? onShirtClick : undefined}
      />
    </group>
  );
}

// ---------------------------------------------------------------------------
// resolveSeed — turn a `{ axis, uv, size }` seed into a concrete
// `{ point, normal, size, rotation }` by raycasting from outside the
// bbox face into the mesh.
// ---------------------------------------------------------------------------
function resolveSeed(mesh, seed) {
  mesh.geometry.computeBoundingBox();
  const bb = mesh.geometry.boundingBox;
  const min = bb.min, max = bb.max;
  const sx = max.x - min.x, sy = max.y - min.y, sz = max.z - min.z;
  const cx = (min.x + max.x) / 2, cy = (min.y + max.y) / 2, cz = (min.z + max.z) / 2;
  const u = seed.uv?.[0] ?? 0.5;
  const v = seed.uv?.[1] ?? 0.5;
  const pad = Math.max(sx, sy, sz);
  let origin, dir;
  switch (seed.axis) {
    case "+z":
      origin = new THREE.Vector3(min.x + u * sx, min.y + v * sy, max.z + pad);
      dir = new THREE.Vector3(0, 0, -1);
      break;
    case "-z":
      origin = new THREE.Vector3(min.x + u * sx, min.y + v * sy, min.z - pad);
      dir = new THREE.Vector3(0, 0, 1);
      break;
    case "+x":
      origin = new THREE.Vector3(max.x + pad, min.y + v * sy, min.z + u * sz);
      dir = new THREE.Vector3(-1, 0, 0);
      break;
    case "-x":
      origin = new THREE.Vector3(min.x - pad, min.y + v * sy, min.z + u * sz);
      dir = new THREE.Vector3(1, 0, 0);
      break;
    case "+y":
      origin = new THREE.Vector3(min.x + u * sx, max.y + pad, min.z + v * sz);
      dir = new THREE.Vector3(0, -1, 0);
      break;
    case "-y":
      origin = new THREE.Vector3(min.x + u * sx, min.y - pad, min.z + v * sz);
      dir = new THREE.Vector3(0, 1, 0);
      break;
    default:
      origin = new THREE.Vector3(cx, cy, max.z + pad);
      dir = new THREE.Vector3(0, 0, -1);
  }

  // Object-space raycast (temporarily neutralize world matrix).
  const ray = new THREE.Raycaster(origin, dir.normalize(), 0, pad * 4);
  const savedMatrix = mesh.matrixWorld.clone();
  mesh.matrixWorld.identity();
  const hits = ray.intersectObject(mesh, false);
  mesh.matrixWorld.copy(savedMatrix);

  let point, normal;
  if (hits.length > 0) {
    point = hits[0].point.clone();
    normal = hits[0].face?.normal?.clone().normalize() || dir.clone().negate();
  } else {
    point = origin.clone().addScaledVector(dir, pad);
    normal = dir.clone().negate();
  }

  const sw = (seed.size?.[0] || 0.3) * Math.max(sx, sy, sz);
  const sh = (seed.size?.[1] || 0.3) * Math.max(sx, sy, sz);
  return {
    point,
    normal,
    size: [sw, sh],
    rotation: seed.rotation || 0,
  };
}
