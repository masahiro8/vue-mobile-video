import * as THREE from "three";
import { getGesture, getEdges } from "./FingerStatus";
import { ModelLoader } from "./ModelLoader";
import { PlaneLoader } from "./PlaneLoader";
import { CommetLoader } from "./CommetLoader";
import { theta } from "../../util/vector";
import { getDistance } from "./FingerSwitch";
import { TriangleLoader } from "./TriangleLoader"; //{TriangleModel}
import { LineLoader } from "./LineLoader";

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
  let handObjects = {};
  let video;
  let models = [];
  let isFingerMesh; //指のモデルの表示フラグ
  let _circles = [];
  let triangles = []; //三角
  let lines = [];

  //指先
  const edges = {
    thumb: [3, 4],
    index: [6, 7, 8],
    middle: [10, 11, 12],
    ring: [14, 15, 16],
    pinky: [18, 19, 20],
  };

  //ランドマークからObjectで返す
  //index = 0 が指の先になってて、edgesと並びが逆なの注意
  const getHandObject = (landmarks) => {
    let obj = {};
    Object.keys(edges).forEach((key) => {
      obj[key] = edges[key].reverse().map((index) => {
        return webcam2space(...landmarks[index]);
      });
    });
    return obj;
  };

  const init = ({
    width,
    height,
    shiftleft,
    videoRef,
    overflowRef,
    showFingerMesh,
    handNumber,
  }) => {
    return new Promise((resolved) => {
      isFingerMesh = showFingerMesh;
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
      for (let i = 0; i < handNumber; i++) {
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
        obj: new THREE.Object3D(),
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

  const addCommet = ({ path }) => {
    return new Promise((resolved) => {
      const index = models.length;
      models.push({
        id: index,
        obj: new THREE.Object3D(),
      });

      CommetLoader(path, (obj, circles) => {
        _circles = circles;
        obj.rotation.x = Math.PI / 2;
        models[index].obj.add(obj);
        models[index].obj.visible = true;
        scene.add(models[index].obj);
        resolved(models[index], _circles);
      });
    });
  };

  const drawCommet = ({ model, scale_rate, landmarks }) => {
    for (let i = 0; i < _circles.length; i++) {
      _circles[i].mesh.material.opacity -= _circles[i].lifeCount;

      if (_circles[i].mesh.material.opacity <= 0) {
        _circles[i].mesh.position.x = -0.5 + Math.random() * 1;
        _circles[i].mesh.position.y = -0.5 + Math.random() * 1;
        _circles[i].mesh.material.opacity = 1.0;
      }
      _circles[i].mesh.position.x +=
        _circles[i].xMoveSpeed * (_circles[i].xDirections ? 1 : -1);
      _circles[i].mesh.position.y +=
        _circles[i].yMoveSpeed * (_circles[i].yDirections ? 1 : -1);
    }

    //中心に表示
    model.obj.position.set(landmarks.x, landmarks.y, landmarks.z);
    model.obj.scale.set(scale_rate, scale_rate, scale_rate);
    model.obj.visible = true;
    model.obj.rotation.x = Math.PI / -2; //blenderのz方向とthreejsのz方向が違うので補正
    // model.obj.lookAt(p1);
  };

  //モデルを追加
  const addModel = ({ path }) => {
    return new Promise((resolved) => {
      const index = models.length;
      models.push({
        id: index,
        obj: new THREE.Object3D(),
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
        y: c.z - p1.z,
      };
      const point = {
        x: p2.x - p1.x,
        y: p2.z - p1.z,
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
          color: 0x00ff7f,
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
    gestureStatusCallback,
    fingerEdgesCallback,
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

      //オブジェクト化
      handObjects = getHandObject(landmarks);
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
        callback: (result) => {
          gestureStatusCallback({ result, handObjects });
        },
      });
    }

    //人差し指と親指の状態
    if (fingerDistanceCallback) {
      getDistance({
        handmeshes: handMeshes[0],
        callback: fingerDistanceCallback,
      });
    }

    if (fingerEdgesCallback) {
      //親指と人差し指の先端の位置を取得
      getEdges({
        handmeshes: handMeshes[0],
        callback: fingerEdgesCallback,
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

  const addTriangle = async () => {
    // return await TriangleModel.addTriangle({
    //   scene: scene,
    //   triangles: triangles,
    // });
    return new Promise((resolved) => {
      const index = triangles.length;
      triangles.push({
        id: index,
        obj: new THREE.Line(),
      });

      //初期化
      const points = [
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ];
      TriangleLoader({
        points: points,
        callback: (obj) => {
          triangles[index].obj = obj;
          triangles[index].obj.visible = true;
          scene.add(triangles[index].obj);
          resolved(triangles[index]);
        },
      });
    });
  };

  /**
   * 三角形を描画
   * @param {Object} param0
   */
  const drawTriangle = async ({ model, thumb, index, middle }) => {
    // TriangleModel.drawTriangle({ model, thumb, index, middle });
    if (!thumb && !index && !middle) {
      //参画を非表示
      triangles[model.id].obj.geometry.setFromPoints([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ]);
      triangles[model.id].obj.visible = false;
      return;
    }

    const vecs = [thumb, index, middle, thumb];
    triangles[model.id].obj.geometry.setFromPoints(vecs);
    triangles[model.id].obj.visible = true;

    //残像を描画
    const obj_clone = triangles[model.id].obj.clone();
    scene.add(obj_clone);
    const clone = await addTriangle();
    clone.obj.geometry.setFromPoints(vecs);
    clone.obj.visible = true;
    setTimeout(() => {
      clone.obj.visible = false;
    }, 1000);
  };

  const addLine = async ({ color }) => {
    return new Promise((resolved) => {
      const index = lines.length;
      lines.push({
        id: index,
        obj: new THREE.Line(),
        color: color,
      });

      //初期化
      const points = [new THREE.Vector3(), new THREE.Vector3()];
      LineLoader({
        points: points,
        color,
        callback: (obj) => {
          lines[index].obj = obj;
          lines[index].obj.visible = true;
          scene.add(lines[index].obj);
          resolved(lines[index]);
        },
      });
    });
  };
  const drawLine = async ({ model, point1, point2 }) => {
    if (!point1 && !point2) {
      //参画を非表示
      lines[model.id].obj.geometry.setFromPoints([
        new THREE.Vector3(),
        new THREE.Vector3(),
      ]);
      lines[model.id].obj.visible = false;
      return;
    }

    const vecs = [point1, point2];
    lines[model.id].obj.geometry.setFromPoints(vecs);
    lines[model.id].obj.visible = true;

    //残像を描画
    const obj_clone = lines[model.id].obj.clone();
    scene.add(obj_clone);
    const clone = await addLine({ color: lines[model.id].color });
    clone.obj.geometry.setFromPoints(vecs);
    clone.obj.visible = true;
    setTimeout(() => {
      clone.obj.visible = false;
    }, 1000);
  };

  const drawPaaLines = ({ lines, handObjects }) => {
    //三角形描画
    const _points = [
      [handObjects["index"][1], handObjects["index"][2]],
      [handObjects["middle"][1], handObjects["middle"][2]],
      [handObjects["ring"][1], handObjects["ring"][2]],
      [handObjects["pinky"][1], handObjects["pinky"][2]],
    ];
    lines.forEach((model, index) => {
      drawLine({
        model,
        point1: _points[index][0],
        point2: _points[index][1],
      });
    });
  };

  return {
    init,
    drawHand,
    addModel,
    addPlane,
    addCommet,
    drawCommet,
    drawModel,
    hideModel,
    addTriangle,
    drawTriangle,
    addLine,
    drawLine,
    drawPaaLines,
  };
};

const handScene = _handScene();
export { handScene };
