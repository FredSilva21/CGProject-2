import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
//Scene
const scene = new THREE.Scene();

//Camera
const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(-40, 10, 10);
camera.lookAt(scene.position); //point the camera to the center of the scene

// Texture
const textureLoader = new THREE.TextureLoader();
const floorTexture = textureLoader.load("./assets/sand.jpeg");

// Material para o chão
const floorMaterial = new THREE.MeshBasicMaterial({
  map: floorTexture,
  side: THREE.DoubleSide,
});

// Geometria para o chão (plano)
const floorGeometry = new THREE.PlaneGeometry(100, 100); // Ajuste o tamanho conforme necessário

// Crie o plano (chão)
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = Math.PI / 2; // Rotação para que o plano fique no chão
scene.add(floor);

//Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor("#000000");
document.body.appendChild(renderer.domElement);

//Controls
const controls = new OrbitControls(camera, renderer.domElement);

// Pivot (Point of Pivot)
const pivot = new THREE.Object3D();
scene.add(pivot);

// Base
const cubeGeometry = new THREE.BoxGeometry(8, 2, 4);
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(1, 2, 4);
pivot.add(cube);

// Wheel 1L
const cylinderGeometry = new THREE.CylinderGeometry(1, 1, 1, 6);
// Texture for the wheel
const wheelTexture = textureLoader.load("./assets/wheel.svg"); // Substitua com o caminho correto para sua textura de roda

// Material for the wheel
const wheelMaterial = new THREE.MeshBasicMaterial({ map: wheelTexture });
const cylinder1 = new THREE.Mesh(cylinderGeometry, wheelMaterial);
cylinder1.position.set(3.5, 1.5, 2);
cylinder1.rotation.x = Math.PI / 2;
pivot.add(cylinder1);

// Wheel 2L
const cylinder2 = new THREE.Mesh(cylinderGeometry, wheelMaterial);
cylinder2.position.set(-1.5, 1.5, 2);
cylinder2.rotation.x = Math.PI / 2;
pivot.add(cylinder2);

// Wheel 1R
const cylinder3 = new THREE.Mesh(cylinderGeometry, wheelMaterial);
cylinder3.position.set(-1.5, 1.5, 6);
cylinder3.rotation.x = Math.PI / 2;
pivot.add(cylinder3);

// Wheel 2R
const cylinder4 = new THREE.Mesh(cylinderGeometry, wheelMaterial);
cylinder4.position.set(3.5, 1.5, 6);
cylinder4.rotation.x = Math.PI / 2;
pivot.add(cylinder4);

//Man Platform
const cubeGeometry2 = new THREE.BoxGeometry(3.5, 2, 3);
const cubeMaterial2 = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const cube2 = new THREE.Mesh(cubeGeometry2, cubeMaterial2);
cube2.position.set(2, 2, 0);
cube.add(cube2);

//Arm Platform
const cubeGeometry3 = new THREE.BoxGeometry(3.5, 1, 3);
const cubeMaterial3 = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const cube3 = new THREE.Mesh(cubeGeometry3, cubeMaterial3);
cube3.position.set(-2, 1, 0);
cube.add(cube3);

//Arm Stand
const cubeGeometry4 = new THREE.BoxGeometry(1, 6, 1);
const cubeMaterial4 = new THREE.MeshBasicMaterial({ color: 0xffffff });
const cube4 = new THREE.Mesh(cubeGeometry4, cubeMaterial4);
cube4.position.set(-2, 4, 0);
cube.add(cube4);

//Pivot Arm
const pivotArm = new THREE.Object3D();
cube4.add(pivotArm);

//Arm
const cubeGeometry5 = new THREE.BoxGeometry(1, 6, 1);
const cubeMaterial5 = new THREE.MeshBasicMaterial({ color: 0xffffff });
const cube5 = new THREE.Mesh(cubeGeometry5, cubeMaterial5);
cube5.position.set(-3, 4.75, 0);
cube5.rotation.set(0, 0, Math.PI / 3);
pivotArm.add(cube5);

//Cable
const cableGeometry = new THREE.CylinderGeometry(0.2, 0.2, 6, 16);
const cableMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });
const cable = new THREE.Mesh(cableGeometry, cableMaterial);
cable.position.set(-5, 3, 0); // Ajusta a posição em relação ao braço
pivotArm.add(cable);

//Sphere
const sphereGeometry = new THREE.SphereGeometry(2, 8, 16);
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(0, -4, 0);
cable.add(sphere);

// GUI
const gui = new GUI();

// Parameters
const pivotControls = gui.addFolder("Pivot Controls");
pivotControls.add(pivot.rotation, "y", 0, Math.PI * 2).name("Rotation Y");
const armControls = gui.addFolder("ArmPivot Controls");
armControls.add(pivotArm.rotation, "y", 0, Math.PI * 2).name("Rotation y");

//AxisHelpers
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const axesHelper2 = new THREE.AxesHelper(2);
cube.add(axesHelper2);

const axesHelper3 = new THREE.AxesHelper(2);
cylinder1.add(axesHelper3);

// Adicione variáveis para controlar o movimento
const movementSpeed = 0.1;
const keys = { W: false, A: false, S: false, D: false };

// Adicione um ouvinte de eventos para capturar teclas pressionadas
document.addEventListener("keydown", (event) => {
  handleKeyDown(event.key);
});

document.addEventListener("keyup", (event) => {
  handleKeyUp(event.key);
});

function handleKeyDown(key) {
  keys[key] = true;
}

function handleKeyUp(key) {
  keys[key] = false;
}

// Adicione variáveis para controlar a animação de baloiço
let swingDirection = 1;
const swingSpeed = 0.01;

// ...

//Animate
function animate() {
  requestAnimationFrame(animate);

  // Atualize a rotação do cabo para criar o movimento de baloiço
  pivotArm.rotation.y += swingDirection * swingSpeed;

  // Inverta a direção de baloiço se o cabo atingir um limite
  if (Math.abs(pivotArm.rotation.y) > Math.PI / 6) {
    swingDirection *= -1;
  }

  // Atualize a posição dos objetos ligados ao pivot (o "carro")
  const carSpeed = 0.1;
  if (keys.W) pivot.position.z += carSpeed;
  if (keys.A) pivot.position.x -= carSpeed;
  if (keys.S) pivot.position.z -= carSpeed;
  if (keys.D) pivot.position.x += carSpeed;

  // Atualize os controles OrbitControls
  controls.update();

  // Renderize a cena
  renderer.render(scene, camera);
}

// Start your own animation loop
animate();
