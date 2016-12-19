const chai = require("chai");
const expect = chai.expect;
const help = require("../commands/help");
const config = require("../config.json");
const initialLang = config.lang;
const fs = require("fs");

describe("Help module tests for russian language", () => {
  let newConf = config;

  before(() => {
    newConf.lang = "ru";
    fs.writeFileSync("./config.json",
                     JSON.stringify(newConf, false, 2));

  });
  after(() => {
    newConf.lang = initialLang;
    fs.writeFileSync("./config.json",
                     JSON.stringify(newConf, false, 2));
  });

  it("should return Использование команды !help:\\n наберите " +
     "!help и желаемую\n команду без восклицательного знака\\n " +
     "Например: !help urbandef", done => {
    help([null, ""], data => {
      expect(data[1]).
        to.equal("Использование команды !help:\n наберите " +
                 "!help и желаемую команду без восклицательного знака\n " +
                 "Например: !help urbandef");
      done();
    });
  });
  it("should return !commands: показывает список доступных команд", done => {
    help([null, "commands"], data => {
      expect(data[1]).
        to.equal("!commands: показывает список доступных команд");
      done();
    });
  });
  it("should return !google: возвращает ссылку на страничку гугла" +
     " с результатами поиска.\\n\n Применение: !google <поисковый запрос>.\\n" +
     " Например: !google foo bar", done => {
    help([null, "google"], data => {
      expect(data[1]).
        to.equal("!google: возвращает ссылку на страничку гугла" +
                 " с результатами поиска.\n Применение: !google <поисковый" +
                 " запрос>.\n Например: !google foo bar");
      done();
    });
  });
  it("should return !title: меняет заголовок чата\\n\n Применение:" +
     " !title <новый заголовок>\\n Пример: !title foobar", done => {
    help([null, "title"], data => {
      expect(data[1]).
        to.equal("!title: меняет заголовок чата\n Применение:" +
                 " !title <новый заголовок>\n Пример: !title foobar");
      done();
    });
  });
  it("should return !urbandef: делает запрос слова или фазы из словаря\n" +
     " Urban dictionary и возврашает определение этого слова или фразы\n" +
     " (Только английский язык).\\n\n Применение: !urbandef <слово|фраза>" +
     "\\n\n Примеры: !urbandef pine | !urbandef pull one's leg", done => {
    help([null, "urbandef"], data => {
      expect(data[1]).
        to.equal("!urbandef: делает запрос слова или фразы из словаря" +
                 " Urban dictionary и возврашает определение этого слова или" +
                 " фразы (Только английский язык).\n Применение: !urbandef" +
                 " <слово|фраза>\n Примеры: !urbandef pine |" +
                 " !urbandef pull one's leg");
      done();
    });
  });
  it("should return !spellcheck: проверяет правильность написания" +
     " слова|фразы,\n возвращает тот же текст но с возможными вариантами" +
     " исправления в скобках.\\n\n Применение: !spellcheck <слово|фраза>." +
     "\\n\n Примеры: !spellcheck foobar" +
     " | !spellcheck foo bar foobar", done => {
    help([null, "spellcheck"], data => {
      expect(data[1]).
        to.equal("!spellcheck: проверяет правильность написания" +
                 " слова|фразы, возвращает тот же текст но с возможными" +
                 " вариантами исправления в скобках.\n Применение:" +
                 " !spellcheck <слово|фраза>.\n Примеры: !spellcheck foobar" +
                 " | !spellcheck foo bar foobar");
      done();
    });
  });
  it("should return !calc: калькулятор - вычисляет значение математического\n" +
     " выражения. Можно использовать * / + - ^, скобки, и отрицательные\n" +
     " числа.\\n Применение: !calc <математическое выражение>.\\n\n" +
     " Пример: !calc (-12 + 7) * 24 / (16 - 8)", done => {
    help([null, "calc"], data => {
      expect(data[1]).
        to.equal("!calc: калькулятор - вычисляет значение математического" +
                 " выражения. Можно использовать * / + - ^, скобки," +
                 " и отрицательные числа.\n Применение: !calc" +
                 " <математическое выражение>.\n" +
                 " Пример: !calc (-12 + 7) * 24 / (16 - 8)");
      done();
    });
  });
  it("should return Не знаю такой команды. Наберите !commands\n" +
  " чтобы посмотреть список доступных команд", done => {
    help([null, "foobar"], data => {
      expect(data[1]).
        to.equal("Не знаю такой команды. Наберите !commands" +
                 " чтобы посмотреть список доступных команд");
      done();
    });
  });
});