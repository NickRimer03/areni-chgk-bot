export const filter = new RegExp(/[.,:;!«»()"'\[\]]/g);
export const picFilter = new RegExp(/\d+.[a-zA-Z]{3,4}/);

export const apiUrl = "http://www.db.chgk.info";
export const imgUrl = "https://db.chgk.info/images/db/";

export const globalData = {
  gameInProgress: false,
  tours: {
    data: null,
    total: 0,
  },
  current: {
    data: null,
    question: "",
    answer: "",
    comment: null,
  },
};

export default {
  picFilter,
  filter,
  apiUrl,
  imgUrl,
  globalData,
};
