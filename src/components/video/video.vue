<template>
  <div class="source">
    <div ref="videoframe" class="videoFrame">
      <video
        id="srcVideo"
        class="video"
        ref="video"
        playsinline
        muted
        autoplay
      />
    </div>
    <div ref="canvasframe" class="canvasFrame">
      <canvas
        id="video_shadow"
        class="video_shadow"
        ref="video_shadow"
        :width="video_rect.width"
        :height="video_rect.height"
      ></canvas>
    </div>
  </div>
</template>
<script>
import { adjustVideoSize } from "./adjustVideoSize";
import { WINDOW_WIDTH } from "./config";

const animationFrame = () => {
  let callbacks = [];
  const tick = () => {
    callbacks.map((callback) => {
      if (callback) {
        callback();
      }
    });
    requestAnimationFrame(tick);
  };
  const setCallback = (callback) => {
    callbacks.push(callback);
  };
  tick();

  return {
    setCallback,
  };
};
const animFrame = animationFrame();

export default {
  name: "vid",
  data: () => {
    return {
      video_rect: { width: 0, height: 0 },
      videoAnimationFrame: null,
      points: null,
    };
  },
  async mounted() {
    const video = document.getElementById("srcVideo");

    await this.initCamera(video);
    setTimeout(() => {
      animFrame.setCallback(async () => {});
    }, 500);

    const { left } = this.videoFrameAdjust();
    const info = adjustVideoSize(this.$refs.video, { left });
    this.video_rect = {
      width: info.rect.width,
      height: info.rect.height,
      left: info.rect.x,
      top: info.rect.y,
    };

    if (left < 0) {
      this.$refs.video_shadow.style.left = `${Math.abs(left)}px`;
    } else {
      this.$refs.video_shadow.style.left = `-${Math.abs(left)}px`;
    }

    this.$emit("ready", info);
  },
  methods: {
    videoFrameAdjust() {
      const rect = this.$refs.videoframe.getBoundingClientRect();
      const left = (WINDOW_WIDTH - rect.width) / 2;
      return { left };
    },
    //繧ｫ繝｡繝ｩ繧定ｵｷ蜍�
    initCamera(video) {
      return new Promise((resolved, rejected) => {
        let media = navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: "user",
          },
        });
        media
          .then((stream) => {
            video.muted = true;
            video.playsinline = true;
            video.onloadedmetadata = (e) => {
              resolved(true);
            };
            video.srcObject = stream;
          })
          .catch((err) => {
            alert(err);
            rejected(false);
          });
      });
    },
    //video_shadow縺ｫ謠冗判
    drawVideoOnCavnvas() {
      if (!this.video_rect || !this.$refs.video_shadow) return;
      const ctx = this.$refs.video_shadow.getContext("2d");
      ctx.clearRect(0, 0, this.video_rect.width, this.video_rect.height);
      ctx.save();

      ctx.drawImage(
        this.$refs.video,
        this.video_rect.left,
        0,
        this.video_rect.width,
        this.video_rect.height
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.source {
  position: absolute;
  width: 375px;
  height: 100%;
  overflow: hidden;
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
  overflow: hidden;
}

.canvasFrame {
  // visibility: hidden;
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
  z-index: 2;
  transform: scale(-1, 1);
  box-sizing: border-box;
}
</style>