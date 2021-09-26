<template>
  <div id="frame" class="source">
    <div class="videoFrame">
      <video
        ref="srcVideo"
        id="srcVideo"
        class="video"
        playsinline
        muted
        autoplay
      />
    </div>
    <div class="canvasFrame">
      <canvas id="video_shadow" class="video_shadow"></canvas>
    </div>
    <div id="overlay" class="overLay"></div>
  </div>
</template>
<script>
  import { videoStream } from "../components/video/videoStream.js";
  import { faceLandmarks } from "../components/tf/FaceLandmarks.js";
  import { faceScene } from "../components/threejs/FaceScene.js";

  export default {
    data: () => {
      return {
        switch: false,
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
          console.log("video_info", { ...video_info });
          //3Dシーンを初期化
          await faceScene.init({
            width: video_info.width,
            height: video_info.height,
            shiftleft: video_info.shiftleft,
            overflowRef: "overlay",
            videoRate: video_info.rate,
            texturePath: "/images/vrmonkey_512_512.jpg",
          });
          const rect = document
            .querySelector("#srcVideo")
            .getBoundingClientRect();
          console.log("init", rect);

          //ここで検出情報を取得
          faceLandmarks({
            ref: "srcVideo",
            fps: 1,
            callback: (landmarks) => {
              // console.log("landmarks", landmarks);
              const _landmarks = landmarks.map((item) => {
                return {
                  x: `${item.x}`,
                  y: `${item.y}`,
                  z: `${item.z}`,
                };
              });
              document.getElementById("tri").innerHTML = JSON.stringify(
                _landmarks
              );
              faceScene.drawMesh({
                srcVideoId: "srcVideo",
                landmarks,
              });
              // faceScene.drawScreen({
              //   srcVideoId: "srcVideo",
              //   landmarks,
              // });
            },
          });
        },
      });
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
