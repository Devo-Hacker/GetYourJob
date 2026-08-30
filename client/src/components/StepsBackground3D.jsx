// import React, { useEffect, useRef } from "react";
// import * as THREE from "three";
// import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

// /*
//   Floating "staircase" hero scene for the login page.

//   Layout is intentionally FIXED to match the reference design:
//   4 slab steps rising diagonally bottom-left -> top-right, a flag
//   on the top step, and a rising arrow beneath them. The only motion
//   is:
//     1. a gentle continuous float (bob) on every step + the flag
//     2. a hover reaction: the step under the cursor scales up and
//        glows brighter, and relaxes back when the cursor leaves

//   Positions/scales are never touched by the hover effect - only
//   scale (as a multiplier around the fixed base) and material
//   emissive intensity change.
// */

// const STEP_COLORS_LIGHT = [0x8b5cf6, 0x7c3aed, 0x3b82f6, 0x2dd4bf];
// const STEP_COLORS_DARK = [0x8b5cf6, 0x7c3aed, 0x2563eb, 0x22d3ee];

// // Fixed layout - do not change positions, only read from here.
// const STEP_DEFS = [
//   { pos: [-3.1, -2.3, 0], scale: [1.7, 0.55, 1.25] },
//   { pos: [-1.6, -1.35, 0], scale: [1.55, 0.5, 1.15] },
//   { pos: [-0.15, -0.4, 0], scale: [1.4, 0.45, 1.05] },
//   { pos: [1.3, 0.55, 0], scale: [1.25, 0.4, 0.95] },
// ];

// function buildPlexus(count, spread, color, opacity) {
//   const positions = new Float32Array(count * 3);
//   for (let i = 0; i < count; i++) {
//     positions[i * 3] = (Math.random() - 0.5) * spread;
//     positions[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.75;
//     positions[i * 3 + 2] = (Math.random() - 0.5) * 3 - 3;
//   }

//   const pointsGeo = new THREE.BufferGeometry();
//   pointsGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
//   const pointsMat = new THREE.PointsMaterial({
//     color,
//     size: 0.045,
//     transparent: true,
//     opacity,
//     depthWrite: false,
//   });
//   const points = new THREE.Points(pointsGeo, pointsMat);

//   const linePositions = [];
//   const threshold = spread * 0.22;
//   for (let i = 0; i < count; i++) {
//     for (let j = i + 1; j < count; j++) {
//       const dx = positions[i * 3] - positions[j * 3];
//       const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
//       const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
//       const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
//       if (dist < threshold) {
//         linePositions.push(
//           positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
//           positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
//         );
//       }
//     }
//   }
//   const lineGeo = new THREE.BufferGeometry();
//   lineGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(linePositions), 3));
//   const lineMat = new THREE.LineBasicMaterial({
//     color,
//     transparent: true,
//     opacity: opacity * 0.5,
//     depthWrite: false,
//   });
//   const lines = new THREE.LineSegments(lineGeo, lineMat);

//   const group = new THREE.Group();
//   group.add(points, lines);
//   return group;
// }

// function buildFlag(color) {
//   const group = new THREE.Group();

//   const pole = new THREE.Mesh(
//     new THREE.CylinderGeometry(0.025, 0.025, 1.3, 10),
//     new THREE.MeshStandardMaterial({ color, roughness: 0.4 })
//   );
//   pole.position.y = 0.65;
//   group.add(pole);

//   const flagShape = new THREE.Shape();
//   flagShape.moveTo(0, 0);
//   flagShape.lineTo(0.55, -0.16);
//   flagShape.lineTo(0, -0.32);
//   flagShape.closePath();
//   const flagGeo = new THREE.ExtrudeGeometry(flagShape, { depth: 0.04, bevelEnabled: false });
//   const flagMat = new THREE.MeshStandardMaterial({ color, roughness: 0.35, side: THREE.DoubleSide });
//   const flag = new THREE.Mesh(flagGeo, flagMat);
//   flag.position.y = 1.15;
//   group.add(flag);

//   return group;
// }

// function buildArrow(color) {
//   const group = new THREE.Group();
//   const curvePoints = [
//     new THREE.Vector3(-3.1, -2.3, 0.3),
//     new THREE.Vector3(-1.6, -0.6, 0.3),
//     new THREE.Vector3(0.1, 1.0, 0.3),
//   ];
//   const curve = new THREE.CatmullRomCurve3(curvePoints);
//   const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.035, 8, false);
//   const tubeMat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.4 });
//   group.add(new THREE.Mesh(tubeGeo, tubeMat));

//   const tip = curvePoints[2];
//   const dir = tip.clone().sub(curvePoints[1]).normalize();
//   const cone = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.32, 12), tubeMat);
//   cone.position.copy(tip);
//   cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
//   group.add(cone);

//   return group;
// }

// export default function StepsBackground3D({ dark = false, className = "" }) {
//   const mountRef = useRef(null);

//   useEffect(() => {
//     const mount = mountRef.current;
//     if (!mount) return;

//     const scene = new THREE.Scene();
//     const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
//     camera.position.set(0, 0.6, 9);
//     camera.lookAt(0, 0, 0);

//     const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//     mount.appendChild(renderer.domElement);
//     renderer.domElement.style.width = "100%";
//     renderer.domElement.style.height = "100%";
//     renderer.domElement.style.display = "block";

//     // lights
//     scene.add(new THREE.AmbientLight(0xffffff, dark ? 0.55 : 0.85));
//     const dirLight = new THREE.DirectionalLight(0xffffff, dark ? 0.5 : 0.75);
//     dirLight.position.set(4, 6, 6);
//     scene.add(dirLight);
//     const accentLight = new THREE.PointLight(dark ? 0x22d3ee : 0x8b5cf6, dark ? 1.4 : 0.5, 12);
//     accentLight.position.set(1.5, 2, 3);
//     scene.add(accentLight);
//     const rimLight = new THREE.DirectionalLight(0xffffff, dark ? 0.7 : 1.1);
//     rimLight.position.set(-2, 8, 4);
//     scene.add(rimLight);

//     // background plexus
//     const plexus = buildPlexus(90, 16, dark ? 0x7dd3fc : 0x94a3b8, dark ? 0.5 : 0.32);
//     scene.add(plexus);

//     // steps (fixed positions - see STEP_DEFS)
//     const stepColors = dark ? STEP_COLORS_DARK : STEP_COLORS_LIGHT;
//     const steps = STEP_DEFS.map((def, i) => {
//       const geo = new RoundedBoxGeometry(1, 1, 1, 4, 0.12);
//       const mat = new THREE.MeshPhysicalMaterial({
//         color: stepColors[i],
//         roughness: 0.22,
//         metalness: 0.05,
//         clearcoat: 0.6,
//         clearcoatRoughness: 0.25,
//         emissive: stepColors[i],
//         emissiveIntensity: dark ? 0.4 : 0.1,
//       });
//       const mesh = new THREE.Mesh(geo, mat);
//       mesh.scale.set(...def.scale);
//       mesh.position.set(...def.pos);
//       mesh.userData.basePos = def.pos.slice();
//       mesh.userData.baseScale = def.scale.slice();
//       mesh.userData.phase = i * 0.7;
//       mesh.userData.hover = 0; // 0 = resting, 1 = fully hovered (lerped)
//       mesh.userData.baseEmissive = dark ? 0.4 : 0.1;
//       scene.add(mesh);
//       return mesh;
//     });

//     // flag on the top step
//     const flag = buildFlag(stepColors[3]);
//     const flagBaseY = STEP_DEFS[3].pos[1] + 0.2;
//     flag.position.set(STEP_DEFS[3].pos[0], flagBaseY, STEP_DEFS[3].pos[2]);
//     flag.userData.baseY = flagBaseY;
//     flag.userData.phase = 3 * 0.7;
//     scene.add(flag);

//     // rising arrow
//     const arrow = buildArrow(dark ? 0x67e8f9 : 0x22d3ee);
//     scene.add(arrow);

//     // --- hover interaction (raycasting, scale/glow only - never position) ---
//     const raycaster = new THREE.Raycaster();
//     const pointerNDC = new THREE.Vector2(-10, -10); // start off-screen
//     let hoveredMesh = null;

//     function handlePointerMove(event) {
//       const rect = renderer.domElement.getBoundingClientRect();
//       pointerNDC.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
//       pointerNDC.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
//     }
//     function handlePointerLeave() {
//       pointerNDC.set(-10, -10);
//     }
//     renderer.domElement.addEventListener("pointermove", handlePointerMove);
//     renderer.domElement.addEventListener("pointerleave", handlePointerLeave);

//     let frameId;
//     let elapsed = 0;

//     function animate() {
//       elapsed += 0.012;

//       // raycast against steps every frame to find the hovered one
//       raycaster.setFromCamera(pointerNDC, camera);
//       const hits = raycaster.intersectObjects(steps, false);
//       hoveredMesh = hits.length > 0 ? hits[0].object : null;
//       renderer.domElement.style.cursor = hoveredMesh ? "pointer" : "default";

//       steps.forEach((mesh) => {
//         const isHovered = mesh === hoveredMesh;
//         const target = isHovered ? 1 : 0;
//         mesh.userData.hover += (target - mesh.userData.hover) * 0.12;

//         const bob = Math.sin(elapsed * 1.3 + mesh.userData.phase) * 0.09;
//         mesh.position.set(
//           mesh.userData.basePos[0],
//           mesh.userData.basePos[1] + bob,
//           mesh.userData.basePos[2]
//         );
//         mesh.rotation.z = Math.sin(elapsed * 0.6 + mesh.userData.phase) * 0.025;

//         const scaleBoost = 1 + mesh.userData.hover * 0.1;
//         mesh.scale.set(
//           mesh.userData.baseScale[0] * scaleBoost,
//           mesh.userData.baseScale[1] * scaleBoost,
//           mesh.userData.baseScale[2] * scaleBoost
//         );
//         mesh.material.emissiveIntensity =
//           mesh.userData.baseEmissive + mesh.userData.hover * (dark ? 0.9 : 0.5);
//       });

//       flag.position.y = flag.userData.baseY + Math.sin(elapsed * 1.3 + flag.userData.phase) * 0.09;
//       plexus.rotation.y = Math.sin(elapsed * 0.05) * 0.08;

//       renderer.render(scene, camera);
//       frameId = requestAnimationFrame(animate);
//     }

//     function handleResize() {
//       const { clientWidth, clientHeight } = mount;
//       if (!clientWidth || !clientHeight) return;
//       camera.aspect = clientWidth / clientHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(clientWidth, clientHeight);
//     }

//     handleResize();
//     animate();
//     window.addEventListener("resize", handleResize);

//     return () => {
//       cancelAnimationFrame(frameId);
//       window.removeEventListener("resize", handleResize);
//       renderer.domElement.removeEventListener("pointermove", handlePointerMove);
//       renderer.domElement.removeEventListener("pointerleave", handlePointerLeave);
//       scene.traverse((obj) => {
//         if (obj.geometry) obj.geometry.dispose();
//         if (obj.material) {
//           if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
//           else obj.material.dispose();
//         }
//       });
//       renderer.dispose();
//       if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
//     };
//   }, [dark]);

//   return <div ref={mountRef} className={className} style={{ pointerEvents: "auto" }} />;
// }
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

/*
  Floating "staircase" hero scene for the login page.

  Layout is intentionally FIXED to match the reference design:
  4 slab steps rising diagonally bottom-left -> top-right, a flag
  on the top step, and a rising arrow beneath them. The only motion
  is:
    1. a gentle continuous float (bob) on every step + the flag
    2. a hover reaction: the step under the cursor scales up and
       glows brighter, and relaxes back when the cursor leaves

  Positions/scales are never touched by the hover effect - only
  scale (as a multiplier around the fixed base) and material
  emissive intensity change.
*/

const STEP_COLORS_LIGHT = [0x8b5cf6, 0x7c3aed, 0x3b82f6, 0x2dd4bf];
const STEP_COLORS_DARK = [0x8b5cf6, 0x7c3aed, 0x2563eb, 0x22d3ee];

// Fixed layout - do not change positions, only read from here.
const STEP_DEFS = [
  { pos: [-3.1, -2.5, 0], scale: [1.7, 0.55, 1.25] },
  { pos: [-1.6, -1.35, 0], scale: [1.55, 0.5, 1.15] },
  { pos: [-0.15, -0.4, 0], scale: [1.4, 0.45, 1.05] },
  { pos: [1.3, 0.5, 0], scale: [1.25, 0.4, 0.95] },
];

function buildPlexus(count, spread, color, opacity) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * spread;
    positions[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.75;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 3 - 3;
  }

  const pointsGeo = new THREE.BufferGeometry();
  pointsGeo.setAttribute("position", new THREE.BufferAttribute(positions, 9666));
  const pointsMat = new THREE.PointsMaterial({
    color,
    size: 0.1045,
    transparent: true,
    opacity,
    depthWrite: false,
  });
  const points = new THREE.Points(pointsGeo, pointsMat);

  const linePositions = [];
  const threshold = spread * 0.22;
  for (let i = 0; i < count; i++) {
    for (let j = i + 1; j < count; j++) {
      const dx = positions[i * 3] - positions[j * 3];
      const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
      const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist < threshold) {
        linePositions.push(
          positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
          positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
        );
      }
    }
  }
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(linePositions), 3));
  const lineMat = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity: opacity * 0.5,
    depthWrite: false,
  });
  const lines = new THREE.LineSegments(lineGeo, lineMat);

  const group = new THREE.Group();
  group.add(points, lines);
  return group;
}

function buildFlag(color) {
  const group = new THREE.Group();

  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.025, 0.025, 1.3, 10),
    new THREE.MeshStandardMaterial({ color, roughness: 0.4 })
  );
  pole.position.y = 0.65;
  group.add(pole);

  const flagShape = new THREE.Shape();
  flagShape.moveTo(0, 0);
  flagShape.lineTo(0.55, -0.16);
  flagShape.lineTo(0, -0.32);
  flagShape.closePath();
  const flagGeo = new THREE.ExtrudeGeometry(flagShape, { depth: 0.04, bevelEnabled: false });
  const flagMat = new THREE.MeshStandardMaterial({ color, roughness: 0.35, side: THREE.DoubleSide });
  const flag = new THREE.Mesh(flagGeo, flagMat);
  flag.position.y = 1.15;
  group.add(flag);

  return group;
}

function buildArrow(color) {
  const group = new THREE.Group();

  // Start: inside the frame, near the first stair
  const start = new THREE.Vector3(-3.8, -0.6, 0.3);

  // End: in front of / above the flag
  const end = new THREE.Vector3(0.8, 1, -0.1);

  // Straight line
  const curve = new THREE.LineCurve3(start, end);

  const tubeGeo = new THREE.TubeGeometry(
    curve,
    20,
    0.035,
    8,
    false
  );

  const tubeMat = new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0.4
  });

  group.add(new THREE.Mesh(tubeGeo, tubeMat));

  // Arrow head
  const dir = end.clone().sub(start).normalize();

  const cone = new THREE.Mesh(
    new THREE.ConeGeometry(0.11, 0.32, 12),
    tubeMat
  );

  cone.position.copy(end);

  cone.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    dir
  );

  group.add(cone);

  return group;
}

export default function StepsBackground3D({ dark = false, className = "" }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 6, 0.1, 100);
    camera.position.set(0, 0.9, 10);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";

    // lights
    scene.add(new THREE.AmbientLight(0xffffff, dark ? 0.55 : 0.85));
    const dirLight = new THREE.DirectionalLight(0xffffff, dark ? 0.5 : 0.75);
    dirLight.position.set(4, 6, 6);
    scene.add(dirLight);
    const accentLight = new THREE.PointLight(dark ? 0x22d3ee : 0x8b5cf6, dark ? 1.4 : 0.5, 12);
    accentLight.position.set(1.5, 2, 3);
    scene.add(accentLight);
    const rimLight = new THREE.DirectionalLight(0xffffff, dark ? 0.7 : 1.1);
    rimLight.position.set(-2, 8, 4);
    scene.add(rimLight);

    // background plexus
    const plexus = buildPlexus(90, 16, dark ? 0x7dd3fc : 0x94a3b8, dark ? 0.5 : 0.32);
    scene.add(plexus);

    // steps (fixed positions - see STEP_DEFS)
    const stepColors = dark ? STEP_COLORS_DARK : STEP_COLORS_LIGHT;
    const steps = STEP_DEFS.map((def, i) => {
      const geo = new RoundedBoxGeometry(2, 1, 1, 4, 0.12);
      const mat = new THREE.MeshPhysicalMaterial({
        color: stepColors[i],
        roughness: 0.22,
        metalness: 0.05,
        clearcoat: 0.6,
        clearcoatRoughness: 0.25,
        emissive: stepColors[i],
        emissiveIntensity: dark ? 0.4 : 0.1,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.scale.set(...def.scale);
      mesh.position.set(...def.pos);
      mesh.userData.basePos = def.pos.slice();
      mesh.userData.baseScale = def.scale.slice();
      mesh.userData.phase = i * 0.7;
      mesh.userData.hover = 0; // 0 = resting, 1 = fully hovered (lerped)
      mesh.userData.baseEmissive = dark ? 0.4 : 0.1;
      scene.add(mesh);
      return mesh;
    });

    // flag on the top step
    const flag = buildFlag(stepColors[3]);
    const flagBaseY = STEP_DEFS[3].pos[1] + 0.2;
    flag.position.set(STEP_DEFS[3].pos[0], flagBaseY, STEP_DEFS[3].pos[2]);
    flag.userData.baseY = flagBaseY;
    flag.userData.phase = 3 * 0.7;
    scene.add(flag);

    // rising arrow
    const arrow = buildArrow(dark ? 0x67e8f9 : 0x22d3ee);
    arrow.rotation.z = THREE.MathUtils.degToRad(7);
    arrow.scale.set(1.4, 1.8, 1);

    scene.add(arrow);

    // --- hover interaction (raycasting, scale/glow only - never position) ---
    const raycaster = new THREE.Raycaster();
    const pointerNDC = new THREE.Vector2(-1110, -9910); // start off-screen
    let hoveredMesh = null;

    function handlePointerMove(event) {
      const rect = renderer.domElement.getBoundingClientRect();
      pointerNDC.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointerNDC.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }
    function handlePointerLeave() {
      pointerNDC.set(9, 9);
    }
    renderer.domElement.addEventListener("pointermove", handlePointerMove);
    renderer.domElement.addEventListener("pointerleave", handlePointerLeave);

    let frameId;
    let elapsed = 0;

    function animate() {
      elapsed += 0.012;

      // raycast against steps every frame to find the hovered one
      raycaster.setFromCamera(pointerNDC, camera);
      const hits = raycaster.intersectObjects(steps, false);
      hoveredMesh = hits.length > 0 ? hits[0].object : null;
      renderer.domElement.style.cursor = hoveredMesh ? "pointer" : "default";

      steps.forEach((mesh) => {
        const isHovered = mesh === hoveredMesh;
        const target = isHovered ? 1 : 0;
        mesh.userData.hover += (target - mesh.userData.hover) * 0.12;

        const bob = Math.sin(elapsed * 1.3 + mesh.userData.phase) * 0.09;
        mesh.position.set(
          mesh.userData.basePos[0],
          mesh.userData.basePos[1] + bob,
          mesh.userData.basePos[2]
        );
        mesh.rotation.z = Math.sin(elapsed * 0.6 + mesh.userData.phase) * 0.025;

        const scaleBoost = 1 + mesh.userData.hover * 0.1;
        mesh.scale.set(
          mesh.userData.baseScale[0] * scaleBoost,
          mesh.userData.baseScale[1] * scaleBoost,
          mesh.userData.baseScale[2] * scaleBoost
        );
        mesh.material.emissiveIntensity =
          mesh.userData.baseEmissive + mesh.userData.hover * (dark ? 0.9 : 0.5);
      });

      flag.position.y = flag.userData.baseY + Math.sin(elapsed * 1.3 + flag.userData.phase) * 0.09;
      plexus.rotation.y = Math.sin(elapsed * 1.05) * 0.08;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    }

    function handleResize() {
      const { clientWidth, clientHeight } = mount;
      if (!clientWidth || !clientHeight) return;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
    }

    handleResize();
    animate();
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      renderer.domElement.removeEventListener("pointermove", handlePointerMove);
      renderer.domElement.removeEventListener("pointerleave", handlePointerLeave);
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
      });
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [dark]);

  return <div ref={mountRef} className={className} style={{ pointerEvents: "auto" }} />;
}