export const videoStream = async ({
  frameId,
  videoId,
  canvasId,
  detectScale,
  readyCallback,
}) => {
  const WINDOW_WIDTH = window.innerWidth;
  const WINDOW_HEIGHT = window.innerHeight;

  const frame = document.getElementById(frameId);
  const video = document.getElementById(videoId);
  const canvas = document.getElementById(canvasId);

  let isStreamingVideo = false;
  let video_info = {
    x: null,
    y: null,
    width: null,
    height: null,
    rate: null,
    rate_back: null,
  };

  /**
   * カメラの起動
   */
  const initCamera = () => {
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
          video.onloadedmetadata = () => {
            resolved(true);
          };
          video.srcObject = stream;
        })
        .catch((err) => {
          alert(err);
          rejected(false);
        });
    });
  };

  /**
   * videoのサイズを画面のサイズに最適化
   * 画面の高さにvideoの高さを合わせる
   */
  const adjustVideoSize = () => {
    const video_window_rate = WINDOW_HEIGHT / video.videoHeight;
    const video_window_rate_back = video.videoHeight / WINDOW_HEIGHT;

    const size = {
      w: video.videoWidth * video_window_rate,
      h: WINDOW_HEIGHT,
    };

    const left = (size.w - WINDOW_WIDTH) / 2;
    const top = (size.h - WINDOW_HEIGHT) / 2;
    // const option_left = (WINDOW_WIDTH - frame.width) / 2;

    const styles = {
      width: size.w + "px",
      height: size.h + "px",
      left: -left + "px",
      top: -top + "px",
    };

    video.width = size.w;
    video.height = size.h;
    video.style.width = styles.width;
    video.style.height = styles.height;
    video.style.left = styles.left;
    video.style.top = styles.top;

    video_info = {
      x: left,
      y: top,
      width: size.w,
      height: size.h,
      shiftleft: -left,
      videoWidth: video.videoWidth,
      videoHeight: video.videoHeight,
      rate: video_window_rate,
      rate_back: video_window_rate_back,
    };
  };

  /**
   * 描画canvasのサイズ
   */
  // const adjustCanvasSize = () => {
  //   const frameRect = video.getBoundingClientRect();
  //   // const rate = video_info.rate_back;
  //   // //動画を描画するcanvasは動画と同解像度
  //   canvas.width = frameRect.width;
  //   canvas.height = frameRect.height;
  //   // canvas.width = `${Math.floor(frameRect.width * rate * detectScale)}`;
  //   // canvas.height = `${Math.floor(frameRect.height * rate * detectScale)}`;
  // };

  /**
   * 動画を描画
   */
  const drawOnCanvas = () => {
    const frameRect = frame.getBoundingClientRect();

    //縮小率
    const rate = video_info.rate_back;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, frameRect.width, frameRect.height);
    ctx.save();

    //動画の切り取り範囲
    const sx = Math.floor((video.videoWidth - frameRect.width * rate) / 2);
    const sy = Math.floor((video.videoHeight - frameRect.height * rate) / 2);
    const sw = Math.floor(frameRect.width * rate);
    const sh = Math.floor(frameRect.height * rate);

    console.log(sx, sy, sw, sh);

    ctx.drawImage(
      video,
      sx,
      sy,
      sw,
      sh,
      0,
      0,
      frameRect.width * rate * detectScale,
      frameRect.height * rate * detectScale
    );
  };

  const stopVideoStream = () => {
    isStreamingVideo = false;
  };

  const replayVideoStream = () => {
    isStreamingVideo = true;
  };

  const render = () => {
    if (isStreamingVideo) {
      drawOnCanvas();
    }
    requestAnimationFrame(render);
  };

  await initCamera();
  adjustVideoSize();
  // adjustCanvasSize();
  readyCallback(video_info);
  // isStreamingVideo = true;
  render();

  return {
    initCamera,
    stopVideoStream,
    replayVideoStream,
  };
};
