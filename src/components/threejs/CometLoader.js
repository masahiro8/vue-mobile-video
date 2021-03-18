import * as THREE from "three";
// 画像を読み込む
export const CometLoader = (path, callback) => {
  let circlesLength = 300;
  let circles = [];

  class Circle {
    constructor(texture, geometry) {
      let material = new THREE.MeshBasicMaterial({
        map: texture,
        color: 0xbacbff,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
      });
      this.mesh = new THREE.Mesh(geometry, material);

      this.mesh.position.x = -0.5 + Math.random() * 1;
      this.mesh.position.y = -0.5 + Math.random() * 1;
      let randomSize = Math.random() + 0.5;
      this.mesh.scale.x = randomSize;
      this.mesh.scale.y = randomSize;
      this.xDirection = Math.floor(Math.random() * 10) % 2 == 0 ? true : false;
      this.yDirection = Math.floor(Math.random() * 10) % 2 == 0 ? true : false;
      this.xMoveSpeed = Math.random() * 2.5;
      this.yMoveSpeed = Math.random() * 1.5;
      this.lifeCount = Math.random() * 0.1;
    }
  }

  let wrap = new THREE.Object3D();

  let texture = new THREE.TextureLoader().load(path, () => {
    let geometry = new THREE.PlaneGeometry(10, 10);

    for (let i = 0; i < circlesLength; i++) {
      let circle = new Circle(texture, geometry);

      wrap.add(circle.mesh);
      circles.push(circle);
    }

    callback(wrap, circles);
  });
};
