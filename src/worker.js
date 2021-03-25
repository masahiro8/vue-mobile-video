/** */
const randomText = (str = "--", time, interval, callback) => {
  let counter = str.length;
  let text = [];

  const randamOneText = (str) => {
    const _str = `${str}______.....------●●●●●======''''''',,,,,■■■■||||||▶▶︎▶︎▶︎▶︎`;
    const r = Math.floor(Math.random() * _str.length);
    return _str.slice(r, r + 1);
  };

  const timeout = (time) => {
    return new Promise((result) => {
      const st = setTimeout(() => {
        clearTimeout(st);
        result();
      }, time);
    });
  };

  const timer2 = (i, t, str, n, callback) => {
    const interval = Math.floor(t / i);
    let counter = 0;
    const req = () => {
      const timeout = setTimeout(() => {
        counter += interval;
        if (counter >= t) {
          const _str = str.split("");
          clearTimeout(timeout);
          callback(_str[n]);
        } else {
          clearTimeout(timeout);
          callback(randamOneText(str));
          req();
        }
      }, interval);
    };
    req();
  };

  //文字確定
  const timer1 = async () => {
    await timeout(time);

    if (counter > 0) {
      const index = str.length - counter;
      timer2(
        interval,
        time * Math.floor(Math.random() * 2),
        str,
        index,
        (v) => {
          text[index] = v;
          callback(text.join(""));
        }
      );
      counter--;
      timer1();
    }
  };
  timer1();
};

/**
 * 座標間の複数のランダムな座標を返す
 * @returns
 */
const TH_crowd = () => {
  const getPointsFrom2Point = (point1, point2, split) => {
    let points = [];
    const step_x = (point2.x - point1.x) / split;
    const step_y = (point2.y - point1.y) / split;
    const step_z = (point2.z - point1.z) / split;
    for (let i = 0; i < split; i++) {
      points.push({
        x: point1.x + step_x * i,
        y: point1.y + step_y * i,
        z: point1.z + step_z * i,
      });
    }
    return points;
  };

  const getRandomPosition = ({ center, num, radial }) => {
    const getPosition = () => {
      const getR = () => {
        return (Math.random() * 360 * Math.PI) / 180;
      };
      const x = radial * Math.sin(getR()) + center.x;
      const y = radial * Math.cos(getR()) + center.y;
      const z = radial * Math.tan(getR()) + center.z;
      return { x, y, z };
    };
    let pos = [];
    for (let i = 0; i < num; i++) {
      pos.push(getPosition());
    }
    return pos;
  };

  /**
   *
   * @param {*} param0
   * @returns
   */
  const getDivideRandomPointsFrom2Points = ({
    groups,
    splitNum, //２点間を補間する座標の数
    randomNum, //補間座標の周りに配置する点の数
    randomRadial, //補間座標の周りに配置する際の半径
  }) => {
    const _positions = groups.map((group) => {
      //２点間の分割頂点を取得
      const divide_points = getPointsFrom2Point(
        {
          x: group[0].x,
          y: group[0].y,
          z: group[0].z,
        },
        {
          x: group[1].x,
          y: group[1].y,
          z: group[1].z,
        },
        splitNum
      );
      const positions = divide_points.map((point) => {
        return getRandomPosition({
          center: point,
          num: randomNum,
          radial: randomRadial,
        });
      });
      return positions;
    });
    //1次限の配列に変換
    return _positions.flat(3);
  };

  return {
    getDivideRandomPointsFrom2Points,
    TH_crowd,
  };
};

self.addEventListener(
  "message",
  (e) => {
    const { f } = e.data;

    //ランダムテキスト
    if (f == "randomText") {
      const { text, time, interval } = e.data;
      randomText(text, time, interval, (t) => {
        self.postMessage(t);
      });
    }

    //ランダム座標
    if (f == "randamPosition") {
      const { points, splitNum, randomNum, randomRadial } = e.data;
      const p = TH_crowd().getDivideRandomPointsFrom2Points({
        groups: points,
        splitNum, //２点間を補間する座標の数
        randomNum, //補間座標の周りに配置する点の数
        randomRadial, //補間座標の周りに配置する際の半径
      });
      self.postMessage(p);
    }
  },
  false
);
