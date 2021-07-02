const fs = require("fs");
const Err = require("./errors");

function readJson(pathToJson) {
  if (fs.existsSync(pathToJson)) {
    try {
      var content = fs.readFileSync(pathToJson, "utf-8").toString();
      var contentJson = JSON.parse(content);
      return contentJson;
    } catch (error) {
      throw new Err(
        100,
        "Read Error",
        "Given JSON file is empty or has incorrect JSON syntax."
      );
    }
  } else {
    throw new Err(101, "Read Error", "Given JSON file is not present.");
  }
}

async function writeJson(pathToJson, writeData) {
  if (fs.existsSync(pathToJson)) {
    try {
      var contentJson = JSON.stringify(writeData, null, 2);
      fs.writeFileSync(pathToJson, contentJson, "utf-8");
    } catch (error) {
      throw new Err(
        100,
        "Read Error",
        "Given JSON file is empty or has incorrect JSON syntax."
      );
    }
  } else {
    throw new Err(101, "Read Error", "Given JSON file is not present.");
  }
}

function compareFunction(key, order = "asc") {
  return function innerSort(a, b) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      return 0;
    }
    const varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
    const varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];
    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return order === "desc" ? comparison * -1 : comparison;
  };
}

module.exports.readJson = readJson;
module.exports.writeJson = writeJson;
module.exports.compareFunction = compareFunction;