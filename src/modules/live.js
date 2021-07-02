const path = require("path");
const blessed = require("blessed");
const contrib = require("blessed-contrib");

const { getSheet } = require("../helpers/newweb");
const { readJson, compareFunction } = require("../helpers/readwrite");

var pageNo = 0;
var sheetList;
var stocksList;
var totalPages;
var sortBy = null;
var filterStock = null;

var stocklistPath = path.join(__dirname, "..", "data", "stockslist.json");

var screen = blessed.screen({
  smartCSR: true,
  fullUnicode: true,
  autoPadding: true,
});

var prompt = blessed.prompt({
  parent: screen,
  border: "line",
  height: "shrink",
  width: "half",
  top: "center",
  draggable: true,
  left: "center",
  label: "**Search**",
  tags: true,
  keys: true,
  vi: true,
  style: {
    border: {
      fg: "#FFFFFF",
    },
    hover: {
      border: {
        fg: "#C0C0C0",
      },
    },
    focus: {
      border: {
        fg: "#E18A07",
      },
    },
  },
});

var sheetTable = blessed.listtable({
  parent: screen,
  top: "0",
  left: "0",
  data: null,
  border: "line",
  align: "left",
  tags: true,
  keys: true,
  width: "100%",
  height: "100%",
  vi: true,
  mouse: true,
  scrollable: true,
  invertSelected: false,
  scrollbar: {
    ch: "#",
    track: {
      bg: "#C0C0C0",
    },
  },
  style: {
    border: {
      fg: "#FFFFFF",
    },
    hover: {
      border: {
        fg: "#C0C0C0",
      },
    },
    focus: {
      border: {
        fg: "#E18A07",
      },
    },
    header: {
      bold: true,
      fg: "#E18A07",
    },
    scrollbar: {
      bold: true,
      fg: "#000000",
      bg: "#E18A07",
    },
    cell: {
      hover: {
        bold: true,
      },
      selected: {
        bold: true,
        fg: "#000000",
        bg: "#C0C0C0",
      },
    },
  },
});

var stocksBox = blessed.box({
  parent: screen,
  shadow: false,
  left: "center",
  top: "center",
  width: "50%",
  height: "50%",
  border: "line",
  tags: true,
  style: {
    border: {
      fg: "#FFFFFF",
    },
    hover: {
      border: {
        fg: "#C0C0C0",
      },
    },
    focus: {
      border: {
        fg: "#E18A07",
      },
    },
  }
});

var stockList = blessed.list({
  parent: stocksBox,
  label: "",
  top: "center",
  left: "center",
  border: "line",
  keys: true,
  width: "100%",
  height: "100%",
  vi: true,
  mouse: true,
  scrollable: true,
  search: function (find) {
    prompt.input("Enter search string!!!", (err, val) => {
      if (val !== null) find(val.toUpperCase());
      screen.render();
    });
  },
  scrollbar: {
    ch: "#",
    track: {
      bg: "#C0C0C0",
    },
  },
  style: {
    border: {
      fg: "#FFFFFF",
    },
    focus: {
      border: {
        fg: "#E18A07",
      },
    },
    hover: {
      border: {
        fg: "#C0C0C0",
      },
    },
    scrollbar: {
      bold: true,
      fg: "#000000",
      bg: "#E18A07",
    },
    item: {
      hover: {
        bold: true,
      },
    },
    selected: {
      bold: true,
      fg: "#000000",
      bg: "#C0C0C0",
    },
  },
  items: this.items,
});

prompt.setIndex(9999);


async function parseStocks() {
  stocksList = [];
  var stocks = readJson(stocklistPath);
  var stockslength = stocks.length;
  if (stockslength !== 0) {
    for (var i = 0; i < stockslength; i++) {
      stocksList.push(stocks[i].symbol);
    }
    stockList.setItems(stocksList);
    screen.render();
  }
}

async function parseSheet() {
  sheetList = [];
  try {
    var res = await getSheet(
      pageNo.toString(),
      "39",
      filterStock
    );
    var sheet = res.content;
    totalPages = res.totalPages;
    if (sortBy == "amount") {
      sheet = sheet.sort(compareFunction("contractAmount", "desc"));
    }
    var factor = 39;
    var sheetlength = sheet.length;
    if (sheetlength != 0) {
      for (var i = 0; i < sheetlength; i++) {
        sheetList.push([
          (pageNo * factor + i + 1).toString(),
          sheet[i].contractId.toString(),
          sheet[i].stockSymbol,
          sheet[i].contractQuantity.toString(),
          sheet[i].contractRate.toString(),
          sheet[i].contractAmount.toString(),
          sheet[i].buyerMemberId.toString() +
            " (" +
            sheet[i].buyerBrokerName.split(" ")[0] +
            ")",
          sheet[i].sellerMemberId.toString() +
            " (" +
            sheet[i].sellerBrokerName.split(" ")[0] +
            ")",
          sheet[i].businessDate,
          sheet[i].tradeTime.split("T")[1],
        ]);
      }
      sheetList.unshift([
        "ID",
        "CONTRACTID",
        "STOCK",
        "QUANTITY",
        "RATE",
        "AMOUNT",
        "BUYER",
        "SELLER",
        "DATE",
        "TIME",
      ]);
      sheetTable.setData(sheetList);
      screen.render();
    }
  } catch (error) {}
}

screen.on("keypress", (ch, key) => {
  if (key.name === "tab")
    return key.shift ? screen.focusPrevious() : screen.focusNext();
  if (key.name === "q" && key.ctrl === true) return process.exit(0);
  if (key.name === "f" && key.ctrl === false) {
    stocksBox.toggle();
    stockList.focus();
    screen.render();
  }
  if (key.name === "s" && key.ctrl === false) {
    sortBy = "amount";
    parseSheet();
  }
  if (key.name === "r" && key.ctrl === false) {
    pageNo = 0;
    filterStock = null;
    sortBy = null;
    parseSheet();
  }
  if (key.name === "left" && key.ctrl === false) {
    if (pageNo > 0) pageNo--;
    else pageNo = totalPages - 1;
    parseSheet();
  }
  if (key.name === "right" && key.ctrl === false) {
    if (pageNo < totalPages - 1) pageNo++;
    else pageNo = 0;
    parseSheet();
  }
});

stockList.on("select", function (element, index) {
  var stocks = readJson(stocklistPath);
  var stockslen = stocks.length;
  for (var i = 0; i < stockslen; i++) {
    if (stocks[i].symbol == element.content) {
      stocksBox.toggle();
      filterStock = stocks[i].id.toString();
      parseSheet();
      break;
    }
  }
});

parseSheet();
parseStocks();

stocksBox.toggle();
sheetTable.focus();

screen.render();

setInterval(async () => {
  parseSheet();
}, 15000);
