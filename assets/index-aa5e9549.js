import*as e from"https://unpkg.com/three@0.126.1/build/three.module.js";import{OrbitControls as I}from"https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js";import{Lensflare as N,LensflareElement as m}from"https://unpkg.com/three@0.126.1/examples/jsm/objects/Lensflare.js";(function(){const f=document.createElement("link").relList;if(f&&f.supports&&f.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))w(t);new MutationObserver(t=>{for(const o of t)if(o.type==="childList")for(const c of o.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&w(c)}).observe(document,{childList:!0,subtree:!0});function P(t){const o={};return t.integrity&&(o.integrity=t.integrity),t.referrerPolicy&&(o.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?o.credentials="include":t.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function w(t){if(t.ep)return;t.ep=!0;const o=P(t);fetch(t.href,o)}})();const i={width:window.innerWidth,height:window.innerHeight},A=document.getElementById("renderer"),_=Math.min(window.devicePixelRatio,2),d={rotationSpeed:.05,windSpeed:.005,c:0,p:1.35,toggleFps:()=>{}},n=new e.TextureLoader,u="4k",B=n.load(`./${u}_earth_daymap.avif`),j=n.load(`./${u}_earth_nightmap.avif`),C=n.load(`./${u}_earth_normal_map.avif`),$=n.load(`./${u}_earth_specular_map.avif`),H=n.load("./moon.jpg"),U=n.load("./star.png"),z=[],W=n.load(`./europe_clouds_${u}.avif`);z.push(W);const q=n.load("https://closure.vps.wbsprt.com/files/earth/lensflare/lensflare0.png"),k=n.load("https://closure.vps.wbsprt.com/files/earth/lensflare/lensflare2.png"),M=n.load("https://closure.vps.wbsprt.com/files/earth/lensflare/hexangle.png"),V=n.load(`https://closure.vps.wbsprt.com/files/earth/EARTH_DISPLACE_${u}_16BITS.jpg`),K=new e.CubeTextureLoader,Q=K.load(["./px.avif","./nx.avif","./py.avif","./ny.avif","./pz.avif","./nz.avif"]),a=new e.Scene;a.background=Q;const J=1e4,X=250,T=new Float32Array(J*3);for(let r=0;r<T.length;r++)T[r]=e.MathUtils.randFloatSpread(X*2);const D=new e.BufferGeometry;D.setAttribute("position",new e.Float32BufferAttribute(T,3));const Y=new e.PointsMaterial({color:16777215,size:1,map:U,alphaTest:.01,transparent:!0,opacity:.6}),Z=new e.Points(D,Y);a.add(Z);const ee=new e.AmbientLight(16777215,.1);a.add(ee);const g=new e.DirectionalLight(10092543,1.3);g.position.set(800,0,0);a.add(g);const l=new N;l.addElement(new m(q,700,0,g.color));l.addElement(new m(k,1200,.025));l.addElement(new m(M,60,.6));l.addElement(new m(M,70,.7));l.addElement(new m(M,120,.9));l.addElement(new m(M,70,1));g.add(l);const s=new e.PerspectiveCamera(65,i.width/i.height);s.position.z=6;a.add(s);const h=new e.Group,x="highp",E=500,te=new e.SphereGeometry(1.4,E,E),oe=new e.MeshPhongMaterial({precision:x,map:B,specularMap:$,specular:new e.Color(1118481),shininess:25,normalMap:C,displacementMap:V,displacementScale:.03}),ne=new e.Mesh(te,oe);h.add(ne);const y=200,ie=new e.SphereGeometry(1.45,y,y),re=new e.MeshPhongMaterial({precision:x,map:z[0],side:e.DoubleSide,opacity:.8,transparent:!0,depthWrite:!1,blending:e.CustomBlending,blendEquation:e.MaxEquation}),F=new e.Mesh(ie,re);h.add(F);const ae=new e.SphereGeometry(1.45,y,y),se=new e.ShaderMaterial({precision:x,uniforms:{uTexture:{value:j},uLightPosition:{value:g.position}},side:e.FrontSide,transparent:!0,depthWrite:!1,vertexShader:`
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
  `}),le=new e.Mesh(ae,se);h.add(le);d.c=0;d.p=1.35;const ce=new e.ShaderMaterial({precision:x,uniforms:{uC:{value:d.c},uP:{value:d.p},uColor:{value:new e.Color(216462)}},vertexShader:`
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
  `,side:e.BackSide,blending:e.AdditiveBlending,transparent:!0}),de=new e.SphereGeometry(1.6,128,128),pe=new e.Mesh(de,ce);h.add(pe);a.add(h);const L=500,me=new e.SphereGeometry(.4,L,L),ue=new e.MeshPhongMaterial({precision:x,map:H,shininess:25,normalMap:C}),v=new e.Mesh(me,ue);a.add(v);v.position.x=-5;v.position.y=5;v.position.z=-5;window.addEventListener("resize",()=>{i.width=window.innerWidth,i.height=window.innerHeight,s.aspect=i.width/i.height,s.updateProjectionMatrix(),p.setSize(i.width,i.height),p.setPixelRatio(_)});const p=new e.WebGLRenderer({canvas:A,antialias:_<1.5,powerPreference:"high-performance"});p.setSize(i.width,i.height);p.setPixelRatio(_);p.render(a,s);const G=new I(s,A);G.enableDamping=!0;var O=new e.Clock;function he(r,f){const P=.0174532925,w=12,t=4,o=.5*Math.PI/180;var c=O.getElapsedTime()*(360/f)*P,S=t*Math.cos(c),b=t*Math.sin(c);S=Number.parseFloat(S.toFixed(w)),b=Number.parseFloat(b.toFixed(w)),r.position.set(S,0,b),v.rotation.y-=o}const R=()=>{G.update();const r=O.getElapsedTime();F.rotation.x=Math.sin(r*2*d.windSpeed),h.rotation.y=r*d.rotationSpeed,he(v,27),p.render(a,s),window.requestAnimationFrame(R)};R();
