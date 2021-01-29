import { WINDOW_HEIGHT, WINDOW_WIDTH } from "./config";

export const adjustVideoSize = (video, option = { left: 0 }) => {
  console.log("option", option.left);
  const video_size = {
    w: video.videoWidth,
    h: video.videoHeight
  };

  const video_window_rate = WINDOW_HEIGHT / video_size.h;

  const size = {
    w: video_size.w * video_window_rate,
    h: WINDOW_HEIGHT
  };

  const left = (size.w - WINDOW_WIDTH) / 2;
  const top = (size.h - WINDOW_HEIGHT) / 2;

  const styles = {
    width: size.w + "px",
    height: size.h + "px",
    left: -left - option.left + "px",
    top: -top + "px"
  };

  const video_rect = {
    x: left,
    y: top,
    width: size.w,
    height: size.h,
    rate: video_window_rate
  };

  video.width = size.w;
  video.height = size.h;
  video.style.width = styles.width;
  video.style.height = styles.height;
  video.style.left = styles.left;
  video.style.top = styles.top;

  // console.log(
  //   "this.video_window_rate",
  //   video_window_rate,
  //   "this.video_size.w",
  //   video_size.w,
  //   "WINDOW_WIDTH",
  //   WINDOW_WIDTH,
  //   "size.w",
  //   size.w,
  //   "size.w - WINDOW_WIDTH",
  //   size.w - WINDOW_WIDTH,
  //   "left",
  //   left
  // );
  // console.log("video_rect.width", video_rect.width, size.w);

  return {
    src: video,
    rect: video_rect
  };
};
