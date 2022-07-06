import http from "http";
import { apiUrl, globalData } from "../config.js";
import { getTourByPage, getTourById } from "./utils.js";
import { rndInt, filterText, filterLineBreaks } from "./utils.js";

const firstPage = getTourByPage();

export function initDB() {
  http.get(apiUrl + firstPage, (res) => {
    let raw = "";

    res.on("data", (chunk) => (raw += chunk));

    res.on("end", () => {
      globalData.tours.data = JSON.parse(raw);
      globalData.tours.total = globalData.tours.data["hydra:totalItems"];
    });
  });
}

export function getQuestion() {
  const rndPage = rndInt(1, globalData.tours.total);

  return new Promise((resolve) => {
    http.get(apiUrl + getTourByPage(rndPage), (res) => {
      let raw = "";

      res.on("data", (chunk) => (raw += chunk));

      res.on("end", () => {
        const data = JSON.parse(raw);

        const id = data["hydra:member"][0].id;

        http.get(apiUrl + getTourById(id), (res) => {
          let raw = "";

          res.on("data", (chunk) => (raw += chunk));

          res.on("end", () => {
            const data = JSON.parse(raw);

            const question = data.questions[rndInt(0, data.questions.length - 1)];

            globalData.current.data = data;
            globalData.current.dataq = question;
            globalData.current.question = filterLineBreaks(question.question);
            globalData.current.answer = question.answer;
            globalData.current.answerf = filterText(question.answer);
            globalData.current.comment = filterLineBreaks(question.comments);

            resolve();
          });
        });
      });
    });
  });
}

export default {
  initDB,
  getQuestion,
};
