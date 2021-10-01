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
        video_info: null,
      };
    },
    props: {
      data: {
        type: Array,
      },
      shader: {
        type: Object,
      },
      textures: {
        type: Array,
      },
      style: {
        type: Object,
      },
    },
    mounted() {
      this.$watch(
        () => [this.shader, this.textures, this.video_info],
        (values, oldValues) => {
          if (JSON.stringify(values) !== JSON.stringify(oldValues)) {
            const fsShader = values[0].fs;
            const vsShader = values[0].vs;
            const textures = values[1];
            const video_info = values[2];
            if (fsShader && vsShader && video_info && textures.length > 0) {
              this.faceDraw();
            }
          }
        },
        {
          immediate: true,
          deep: true,
        }
      );
      this.initVideo();
    },
    methods: {
      initVideo() {
        //ここからビデオの映像を取得
        videoStream({
          frameId: "frame",
          videoId: "srcVideo",
          canvasId: "video_shadow",
          detectScale: 1,

          //カメラ起動完了でコール
          readyCallback: async (video_info) => {
            this.video_info = video_info;
          },
        });
      },

      /**
       * Three.js のシーンを作成
       */
      async faceDraw() {
        const video_info = this.video_info;
        //3Dシーンを初期化
        await faceScene.init({
          width: video_info.width,
          height: video_info.height,
          shiftleft: video_info.shiftleft,
          overflowRef: "overlay",
          videoRate: video_info.rate,
          texturePath: this.textures[0],
          vsShader: this.shader.vs,
          fsShader: this.shader.fs,
        });

        //動画をここでaiに渡す
        faceLandmarks({
          ref: "srcVideo",
          fps: 15,

          //検出情報を取得
          callback: (landmarks) => {
            faceScene.drawMesh({
              srcVideoId: "srcVideo",
              landmarks,
            });
          },
        });
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
