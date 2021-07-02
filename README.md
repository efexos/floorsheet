floorsheet
==========

Visualize NepalStock daily/historic floorsheets in terminal or cmd.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/floorsheet.svg)](https://npmjs.org/package/floorsheet)
<!-- [![Downloads/week](https://img.shields.io/npm/dw/floorsheet.svg)](https://npmjs.org/package/floorsheet)
[![License](https://img.shields.io/npm/l/floorsheet.svg)](https://github.com/efexos/floorsheet/blob/master/package.json) -->

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
* [Keybindings](#keybindings)
* [Regards](#regards)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g floorsheet
$ floorsheet COMMAND
running command...
$ floorsheet (-v|--version|version)
floorsheet/1.0.0 linux-x64 node-v10.19.0
$ floorsheet --help [COMMAND]
USAGE
  $ floorsheet COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`floorsheet help [COMMAND]`](#floorsheet-help-command)
* [`floorsheet history`](#floorsheet-history)
* [`floorsheet live`](#floorsheet-live)

## `floorsheet help [COMMAND]`

display help for floorsheet

```
USAGE
  $ floorsheet help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_

## `floorsheet history`

Run historic floorsheets till "2014".

```
USAGE
  $ floorsheet history

DESCRIPTION
  ...
  This command will run historic floorsheet,
  where you can see/interact with all the previous
  daily trade data.
```

_See code: [src/commands/history.js](https://github.com/efexos/floorsheet/blob/v1.0.0/src/commands/history.js)_

## `floorsheet live`

Run live floorsheet of current day.

```
USAGE
  $ floorsheet live

DESCRIPTION
  ...
  This command will run live floorsheet,
  which is updated every 15 seconds. Data
  is gathered through nepse newweb API. Although
  the data on newweb is updated once every 
  minute this app will try to update every 15 seconds
  to minimize the inconsistancy while gathering data.
  ...
```

_See code: [src/commands/live.js](https://github.com/efexos/floorsheet/blob/v1.0.0/src/commands/live.js)_
<!-- commandsstop -->

<!-- keybingings -->
# Keybindings

  `"CTRL + q" => Close the application.`

  `"f" Toggle filter window, While in filter window press "/" to search one stock.`
   
  `"s" Sort the list with highest volume on top`

  `"r" Reset the list table to default.`
   
  `"left", "right" Change pages.`
   
  `"TAB", Focus the table.`

<!-- keybindings stop -->

<!-- Regards -->
# Regards
   efexos (This app is unpolished, Expect changes soon.)
   
   Mail:: vhusanpokharel@gmail.com
   
   Contact Me || Buy me a drink(e-sewa):: +977-9862177635 
<!-- Regards End -->

<!-- Screenshot -->
![](https://github.com/efexos/floorshit/blob/main/sc.png)
<!-- Screenshot End -->
