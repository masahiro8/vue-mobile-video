<template>
  <div id="frame" class="source">
    <div id="overlay" class="overLay"></div>
  </div>
</template>
<script>
  import * as THREE from "three";
  import { VS_CODE, FS_CODE } from "@/components/threejs/face/shader/shader.js";
  // import { VERTEXS, ORDERS } from "./sample/MESH_SAMPLE";

  let scene;
  let shapeMesh;
  let texture;
  const screenRect = { width: 1000, height: 1000 };

  const POINTS = [
    [100, 100, 0],
    [100, -100, 0],
    [-100, -100, 0],
    [-100, 100, 0],
  ];
  const TRIANGLES = [
    [0, 1, 3],
    [3, 1, 2],
  ];
  const UV = [
    [
      [1, 1],
      [1, 0],
      [0, 1],
    ],
    [
      [0, 1],
      [1, 0],
      [0, 0],
    ],
  ];

  export default {
    data: () => {
      return {
        scene: null,
      };
    },
    props: {
      data: {
        type: Array,
      },
    },
    mounted() {
      this.init();
      this.drawMeshSimple();
      // this.drawMesh();
    },
    methods: {
      init() {
        let _three = {
          camera: null,
          screenRect: screenRect,
          shiftleft: -128,
          overflowRef: "overlay",
        };
        const overflowRef = "overlay";

        // シーン
        scene = new THREE.Scene({ alpha: true });

        // テクスチャ
        const loader = new THREE.TextureLoader(); // テクスチャローダーを作成
        texture = loader.load("./images/vrmonkey_512_512.jpg"); // テクスチャ読み込み
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;

        // レンダラー
        _three.renderer = new THREE.WebGLRenderer({
          alpha: true,
        });
        _three.renderer.setSize(
          _three.screenRect.width,
          _three.screenRect.height
        );
        _three.renderer.setPixelRatio(window.devicePixelRatio);

        // 平行光源
        const directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(1, 1, 1);
        // シーンに追加
        scene.add(directionalLight);

        // canvas
        document
          .getElementById(overflowRef)
          .appendChild(_three.renderer.domElement);
        const canvas3d = document.querySelector(`#${overflowRef} canvas`);
        canvas3d.style.position = `absolute`;
        canvas3d.style.left = `${_three.shiftleft}px`;

        // Camera
        _three.camera = new THREE.OrthographicCamera(
          -_three.screenRect.width / 2,
          _three.screenRect.width / 2,
          -_three.screenRect.height / 2,
          _three.screenRect.height / 2,
          -1000,
          1000
        );
        _three.camera.position.set(0, 0, 500);
        _three.camera.lookAt(0, 0, 0);

        // レンダリング
        function nrender() {
          requestAnimationFrame(nrender);
          _three.renderer.render(scene, _three.camera);
        }
        nrender();
      },

      //https://qiita.com/Urushibara01/items/d828e853fc5c4626647a
      drawMeshSimple() {
        // const geos = [
        //   { pos: [50.0, -50.0, 0.0], uv: [1, 1], norm: [0, 0, 1] }, //頂点0
        //   { pos: [-50.0, -50.0, 0.0], uv: [0, 1], norm: [0, 0, 1] }, //頂点1
        //   { pos: [-50.0, 50.0, 0.0], uv: [0, 0], norm: [0, 0, 1] }, //頂点2
        //   { pos: [50.0, 50.0, 0.0], uv: [1, 0], norm: [0, 0, 1] }, //頂点3
        // ];

        const geos = [
          { pos: [218, 218], uv: [0, 0.13], norm: [0, 0, 1] },
          { pos: [218, 240], uv: [0, 0.18], norm: [0, 0, 1] },
          { pos: [256, 246], uv: [0.18, 0.2], norm: [0, 0, 1] },
          { pos: [256, 257], uv: [0.18, 0.23], norm: [0, 0, 1] },
        ];

        const order = [
          [0, 1, 2],
          [2, 1, 3],
          [3, 1, 2],
        ];

        // const geos = VERTEXS;
        // const order = ORDERS;

        const positions = order.flat().map((i) => {
          return geos[i].pos;
        });

        const uv = order.flat().map((i) => {
          return geos[i].uv;
        });

        const normal = order.flat().map((i) => {
          return geos[i].norm;
        });

        // console.log(positions, normal, uv);

        const vtxs = new Float32Array(positions.flat());
        const uvs = new Float32Array(uv.flat(2));
        const normals = new Float32Array(normal.flat(2));
        const indexes = new Uint16Array(order.flat());

        console.log(vtxs, uvs, indexes);

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.BufferAttribute(vtxs, 3));
        geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
        geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
        geometry.setIndex(new THREE.BufferAttribute(indexes, 1));

        const phoneMat = new THREE.MeshStandardMaterial({
          map: texture,
          side: THREE.DoubleSide,
        });

        // const mat = new THREE.ShaderMaterial({
        //   uniforms: {
        //     uTex: {
        //       type: "t",
        //       value: texture,
        //     },
        //   },
        //   vertexShader: VS_CODE,
        //   fragmentShader: FS_CODE,
        //   side: THREE.DoubleSide,
        //   transparent: true,
        // });

        const plane = new THREE.Mesh(geometry, phoneMat);
        plane.material.wireframe = true;

        // var helper = new THREE.FaceNormalsHelper(plane, 3, 0xffff00, 1);

        scene.add(plane);
      },

      drawMesh() {
        const _TRIANGLES = TRIANGLES.flat();
        const _UV = UV.flat(2);

        let faces = new Float32Array(_TRIANGLES.length * 3);
        let normals = new Float32Array(_TRIANGLES.length * 3);

        for (let i = 0; i < _TRIANGLES.length; i++) {
          faces[i * 3] = POINTS[_TRIANGLES[i]][0];
          faces[i * 3 + 1] = POINTS[_TRIANGLES[i]][1];
          faces[i * 3 + 2] = POINTS[_TRIANGLES[i]][2];

          normals[i * 3] = 0.0;
          normals[i * 3 + 1] = 0.0;
          normals[i * 3 + 2] = 1.0;
        }

        // index
        let indexes = new Uint32Array(_TRIANGLES);

        // uv
        let uvs = new Float32Array(_UV.length);
        for (let i = 0; i < _UV.length; i++) uvs[i] = _UV[i];

        // ジオメトリ
        let geo = new THREE.BufferGeometry();

        // メッシュ追加
        geo.setAttribute("position", new THREE.BufferAttribute(faces, 3));
        // geo.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
        // geo.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
        geo.setIndex(new THREE.BufferAttribute(indexes, 1));
        geo.setIndex(_TRIANGLES);

        // マテリアル
        let n = false;
        const mat = new THREE.ShaderMaterial({
          uniforms: {
            uTex: {
              type: "t",
              value: texture,
            },
          },
          vertexShader: VS_CODE,
          fragmentShader: FS_CODE,
          side: THREE.DoubleSide,
          transparent: true,
        });

        const phoneMat = new THREE.MeshStandardMaterial({
          map: texture,
          side: THREE.DoubleSide,
        });

        const basicMat = new THREE.MeshBasicMaterial({
          color: 0x00ff00,
          side: THREE.DoubleSide,
        });

        const lineMat = new THREE.LineBasicMaterial({
          color: 0x00ff00,
          linewidth: 10,
        });

        if (!n) console.log(UV, mat, basicMat, lineMat, phoneMat, indexes);

        shapeMesh = new THREE.Mesh(geo, basicMat);
        scene.add(shapeMesh);
      },
    },
  };
</script>
<style lang="scss" scoped>
  .overLay {
    width: 1000px;
    height: 1000px;
    border: 1px solid red;
  }
</style>
