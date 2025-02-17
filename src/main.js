import "./style.css";
import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import gsap from "gsap";

// Create the scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(
   25,
   window.innerWidth / window.innerHeight,
   0.1,
   1000
);
// camera.position.set(0, 3, 10); // Move camera back to better see the spheres
camera.position.z = 9;

let lastWheelTime = 0;
const throttleDelay = 2000;
let scrollCount = 0;
const throttledWheelHandler = (event) => {
   const currentTime = Date.now();

   console.log("scrollCount", scrollCount);
   if (currentTime - lastWheelTime >= throttleDelay) {
      lastWheelTime = currentTime;
      const direction = event.deltaY > 0 ? true : false;

      scrollCount = direction ? (scrollCount + 1) % 4 : (scrollCount - 1) % 4;

      const headings = document.querySelectorAll(".heading");

      gsap.to(headings, {
         duration: 1,
         y: `-=${100}%`,
         ease: "power2.inOut",
      });

      gsap.to(spheres.rotation, {
         duration: 1,
         y: direction ? `-=${Math.PI / 2}` : `+=${Math.PI / 2}`,

         ease: "power2.inOut",
      });

      if (scrollCount === 0) {
         gsap.to(headings, {
            duration: 1,
            y: 0,
            ease: "power2.inOut",
         });
      }
   }
};

window.addEventListener("wheel", throttledWheelHandler);

// Create a renderer
const renderer = new THREE.WebGLRenderer({
   canvas: document.getElementById("canvas"),
   antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.domElement.style.position = "absolute"; // Ensure it's visible
document.body.appendChild(renderer.domElement);

const loader = new RGBELoader();
loader.load(
   // "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/dry_orchard_meadow_1k.hdr",
   "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/moonlit_golf_1k.hdr",
   function (texture) {
      console.log("Texture loaded:", texture);
      texture.mapping = THREE.EquirectangularReflectionMapping;
      // scene.background = texture;
      scene.environment = texture;
   }
);
const radius = 1.3;
const segments = 64;
const orbitRadius = 4.5;
const colors = [0x0077ff, 0x00ff00, 0xff0000, 0x0000ff];
const texture = [
   "public/resources/csilla/color.png",
   "public/resources/earth/map.jpg",
   "public/resources/venus/map.jpg",
   "public/resources/volcanic/color.png",
];

const spheres = new THREE.Group();

const starTexture = new THREE.TextureLoader().load(
   "/public/resources/stars.jpg"
);
starTexture.colorSpace = THREE.SRGBColorSpace;
const starGeometry = new THREE.SphereGeometry(50, 64, 64);
const starMaterial = new THREE.MeshStandardMaterial({
   map: starTexture,
   side: THREE.BackSide,
});
const starSphere = new THREE.Mesh(starGeometry, starMaterial);
scene.add(starSphere);

const sphereMesh = [];

for (let i = 0; i < 4; i++) {
   const textureLoader = new THREE.TextureLoader();

   const geometry = new THREE.SphereGeometry(radius, segments, segments);
   const material = new THREE.MeshStandardMaterial({ map: texture[i] });
   const sphere = new THREE.Mesh(geometry, material);

   sphereMesh.push(sphere);

   textureLoader.load(texture[i], function (texture) {
      const sphereMaterial = new THREE.MeshStandardMaterial({
         map: texture,
      });
      sphere.material = sphereMaterial;
      texture.colorSpace = THREE.SRGBColorSpace;
   });

   const angle = (i / 4) * (Math.PI * 2);
   sphere.position.x = orbitRadius * Math.cos(angle);
   sphere.position.z = orbitRadius * Math.sin(angle);
   spheres.add(sphere);
}
spheres.rotation.x = 0.11;
spheres.position.y = -0.8;
spheres.position.z = -1;

scene.add(spheres);

// Animation loop
const clock = new THREE.Clock();
function animate() {
   requestAnimationFrame(animate);
   // controls.update();
   for (let i = 0; i < sphereMesh.length; i++) {
      const sphere = sphereMesh[i];
      sphere.rotation.y =
         i === 2 || 1
            ? -clock.getElapsedTime() * 0.03
            : clock.getElapsedTime() * 0.05;
      sphere.rotation.z =
         i === 3 || 4
            ? -clock.getElapsedTime() * 0.02
            : clock.getElapsedTime() * 0.01;
      sphere.rotation.x =
         i === 1 || 4
            ? -clock.getElapsedTime() * 0.02
            : clock.getElapsedTime() * 0.04;
   }
   renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener("resize", () => {
   camera.aspect = window.innerWidth / window.innerHeight;
   camera.updateProjectionMatrix();
   renderer.setSize(window.innerWidth, window.innerHeight);
   renderer.setPixelRatio(window.devicePixelRatio);
});
