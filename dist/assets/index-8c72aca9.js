import*as e from"https://unpkg.com/three@0.126.1/build/three.module.js";import{OrbitControls as F}from"https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js";import{Lensflare as j,LensflareElement as d}from"https://unpkg.com/three@0.126.1/examples/jsm/objects/Lensflare.js";(function(){const x=document.createElement("link").relList;if(x&&x.supports&&x.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))b(t);new MutationObserver(t=>{for(const o of t)if(o.type==="childList")for(const y of o.addedNodes)y.tagName==="LINK"&&y.rel==="modulepreload"&&b(y)}).observe(document,{childList:!0,subtree:!0});function G(t){const o={};return t.integrity&&(o.integrity=t.integrity),t.referrerPolicy&&(o.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?o.credentials="include":t.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function b(t){if(t.ep)return;t.ep=!0;const o=G(t);fetch(t.href,o)}})();const r={width:window.innerWidth,height:window.innerHeight},T=document.getElementById("renderer"),P=Math.min(window.devicePixelRatio,2),l={rotationSpeed:.05,windSpeed:.005,c:0,p:1.35,toggleFps:()=>{}},n=new e.TextureLoader,u=ue()?"4k":"8k",O=n.load(`https://closure.vps.wbsprt.com/files/earth/${u}_earth_daymap.jpg`),B=n.load(`https://closure.vps.wbsprt.com/files/earth/${u}_earth_nightmap.jpg`),A=n.load(`https://closure.vps.wbsprt.com/files/earth/${u}_earth_normal_map.png`),R=n.load(`https://closure.vps.wbsprt.com/files/earth/${u}_earth_specular_map.png`),$=n.load("/moon.jpg"),H=n.load("/star.png"),C=[],U=n.load(`https://closure.vps.wbsprt.com/files/earth/europe_clouds_${u}.jpg`);C.push(U);const W=n.load("https://closure.vps.wbsprt.com/files/earth/lensflare/lensflare0.png"),k=n.load("https://closure.vps.wbsprt.com/files/earth/lensflare/lensflare2.png"),g=n.load("https://closure.vps.wbsprt.com/files/earth/lensflare/hexangle.png"),q=n.load(`https://closure.vps.wbsprt.com/files/earth/EARTH_DISPLACE_${u}_16BITS.jpg`),I=new e.CubeTextureLoader,N=I.load(["https://closure.vps.wbsprt.com/files/earth/space/px.png","https://closure.vps.wbsprt.com/files/earth/space/nx.png","https://closure.vps.wbsprt.com/files/earth/space/py.png","https://closure.vps.wbsprt.com/files/earth/space/ny.png","https://closure.vps.wbsprt.com/files/earth/space/pz.png","https://closure.vps.wbsprt.com/files/earth/space/nz.png"]),i=new e.Scene;i.background=N;const V=1e4,K=250,M=new Float32Array(V*3);for(let s=0;s<M.length;s++)M[s]=e.MathUtils.randFloatSpread(K*2);const _=new e.BufferGeometry;_.setAttribute("position",new e.Float32BufferAttribute(M,3));const Q=new e.PointsMaterial({color:16777215,size:1,map:H,alphaTest:.01,transparent:!0,opacity:.6}),J=new e.Points(_,Q);i.add(J);const X=new e.AmbientLight(16777215,.1);i.add(X);const m=new e.DirectionalLight(10092543,1.3);m.position.set(800,0,0);i.add(m);const c=new j;c.addElement(new d(W,700,0,m.color));c.addElement(new d(k,1200,.025));c.addElement(new d(g,60,.6));c.addElement(new d(g,70,.7));c.addElement(new d(g,120,.9));c.addElement(new d(g,70,1));m.add(c);const a=new e.PerspectiveCamera(65,r.width/r.height);a.position.z=6;i.add(a);const h=new e.Group,f="highp",S=500,Y=new e.SphereGeometry(1.4,S,S),Z=new e.MeshPhongMaterial({precision:f,map:O,specularMap:R,specular:new e.Color(1118481),shininess:25,normalMap:A,displacementMap:q,displacementScale:.03}),ee=new e.Mesh(Y,Z);h.add(ee);const w=200,te=new e.SphereGeometry(1.45,w,w),oe=new e.MeshPhongMaterial({precision:f,map:C[0],side:e.DoubleSide,opacity:.8,transparent:!0,depthWrite:!1,blending:e.CustomBlending,blendEquation:e.MaxEquation}),z=new e.Mesh(te,oe);h.add(z);const ne=new e.SphereGeometry(1.45,w,w),re=new e.ShaderMaterial({precision:f,uniforms:{uTexture:{value:B},uLightPosition:{value:m.position}},side:e.FrontSide,transparent:!0,depthWrite:!1,vertexShader:`
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
  `,fragmentShader:`
    uniform sampler2D uTexture;

    varying vec2 vUv;
    varying float vAlpha;

    void main() {
      vec4 textureColor = texture2D(uTexture, vUv);
      gl_FragColor = vec4(textureColor.rgb, vAlpha);
    }
  `}),ie=new e.Mesh(ne,re);h.add(ie);l.c=0;l.p=1.35;const se=new e.ShaderMaterial({precision:f,uniforms:{uC:{value:l.c},uP:{value:l.p},uColor:{value:new e.Color(216462)}},vertexShader:`
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
  `,fragmentShader:`
    uniform vec3 uColor;
    varying float vAlpha;
    void main()
    {
      gl_FragColor = vec4(uColor, vAlpha);
    }
  `,side:e.BackSide,blending:e.AdditiveBlending,transparent:!0}),ae=new e.SphereGeometry(1.6,128,128),ce=new e.Mesh(ae,se);h.add(ce);i.add(h);const L=500,le=new e.SphereGeometry(.4,L,L),pe=new e.MeshPhongMaterial({precision:f,map:$,shininess:25,normalMap:A}),v=new e.Mesh(le,pe);i.add(v);v.position.x=-5;v.position.y=5;v.position.z=-5;window.addEventListener("resize",()=>{r.width=window.innerWidth,r.height=window.innerHeight,a.aspect=r.width/r.height,a.updateProjectionMatrix(),p.setSize(r.width,r.height),p.setPixelRatio(P)});const p=new e.WebGLRenderer({canvas:T,antialias:P<1.5,powerPreference:"high-performance"});p.setSize(r.width,r.height);p.setPixelRatio(P);p.render(i,a);const E=new F(a,T);E.enableDamping=!0;var de=new e.Clock;const D=()=>{E.update();const s=de.getElapsedTime();z.rotation.x=Math.sin(s*2*l.windSpeed),h.rotation.y=s*l.rotationSpeed,v.rotation.y=s,p.render(i,a),window.requestAnimationFrame(D)};D();function ue(){return he()||me()}function he(){return["iPad Simulator","iPhone Simulator","iPod Simulator","iPad","iPhone","iPod"].includes(navigator.platform)||navigator.userAgent.includes("Mac")&&"ontouchend"in document}function me(){return/android/i.test(navigator.userAgent)}
