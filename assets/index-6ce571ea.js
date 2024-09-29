import*as e from"https://unpkg.com/three@0.126.1/build/three.module.js";import{OrbitControls as I}from"https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js";import{Lensflare as N,LensflareElement as h}from"https://unpkg.com/three@0.126.1/examples/jsm/objects/Lensflare.js";(function(){const f=document.createElement("link").relList;if(f&&f.supports&&f.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))w(t);new MutationObserver(t=>{for(const o of t)if(o.type==="childList")for(const l of o.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&w(l)}).observe(document,{childList:!0,subtree:!0});function P(t){const o={};return t.integrity&&(o.integrity=t.integrity),t.referrerPolicy&&(o.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?o.credentials="include":t.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function w(t){if(t.ep)return;t.ep=!0;const o=P(t);fetch(t.href,o)}})();const r={width:window.innerWidth,height:window.innerHeight},A=document.getElementById("renderer"),_=Math.min(window.devicePixelRatio,2),p={rotationSpeed:.05,windSpeed:.005,c:0,p:1.35,toggleFps:()=>{}},n=new e.TextureLoader,m="4k",B=n.load(`./${m}_earth_daymap.avif`),j=n.load(`./${m}_earth_nightmap.avif`),C=n.load(`./${m}_earth_normal_map.avif`),$=n.load(`./${m}_earth_specular_map.avif`),H=n.load("./moon.jpg"),U=n.load("./star.png"),z=[],W=n.load(`./europe_clouds_${m}.avif`);z.push(W);const q=n.load("https://closure.vps.wbsprt.com/files/earth/lensflare/lensflare0.png"),k=n.load("https://closure.vps.wbsprt.com/files/earth/lensflare/lensflare2.png"),M=n.load("https://closure.vps.wbsprt.com/files/earth/lensflare/hexangle.png"),V=n.load(`https://closure.vps.wbsprt.com/files/earth/EARTH_DISPLACE_${m}_16BITS.jpg`),K=new e.CubeTextureLoader,Q=K.load(["https://closure.vps.wbsprt.com/files/earth/space/px.png","https://closure.vps.wbsprt.com/files/earth/space/nx.png","https://closure.vps.wbsprt.com/files/earth/space/py.png","https://closure.vps.wbsprt.com/files/earth/space/ny.png","https://closure.vps.wbsprt.com/files/earth/space/pz.png","https://closure.vps.wbsprt.com/files/earth/space/nz.png"]),a=new e.Scene;a.background=Q;const J=1e4,X=250,T=new Float32Array(J*3);for(let i=0;i<T.length;i++)T[i]=e.MathUtils.randFloatSpread(X*2);const D=new e.BufferGeometry;D.setAttribute("position",new e.Float32BufferAttribute(T,3));const Y=new e.PointsMaterial({color:16777215,size:1,map:U,alphaTest:.01,transparent:!0,opacity:.6}),Z=new e.Points(D,Y);a.add(Z);const ee=new e.AmbientLight(16777215,.1);a.add(ee);const g=new e.DirectionalLight(10092543,1.3);g.position.set(800,0,0);a.add(g);const c=new N;c.addElement(new h(q,700,0,g.color));c.addElement(new h(k,1200,.025));c.addElement(new h(M,60,.6));c.addElement(new h(M,70,.7));c.addElement(new h(M,120,.9));c.addElement(new h(M,70,1));g.add(c);const s=new e.PerspectiveCamera(65,r.width/r.height);s.position.z=6;a.add(s);const u=new e.Group,x="highp",E=500,te=new e.SphereGeometry(1.4,E,E),oe=new e.MeshPhongMaterial({precision:x,map:B,specularMap:$,specular:new e.Color(1118481),shininess:25,normalMap:C,displacementMap:V,displacementScale:.03}),ne=new e.Mesh(te,oe);u.add(ne);const y=200,re=new e.SphereGeometry(1.45,y,y),ie=new e.MeshPhongMaterial({precision:x,map:z[0],side:e.DoubleSide,opacity:.8,transparent:!0,depthWrite:!1,blending:e.CustomBlending,blendEquation:e.MaxEquation}),F=new e.Mesh(re,ie);u.add(F);const ae=new e.SphereGeometry(1.45,y,y),se=new e.ShaderMaterial({precision:x,uniforms:{uTexture:{value:j},uLightPosition:{value:g.position}},side:e.FrontSide,transparent:!0,depthWrite:!1,vertexShader:`
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
  `}),ce=new e.Mesh(ae,se);u.add(ce);p.c=0;p.p=1.35;const le=new e.ShaderMaterial({precision:x,uniforms:{uC:{value:p.c},uP:{value:p.p},uColor:{value:new e.Color(216462)}},vertexShader:`
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
  `,side:e.BackSide,blending:e.AdditiveBlending,transparent:!0}),pe=new e.SphereGeometry(1.6,128,128),de=new e.Mesh(pe,le);u.add(de);a.add(u);const L=500,he=new e.SphereGeometry(.4,L,L),me=new e.MeshPhongMaterial({precision:x,map:H,shininess:25,normalMap:C}),v=new e.Mesh(he,me);a.add(v);v.position.x=-5;v.position.y=5;v.position.z=-5;window.addEventListener("resize",()=>{r.width=window.innerWidth,r.height=window.innerHeight,s.aspect=r.width/r.height,s.updateProjectionMatrix(),d.setSize(r.width,r.height),d.setPixelRatio(_)});const d=new e.WebGLRenderer({canvas:A,antialias:_<1.5,powerPreference:"high-performance"});d.setSize(r.width,r.height);d.setPixelRatio(_);d.render(a,s);const G=new I(s,A);G.enableDamping=!0;var O=new e.Clock;function ue(i,f){const P=.0174532925,w=12,t=4,o=.5*Math.PI/180;var l=O.getElapsedTime()*(360/f)*P,b=t*Math.cos(l),S=t*Math.sin(l);b=Number.parseFloat(b.toFixed(w)),S=Number.parseFloat(S.toFixed(w)),i.position.set(b,0,S),v.rotation.y+=o}const R=()=>{G.update();const i=O.getElapsedTime();F.rotation.x=Math.sin(i*2*p.windSpeed),u.rotation.y=i*p.rotationSpeed,ue(v,27),d.render(a,s),window.requestAnimationFrame(R)};R();
