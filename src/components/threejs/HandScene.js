import * as THREE from "three";
import { getGesture } from "./finger/FingerStatus";
import { ModelLoader } from "./loader/ModelLoader";
import { PlaneLoader } from "./loader/PlaneLoader";
import { theta } from "../../util/vector";
import { getDistance } from "./finger/FingerSwitch";
/**
 * threejsのベクトル演算
 * https://qiita.com/aa_debdeb/items/c58d5eda9a4052b5dd2f
 */

const _handScene = () => {
  let scene;
  let camera;
  let hemiLight;
  let renderer;
  let hands = [];
  let handMeshes = [];
  let video;
  let models = [];
  let isFingerMesh; //指のモデルの表示フラグ

  //指先
  const edges = {
    thumb: [3, 4],
    index: [6, 7, 8],
    middle: [10, 11, 12],
    ring: [14, 15, 16],
    pinky: [18, 19, 20]
  };

  const init = ({
    width,
    height,
    shiftleft,
    videoRef,
    overflowRef,
    showMesh,
    detectNumber
  }) => {
    return new Promise((resolved) => {
      isFingerMesh = showMesh;
      video = document.getElementById(videoRef);
      scene = new THREE.Scene({ alpha: true });

      renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(1);

      document.getElementById(overflowRef).appendChild(renderer.domElement);
      const canvas3d = document.querySelector(`#${overflowRef} canvas`);
      canvas3d.style.position = `absolute`;
      canvas3d.style.left = `${shiftleft}px`;

      camera = new THREE.PerspectiveCamera(83, width / height, 0.1, 1000);
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
      for (let i = 0; i < detectNumber; i++) {
        setupMeshes();
      }
      nrender();

      resolved();
    });
  };

  const addPlane = ({ path }) => {
    return new Promise((resolved) => {
      const index = models.length;
      models.push({
        id: index,
        obj: new THREE.Object3D()
      });

      PlaneLoader(path, (obj) => {
        obj.rotation.x = Math.PI / 2;
        models[index].obj.add(obj);
        models[index].obj.visible = true;
        scene.add(models[index].obj);
        resolved(models[index]);
      });
    });
  };

  //モデルを追加
  const addModel = ({ path }) => {
    return new Promise((resolved) => {
      const index = models.length;
      models.push({
        id: index,
        obj: new THREE.Object3D()
      });

      ModelLoader(path, (obj) => {
        obj.scale.set(1.0, 1.0, 1.0);
        obj.rotation.x = Math.PI / 2;
        models[index].obj.add(obj);
        models[index].obj.visible = true;
        scene.add(models[index].obj);
        resolved(models[index]);
      });
    });
  };

  const hideModel = ({ model }) => {
    model.obj.visible = false;
  };

  //モデルを描画
  const drawModel = ({ model, scale_rate, landmarks }) => {
    const rot = (c, p1, p2) => {
      const camera = {
        x: c.x - p1.x,
        y: c.z - p1.z
      };
      const point = {
        x: p2.x - p1.x,
        y: p2.z - p1.z
      };
      const rad = theta(camera, point);
      return rad;
    };

    const p0 = webcam2space(...landmarks[4]);
    const p1 = webcam2space(...landmarks[8]);
    //２点間の距離からスケールを算出
    const scale = p0.distanceTo(p1) * scale_rate;
    const _center = p0.add(p1);

    //カメラと人差し指の角度を取得して
    //オブジェクトの中心軸を回転させる
    const cam = camera.position;
    const point1 = webcam2space(...landmarks[5]);
    const point2 = webcam2space(...landmarks[8]);
    const radian = rot(cam, point1, point2);

    //中心に表示
    model.obj.position.set(_center.x * 0.5, _center.y * 0.5, _center.z * 0.5);
    model.obj.scale.set(scale, scale, scale);
    model.obj.visible = true;
    model.obj.rotation.x = Math.PI / -2; //blenderのz方向とthreejsのz方向が違うので補正
    model.obj.rotation.z = radian - Math.PI / 3; //中心軸回転
    // model.obj.lookAt(p1);
  };

  const webcam2space = (x, y, z) => {
    return new THREE.Vector3(
      x - video.videoWidth / 2,
      -(y - video.videoHeight / 2),
      -z
    );
  };

  //指のメッシュを作成
  const setupMeshes = () => {
    let meshes = [];
    let meshes_clone = [];
    for (var i = 0; i < 21; i++) {
      let obj = new THREE.Object3D();

      const mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(10, 10, 1, 32),
        new THREE.MeshPhongMaterial({
          color: 0x00ff7f
        })
      );
      mesh.rotation.x = Math.PI / 2;
      obj.add(mesh);
      obj.visible = false;
      scene.add(obj);
      meshes.push(obj);

      const obj_clone = obj.clone();
      scene.add(obj_clone);
      meshes_clone.push(obj_clone);
    }
    hands.push(meshes);
    handMeshes.push(meshes_clone);
  };

  const drawHand = ({
    index,
    landmarks,
    fingerDistanceCallback,
    gestureStatusCallback
  }) => {
    //画面サイズの中央位置を(0,0,0)として補正
    //メッシュを描画
    const drawMesh = (i) => {
      const next = i == 0 ? 0 : i - 1;

      const p0 = webcam2space(...landmarks[i]); //現在の座標
      const p1 = webcam2space(...landmarks[next]); //次のパーツの座標

      // p0をp1の方向に0.5(中間地点)の距離
      // const mid = p0.clone().lerp(p1, 0.5);

      //モデル描画用
      if (fingerPoints.flat().indexOf(i) !== -1) {
        hands[index][i].position.set(p0.x, p0.y, p0.z); //座標を更新
        hands[index][i].scale.z = p0.distanceTo(p1); //次のパーツとの距離にスケールをかける
        hands[index][i].lookAt(p1); //zを次のパーツ方向に向ける
        hands[index][i].visible = isFingerMesh;
      }

      //ジェスチャー検出用
      handMeshes[index][i].position.set(p0.x, p0.y, p0.z); //座標を更新
      handMeshes[index][i].scale.z = p0.distanceTo(p1); //次のパーツとの距離にスケールをかける
      handMeshes[index][i].lookAt(p1); //zを次のパーツ方向に向ける
      handMeshes[index][i].visible = false;
    };

    //指の骨モデルを表示
    const fingerPoints = Object.keys(edges).map((key) => {
      return edges[key];
    });
    for (var i = 0; i < landmarks.length; i++) {
      //指以外は描画しない
      if (fingerPoints.flat().indexOf(i) !== -1) {
        drawMesh(i);
      }
    }

    //じゃんけん
    if (gestureStatusCallback) {
      getGesture({
        handmeshes: handMeshes[0],
        callback: gestureStatusCallback
      });
    }

    //人差し指と親指の状態
    if (fingerDistanceCallback) {
      getDistance({
        handmeshes: handMeshes[0],
        callback: fingerDistanceCallback
      });
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
    drawHand,
    addModel,
    addPlane,
    drawModel,
    hideModel
  };
};

const handScene = _handScene();
export { handScene };
