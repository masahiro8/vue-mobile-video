export const updateImageAndText = ({
  handScene,
  landmarks,
  index,
  data,
  images,
  callback,
}) => {
  //オブジェクトを表示
  handScene.drawModel({
    model: images[index],
    scale_rate: 0.15,
    landmarks: landmarks[0].landmarks,
  });

  //テキストを表示
  const texts = [...data[this.ImageIndex].text];
  let _texts = new Array(texts.length);
  for (let i = 0; i < texts.length; i++) {
    setTimeout(() => {
      const w = new Worker();
      w.postMessage({ text: texts[i], time: 50, interval: 20 });
      w.addEventListener("message", (t) => {
        _texts[i] = t.data;
        callback([..._texts]);
      });
    }, 100 * i);
  }
};
