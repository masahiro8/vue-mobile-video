<template>
  <div id="app">
    <VideoToCanvas :data="data" @set-text="setText" />
    <div class="overlayText">
      <p v-for="(text, index) in texts" :key="index" class="text">{{ text }}</p>
    </div>
  </div>
</template>

<script>
import Worker from "worker-loader!./worker.js";
import VideoToCanvas from "./page/VideoToCanvas";

const DATA = [
  { path: "./images/vrmonkey_512_512.jpg", text: ["© Backham Co., Ltd."] },
  {
    path: "./images/LOGO_512.jpg",
    text: ["韓国コスメの", "バーチャルメイクサービス", "MAHOU MAKE"],
  },
];

export default {
  name: "App",
  components: {
    VideoToCanvas,
  },
  data: () => {
    return {
      data: DATA,
      isLoading: true,
      texts: ["LOADING...", "© Backham Co., Ltd."],
    };
  },
  mounted() {
    this.loading();
  },
  methods: {
    async loading() {

      let _texts = new Array(this.texts.length);
      for (let i = 0; i < this.texts.length; i++) {
        //worker
        const w = new Worker();
        w.postMessage({ text:this.texts[i], time:50, interval:20 });
        w.addEventListener("message", (t) => {
          _texts[i] = t.data;
          this.texts = [..._texts];
        });
      }
      const timer = setTimeout(() => {
        if (this.isLoading) {
          this.loading();
        }else {
          clearTimeout(timer);
        }
      }, 2000);
    },
    setText(texts) {
      this.isLoading = false;
      this.texts = [...texts];
    },
  },
};
</script>

<style lang="scss">
body {
  padding: 0;
  margin: 0;
  overflow: hidden;
}
#app {
  overflow: hidden;
  margin: 0;
  padding: 0;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  overflow: auto;
}

.overlayText {
  position: fixed;
  width: 100%;
  z-index: 999;
  padding: 16px;

  .text {
    display: block;
    font-size: 14px;
    text-align: left;
    margin: 0;
  }
}
</style>
