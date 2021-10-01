<template>
  <div id="app">
    <Face :data="products" :shader="shader" :textures="textures" />
    <ProductUi />
  </div>
</template>

<script>
  import Face from "./page/Face";
  import ProductUi from "./ui/ProductUi/index.vue";
  import { VS_CODE, FS_CODE } from "@/shader/face.js";
  import { Store } from "@/store/Store";

  export default {
    name: "App",
    components: {
      Face,
      ProductUi,
    },
    data: () => {
      return {
        shader: {
          fs: null,
          vs: null,
        },
        textures: [],
      };
    },
    computed: {
      products() {
        return Store.getters["Products/getData"];
      },
    },
    mounted() {
      Store.dispatch("Products/load", {});

      // this.loadData();
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
