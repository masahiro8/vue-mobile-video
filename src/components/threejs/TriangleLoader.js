import * as THREE from "three";

//https://threejs.org/docs/#api/en/objects/Line

export const TriangleLoader = ({ points, callback }) => {
  let geo;
  let mat;
  let lines;

  const vecs = [];
  points.forEach((point) => {
    vecs.push(point);
  });
  geo = new THREE.BufferGeometry();
  geo.elementNeedUpdate = true;
  mat = new THREE.LineBasicMaterial({
    color: 0xff8800,
    linewidth: 5,
  });
  lines = new THREE.Line(geo, mat);
  lines.geometry.setFromPoints(vecs);
  callback(lines);
};
