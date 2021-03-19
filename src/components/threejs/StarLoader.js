import * as THREE from "three";
// 画像を読み込む
export const StarLoader = (path, callback) => {
  let starsLength = 100;
  let stars = [];

  class Star {
    constructor(texture, geometry) {
      let opacity = Math.random() + 0.1;
      let material = new THREE.MeshBasicMaterial({
        map: texture,
        color: 0xfcffd9,
        transparent: true,
        opacity: opacity,
        blending: THREE.AdditiveBlending
      });
      this.mesh = new THREE.Mesh(geometry, material);

      let randomSize = Math.random() * 0.1;
      this.mesh.scale.x = randomSize;
      this.mesh.scale.y = randomSize;
      this.xDirection = Math.floor(Math.random() * 10) % 2 == 0 ? true : false;
      this.yDirection = Math.floor(Math.random() * 10) % 2 == 0 ? true : false;
      this.xMoveSpeed = Math.random() * 31;
      this.yMoveSpeed = Math.random() * 17;
    }
  }

  let wrap = new THREE.Object3D();

  let texture = new THREE.TextureLoader().load(path, () => {
    texture.needsUpdate = true;

    let geometry = new THREE.PlaneGeometry(50, 50);

    for (let i = 0; i < starsLength; i++) {
      let star = new Star(texture, geometry);

      wrap.add(star.mesh);
      stars.push(star);
    }

    callback(wrap, stars);
  });
};
