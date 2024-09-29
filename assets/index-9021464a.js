import*as e from"https://unpkg.com/three@0.126.1/build/three.module.js";import{OrbitControls as j}from"https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js";import{Lensflare as N,LensflareElement as h}from"https://unpkg.com/three@0.126.1/examples/jsm/objects/Lensflare.js";(function(){const f=document.createElement("link").relList;if(f&&f.supports&&f.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))w(t);new MutationObserver(t=>{for(const o of t)if(o.type==="childList")for(const l of o.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&w(l)}).observe(document,{childList:!0,subtree:!0});function P(t){const o={};return t.integrity&&(o.integrity=t.integrity),t.referrerPolicy&&(o.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?o.credentials="include":t.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function w(t){if(t.ep)return;t.ep=!0;const o=P(t);fetch(t.href,o)}})();const r={width:window.innerWidth,height:window.innerHeight},A=document.getElementById("renderer"),_=Math.min(window.devicePixelRatio,2),p={rotationSpeed:.05,windSpeed:.005,c:0,p:1.35,toggleFps:()=>{}},C=window.location.href.includes("threejs-astronomy")?"/threejs-astronomy/dist":"/dist",n=new e.TextureLoader,m="4k",$=n.load(`./${m}_earth_daymap.avif`),B=n.load(`./${m}_earth_nightmap.avif`),z=n.load(`./${m}_earth_normal_map.avif`),U=n.load(`./${m}_earth_specular_map.avif`),H=n.load(`${C}/moon.jpg`),W=n.load(`${C}/star.png`),D=[],q=n.load(`./europe_clouds_${m}.avif`);D.push(q);const k=n.load("https://closure.vps.wbsprt.com/files/earth/lensflare/lensflare0.png"),V=n.load("https://closure.vps.wbsprt.com/files/earth/lensflare/lensflare2.png"),M=n.load("https://closure.vps.wbsprt.com/files/earth/lensflare/hexangle.png"),K=n.load(`https://closure.vps.wbsprt.com/files/earth/EARTH_DISPLACE_${m}_16BITS.jpg`),Q=new e.CubeTextureLoader,J=Q.load(["https://closure.vps.wbsprt.com/files/earth/space/px.png","https://closure.vps.wbsprt.com/files/earth/space/nx.png","https://closure.vps.wbsprt.com/files/earth/space/py.png","https://closure.vps.wbsprt.com/files/earth/space/ny.png","https://closure.vps.wbsprt.com/files/earth/space/pz.png","https://closure.vps.wbsprt.com/files/earth/space/nz.png"]),a=new e.Scene;a.background=J;const X=1e4,Y=250,T=new Float32Array(X*3);for(let i=0;i<T.length;i++)T[i]=e.MathUtils.randFloatSpread(Y*2);const F=new e.BufferGeometry;F.setAttribute("position",new e.Float32BufferAttribute(T,3));const Z=new e.PointsMaterial({color:16777215,size:1,map:W,alphaTest:.01,transparent:!0,opacity:.6}),ee=new e.Points(F,Z);a.add(ee);const te=new e.AmbientLight(16777215,.1);a.add(te);const g=new e.DirectionalLight(10092543,1.3);g.position.set(800,0,0);a.add(g);const c=new N;c.addElement(new h(k,700,0,g.color));c.addElement(new h(V,1200,.025));c.addElement(new h(M,60,.6));c.addElement(new h(M,70,.7));c.addElement(new h(M,120,.9));c.addElement(new h(M,70,1));g.add(c);const s=new e.PerspectiveCamera(65,r.width/r.height);s.position.z=6;a.add(s);const u=new e.Group,x="highp",E=500,oe=new e.SphereGeometry(1.4,E,E),ne=new e.MeshPhongMaterial({precision:x,map:$,specularMap:U,specular:new e.Color(1118481),shininess:25,normalMap:z,displacementMap:K,displacementScale:.03}),re=new e.Mesh(oe,ne);u.add(re);const y=200,ie=new e.SphereGeometry(1.45,y,y),ae=new e.MeshPhongMaterial({precision:x,map:D[0],side:e.DoubleSide,opacity:.8,transparent:!0,depthWrite:!1,blending:e.CustomBlending,blendEquation:e.MaxEquation}),G=new e.Mesh(ie,ae);u.add(G);const se=new e.SphereGeometry(1.45,y,y),ce=new e.ShaderMaterial({precision:x,uniforms:{uTexture:{value:B},uLightPosition:{value:g.position}},side:e.FrontSide,transparent:!0,depthWrite:!1,vertexShader:`
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
  `}),le=new e.Mesh(se,ce);u.add(le);p.c=0;p.p=1.35;const pe=new e.ShaderMaterial({precision:x,uniforms:{uC:{value:p.c},uP:{value:p.p},uColor:{value:new e.Color(216462)}},vertexShader:`
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
  `,side:e.BackSide,blending:e.AdditiveBlending,transparent:!0}),de=new e.SphereGeometry(1.6,128,128),he=new e.Mesh(de,pe);u.add(he);a.add(u);const L=500,me=new e.SphereGeometry(.4,L,L),ue=new e.MeshPhongMaterial({precision:x,map:H,shininess:25,normalMap:z}),v=new e.Mesh(me,ue);a.add(v);v.position.x=-5;v.position.y=5;v.position.z=-5;window.addEventListener("resize",()=>{r.width=window.innerWidth,r.height=window.innerHeight,s.aspect=r.width/r.height,s.updateProjectionMatrix(),d.setSize(r.width,r.height),d.setPixelRatio(_)});const d=new e.WebGLRenderer({canvas:A,antialias:_<1.5,powerPreference:"high-performance"});d.setSize(r.width,r.height);d.setPixelRatio(_);d.render(a,s);const O=new j(s,A);O.enableDamping=!0;var R=new e.Clock;function ve(i,f){const P=.0174532925,w=12,t=4,o=.5*Math.PI/180;var l=R.getElapsedTime()*(360/f)*P,b=t*Math.cos(l),S=t*Math.sin(l);b=Number.parseFloat(b.toFixed(w)),S=Number.parseFloat(S.toFixed(w)),i.position.set(b,0,S),v.rotation.y+=o}const I=()=>{O.update();const i=R.getElapsedTime();G.rotation.x=Math.sin(i*2*p.windSpeed),u.rotation.y=i*p.rotationSpeed,ve(v,27),d.render(a,s),window.requestAnimationFrame(I)};I();
