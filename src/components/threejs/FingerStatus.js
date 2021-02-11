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

export const FINGER_STATUS = {
  INDEX_FINGER: { key: "indexFinger", index: [6, 7, 8] },
  MIDDLE_FINGER: { key: "middleFinger", index: [10, 11, 12] },
  RING_FINGER: { key: "ringFinger", index: [14, 15, 16] },
  PINKY: { key: "pinky", index: [18, 19, 20] }
};

/**
 * ジェスチャの判定用のそれぞれの状態
 */
const GESTURE_STATUS = {
  PAA: [true, true, true, true],
  GUU: [false, false, false, false],
  CHOKI: [true, true, false, false]
};

//指の曲がりを判定する境界の角度
const borderAngle = 170;

export const getGesture = (handmeshes) => {
  //指の角度
  const angles = Object.keys(FINGER_STATUS).map((key) => {
    const indexs = FINGER_STATUS[key].index;
    return getFingerStatusByAngle(handmeshes, indexs);
  });

  //指の位置
  const position = Object.keys(FINGER_STATUS).map((key) => {
    const indexs = FINGER_STATUS[key].index;
    return getFingerStatusByPosition(handmeshes, indexs);
  });

  //判定
  const result = Object.keys(GESTURE_STATUS).filter((key) => {
    let counter_angle = 0;
    let counter_position = 0;

    const status = GESTURE_STATUS[key];
    for (let i = 0; i < angles.length; i++) {
      if (status[i] === angles[i] > borderAngle) {
        counter_angle++;
      }
    }

    for (let i = 0; i < position.length; i++) {
      if (status[i] === position[i]) {
        counter_position++;
      }
    }

    return counter_position === GESTURE_STATUS[key].length;
    // return counter_angle === GESTURE_STATUS[key].length;
  });

  // console.log(result);
};

/**
 *
 * 指の角度を取得
 *
 * @param {*} handmeshes
 * @param {*} fingerIndex
 */
export const getFingerStatusByAngle = (handmeshes, fingerIndex) => {
  const n1 = handmeshes[fingerIndex[0]].position.clone();
  const n2 = handmeshes[fingerIndex[1]].position.clone();
  const n3 = handmeshes[fingerIndex[2]].position.clone();
  const _n1 = n1.sub(n2);
  const _n3 = n3.sub(n2);
  const angle = _n1.angleTo(_n3);
  const _angle = angle * (180 / Math.PI);
  // console.log("_angle ", _angle);
  return _angle;
};

/**
 * 関節の位置関係を取得
 * @param {*} handmeshes
 * @param {*} fingerIndex
 */
export const getFingerStatusByPosition = (handmeshes, fingerIndex) => {
  const n1 = handmeshes[fingerIndex[0]].position.clone();
  const n3 = handmeshes[fingerIndex[2]].position.clone();
  const position = n1.y < n3.y;
  // console.log("position ", position);
  return position;
};
