import * as THREE from "three";
import { TRIANGLES_WRAP, UV_WRAP } from "@/components/tf/face/landmarks.js";
import { deepCopy } from "@/util/util.js";
/**
 * threejsのベクトル演算
 * https://qiita.com/aa_debdeb/items/c58d5eda9a4052b5dd2f
 */

const _faceScene = () => {
  let scene;
  let camera;
  let renderer;
  let shapeMesh;
  let screenRect = { width: 0, height: 0 };
  let texture;
  let shader = {
    vs: null,
    fs: null,
  };

  /**
   * 描画のためのThree.jsのシーンを作成
   */
  const init = ({
    width,
    height,
    shiftleft,
    overflowRef,
    texturePath,
    vsShader,
    fsShader,
  }) => {
    return new Promise((resolved) => {
      screenRect = { width, height };

      // テクスチャ
      const loader = new THREE.TextureLoader(); // テクスチャローダーを作成
      texture = loader.load(texturePath); // テクスチャ読み込み
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;

      //シェーダー
      shader.vs = vsShader;
      shader.fs = fsShader;

      // シーン
      scene = new THREE.Scene({ alpha: true });

      // レンダラー
      renderer = new THREE.WebGLRenderer({
        alpha: true,
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio);

      // 平行光源
      const directionalLight = new THREE.DirectionalLight(0xffffff);
      directionalLight.position.set(1, 1, 1);
      // シーンに追加
      scene.add(directionalLight);

      // canvas
      document.getElementById(overflowRef).appendChild(renderer.domElement);
      const canvas3d = document.querySelector(`#${overflowRef} canvas`);
      canvas3d.style.position = `absolute`;
      canvas3d.style.left = `${shiftleft}px`;

      // Camera
      camera = new THREE.OrthographicCamera(
        -width / 2,
        width / 2,
        -height / 2,
        height / 2,
        -1000,
        1000
      );
      camera.position.set(0, 0, 500);
      camera.lookAt(0, 0, 0);

      // レンダリング
      function nrender() {
        requestAnimationFrame(nrender);
        renderer.render(scene, camera);
      }
      nrender();
      resolved();
    });
  };

  /**
   * landmarksに中間の頂点を追加
   * 頂点数 86に増やす
   *
   */
  const addMiddlePoint = (landmarks) => {
    let _landmarks = deepCopy(landmarks);

    const middlePointsList = [
      //右頬の中点 鼻の右端を中心に目の下側、輪郭との中点を追加する
      [_landmarks[31], _landmarks[27]], //31:鼻右端, 27:鼻根

      [_landmarks[31], _landmarks[39]], //39:右目頭
      [_landmarks[31], _landmarks[40]], //40:右目下
      [_landmarks[31], _landmarks[41]], //41:右目下
      [_landmarks[31], _landmarks[36]], //36:右目尻

      [_landmarks[31], _landmarks[0]], //0:輪郭右端
      [_landmarks[31], _landmarks[1]], //1:輪郭右
      [_landmarks[31], _landmarks[2]], //2:輪郭右
      [_landmarks[31], _landmarks[3]], //3:輪郭右
      //左頬の中点 鼻の左端を中心に目の下側、輪郭との中点を追加する
      [_landmarks[35], _landmarks[27]], //35:鼻左端, 27:鼻根

      [_landmarks[35], _landmarks[47]], //42: 左目頭
      [_landmarks[35], _landmarks[46]],
      [_landmarks[35], _landmarks[45]],
      [_landmarks[35], _landmarks[44]],

      [_landmarks[35], _landmarks[16]], //16:輪郭左端
      [_landmarks[35], _landmarks[15]], //15:輪郭左
      [_landmarks[35], _landmarks[14]], //14:輪郭左
      [_landmarks[35], _landmarks[13]], //13:輪郭左
    ];

    let addArr = [];
    for (let i = 0; i < middlePointsList.length; i++) {
      addArr.push({
        x: (middlePointsList[i][0].x + middlePointsList[i][1].x) / 2,
        y: (middlePointsList[i][0].y + middlePointsList[i][1].y) / 2,
        z: 0.0,
      });
    }
    return [..._landmarks, ...addArr];
  };

  /**
   *
   * 描画
   */
  const drawMesh = ({ srcVideoId, landmarks }) => {
    // メッシュを削除
    if (scene && shapeMesh) {
      scene.remove(shapeMesh);
      shapeMesh.geometry.dispose();
      shapeMesh.material.dispose();
    }

    // 中間の頂点を追加
    let _landmarks = addMiddlePoint(landmarks);

    // スケールを取得
    const video = document.getElementById(srcVideoId);
    const scaleRate = screenRect.width / video.videoWidth;

    // メッシュ用の配列を作成
    let faces = new Float32Array(_landmarks.length * 3);
    let normals = new Float32Array(_landmarks.length * 3); //頂点法線

    // シェーダーではsetIndexが必須なので、facesでは最小の頂点情報を作成する
    // シェーダーを使用しない場合は、重複する頂点もまとめてfacesにぶっ込んでもOK
    for (let i = 0; i < _landmarks.length; i++) {
      faces[i * 3] = _landmarks[i].x * scaleRate - screenRect.width / 2;
      faces[i * 3 + 1] = _landmarks[i].y * scaleRate - screenRect.height / 2;
      faces[i * 3 + 2] = _landmarks[i].z;
      normals[i * 3] = 0.0;
      normals[i * 3 + 1] = 0.0;
      normals[i * 3 + 2] = 1.0;
    }

    // 配列に変換してindex作成
    const _TRIANGLES = TRIANGLES_WRAP.map((item) => item.points).flat(2);
    let indexes = new Uint16Array(_TRIANGLES);

    // uv
    const _UV = UV_WRAP.map((item) => item.uv).flat(2);
    let uvs = new Float32Array(_UV.length);
    for (let i = 0; i < _UV.length; i++) uvs[i] = _UV[i];

    // ジオメトリ
    let geo = new THREE.BufferGeometry();

    // メッシュ追加
    geo.setAttribute("position", new THREE.BufferAttribute(faces, 3));
    geo.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
    geo.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    geo.setIndex(new THREE.BufferAttribute(indexes, 1));

    // マテリアル

    // シェーダーマテリアル
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTex: {
          type: "t",
          value: texture,
        },
      },
      vertexShader: shader.vs,
      fragmentShader: shader.fs,
      side: THREE.DoubleSide,
      transparent: true,
    });

    shapeMesh = new THREE.Mesh(geo, mat);

    //ワイヤーフレーム表示
    // shapeMesh.material.wireframe = true;
    scene.add(shapeMesh);
  };

  return {
    init,
    drawMesh,
  };
};

const faceScene = _faceScene();
export { faceScene };
