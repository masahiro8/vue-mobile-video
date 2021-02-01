<template>
  <div id="app">
    <VideoToCanvas />
  </div>
</template>

<script>
import VideoToCanvas from "./page/VideoToCanvas";

export default {
  name: "App",
  components: {
    VideoToCanvas,
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
