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
  import { Store } from "@/store/Store";

  export default {
    data: () => {
      return {
        video_info: null,
        product: {
          // TODO 初期値は透明かな？
          textures: ["/images/LOGO_512.jpg"],
        },
      };
    },
    props: {
      data: {
        type: Object,
      },
      shader: {
        type: Object,
      },
    },
    mounted() {
      /**
       * 非同期で取得するデータが全て揃ったら描画開始
       */
      this.$watch(
        () => [this.shader, this.video_info, this.data],
        (values, oldValues) => {
          if (JSON.stringify(values) !== JSON.stringify(oldValues)) {
            const fsShader = values[0].fs;
            const vsShader = values[0].vs;
            const video_info = values[1];
            const data = values[2];
            if (fsShader && vsShader && video_info && data) {
              this.faceDraw();
            }
          }
        },
        {
          immediate: true,
          deep: true,
        }
      );

      /**
       * 商品を選択
       */
      this.$watch(
        () => Store.getters["Products/getProduct"],
        (newPdt, oldPdt) => {
          if (JSON.stringify(newPdt) !== JSON.stringify(oldPdt)) {
            // TODO 実装用に仮でテクスチャを設定
            const textures = [
              {
                file_path: "/images/_eyeshadow.png",
              },
            ];
            this.product = { ...newPdt, textures };
            this.updateMaterial();
          }
        },
        { deep: true }
      );

      // ビデオ開始
      this.initVideo();
    },
    methods: {
      /**
       * ビデオの初期化
       */
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
          vsShader: this.shader.vs,
          fsShader: this.shader.fs,
          textures: this.product.textures,
          stylesRgb: this.product.stylesRgb,
          styles: this.product.styles,
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

      /**
       * 選択した商品が変わったら
       * マテリアルに必要なデータを更新
       */
      updateMaterial() {
        const { textures, stylesRgb, styles } = this.product;
        faceScene.updateMaterial({ textures, stylesRgb, styles });
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
