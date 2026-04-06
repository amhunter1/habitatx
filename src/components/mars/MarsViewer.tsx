import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import marsGlbUrl from "../../../marsmodeli/24881_Mars_1_6792.glb?url";
import type { Region } from "../../types/mission";

const REGION_PIN_COORDINATES: Record<string, { longitude: number; latitude: number }> = {
  planum_boreum: { longitude: 0, latitude: 82 },
  arcadia_planitia: { longitude: 184, latitude: 47 },
  deuteronilus_mensae: { longitude: 25, latitude: 43 },
  elysium: { longitude: 0, latitude: 82 },
  arcadia: { longitude: 184, latitude: 47 },
  utopia: { longitude: 25, latitude: 43 }
};

function mapRegionToSpherePosition(region: Region, radius: number): THREE.Vector3 {
  const predefined = REGION_PIN_COORDINATES[region.id];
  const longitude = THREE.MathUtils.degToRad(
    predefined ? predefined.longitude : 150 - region.mapPositionX * 1.2
  );
  const latitude = THREE.MathUtils.degToRad(
    predefined ? predefined.latitude : 48 - region.mapPositionY * 0.95
  );
  const cosLat = Math.cos(latitude);

  return new THREE.Vector3(
    radius * cosLat * Math.cos(longitude),
    radius * Math.sin(latitude),
    radius * cosLat * Math.sin(longitude)
  );
}

function buildOrbitRing(radiusX: number, radiusY: number, color: string, opacity: number) {
  const points: THREE.Vector3[] = [];

  for (let index = 0; index < 128; index += 1) {
    const angle = (index / 128) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(angle) * radiusX, 0, Math.sin(angle) * radiusY));
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity
  });

  return new THREE.LineLoop(geometry, material);
}

function buildStarField(starCount: number, radiusRange: [number, number], size: number, color: string) {
  const positions = new Float32Array(starCount * 3);

  for (let index = 0; index < starCount; index += 1) {
    const radius = THREE.MathUtils.randFloat(radiusRange[0], radiusRange[1]);
    const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
    const phi = Math.acos(THREE.MathUtils.randFloatSpread(2));
    const offset = index * 3;

    positions[offset] = radius * Math.sin(phi) * Math.cos(theta);
    positions[offset + 1] = radius * Math.cos(phi);
    positions[offset + 2] = radius * Math.sin(phi) * Math.sin(theta);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color,
    size,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.82
  });

  return new THREE.Points(geometry, material);
}

function buildNebulaShell(radius: number, color: string, opacity: number, scale: [number, number, number]) {
  const geometry = new THREE.SphereGeometry(radius, 48, 48);
  const material = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity,
    side: THREE.BackSide
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.scale.set(scale[0], scale[1], scale[2]);
  return mesh;
}

export function MarsViewer({
  regions,
  selectedRegionId,
  onSelect
}: {
  regions: Region[];
  selectedRegionId: string;
  onSelect: (id: string) => void;
}) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const buttonRefs = useRef(new Map<string, HTMLButtonElement>());
  const selectedRegionRef = useRef(selectedRegionId);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    selectedRegionRef.current = selectedRegionId;
  }, [selectedRegionId]);

  useEffect(() => {
    const host = hostRef.current;
    const overlay = overlayRef.current;
    if (!host || !overlay) {
      return;
    }

    setIsLoading(true);
    setError(null);

    let frameId = 0;
    let disposed = false;
    let controls: OrbitControls | null = null;
    let resizeObserver: ResizeObserver | null = null;

    const scene = new THREE.Scene();
    scene.background = null;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.domElement.className = "mars-viewer-canvas";
    host.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0.3, 3.3);

    scene.add(new THREE.AmbientLight(0xffffff, 1.95));

    const directionalLight = new THREE.DirectionalLight(0xffeedf, 3);
    directionalLight.position.set(4, 3, 5);
    scene.add(directionalLight);

    const fillLight = new THREE.DirectionalLight(0xc97758, 1.4);
    fillLight.position.set(-3, -1, -2);
    scene.add(fillLight);

    const backLight = new THREE.PointLight(0x7e8ef7, 1.1, 25);
    backLight.position.set(-6, 1.8, -7);
    scene.add(backLight);

    const starFields = [
      buildStarField(1300, [8, 14], 0.042, "#fff4ea"),
      buildStarField(600, [14, 20], 0.055, "#b9cbff")
    ];
    starFields.forEach((field) => scene.add(field));

    const nebulaShells = [
      buildNebulaShell(9.8, "#422235", 0.18, [1.35, 0.82, 1.12]),
      buildNebulaShell(12.5, "#18274b", 0.12, [1.05, 1.2, 0.9])
    ];
    nebulaShells.forEach((shell) => scene.add(shell));

    const planetGroup = new THREE.Group();
    planetGroup.rotation.set(0.22, 0.2, 0);
    scene.add(planetGroup);

    const equatorRing = buildOrbitRing(1.95, 1.95, "#f7d7c4", 0.16);
    planetGroup.add(equatorRing);

    const verticalRing = buildOrbitRing(1.95, 1.95, "#d2a187", 0.14);
    verticalRing.rotation.x = Math.PI / 2;
    planetGroup.add(verticalRing);

    const tiltedRing = buildOrbitRing(2.08, 1.82, "#7d8cff", 0.12);
    tiltedRing.rotation.set(Math.PI / 2.55, 0.22, 0.18);
    planetGroup.add(tiltedRing);

    const regionAnchorGroup = new THREE.Group();
    planetGroup.add(regionAnchorGroup);

    const regionMarkers = regions.map((region) => ({
      id: region.id,
      anchor: mapRegionToSpherePosition(region, 0.92)
    }));

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.045;
    controls.enablePan = false;
    controls.minDistance = 1.6;
    controls.maxDistance = 5;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.82;
    controls.target.set(0, 0, 0);
    controls.update();

    const resize = () => {
      const { clientWidth, clientHeight } = host;
      if (!clientWidth || !clientHeight) {
        return;
      }
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight, false);
    };

    resizeObserver = new ResizeObserver(() => {
      resize();
    });
    resizeObserver.observe(host);
    resize();

    const loader = new GLTFLoader();
    let marsRoot: THREE.Object3D | null = null;

    loader.load(
      marsGlbUrl,
      (gltf) => {
        if (disposed) {
          return;
        }

        marsRoot = gltf.scene;
        const box = new THREE.Box3().setFromObject(marsRoot);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        marsRoot.position.sub(center);
        const maxAxis = Math.max(size.x, size.y, size.z);
        const scale = maxAxis > 0 ? 1.8 / maxAxis : 1;
        marsRoot.scale.setScalar(scale);

        marsRoot.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = false;
            child.receiveShadow = false;
            if (Array.isArray(child.material)) {
              child.material.forEach((material) => {
                material.needsUpdate = true;
              });
            } else if (child.material) {
              child.material.needsUpdate = true;
            }
          }
        });

        planetGroup.add(marsRoot);
        setIsLoading(false);
      },
      undefined,
      () => {
        if (disposed) {
          return;
        }
        setError("Mars 3D modeli yüklenemedi.");
        setIsLoading(false);
      }
    );

    const projected = new THREE.Vector3();
    const worldAnchor = new THREE.Vector3();
    const cameraDirection = new THREE.Vector3();
    const anchorNormal = new THREE.Vector3();

    const updatePins = () => {
      const width = overlay.clientWidth;
      const height = overlay.clientHeight;
      cameraDirection.copy(camera.position).normalize();

      regionMarkers.forEach((marker) => {
        const button = buttonRefs.current.get(marker.id);
        if (!button) {
          return;
        }

        worldAnchor.copy(marker.anchor);
        regionAnchorGroup.localToWorld(worldAnchor);
        projected.copy(worldAnchor).project(camera);
        anchorNormal.copy(worldAnchor).normalize();
        const isFrontFacing = anchorNormal.dot(cameraDirection) > 0.04;
        const onScreen = projected.z > -1 && projected.z < 1.02;
        const x = (projected.x * 0.5 + 0.5) * width;
        const y = (-projected.y * 0.5 + 0.5) * height;
        const visible = isFrontFacing && onScreen;
        const isSelected = marker.id === selectedRegionRef.current;

        button.style.left = `${x}px`;
        button.style.top = `${y}px`;
        button.style.opacity = visible ? "1" : "0";
        button.style.pointerEvents = visible ? "auto" : "none";
        button.style.transform = `translate(-50%, -50%) scale(${isSelected ? 1.05 : 0.92})`;
      });
    };

    const animate = () => {
      if (disposed) {
        return;
      }

      starFields[1].rotation.y += 0.0006;
      nebulaShells[0].rotation.y += 0.0007;
      nebulaShells[1].rotation.x += 0.0003;
      controls?.update();
      updatePins();
      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(animate);
    };
    animate();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frameId);
      resizeObserver?.disconnect();
      controls?.dispose();

      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) {
          return;
        }

        object.geometry.dispose();
        if (Array.isArray(object.material)) {
          object.material.forEach((material) => material.dispose());
        } else {
          object.material.dispose();
        }
      });

      planetGroup.traverse((object) => {
        if (object instanceof THREE.Line) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });

      renderer.dispose();
      if (renderer.domElement.parentNode === host) {
        host.removeChild(renderer.domElement);
      }
      if (marsRoot) {
        planetGroup.remove(marsRoot);
      }
      starFields.forEach((field) => {
        scene.remove(field);
        field.geometry.dispose();
        if (Array.isArray(field.material)) {
          field.material.forEach((material) => material.dispose());
        } else {
          field.material.dispose();
        }
      });
    };
  }, [regions]);

  return (
    <div className="mars-viewer-stage">
      <div ref={hostRef} className="mars-viewer-host" />
      <div ref={overlayRef} className="mars-viewer-pin-overlay">
        {regions.map((region) => (
          <button
            key={region.id}
            ref={(node) => {
              if (node) {
                buttonRefs.current.set(region.id, node);
              } else {
                buttonRefs.current.delete(region.id);
              }
            }}
            className={`region-pin ${selectedRegionId === region.id ? "selected" : ""}`}
            onClick={() => onSelect(region.id)}
            type="button"
          >
            {region.ad}
          </button>
        ))}
      </div>
      {isLoading ? (
        <div className="mars-viewer-status">
          <strong>Yükleniyor</strong>
          <span>Mars 3D modeli hazırlanıyor...</span>
        </div>
      ) : null}
      {error ? (
        <div className="mars-viewer-status mars-viewer-status-error">
          <strong>3D görünüm hatası</strong>
          <span>{error}</span>
        </div>
      ) : null}
    </div>
  );
}
