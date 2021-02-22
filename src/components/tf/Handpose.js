import * as handpose from "@tensorflow-models/handpose";
import { fpsWorker } from "../../util/fps";

/**
 * ハンドランドマークを取得
 * @param {*} param0
 */
export const handpose3d = async ({ ref, fps, callback }) => {
  let model = await handpose.load();
  const srcTarget = document.getElementById(ref);

  //fpsを設定して取得
  fpsWorker.setCallback(async () => {
    if (model && ref) {
      const predictions = await model.estimateHands(srcTarget);
      if (predictions.length > 0) {
        callback(predictions);
      }
    }
  }, fps);
};
