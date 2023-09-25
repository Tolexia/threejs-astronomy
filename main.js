import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js';
import {
  Lensflare,
  LensflareElement,
} from 'https://unpkg.com/three@0.126.1/examples/jsm/objects/Lensflare.js';
import { SphereGeometry } from 'three';

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const canvas = document.getElementById('renderer');
const pixelRatio = Math.min(window.devicePixelRatio, 2);


const parameters = {
  rotationSpeed: 0.05,
  // relative to rotation
  windSpeed: 0.005,
  c: 0,
  p: 1.35,
  toggleFps: () => {
  },
};


/**
 * Textures
 */
const baseUrl = (window.location.href.includes("threejs-astronomy") ? "/threejs-astronomy/dist" : "/dist");
const textureLoader = new THREE.TextureLoader();

// const textureQuality = isMobile() ? '4k' : '8k';
const textureQuality = '4k';

// surface textures
// source https://www.solarsystemscope.com/textures/
const dayTexture = textureLoader.load(
  `https://closure.vps.wbsprt.com/files/earth/${textureQuality}_earth_daymap.jpg`,
);
const nightTexture = textureLoader.load(
  `https://closure.vps.wbsprt.com/files/earth/${textureQuality}_earth_nightmap.jpg`,
);
const normalTexture = textureLoader.load(
  `https://closure.vps.wbsprt.com/files/earth/${textureQuality}_earth_normal_map.png`,
);
const specularTexture = textureLoader.load(
  `https://closure.vps.wbsprt.com/files/earth/${textureQuality}_earth_specular_map.png`,
);
const moonTexture = textureLoader.load(
  `${baseUrl}/moon.jpg`,
);
const starTexture = textureLoader.load(`${baseUrl}/star.png`)
// sky textures
// http://www.shadedrelief.com/natural3/pages/clouds.html
const skyTextures = [];
const cloudySkyTexture = textureLoader.load(
  `https://closure.vps.wbsprt.com/files/earth/europe_clouds_${textureQuality}.jpg`,
);
skyTextures.push(cloudySkyTexture);

// lens flares
// https://opengameart.org/content/lens-flares-and-particles
const textureFlare0 = textureLoader.load(
  'https://closure.vps.wbsprt.com/files/earth/lensflare/lensflare0.png',
);
const textureFlare2 = textureLoader.load(
  'https://closure.vps.wbsprt.com/files/earth/lensflare/lensflare2.png',
);
const textureFlareHex = textureLoader.load(
  'https://closure.vps.wbsprt.com/files/earth/lensflare/hexangle.png',
);
// http://www.cgchannel.com/2021/01/get-a-free-43200-x-21600px-displacement-map-of-the-earth/
const displacementTexture = textureLoader.load(
  `https://closure.vps.wbsprt.com/files/earth/EARTH_DISPLACE_${textureQuality}_16BITS.jpg`,
);
const cubeTextureLoader = new THREE.CubeTextureLoader();
const environmentMapTexture = cubeTextureLoader.load(
  [
    'https://closure.vps.wbsprt.com/files/earth/space/px.png',
    'https://closure.vps.wbsprt.com/files/earth/space/nx.png',
    'https://closure.vps.wbsprt.com/files/earth/space/py.png',
    'https://closure.vps.wbsprt.com/files/earth/space/ny.png',
    'https://closure.vps.wbsprt.com/files/earth/space/pz.png',
    'https://closure.vps.wbsprt.com/files/earth/space/nz.png',
  ],
);

/**
 * Scene & Stars
 */

const scene = new THREE.Scene();
scene.background = environmentMapTexture;
const count = 10000
const distance = 250;
// Stars
const points = new Float32Array(count*3); 
for(let i = 0; i < points.length ; i++)
{
    points[i] = THREE.MathUtils.randFloatSpread(distance*2)
}
const pointGeometry = new THREE.BufferGeometry();
pointGeometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3))
const pointMaterial = new THREE.PointsMaterial({
    color:0xffffff,
    // vertexColors:colors,
    size:1,
    map: starTexture,
    alphaTest: 0.01,
    transparent:true,
    opacity:.6
})
const pointObject = new THREE.Points(pointGeometry, pointMaterial);
scene.add(pointObject);
/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0x99ffff, 1.3);
directionalLight.position.set(800, 0.0, 0);
scene.add(directionalLight);

/**
 * Lensflare
 */
const lensflare = new Lensflare();
lensflare.addElement(
  new LensflareElement(textureFlare0, 700, 0, directionalLight.color)
);
lensflare.addElement(new LensflareElement(textureFlare2, 1200, 0.025));
lensflare.addElement(new LensflareElement(textureFlareHex, 60, 0.6));
lensflare.addElement(new LensflareElement(textureFlareHex, 70, 0.7));
lensflare.addElement(new LensflareElement(textureFlareHex, 120, 0.9));
lensflare.addElement(new LensflareElement(textureFlareHex, 70, 1));
directionalLight.add(lensflare);

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(65, sizes.width / sizes.height);
camera.position.z = 6;
scene.add(camera);

/**
 * Earth
 */
const earth = new THREE.Group();

const shaderPrecision = 'highp';

const earthSegments = 500;
const earthGeometry = new THREE.SphereGeometry(1.4, earthSegments, earthSegments);
const earthMaterial = new THREE.MeshPhongMaterial({
  precision: shaderPrecision,
  map: dayTexture,
  specularMap: specularTexture,
  specular: new THREE.Color(0x111111),
  shininess: 25,
  normalMap: normalTexture,
  displacementMap: displacementTexture,
  displacementScale: 0.03,
});


const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
earth.add(earthMesh);

const couldSegments = 200;
const cloudGeometry = new THREE.SphereGeometry(
  1.45,
  couldSegments,
  couldSegments
);
const cloudMaterial = new THREE.MeshPhongMaterial({
  precision: shaderPrecision,
  map: skyTextures[0],
  side: THREE.DoubleSide,
  opacity: 0.8,
  transparent: true,
  depthWrite: false,
  blending: THREE.CustomBlending,
  blendEquation: THREE.MaxEquation,
});
const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
earth.add(cloudMesh);

const nightGeometry = new THREE.SphereGeometry(
  1.45,
  couldSegments,
  couldSegments
);

const nightMaterial = new THREE.ShaderMaterial({
  precision: shaderPrecision,
  uniforms: {
    uTexture: { value: nightTexture },
    uLightPosition: { value: directionalLight.position },
  },
  side: THREE.FrontSide,
  transparent: true,
  depthWrite: false,
  vertexShader: `
   uniform vec3 uLightPosition;

   varying vec2 vUv;
   varying float vAlpha;

   void main() {
      vec4 viewPosition4 = modelViewMatrix * vec4(position, 1.0);
      vec4 viewLightPosition4 = viewMatrix * vec4(uLightPosition, 1.0);
      vec3 lightDirection = normalize(viewLightPosition4.xyz - viewPosition4.xyz);
      vec3 normalDirection = normalize(normalMatrix * normal);

      gl_Position = projectionMatrix * viewPosition4;

      vAlpha = abs(min(0.0, dot(lightDirection, normalDirection)));
      vUv = uv;
   }
  `,
  fragmentShader: `
    uniform sampler2D uTexture;

    varying vec2 vUv;
    varying float vAlpha;

    void main() {
      vec4 textureColor = texture2D(uTexture, vUv);
      gl_FragColor = vec4(textureColor.rgb, vAlpha);
    }
  `,
});

const nightMesh = new THREE.Mesh(nightGeometry, nightMaterial);
earth.add(nightMesh);

parameters.c = 0;
parameters.p = 1.35;
// inspired by http://stemkoski.github.io/Three.js/Shader-Glow.html
const atmosphereMaterial = new THREE.ShaderMaterial({
  precision: shaderPrecision,
  uniforms: {
    uC: { value: parameters.c },
    uP: { value: parameters.p },
    uColor: { value: new THREE.Color(0x034d8e) },
  },
  vertexShader: `
    uniform float uC;
    uniform float uP;
    varying float vAlpha;
    void main()
    {
        vec4 viewPosition4 = modelViewMatrix * vec4(position, 1.0);
        vec3 viewPosition = viewPosition4.xyz;
        vec4 viewCameraPosition4 = viewMatrix * vec4(cameraPosition, 1.0);
        vec3 cameraDirection = normalize(viewCameraPosition4.xyz - viewPosition);
        vec3 normalDirection = normalize(normalMatrix * normal);
        float intensity = abs(min(0.0, dot(cameraDirection, normalDirection)));
        vAlpha = pow(intensity + uC, uP);
        gl_Position = projectionMatrix * viewPosition4;
    }
  `,
  fragmentShader: `
    uniform vec3 uColor;
    varying float vAlpha;
    void main()
    {
      gl_FragColor = vec4(uColor, vAlpha);
    }
  `,
  side: THREE.BackSide,
  blending: THREE.AdditiveBlending,
  transparent: true,
});

const atmosphereGeometry = new THREE.SphereGeometry(1.6, 128, 128);
const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
earth.add(atmosphereMesh);

scene.add(earth);

/**
 * Moon
 */
const moonSegments = 500;
const moonGeometry = new THREE.SphereGeometry(0.4, moonSegments, moonSegments);
const moonMaterial = new THREE.MeshPhongMaterial({
  precision: shaderPrecision,
  map: moonTexture,
  shininess: 25,
  normalMap: normalTexture,
});
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
scene.add(moon);
moon.position.x = -5;
moon.position.y = 5;
moon.position.z = -5;
window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(pixelRatio);
});

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: pixelRatio < 1.5,
  powerPreference: 'high-performance',
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(pixelRatio);
renderer.render(scene, camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

var clock = new THREE.Clock();

// Orbit Handling
function setPositionInOrbit(object3D, OrbitalPeriod)
{
  const DEGREES_TO_RADIANS_RATIO = 0.0174532925;
  const COORDINATE_PRECISION = 12;
  const _orbitAmplitude = 4;
  const _degreesToRotate = 0.5 * Math.PI / 180;
  var theta =  clock.getElapsedTime() * (360 / OrbitalPeriod) * DEGREES_TO_RADIANS_RATIO;
  var x = _orbitAmplitude * Math.cos(theta);
  var z = _orbitAmplitude * Math.sin(theta);

  x = Number.parseFloat(x.toFixed(COORDINATE_PRECISION));
  z = Number.parseFloat(z.toFixed(COORDINATE_PRECISION));

  object3D.position.set(x, 0, z);
  moon.rotation.z += _degreesToRotate;
}
const tick = () => {

  controls.update();

  // animations
  const elapsedTime = clock.getElapsedTime();

  cloudMesh.rotation.x = Math.sin(elapsedTime * 2 * parameters.windSpeed);
  earth.rotation.y = elapsedTime * parameters.rotationSpeed;
  // moon.rotation.y = elapsedTime;
  setPositionInOrbit(moon, 27)
  // moon.position.x += Math.cos(2 *  moon.position.x)
  // moon.position.y += Math.sin(2 *  moon.position.y)
  // moon.position.z += Math.sin(2 *  moon.position.z)

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);

};

tick();

function isMobile() {
  return iOS() || isAndroid();
}

// https://stackoverflow.com/questions/9038625/detect-if-device-is-ios
function iOS() {
  return (
    [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod',
    ].includes(navigator.platform) ||
    // iPad on iOS 13 detection
    (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
  );
}

function isAndroid() {
  return /android/i.test(navigator.userAgent);
}
