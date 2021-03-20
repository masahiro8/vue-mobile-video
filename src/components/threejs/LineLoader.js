import * as THREE from "three";

//https://threejs.org/docs/#api/en/objects/Line

export const LineLoader = ({ points, color, callback }) => {
  let geo;
  let mat;
  let lines;
  //pointsはすでにVector3
  // console.log("points", [...points]);
  const vecs = [];
  vecs.push(points[0]);
  vecs.push(points[1]);
  geo = new THREE.BufferGeometry();
  geo.elementNeedUpdate = true;
  mat = new THREE.LineBasicMaterial({
    color,
    linewidth: 2,
  });
  lines = new THREE.Line(geo, mat);
  lines.geometry.setFromPoints(vecs);
  callback(lines);
};
