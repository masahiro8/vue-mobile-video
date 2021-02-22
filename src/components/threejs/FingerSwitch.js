/*
  指の番号
  fingerLookupIndices = {
    thumb       : [0, 1, 2, 3, 4],
    indexFinger : [0, 5, 6, 7, 8],
    middleFinger: [0, 9, 10, 11, 12],
    ringFinger  : [0, 13, 14, 15, 16],
    pinky       : [0, 17, 18, 19, 20]
  };
  */

/**
 * 親指と人差し指の距離
 */
export const getDistance = ({ handmeshes, callback }) => {
  const thumb = handmeshes[4].position.clone();
  const index = handmeshes[8].position.clone();
  const distance = thumb.distanceTo(index);
  callback(distance < 50);
};
