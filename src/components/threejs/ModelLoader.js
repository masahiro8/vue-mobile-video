import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export const ModelLoader = (path, callback) => {
  const loader = new GLTFLoader();
  loader.load(
    path,
    function (gltf) {
      callback(gltf.scenes[0].children[0]);
    },
    undefined,
    function (error) {
      console.error(error);
    }
  );
};
