<template>
  <div id="app">
    <Face :data="data" />
    <!-- <ThreeMesh /> -->
    <textarea
      id="tri"
      cols="30"
      rows="10"
      style="position:absolute;z-index:99999"
    ></textarea>
  </div>
</template>

<script>
  import Face from "./page/Face";
  // import ThreeMesh from "./page/3DMesh";

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
      // ThreeMesh,
    },
    data: () => {
      return {
        data: DATA,
      };
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
