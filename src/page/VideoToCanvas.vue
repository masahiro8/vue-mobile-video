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
import { videoStream } from "../components/video/video.js";
import { handpose3d } from "../components/handpose/Handpose.js";
import { handScene } from "../components/threejs/HandScene.js";

export default {
  mounted() {
    videoStream({
      frameId: "frame",
      videoId: "srcVideo",
      canvasId: "video_shadow",
      detectScale: 1,
      //カメラ起動完了でコール
      readyCallback: (video_info) => {
        handScene.init({
          width: video_info.width,
          height: video_info.height,
          shiftleft: video_info.shiftleft,
          videoRef: "srcVideo",
          overflowRef: "overlay",
        });
        handpose3d({
          ref: "srcVideo",
          fps: 20,
          callback: (landmarks) => {
            handScene.setLandmark(landmarks);
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
  // height: 812px;
  /* overflow: hidden; */
  /* visibility: hidden; */
}

.overLay {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
  transform: scale(-1, 1);
  // height: 812px;
  /* overflow: hidden; */
  /* visibility: hidden; */
  canvas {
    position: absolute;
  }
}

.canvasFrame {
  //visibility: hidden;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  // background-color: white;
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