import*as e from"https://unpkg.com/three@0.126.1/build/three.module.js";import{OrbitControls as I}from"https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js";import{Lensflare as N,LensflareElement as h}from"https://unpkg.com/three@0.126.1/examples/jsm/objects/Lensflare.js";(function(){const v=document.createElement("link").relList;if(v&&v.supports&&v.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))f(t);new MutationObserver(t=>{for(const o of t)if(o.type==="childList")for(const l of o.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&f(l)}).observe(document,{childList:!0,subtree:!0});function b(t){const o={};return t.integrity&&(o.integrity=t.integrity),t.referrerPolicy&&(o.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?o.credentials="include":t.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function f(t){if(t.ep)return;t.ep=!0;const o=b(t);fetch(t.href,o)}})();const r={width:window.innerWidth,height:window.innerHeight},A=document.getElementById("renderer"),_=Math.min(window.devicePixelRatio,2),p={rotationSpeed:.05,windSpeed:.005,c:0,p:1.35,toggleFps:()=>{}},C=window.location.href.includes("threejs-astronomy")?"/threejs-astronomy/dist":"/dist",n=new e.TextureLoader,m="4k",$=n.load(`https://closure.vps.wbsprt.com/files/earth/${m}_earth_daymap.jpg`),B=n.load(`https://closure.vps.wbsprt.com/files/earth/${m}_earth_nightmap.jpg`),z=n.load(`https://closure.vps.wbsprt.com/files/earth/${m}_earth_normal_map.png`),U=n.load(`https://closure.vps.wbsprt.com/files/earth/${m}_earth_specular_map.png`),H=n.load(`${C}/moon.jpg`),W=n.load(`${C}/star.png`),D=[],q=n.load(`https://closure.vps.wbsprt.com/files/earth/europe_clouds_${m}.jpg`);D.push(q);const k=n.load("https://closure.vps.wbsprt.com/files/earth/lensflare/lensflare0.png"),V=n.load("https://closure.vps.wbsprt.com/files/earth/lensflare/lensflare2.png"),M=n.load("https://closure.vps.wbsprt.com/files/earth/lensflare/hexangle.png"),K=n.load(`https://closure.vps.wbsprt.com/files/earth/EARTH_DISPLACE_${m}_16BITS.jpg`),Q=new e.CubeTextureLoader,J=Q.load(["https://closure.vps.wbsprt.com/files/earth/space/px.png","https://closure.vps.wbsprt.com/files/earth/space/nx.png","https://closure.vps.wbsprt.com/files/earth/space/py.png","https://closure.vps.wbsprt.com/files/earth/space/ny.png","https://closure.vps.wbsprt.com/files/earth/space/pz.png","https://closure.vps.wbsprt.com/files/earth/space/nz.png"]),s=new e.Scene;s.background=J;const X=1e4,Y=250,T=new Float32Array(X*3);for(let i=0;i<T.length;i++)T[i]=e.MathUtils.randFloatSpread(Y*2);const F=new e.BufferGeometry;F.setAttribute("position",new e.Float32BufferAttribute(T,3));const Z=new e.PointsMaterial({color:16777215,size:1,map:W,alphaTest:.01,transparent:!0,opacity:.6}),ee=new e.Points(F,Z);s.add(ee);const te=new e.AmbientLight(16777215,.1);s.add(te);const g=new e.DirectionalLight(10092543,1.3);g.position.set(800,0,0);s.add(g);const c=new N;c.addElement(new h(k,700,0,g.color));c.addElement(new h(V,1200,.025));c.addElement(new h(M,60,.6));c.addElement(new h(M,70,.7));c.addElement(new h(M,120,.9));c.addElement(new h(M,70,1));g.add(c);const a=new e.PerspectiveCamera(65,r.width/r.height);a.position.z=6;s.add(a);const u=new e.Group,x="highp",E=500,oe=new e.SphereGeometry(1.4,E,E),ne=new e.MeshPhongMaterial({precision:x,map:$,specularMap:U,specular:new e.Color(1118481),shininess:25,normalMap:z,displacementMap:K,displacementScale:.03}),re=new e.Mesh(oe,ne);u.add(re);const y=200,ie=new e.SphereGeometry(1.45,y,y),se=new e.MeshPhongMaterial({precision:x,map:D[0],side:e.DoubleSide,opacity:.8,transparent:!0,depthWrite:!1,blending:e.CustomBlending,blendEquation:e.MaxEquation}),G=new e.Mesh(ie,se);u.add(G);const ae=new e.SphereGeometry(1.45,y,y),ce=new e.ShaderMaterial({precision:x,uniforms:{uTexture:{value:B},uLightPosition:{value:g.position}},side:e.FrontSide,transparent:!0,depthWrite:!1,vertexShader:`
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
  `}),le=new e.Mesh(ae,ce);u.add(le);p.c=0;p.p=1.35;const pe=new e.ShaderMaterial({precision:x,uniforms:{uC:{value:p.c},uP:{value:p.p},uColor:{value:new e.Color(216462)}},vertexShader:`
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
  `,side:e.BackSide,blending:e.AdditiveBlending,transparent:!0}),de=new e.SphereGeometry(1.6,128,128),he=new e.Mesh(de,pe);u.add(he);s.add(u);const L=500,me=new e.SphereGeometry(.4,L,L),ue=new e.MeshPhongMaterial({precision:x,map:H,shininess:25,normalMap:z}),w=new e.Mesh(me,ue);s.add(w);w.position.x=-5;w.position.y=5;w.position.z=-5;window.addEventListener("resize",()=>{r.width=window.innerWidth,r.height=window.innerHeight,a.aspect=r.width/r.height,a.updateProjectionMatrix(),d.setSize(r.width,r.height),d.setPixelRatio(_)});const d=new e.WebGLRenderer({canvas:A,antialias:_<1.5,powerPreference:"high-performance"});d.setSize(r.width,r.height);d.setPixelRatio(_);d.render(s,a);const O=new I(a,A);O.enableDamping=!0;var R=new e.Clock;function we(i,v){const b=.0174532925,f=12,t=4,o=.5*Math.PI/180;var l=R.getElapsedTime()*(360/v)*b,P=t*Math.cos(l),S=t*Math.sin(l);P=Number.parseFloat(P.toFixed(f)),S=Number.parseFloat(S.toFixed(f)),i.position.set(P,0,S),w.rotation.z+=o}const j=()=>{O.update();const i=R.getElapsedTime();G.rotation.x=Math.sin(i*2*p.windSpeed),u.rotation.y=i*p.rotationSpeed,we(w,27),d.render(s,a),window.requestAnimationFrame(j)};j();
