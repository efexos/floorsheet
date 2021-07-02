const path = require("path");
const https = require("https");
const fetch = require("node-fetch");

const Err = require("./errors");
const { readJson } = require("./readwrite");

const httpsAgent = new https.Agent({ keepAlive: true });

const settingsPath = path.join(__dirname, "..", "settings", "settings.json");

async function getStocksList() {
  try {
    var settings = readJson(settingsPath);
    var res = await fetch(
      "https://newweb.nepalstock.com/api/nots/security?nonDelisted=false",
      {
        method: "GET",
        agent: httpsAgent,
        headers: settings.headers,
        timeout: "2000",
      }
    );
    var resJson = await res.json();
    return resJson;
  } catch (error) {
    throw new Err(401, "TimeoutErr", "Time out while getting Stocks List");
  }
}

async function getBrokersList () {
  try {
    var settings = readJson(settingsPath);
    var res = await fetch(
      "https://newweb.nepalstock.com.np/api/nots/member?&size=50",
      {
        method: "POST",
        agent: httpsAgent,
        headers: settings.headers,
        body: JSON.stringify({
          memberName: "",
          contactPerson: "",
          contactNumber: "",
          memberCode: "",
          provinceId: 0,
          districtId: 0,
          municipalityId: 0,
        }),
        timeout: 5000,
      }
    );
    var resJson = await res.json();
    return resJson;
  } catch (error) {
    throw new Err(401, "TimeoutErr", "Time out while getting Brokers List");
  }
}

async function getSheet(
  pageNo = "0",
  pageSize = "500",
  stockId = false
) {
  var url = "https://newweb.nepalstock.com.np/api/nots/nepse-data/floorsheet";
  url = url + "?page=" + pageNo;
  url = url + "&size=" + pageSize;
  if (stockId) url = url + "&stockId=" + stockId;
  url = url + "&sort=contractId,desc";
  try {
    var settings = readJson(settingsPath);
    var res = await fetch(url, {
      method: "POST",
      agent: httpsAgent,
      headers: settings.headers,
      body: JSON.stringify({ id: settings.uselessCode.toString() }),
      timeout: "10000",
    });
    var resJson = await res.json();
    var sheet = resJson.floorsheets;
    if (sheet != undefined) return sheet;
    return null;
  } catch (error) {
    throw new Err(401, "TimeoutErr", "Time out while getting floorsheet page.");
  }
}

module.exports.getSheet = getSheet;
module.exports.getStocksList = getStocksList;
module.exports.getBrokersList = getBrokersList;
