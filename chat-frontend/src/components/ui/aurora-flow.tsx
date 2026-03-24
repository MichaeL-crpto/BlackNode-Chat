'use client';

import React, { useEffect, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const AuroraShader = () => {
  const { scene } = useThree();

  useEffect(() => {
    const geometry = new THREE.PlaneGeometry(200, 200);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec2 resolution;
        varying vec2 vUv;

        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

        float snoise(vec2 v) {
          const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                             -0.577350269189626, 0.024390243902439);
          vec2 i  = floor(v + dot(v, C.yy) );
          vec2 x0 = v -   i + dot(i, C.xx);
          vec2 i1;
          i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod289(i);
          vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
            + i.x + vec3(0.0, i1.x, 1.0 ));
          vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
          m = m*m ;
          m = m*m ;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
          vec3 g;
          g.x  = a0.x  * x0.x  + h.x  * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }

        void main() {
          vec2 uv = vUv;

          float flow1 = snoise(vec2(uv.x * 2.0 + time * 0.1, uv.y * 0.5 + time * 0.05));
          float flow2 = snoise(vec2(uv.x * 1.5 + time * 0.08, uv.y * 0.8 + time * 0.03));
          float flow3 = snoise(vec2(uv.x * 3.0 + time * 0.12, uv.y * 0.3 + time * 0.07));

          float streaks = sin((uv.x + flow1 * 0.3) * 8.0 + time * 0.2) * 0.5 + 0.5;
          streaks *= sin((uv.y + flow2 * 0.2) * 12.0 + time * 0.15) * 0.5 + 0.5;

          float aurora = (flow1 + flow2 + flow3) * 0.33 + 0.5;
          aurora = pow(aurora, 2.0);

          vec3 bgColor = vec3(0.01, 0.02, 0.04);
          vec3 color1 = vec3(0.05, 0.1, 0.25);
          vec3 color2 = vec3(0.1, 0.2, 0.4);
          vec3 color3 = vec3(0.2, 0.3, 0.6);
          vec3 accentColor = vec3(0.3, 0.1, 0.4);

          vec3 color = bgColor;

          float flow_mix1 = smoothstep(0.3, 0.7, aurora + streaks * 0.3);
          color = mix(color, color1, flow_mix1);

          float flow_mix2 = smoothstep(0.6, 0.9, aurora + flow1 * 0.4);
          color = mix(color, color2, flow_mix2);

          float flow_mix3 = smoothstep(0.8, 1.0, streaks + aurora * 0.5);
          color = mix(color, color3, flow_mix3 * 0.7);

          float flow_mix4 = smoothstep(0.7, 0.95, flow3 + streaks * 0.2);
          color = mix(color, accentColor, flow_mix4 * 0.5);

          float noise = snoise(uv * 100.0) * 0.02;
          color += noise;

          gl_FragColor = vec4(color, 1.0);
        }
      `,
      side: THREE.DoubleSide
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.z = -50;
    scene.add(mesh);

    const animate = () => {
      material.uniforms.time.value += 0.01;
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      scene.remove(mesh);
      geometry.dispose();
      material.dispose();
    };
  }, [scene]);

  return null;
};

const Lights = () => {
  const { scene } = useThree();

  useEffect(() => {
    const ambientLight = new THREE.AmbientLight(0.9);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0.8, 100, 2);
    pointLight1.position.set(20, 20, 10);
    pointLight1.color.set('#00cccc');
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0.6, 80, 2);
    pointLight2.position.set(-20, -10, 5);
    pointLight2.color.set('#9f33ff');
    scene.add(pointLight2);

    return () => {
      scene.remove(ambientLight);
      scene.remove(pointLight1);
      scene.remove(pointLight2);
      ambientLight.dispose();
      pointLight1.dispose();
      pointLight2.dispose();
    };
  }, [scene]);

  return null;
};

export const AuroraFlow = () => {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 30], fov: 75 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance"
        }}
      >
        <AuroraShader />
        <Lights />
      </Canvas>
    </div>
  );
};
