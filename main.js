import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// レンダラーの設定
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);

// シーンの設定
const scene = new THREE.Scene();

// カメラの設定
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  1000
);
camera.position.set(4, 5, 11);

// カメラコントロールの設定
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 5;
controls.maxDistance = 0.5; // maxDistanceの値を修正
controls.minPolarAngle = 0.5;
controls.maxPolarAngle = 1.5;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.3;
controls.target.set(0, 0.5, -0.8);
controls.update();

// 地面の設定
const groundGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
groundGeometry.rotateX(-Math.PI / 2);
const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0x555555,
  side: THREE.DoubleSide,
});
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.receiveShadow = true;
scene.add(groundMesh);

// 照明の設定
const light = new THREE.PointLight(0x0000ff, 2, 50, 1.0);
scene.add(light);
light.position.set(-1, 0, 0);

const secondLight = new THREE.PointLight(0xdc143c, 2, 50, 1.0);
scene.add(secondLight);
secondLight.position.set(1, 0, 0);

const thirdLight = new THREE.PointLight(0x228b22, 6, 50, 1.0);
scene.add(thirdLight);
thirdLight.position.set(1, 1, 1);

// モデルの読み込み
const loader = new GLTFLoader().setPath("tatung_einstein_tc-01");
loader.load(
  "scene.gltf",
  (gltf) => {
    const mesh = gltf.scene;
    mesh.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    mesh.position.set(0, 0.07, 0);
    scene.add(mesh);
    document.getElementById("progress-container").style.display = "none";
  },
  (xhr) => {
    console.log(`loading ${(xhr.loaded / xhr.total) * 100}%`);
  },
  (error) => {
    console.error(error);
  }
);

// ウィンドウリサイズ対応
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// アニメーションループ
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();
