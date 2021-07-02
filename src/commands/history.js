const {Command} = require('@oclif/command')

class History extends Command {
  async run() {
    console.log("Comming Soon...Under Development.")
  }
}

History.description = `Run historic floorsheets till "2014".
...
This command will run historic floorsheet,
where you can see/interact with all the previous
daily trade data.
`
module.exports = History
