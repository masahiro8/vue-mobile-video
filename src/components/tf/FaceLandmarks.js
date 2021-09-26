import "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-converter";
import "@tensorflow/tfjs-backend-webgl";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
// import { MediaPipeFaceMesh } from "@tensorflow-models/face-landmarks-detection/dist/types";
import { fpsWorker } from "../../util/fps";
import { LANDMARK_POINTS } from "./face/landmarks.js";

const PREDICT_IRISES = false; //視線？

/**
 * ランドマークを取得
 * @param {*} param0
 */
export const faceLandmarks = async ({ ref, fps, callback }) => {
  let model = await faceLandmarksDetection.load();
  const srcTarget = document.getElementById(ref);

  //fpsを設定して取得
  fpsWorker.setCallback(async () => {
    if (model && ref) {
      const predictions = await model.estimateFaces({
        input: srcTarget,
        returnTensors: false,
        flipHorizontal: false,
        predictIrises: PREDICT_IRISES,
      });
      if (predictions.length > 0) {
        console.log("---", predictions[0]);
        const landmarks = predictions.map((x) => packFace(x, LANDMARK_POINTS));
        if ("scaledMesh" in landmarks[0]) {
          callback(landmarks[0].scaledMesh);
        }
      }
    }
  }, fps);
};

const packFace = (face, set) => {
  let ret = { scaledMesh: [], irises: [] };
  for (let i = 0; i < set.length; i++) {
    const j = set[i];
    ret.scaledMesh[i] = {
      x: face.scaledMesh[j][0], // x
      y: face.scaledMesh[j][1], // y
      z: face.scaledMesh[j][2], // 3D depth
    };
  }
  // 視線
  // if (PREDICT_IRISES) {
  //   const NUM_KEYPOINTS = 468;
  //   const NUM_IRIS_KEYPOINTS = 5;
  //   for (let i = 0; i < NUM_IRIS_KEYPOINTS * 2; i++) {
  //     ret.irises[i] = fsm[NUM_KEYPOINTS + i];
  //   }
  // }
  return ret;
};
