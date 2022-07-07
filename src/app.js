import TelegramBot from "node-telegram-bot-api";
import texts from "./texts.js";
import { initDB, getQuestion } from "./data.js";
import { picFilter, imgUrl, globalData } from "../config.js";

const {
  attention,
  next,
  more,
  confirmNext,
  code,
  bingo,
  comment,
  answer,
  help,
  error,
  stop,
  hint,
  repeat,
  wrong,
  wrongLength,
  rightLength,
} = texts;

export default () => {
  const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

  // TODO: команда для повтора вопроса
  // TODO: система подсчёта очков
  // TODO: в ответе показывать зачётные варианты (если таковые есть)
  // TODO: улучшить подсказку по символам

  /**
   * Read user answer
   */
  bot.onText(/\/ответ (.+)/, ({ chat: { id } }, match) => {
    if (!globalData.gameInProgress) {
      return;
    }

    const { comment: commentary } = globalData.current;
    const userAnswer = match[1].toLowerCase();
    const gameAnswer = globalData.current.answerf;

    if (userAnswer === gameAnswer) {
      const text =
        bingo +
        code[0] +
        globalData.current.answer +
        code[1] +
        (commentary !== null ? comment[0] + commentary + comment[1] : "") +
        next;

      bot.sendMessage(id, text, { parse_mode: "HTML" });
      globalData.gameInProgress = false;
    } else {
      let subtext = "";

      if (gameAnswer.length !== userAnswer.length) {
        subtext = wrongLength;
      } else {
        let matches = 0;

        for (const [i, c] of [...gameAnswer].entries()) {
          if (c === userAnswer[i]) {
            matches += 1;
          }
        }

        const percent = Math.round((matches * 100) / gameAnswer.length);
        subtext = matches + rightLength + `(${percent}%)`;
      }

      bot.sendMessage(id, wrong + subtext);
    }
  });

  /**
   * Ask bot for next question
   */
  bot.onText(/\/next/, ({ chat: { id } }) => {
    if (globalData.gameInProgress) {
      bot.sendMessage(id, confirmNext);

      return;
    }

    globalData.gameInProgress = true;

    bot.sendMessage(id, attention);

    getQuestion()
      .then(() => {
        const match = globalData.current.question.match(picFilter);

        if (match !== null) {
          bot.sendPhoto(id, imgUrl + match[0]);
        }

        bot.sendMessage(id, answer[0] + globalData.current.question + answer[1]);
      })
      .catch(() => {
        bot.sendMessage(id, error);
      });
  });

  /**
   * Ask bot for current answer
   */
  bot.onText(/\/answer/, ({ chat: { id } }) => {
    if (!globalData.gameInProgress) {
      return;
    }

    const { comment: commentary } = globalData.current;

    const text =
      answer[2] +
      code[0] +
      globalData.current.answer +
      code[1] +
      (commentary !== null ? comment[0] + commentary + comment[1] : "") +
      more;

    bot.sendMessage(id, text, { parse_mode: "HTML" });
    globalData.gameInProgress = false;
  });

  /**
   * Ask bot to give a hint
   */
  bot.onText(/\/hint/, ({ chat: { id } }) => {
    if (!globalData.gameInProgress) {
      return;
    }

    bot.sendMessage(id, hint + globalData.current.answerf.replace(/\S/g, "*"));
  });

  /**
   * Ask bot to repeat question
   */
  bot.onText(/\/repeat/, ({ chat: { id } }) => {
    if (!globalData.gameInProgress) {
      return;
    }

    bot.sendMessage(id, repeat + answer[0] + globalData.current.question + answer[1]);
  });

  /**
   * Ask bot to stop the game
   */
  bot.onText(/\/stop/, ({ chat: { id } }) => {
    if (globalData.gameInProgress) {
      globalData.gameInProgress = false;
      bot.sendMessage(id, stop);
    }
  });

  /**
   * Ask bot for help (command list)
   */
  bot.onText(/\/help/, ({ chat: { id } }) => {
    bot.sendMessage(id, help);
  });
};

initDB();
