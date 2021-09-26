import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export const ModelLoader = (path, callback) => {
  const loader = new GLTFLoader();
  loader.setCrossOrigin("anonymous");
  loader.load(
    path,
    function (gltf) {
      console.log("load model gltf", path);
      callback(gltf.scenes[0].children[0]);
    },
    undefined,
    function (error) {
      console.log("load model error", path, error);
      console.error(error);
    }
  );
};
