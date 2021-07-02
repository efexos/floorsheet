const path = require("path");
const {Command} = require('@oclif/command');
const { getBrokersList, getStocksList } = require("../helpers/newweb");
const { writeJson } = require("../helpers/readwrite");

const stockslistPath = path.join(__dirname, "..", "data", "stockslist.json");
const brokerslistPath = path.join(__dirname, "..", "data", "brokerslist.json");

class Live extends Command {
  async run() {
    require("../helpers/chrome").updateClient()
      .then(async (res) => {
        if (res) {
          try {
            var stockslist = await getStocksList();
            var brokerslist = await getBrokersList(); 
            writeJson(stockslistPath, stockslist);
            writeJson(brokerslistPath, brokerslist);
          } catch (error) {
            console.log("Could not update Stocks/Brokers List");
          }
        }
      })
      .then(() => {
        require("../modules/live");
      })
      .catch((error)=>{
        console.log(error)
      })
  }
}

Live.description = `Run live floorsheet of current day.
...
This command will run live floorsheet,
which is updated every 15 seconds. Data
is gathered through nepse newweb API. Although
the data on newweb is updated once every 
minute this app will try to update every 15 seconds
to minimize the inconsistancy while gathering data.
...
`

module.exports = Live
