/*
 * Helper fuctions
 */

"use strict";

const detectLanguage = text => {
  const RU = ["а","б","в","г","д","е","ё","ж","з","и","й","к","л","м","н","о",
              "п","р","с","т","у","ф","х","ц","ч","ш","щ","ъ","ы","ь","э","ю",
              "я"];
  const cleanText = text.split("").filter(val => isNaN(Number(val)));

  return RU.indexOf(cleanText[0].toLowerCase()) >= 0 ? "ru" : "en";
};

module.exports = {
  detectLanguage: detectLanguage
}