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
import Worker from "worker-loader!../worker.js";
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
    clearTimer
  };
};

export default {
  data: () => {
    return {
      switch: false,
      isImageShow:true,//画像の表示フラグ
      timer: delayTimer(),
      Images: [], //画像を設定
      ImageIndex: 0, //表示する画像のindex
      commet: null,
      triangle: null,//三角形
      lines:null,//線
      circle:null,
      prevHandObjects:{}
    };
  },
  props: {
    data: {
      type: Array
    }
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
          showFingerMesh: false, //指モデルの表示フラグ
          handNumber: 2 //現在は手は１つしか検出できない mediapopeの仕様
        });
        console.log("init");

        //モデルをロード
        // const miton = await handScene.addModel({
        //   path: "https://storage.googleapis.com/ar-3d/gltf/miton_center.glb",
        // });

        //モデルをロード
        this.loadModels();
        console.log("models loaded");

        const loadCommet = (path) => {
          return new Promise((resolve) => {
            const model = handScene.addCommet({
              path: path
            });
            resolve(model);
          });
        };

        this.commet = await loadCommet("/images/circle.png");

        //三角形を初期化
        this.triangle = await handScene.addTriangle();

        //指
        this.lines = [0x00ff00,0x00ff66,0x00ffaa,0x00ffff];
        this.lines =  await Promise.all(
          this.lines.map(async (color) => {
            return await handScene.addLine({color});
          })
        );

        //輪
        this.circle = await handScene.addShapes([
          { radius: 10, segments: 3, color: 0xffffff },
          { radius: 10, segments: 4, color: 0xffffff },
          { radius: 10, segments: 5, color: 0xffffff },
          { radius: 10, segments: 6, color: 0xffffff },
          { radius: 10, segments: 8, color: 0xffffff },
        ]);

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
                  //人差し指と親指をくっつけたらコールバックされる
                  this.updateSwitch(result ,()=>{
                    //画像を変更
                    if (this.ImageIndex === this.Images.length - 1) {
                      this.ImageIndex = 0;
                    } else {
                      this.ImageIndex++;
                    }
                    //テキスト描画
                    this.setText();
                  });
                },
                //じゃんけん結果を取得
                gestureStatusCallback: ({result, handObjects}) => {
                  this.updateGesture({result, handObjects});
                },
                //親指と人差し指の先端の位置を取得
                fingerEdgesCallback: ({thumb, index, middle}) => {
                  this.updateEdges(thumb, index, middle);
                }
              });
            }

            //オブジェクトを表示
            this.hideModels();
            this.showModel(landmarks);
          }
        });
      }
    });
  },
  methods: {
    //モデルをロード
    async loadModels() {
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
    },
    
    //ジェスチャーから描画
    updateGesture({result, handObjects}) {

      const hideLines = () => {
        this.lines.forEach((model) => {
          handScene.drawLine({
            model,
            point1:null,
            point2:null,
          });
        });
      }

      const hideTriangles = () =>{
        handScene.drawTriangle({
          model:this.triangle,
          points:null
        });
      }

      const hideCircles = () =>{
        handScene.drawShapes({
          model:this.circle,
          center:null,
          radius: 0
        });
      }

      //最初に全部消す
      hideLines();
      hideTriangles();
      hideCircles();

      //チョキの場合
      if(result.length && result[0] === "CHOKI"){
        //画像は描画しない
        this.isImageShow = false;
        
        //三角形描画
        handScene.drawTriangle({
          model:this.triangle,
          points:[
            handObjects["thumb"][1],
            handObjects["index"][2],
            handObjects["middle"][2],
            handObjects["thumb"][1]
          ],
        });
      
      //パーの場合
      } else if(result.length && result[0] === "PAA"){
        //画像は描画しない
        this.isImageShow = false;

        //三角形描画
        handScene.drawPaaLines({
          lines:this.lines,
          points:[
            [handObjects["index"][2], this.prevHandObjects["index"][2]],
            [handObjects["middle"][2], this.prevHandObjects["middle"][2]],
            [handObjects["ring"][2], this.prevHandObjects["ring"][2]],
            [handObjects["pinky"][2], this.prevHandObjects["pinky"][2]],
          ]
        });
      
      //グーの場合
      } else if(result.length && result[0] === "GUU"){
        //画像は描画しない
        this.isImageShow = false;

        //半径
        const radius = handObjects["thumb"][1].distanceTo(handObjects["thumb"][0]);

        //三角形描画
        handScene.drawShapes({
          model:this.circle,
          center:handObjects["thumb"][1],
          radius:radius * 0.3
        });

      } else {
        //画像は描画する
        this.isImageShow = true;
      }
      this.prevHandObjects = handObjects;
    },
    //テキストアニメーション
    setText() {
      const texts = [...this.data[this.ImageIndex].text];
      let _texts = new Array(texts.length);
      for (let i = 0; i < texts.length; i++) {
        setTimeout(()=>{
          const w = new Worker();
          w.postMessage({ text:texts[i], time:50, interval:20 });
          w.addEventListener("message", (t) => {
            _texts[i] = t.data;
            this.$emit("set-text", [..._texts]);
          });
        },100*i);
      }
    },
    //指を描画後に人差し指と親指の距離を取得
    updateSwitch(result,callback) {
      if (this.switch !== result) {
        //result => true 閉じてる、false 開いてる
        this.switch = result;
        if (result) {
          //300ms以上閉じるとコールバック
          this.timer.setTimer(300, () => {
            callback();
          });
        } else {
          this.timer.clearTimer();
        }
      }
    },
    //thumb, index, middle
    updateEdges(thumb, index, middle) {
      const v = [thumb, index, middle];
      console.log("v =", v.length);

      //パーティクル描画
      // handScene.drawCommet({
      //   model: this.commet,
      //   scale_rate: 5.0,
      //   landmarks: index
      // });

    },
    showModel(landmarks) {
      if (this.switch || !this.isImageShow) {
        this.hideAll();
        return;
      }

      //オブジェクトを表示
      handScene.drawModel({
        model: this.Images[this.ImageIndex],
        scale_rate: 0.15,
        landmarks: landmarks[0].landmarks
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
    }
  }
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
  color:white;
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
