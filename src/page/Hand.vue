<template>
  <div id="frame" class="source">
    <div class="videoFrame">
      <video id="srcVideo" class="video" playsinline muted autoplay />
    </div>
    <div class="canvasFrame">
      <canvas id="video_shadow" class="video_shadow"></canvas>
    </div>
    <div id="overlay" class="overLay"></div>
  </div>
</template>
<script>
import { videoStream } from "../components/video/videoStream.js";
import { handpose3d } from "../components/tf/Handpose.js";
import { handScene } from "../components/threejs/HandScene.js";

const delayTimer = () => {
  let timer = null;

  const clearTimer = () => {
    clearTimeout(timer);
  };

  const setTimer = (time, callback) => {
    clearTimer();
    timer = setTimeout(() => {
      callback();
    }, time);
  };

  return {
    setTimer,
    clearTimer,
  };
};

export default {
  data: () => {
    return {
      switch: false,
      timer: delayTimer(),
      Images: [], //画像を設定
      ImageIndex: 0, //表示する画像のindex
    };
  },
  props: {
    data: {
      type: Array,
    },
  },
  mounted() {
    //ここからビデオの映像を取得
    videoStream({
      frameId: "frame",
      videoId: "srcVideo",
      canvasId: "video_shadow",
      detectScale: 1,
      //カメラ起動完了でコール
      readyCallback: async (video_info) => {
        //3Dシーンを初期化
        await handScene.init({
          width: video_info.width,
          height: video_info.height,
          shiftleft: video_info.shiftleft,
          videoRef: "srcVideo",
          overflowRef: "overlay",
          showMesh: false, //指モデルの表示フラグ
          detectNumber: 2, //現在は手は１つしか検出できない mediapopeの仕様
        });
        console.log("init");

        //モデルをロード
        // const miton = await handScene.addModel({
        //   path: "https://storage.googleapis.com/ar-3d/gltf/miton_center.glb",
        // });

        //モデル作成
        const loadMmodel = (path) => {
          return new Promise((resolve) => {
            const model = handScene.addPlane({
              path: path,
            });
            resolve(model);
          });
        };

        //画像モデルを配列に登録
        this.Images = await Promise.all(
          this.data.map(async (item) => {
            const model = await loadMmodel(item.path);
            return model;
          })
        );

        console.log("models loaded");

        //ここで手の検出情報を取得
        handpose3d({
          ref: "srcVideo",
          fps: 20,
          callback: (landmarks) => {
            //手のモデル表示
            //配列で渡してるが実際にはmediapipeは１つだけしか返していない
            for (let i = 0; i < landmarks.length; i++) {
              //検出情報を3Dに渡す
              handScene.drawHand({
                index: i,
                landmarks: landmarks[i].landmarks,
                fingerDistanceCallback: (result) => {
                  this.updateSwitch(result);
                },
                gestureStatusCallback: (result) => {
                  this.updateGesture(result);
                },
              });
            }

            //オブジェクトを表示
            // handScene.drawModel({
            //   model: mlogo,
            //   scale_rate: 0.15,
            //   landmarks: landmarks[0].landmarks,
            // });

            this.hideModels();
            this.showModel(landmarks);
          },
        });
      },
    });
  },
  methods: {
    updateGesture(result) {
      console.log("gesture", result);
    },
    //指を描画後に人差し指と親指の距離を取得
    updateSwitch(result) {
      if (this.switch !== result) {
        //result => true 閉じてる、false 開いてる
        this.switch = result;
        if (result) {
          //300ms以上閉じるとコールバック
          this.timer.setTimer(300, () => {
            //トリガー
            //ImageIndexを更新
            if (this.ImageIndex === this.Images.length - 1) {
              this.ImageIndex = 0;
            } else {
              this.ImageIndex++;
            }
          });
        } else {
          this.timer.clearTimer();
        }
      }
    },
    showModel(landmarks) {
      if (this.switch) {
        this.hideAll();
        return;
      }

      //オブジェクトを表示
      handScene.drawModel({
        model: this.Images[this.ImageIndex],
        scale_rate: 0.15,
        landmarks: landmarks[0].landmarks,
      });
    },
    hideModels() {
      //非表示オブジェクト
      for (let i = 0; i < this.Images.length; i++) {
        if (i !== this.ImageIndex) {
          handScene.hideModel({ model: this.Images[i] });
        }
      }
    },
    hideAll() {
      for (let i = 0; i < this.Images.length; i++) {
        handScene.hideModel({ model: this.Images[i] });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.source {
  position: absolute;
  width: 375px;
  height: 100%;
  /* overflow: hidden; */
}
.video {
  position: relative;
  left: 0;
  top: 0;
  z-index: 1;
  transform: scale(-1, 1);
  width: 100%;
  height: 100%;
}

.videoFrame {
  position: absolute;
  width: 100%;
  height: 100%;
}

.overLay {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
  transform: scale(-1, 1);
  canvas {
    position: absolute;
  }
}

.canvasFrame {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
}

.video_shadow {
  position: absolute;
  left: 0;
  top: 0;
  width: 375px;
  z-index: 2;
  transform: scale(-1, 1);
  box-sizing: border-box;
}
</style>