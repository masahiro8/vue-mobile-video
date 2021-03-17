export const randomText = (str = "--", time, interval, callback) => {
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
