import * as THREE from "three";

/**
 * threejsのベクトル演算
 * https://qiita.com/aa_debdeb/items/c58d5eda9a4052b5dd2f
 */

const _handScene = () => {
  let scene;
  let camera;
  let light;
  let hemiLight;
  let renderer;
  let handMeshes = [];
  let video;

  const init = ({ width, height, shiftleft, videoRef, overflowRef }) => {
    video = document.getElementById(videoRef);
    scene = new THREE.Scene({ alpha: true });

    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(1);

    document.getElementById(overflowRef).appendChild(renderer.domElement);
    const canvas3d = document.querySelector(`#${overflowRef} canvas`);
    canvas3d.style.position = `absolute`;
    canvas3d.style.left = `${shiftleft}px`;

    camera = new THREE.PerspectiveCamera(110, width / height, 0.1, 1000);
    camera.position.set(0, 0, video.videoWidth / 2);
    /**
     * カメラの画角がデバイスによって違うので、
     * PerspectiveCameraの第一引数は固定するの難しい
     *
     * MBP15-2019 = 83
     * Pixel4XL = 110
     */

    // light = new THREE.AmbientLight(0xffffff);
    // scene.add(light);

    hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
    hemiLight.color.setHSL(0.6, 1, 0.6);
    hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    hemiLight.position.set(0, 500, 0);
    scene.add(hemiLight);

    // レンダリング
    function nrender() {
      requestAnimationFrame(nrender);
      renderer.render(scene, camera);
    }
    //メッシュを用意
    setupMeshes();

    nrender();
    console.log("init test");
  };

  const setupMeshes = () => {
    for (var i = 0; i < 21; i++) {
      let obj = new THREE.Object3D();

      const mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(10, 10, 1, 32),
        new THREE.MeshPhongMaterial({
          color: 0x00ff7f
        })
      );

      // const geometry = new THREE.BoxGeometry(10, 1, 10);
      // const material = new THREE.MeshNormalMaterial();
      // let mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.x = Math.PI / 2;

      obj.add(mesh);
      scene.add(obj);
      handMeshes.push(obj);
    }
  };

  const setLandmark = (landmarks) => {
    //画面サイズの中央位置を(0,0,0)として補正
    const webcam2space = (x, y, z) => {
      return new THREE.Vector3(
        x - video.videoWidth / 2,
        -(y - video.videoHeight / 2),
        -z
      );
    };

    //メッシュを描画
    const drawMesh = (i) => {
      const next = i == 0 ? 0 : i - 1;

      //現在の座標
      const p0 = webcam2space(...landmarks[i]);

      //次のパーツの座標
      const p1 = webcam2space(...landmarks[next]);

      //　p0をp1の方向に0.5(中間地点)の距離
      // const mid = p0.clone().lerp(p1, 0.5);

      //座標を更新
      handMeshes[i].position.set(p0.x, p0.y, p0.z);

      //次のパーツとの距離にスケールをかける
      handMeshes[i].scale.z = p0.distanceTo(p1);

      //zを次のパーツ方向に向ける
      handMeshes[i].lookAt(p1);
    };

    //指先
    const edges = [
      [3, 4],
      [6, 7, 8],
      [10, 11, 12],
      [14, 15, 16],
      [18, 19, 20]
    ];
    for (var i = 0; i < landmarks.length; i++) {
      if (edges.flat().indexOf(i) !== -1) {
        drawMesh(i);
      }
    }
  };

  /*
  指の番号
  fingerLookupIndices = {
    thumb       : [0, 1, 2, 3, 4],
    indexFinger : [0, 5, 6, 7, 8],
    middleFinger: [0, 9, 10, 11, 12],
    ringFinger  : [0, 13, 14, 15, 16],
    pinky       : [0, 17, 18, 19, 20]
  };
  */

  return {
    init,
    setLandmark
  };
};

const handScene = _handScene();
export { handScene };
