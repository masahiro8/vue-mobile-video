import { ENDPOINT } from "./api.config";

// とりあえずGETしかしないので、fetchAPIで取得するが、
// やることがふえたらaxiosで書き換える

export const api = () => {
  const URL_DATA = `${ENDPOINT}/data/facy-data.json`; // https://app.mahoumake.com/data/facy-data.json

  const getData = async () => {
    const res = await fetch(URL_DATA);
    return await res.json();
  };

  return {
    getData,
  };
};
