<template>
  <div id="app">
    <VideoToCanvas :data="data" />
  </div>
</template>

<script>
import Worker from "worker-loader!./worker.js";
import VideoToCanvas from "./page/VideoToCanvas";

const DATA = [
  { path: "./images/vrmonkey_512_512.jpg", text: "" },
  {
    path: "./images/LOGO_512.jpg",
    text: "韓国コスメのバーチャルメイクサービス MAHOU MAKE",
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
    };
  },
  mounted(){
    const w = new Worker();
    w.postMessage({ test: "Send from main thread" });
    w.addEventListener("message", (e) => console.log(e.data));
  }
};
</script>

<style>
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
</style>
