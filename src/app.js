import TelegramBot from "node-telegram-bot-api";
import texts from "./texts.js";
import { initDB, getQuestion } from "./data.js";
import { picFilter, imgUrl, globalData } from "../config.js";

const { attention, next, more, confirmNext, code, bingo, comment, answer, help, error, stop } =
  texts;

export default () => {
  const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

  /**
   * Read user answer
   */
  bot.onText(/\/ответ (.+)/, ({ chat: { id } }, match) => {
    if (!globalData.gameInProgress) {
      return;
    }

    const { comment: commentary } = globalData.current;

    if (match[1].toLowerCase() === globalData.current.answerf) {
      const text =
        bingo +
        code[0] +
        globalData.current.answer +
        code[1] +
        (commentary !== null ? comment[0] + commentary + comment[1] : "") +
        next;

      bot.sendMessage(id, text, { parse_mode: "HTML" });
      globalData.gameInProgress = false;
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
