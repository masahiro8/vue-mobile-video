import * as THREE from "three";

//https://threejs.org/docs/#api/en/geometries/CircleGeometry

export const CircleLoader = ({ size, color, callback }) => {
  let circle;
  const geometry = new THREE.CircleGeometry(size.radius, size.segments);
  const material = new THREE.LineBasicMaterial({ color: color });
  circle = new THREE.LineLoop(geometry, material);
  callback(circle);
};
