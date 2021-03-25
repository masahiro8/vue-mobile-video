import * as THREE from "three";
import { getGesture, getEdges } from "./FingerStatus";
import { ModelLoader } from "./ModelLoader";
import { PlaneLoader } from "./PlaneLoader";
import { CometLoader } from "./CometLoader";
import { theta } from "../../util/vector";
import { getDistance } from "./FingerSwitch";
import { TriangleLoader } from "./TriangleLoader"; //{TriangleModel}
import { LineLoader } from "./LineLoader";
import { CircleLoader } from "./CircleLoader";
import Worker from "worker-loader!../../worker.js";

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
  let lines = []; //ライン
  let shapes = [];
  let circles = [];
  let hand_shapes = [];

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

  const addComet = ({ path }) => {
    return new Promise((resolved) => {
      const index = models.length;
      models.push({
        id: index,
        obj: new THREE.Object3D(),
      });

      CometLoader(path, (obj, circles) => {
        _circles = circles;
        obj.rotation.x = Math.PI / 2;
        models[index].obj.add(obj);
        models[index].obj.visible = true;
        scene.add(models[index].obj);
        resolved(models[index], _circles);
      });
    });
  };

  const drawComet = ({ model, scale_rate, landmarks }) => {
    for (let i = 0; i < _circles.length; i++) {
      _circles[i].mesh.material.opacity -= _circles[i].lifeCount;

      if (_circles[i].mesh.material.opacity <= 0) {
        _circles[i].mesh.position.x = landmarks.x;
        _circles[i].mesh.position.y = landmarks.y;
        _circles[i].mesh.material.opacity = 1.0;
      }
      _circles[i].mesh.position.x +=
        _circles[i].xMoveSpeed * (_circles[i].xDirection ? 1 : -1);
      _circles[i].mesh.position.y +=
        _circles[i].yMoveSpeed * (_circles[i].yDirection ? 1 : -1);
    }

    //中心に表示
    // model.obj.position.set(landmarks.x, landmarks.y, landmarks.z);
    model.obj.position.set(0, 0, 0);
    model.obj.scale.set(scale_rate, scale_rate, scale_rate);
    model.obj.visible = true;
    model.obj.rotation.x = Math.PI / -2; //blenderのz方向とthreejsのz方向が違うので補正
  };

  const hideComet = ({ model }) => {
    setTimeout(() => {
      model.obj.visible = false;
    }, 500);
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
  const drawTriangle = async ({ model, points }) => {
    if (!points) {
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

    const vecs = points;
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

  // パーのエフェクト
  const drawPaaLines = ({ lines, points }) => {
    lines.forEach((model, index) => {
      drawLine({
        model,
        point1: points[index][0],
        point2: points[index][1],
      });
    });
  };

  /**
   *
   * 図形を生成
   * @param {*} shapes
   * @returns
   */
  const addShapes = (_shapes) => {
    const genShape = ({ radius, segments, color }) => {
      return new Promise((resolved) => {
        let index = shapes.length;
        //円
        shapes.push({
          id: index,
          obj: new THREE.Mesh(),
          color,
          radius,
          segments,
        });
        CircleLoader({
          size: { radius, segments },
          color,
          callback: (obj) => {
            shapes[index].obj = obj;
            shapes[index].obj.visible = false;
            scene.add(shapes[index].obj);
            resolved();
          },
        });
      });
    };
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolved) => {
      await Promise.all(
        _shapes.map(async ({ radius, segments, color }) => {
          return await genShape({ radius, segments, color });
        })
      );
      resolved(shapes);
    });
  };

  const drawShapes = ({ center, radius }) => {
    if (!center) {
      //三角を非表示
      shapes.forEach((shape) => {
        shape.obj.scale.set(0, 0, 0);
        shape.obj.position.set(0, 0, 0);
        shape.obj.visible = false;
      });
      return;
    }

    const index = Math.floor(Math.random() * shapes.length);
    shapes[index].obj.scale.set(radius, radius, radius);
    shapes[index].obj.position.set(center.x, center.y, center.z);
    shapes[index].obj.visible = true;
  };

  const addCircles = () => {
    const genCircle = ({ radius, segments, color }) => {
      return new Promise((resolved) => {
        let index = circles.length;
        //円
        circles.push({
          id: index,
          obj: new THREE.Mesh(),
          color,
          radius,
          segments,
        });
        CircleLoader({
          size: { radius, segments },
          color,
          callback: (obj) => {
            circles[index].obj = obj;
            circles[index].obj.visible = false;
            scene.add(circles[index].obj);
            resolved();
          },
        });
      });
    };

    const chunk = (arr, size) => {
      return arr.reduce(
        (newarr, _, i) =>
          i % size ? newarr : [...newarr, arr.slice(i, i + size)],
        []
      );
    };

    let _circles = [...Array(200)]; //n個の円
    _circles = _circles.map(() => {
      return { radius: 5 + Math.random() * 10, segments: 32, color: 0xffffff };
    });

    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolved) => {
      await Promise.all(
        _circles.map(async ({ radius, segments, color }) => {
          return await genCircle({
            radius,
            segments,
            color,
          });
        })
      );
      circles = chunk(circles, 14);
      console.log("circles", circles);
      resolved(circles);
    });
  };

  /**
   * 手の骨格に合わせて描画
   */
  const drawCircles = ({ fingers }) => {
    //複数配列から２点の組み合わせを全て返す
    const get2Points = (counter, line, res) => {
      if (line.length == counter + 1) {
        return res;
      }
      const point1 = {
        x: line[counter].x,
        y: line[counter].y,
        z: line[counter].z,
      };
      const point2 = {
        x: line[counter + 1].x,
        y: line[counter + 1].y,
        z: line[counter + 1].z,
      };
      res[counter] = [point1, point2];
      counter = counter + 1;
      return get2Points(counter, line, res);
    };

    //データを整形
    const points = fingers
      .map((line) => {
        return get2Points(0, line, []);
      })
      .flat(1);

    //ここから座標を取得
    const w = new Worker();
    w.postMessage({
      f: "randamPosition",
      points: points,
      splitNum: 5,
      randomNum: 8,
      randomRadial: 8,
    });
    w.addEventListener("message", (r) => {
      if (hand_shapes.length == 0) {
        //初期はメッシュを作成
        hand_shapes = r.data.map((position) => {
          const size = 3 + Math.random() * 10;
          const point = new THREE.Mesh(
            new THREE.CircleGeometry(size, 24),
            new THREE.MeshBasicMaterial({
              color: [0xffffff, 0xb3fdbf, 0xc4e9fe, 0xfec4ed][
                Math.floor(Math.random() * 4)
              ],
            })
          );
          let obj = new THREE.Object3D();
          obj.add(point);
          obj.visible = true;
          obj.position.set(position.x, position.y, position.z);
          scene.add(obj);
          return obj;
        });
      } else {
        //座標を更新
        r.data.forEach((position, index) => {
          hand_shapes[index].position.set(position.x, position.y, position.z);
        });
      }
    });
  };

  return {
    init,
    drawHand,
    addModel,
    addPlane,
    addComet,
    drawComet,
    drawModel,
    hideModel,
    addTriangle,
    drawTriangle,
    addLine,
    drawLine,
    drawPaaLines,
    addShapes,
    drawShapes,
    hideComet,
    addCircles,
    drawCircles,
  };
};

const handScene = _handScene();
export { handScene };
