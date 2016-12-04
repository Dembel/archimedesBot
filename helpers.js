/*
 * Helper fuctions
 */

"use strict";

const detectLanguage = text => {
  const RU = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";
  const sample = Array.from(text).filter(val => isNaN(Number(val)));

  return RU.includes(sample[0].toLowerCase()) ? "ru" : "en";
};

module.exports = {
  detectLanguage: detectLanguage
}