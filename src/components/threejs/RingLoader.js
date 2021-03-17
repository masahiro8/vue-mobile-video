import * as THREE from "three";
// 画像を読み込む
export const RingLoader = (path, callback) => {
  const texture = new THREE.TextureLoader().load(path, (tex) => {
    // 読み込み完了時
    // 縦横比を保って適当にリサイズ
    const w = 1;
    const h = tex.image.height / (tex.image.width / w);

    const geometry = new THREE.TorusGeometry(6, 3, 2, 100);

    tex.warpS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 2); //テクスチャのリピート回数
    const material = new THREE.ShaderMaterial({
      uniforms: {
        map: {
          type: "t",
          value: texture
        }
      },
      vertexShader: `
        varying vec2 vUv;       // フラグメントシェーダーに渡すUV座標
        void main()
        {
          vUv = uv;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D map;      // テクスチャ
        varying vec2 vUv;           // UV座標
        void main() {
          // UVの位置からテクスチャの色を取得
          vec4 tColor = texture2D(map, vUv);
          gl_FragColor = tColor;
        }
      `,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true
    });
    const ring = new THREE.Mesh(geometry, material);
    ring.scale.set(w, h, 1);
    callback(ring);
  });
};
