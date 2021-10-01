<template>
  <div id="app">
    <Face :data="data" :shader="shader" :textures="textures" :style="style" />
  </div>
</template>

<script>
  import Face from "./page/Face";
  import { VS_CODE, FS_CODE } from "@/components/threejs/face/shader/shader.js";

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
      Face,
    },
    data: () => {
      return {
        data: DATA,
        shader: {
          fs: null,
          vs: null,
        },
        textures: [],
        style: {},
      };
    },
    mounted() {
      // 非同期で実行
      setTimeout(() => {
        this.shader = {
          fs: FS_CODE,
          vs: VS_CODE,
        };
        this.textures = ["/images/vrmonkey_512_512.jpg"];
      }, 1000);
    },
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
