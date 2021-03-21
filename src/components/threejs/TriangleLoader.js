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

/**
 *
 * TODO sceneでエラーになるので、とりあえずHandSceneの中で実装してる
 * THREEjsのsceneは参照を渡せなかったかも
 */
// const _TriangleModel = () => {
//   let _scene = null;
//   let _triangles = null;
//   const addTriangle = ({ scene, triangles }) => {
//     return new Promise((resolved) => {
//       const index = triangles.length;
//       triangles.push({
//         id: index,
//         obj: new THREE.Line(),
//       });

//       //初期化
//       const points = [
//         new THREE.Vector3(),
//         new THREE.Vector3(),
//         new THREE.Vector3(),
//       ];
//       TriangleLoader({
//         points: points,
//         callback: (obj) => {
//           triangles[index].obj = obj;
//           triangles[index].obj.visible = true;
//           scene.add(triangles[index].obj);
//           _scene = scene;
//           _triangles = triangles;
//           resolved(triangles[index]);
//         },
//       });
//     });
//   };

//   /**
//    * 三角形を描画
//    * @param {Object} param0
//    */
//   const drawTriangle = async ({ model, thumb, index, middle }) => {
//     if (!thumb && !index && !middle) {
//       //参画を非表示
//       _triangles[model.id].obj.geometry.setFromPoints([
//         new THREE.Vector3(),
//         new THREE.Vector3(),
//         new THREE.Vector3(),
//         new THREE.Vector3(),
//       ]);
//       _triangles[model.id].obj.visible = false;
//       return;
//     }

//     const vecs = [thumb, index, middle, thumb];
//     _triangles[model.id].obj.geometry.setFromPoints(vecs);
//     _triangles[model.id].obj.visible = true;

//     //残像を描画
//     const obj_clone = _triangles[model.id].obj.clone();
//     _scene.add(obj_clone);
//     const clone = await addTriangle();
//     clone.obj.geometry.setFromPoints(vecs);
//     clone.obj.visible = true;
//     setTimeout(() => {
//       clone.obj.visible = false;
//     }, 1000);
//   };

//   return {
//     addTriangle,
//     drawTriangle,
//   };
// };

// const TriangleModel = _TriangleModel();
// export { TriangleModel };
