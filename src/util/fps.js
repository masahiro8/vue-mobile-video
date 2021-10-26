/**
 * FPSを設定してコールバックする
 *
 * fps=10でコールバックされる
 * fps(()=>{},10);
 *
 */
const _fps = () => {
  let fps;
  let callbacks = [];

  let dTime = 0;
  let lastTime = new Date().getTime();

  const setCallback = (callback, v) => {
    fps = v;
    callbacks.push(callback);
    predict();
  };
  const publsh = () => {
    for (let i = 0; i < callbacks.length; i++) {
      callbacks[i]();
    }
  };
  const predict = () => {
    requestAnimationFrame(predict);
    dTime = new Date().getTime() - lastTime;
    if (dTime > 1000 / fps) {
      publsh();
      lastTime = new Date().getTime();
    }
  };
  return {
    setCallback,
  };
};

const fpsWorker = _fps();
export { fpsWorker };
