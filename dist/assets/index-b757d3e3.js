import*as e from"https://unpkg.com/three@0.126.1/build/three.module.js";import{OrbitControls as j}from"https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js";import{Lensflare as O,LensflareElement as d}from"https://unpkg.com/three@0.126.1/examples/jsm/objects/Lensflare.js";(function(){const x=document.createElement("link").relList;if(x&&x.supports&&x.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))b(t);new MutationObserver(t=>{for(const o of t)if(o.type==="childList")for(const y of o.addedNodes)y.tagName==="LINK"&&y.rel==="modulepreload"&&b(y)}).observe(document,{childList:!0,subtree:!0});function F(t){const o={};return t.integrity&&(o.integrity=t.integrity),t.referrerPolicy&&(o.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?o.credentials="include":t.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function b(t){if(t.ep)return;t.ep=!0;const o=F(t);fetch(t.href,o)}})();const r={width:window.innerWidth,height:window.innerHeight},T=document.getElementById("renderer"),P=Math.min(window.devicePixelRatio,2),l={rotationSpeed:.05,windSpeed:.005,c:0,p:1.35,toggleFps:()=>{}},C=window.location.href.includes("threejs-astronomy")?"/dist":"/threejs-astronomy/dist",n=new e.TextureLoader,h="4k",$=n.load(`https://closure.vps.wbsprt.com/files/earth/${h}_earth_daymap.jpg`),B=n.load(`https://closure.vps.wbsprt.com/files/earth/${h}_earth_nightmap.jpg`),_=n.load(`https://closure.vps.wbsprt.com/files/earth/${h}_earth_normal_map.png`),R=n.load(`https://closure.vps.wbsprt.com/files/earth/${h}_earth_specular_map.png`),U=n.load(`${C}/moon.jpg`),H=n.load(`${C}/star.png`),z=[],W=n.load(`https://closure.vps.wbsprt.com/files/earth/europe_clouds_${h}.jpg`);z.push(W);const q=n.load("https://closure.vps.wbsprt.com/files/earth/lensflare/lensflare0.png"),I=n.load("https://closure.vps.wbsprt.com/files/earth/lensflare/lensflare2.png"),g=n.load("https://closure.vps.wbsprt.com/files/earth/lensflare/hexangle.png"),k=n.load(`https://closure.vps.wbsprt.com/files/earth/EARTH_DISPLACE_${h}_16BITS.jpg`),N=new e.CubeTextureLoader,V=N.load(["https://closure.vps.wbsprt.com/files/earth/space/px.png","https://closure.vps.wbsprt.com/files/earth/space/nx.png","https://closure.vps.wbsprt.com/files/earth/space/py.png","https://closure.vps.wbsprt.com/files/earth/space/ny.png","https://closure.vps.wbsprt.com/files/earth/space/pz.png","https://closure.vps.wbsprt.com/files/earth/space/nz.png"]),i=new e.Scene;i.background=V;const K=1e4,Q=250,M=new Float32Array(K*3);for(let s=0;s<M.length;s++)M[s]=e.MathUtils.randFloatSpread(Q*2);const A=new e.BufferGeometry;A.setAttribute("position",new e.Float32BufferAttribute(M,3));const J=new e.PointsMaterial({color:16777215,size:1,map:H,alphaTest:.01,transparent:!0,opacity:.6}),X=new e.Points(A,J);i.add(X);const Y=new e.AmbientLight(16777215,.1);i.add(Y);const u=new e.DirectionalLight(10092543,1.3);u.position.set(800,0,0);i.add(u);const c=new O;c.addElement(new d(q,700,0,u.color));c.addElement(new d(I,1200,.025));c.addElement(new d(g,60,.6));c.addElement(new d(g,70,.7));c.addElement(new d(g,120,.9));c.addElement(new d(g,70,1));u.add(c);const a=new e.PerspectiveCamera(65,r.width/r.height);a.position.z=6;i.add(a);const m=new e.Group,w="highp",S=500,Z=new e.SphereGeometry(1.4,S,S),ee=new e.MeshPhongMaterial({precision:w,map:$,specularMap:R,specular:new e.Color(1118481),shininess:25,normalMap:_,displacementMap:k,displacementScale:.03}),te=new e.Mesh(Z,ee);m.add(te);const v=200,oe=new e.SphereGeometry(1.45,v,v),ne=new e.MeshPhongMaterial({precision:w,map:z[0],side:e.DoubleSide,opacity:.8,transparent:!0,depthWrite:!1,blending:e.CustomBlending,blendEquation:e.MaxEquation}),E=new e.Mesh(oe,ne);m.add(E);const re=new e.SphereGeometry(1.45,v,v),ie=new e.ShaderMaterial({precision:w,uniforms:{uTexture:{value:B},uLightPosition:{value:u.position}},side:e.FrontSide,transparent:!0,depthWrite:!1,vertexShader:`
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
  `}),se=new e.Mesh(re,ie);m.add(se);l.c=0;l.p=1.35;const ae=new e.ShaderMaterial({precision:w,uniforms:{uC:{value:l.c},uP:{value:l.p},uColor:{value:new e.Color(216462)}},vertexShader:`
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
  `,side:e.BackSide,blending:e.AdditiveBlending,transparent:!0}),ce=new e.SphereGeometry(1.6,128,128),le=new e.Mesh(ce,ae);m.add(le);i.add(m);const L=500,pe=new e.SphereGeometry(.4,L,L),de=new e.MeshPhongMaterial({precision:w,map:U,shininess:25,normalMap:_}),f=new e.Mesh(pe,de);i.add(f);f.position.x=-5;f.position.y=5;f.position.z=-5;window.addEventListener("resize",()=>{r.width=window.innerWidth,r.height=window.innerHeight,a.aspect=r.width/r.height,a.updateProjectionMatrix(),p.setSize(r.width,r.height),p.setPixelRatio(P)});const p=new e.WebGLRenderer({canvas:T,antialias:P<1.5,powerPreference:"high-performance"});p.setSize(r.width,r.height);p.setPixelRatio(P);p.render(i,a);const D=new j(a,T);D.enableDamping=!0;var he=new e.Clock;const G=()=>{D.update();const s=he.getElapsedTime();E.rotation.x=Math.sin(s*2*l.windSpeed),m.rotation.y=s*l.rotationSpeed,f.rotation.y=s,p.render(i,a),window.requestAnimationFrame(G)};G();
