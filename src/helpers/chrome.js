const os = require("os");
const fs = require("fs");
const path = require("path");
const Chrome = require("chrome-launcher");
const CDebugPort = require("chrome-remote-interface");

const { readJson, writeJson } = require("./readwrite");

var newFlags = Chrome.Launcher.defaultFlags();

const settingsPath = path.join(__dirname, "..", "settings", "settings.json");

newFlags.push("--headless");
newFlags.push("--new-window");

var updateClient = async () => {
  const chrome = await Chrome.launch({
    port: 9221,
    chromeFlags: newFlags,
    ignoreDefaultFlags: true,
    startingUrl: "https://newweb.nepalstock.com/floor-sheet",
  });
  const client = await CDebugPort({ host: "localhost", port: chrome.port });
  const { Network } = client;

  await Promise.all([Network.enable()]);

  return new Promise((resolve) => {
    Network.setRequestInterception({
      patterns: [
        {
          urlPattern:
            "https://newweb.nepalstock.com/api/nots/nepse-data/floorsheet?&sort=contractId,desc",
          interceptionStage: "HeadersReceived",
        },
      ],
    });
    Network.requestIntercepted(async ({ interceptionId, request }) => {
      try {
        var settings = readJson(settingsPath);
      } catch (error) {
        var settings = {};
      }
      settings.headers = request.headers;
      settings.uselessCode = JSON.parse(request.postData).id;
      try {
        await writeJson(settingsPath, settings);
      } catch (error) {
        fs.writeFileSync(settingsPath, JSON.stringify(settings));
      }
      await client.close();
      if (os.platform() == "win32") await chrome.kill();
      else chrome.process.kill(1);
      resolve(true);
    });
  });
};

module.exports.updateClient = updateClient;
