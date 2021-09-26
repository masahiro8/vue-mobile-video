import * as THREE from "three";
// 画像を読み込む
export const PlaneLoader = (path, callback) => {
  const texture = new THREE.TextureLoader().load(path, (tex) => {
    // 読み込み完了時
    // 縦横比を保って適当にリサイズ
    const w = 5;
    const h = tex.image.height / (tex.image.width / w);

    // 平面
    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshPhongMaterial({ map: texture });
    const plane = new THREE.Mesh(geometry, material);
    plane.scale.set(w, h, 1);
    callback(plane);
  });
};
