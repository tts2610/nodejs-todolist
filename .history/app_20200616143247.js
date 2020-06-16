const fs = require("fs");
const yargs = require("yargs");
const chalk = require("chalk");
let params = process.argv;

function loadData() {
  try {
    const buffer = fs.readFileSync("data.json");
    const data = buffer.toString();
    const obj = JSON.parse(data);
    return obj;
  } catch (error) {
    return {};
  }
}

function addTodo(todo, status) {
  const data = loadData();
  data[todo] = status;
  saveData(data);
}

function saveData(data) {
  fs.writeFileSync("data.json", JSON.stringify(data));
}

yargs.command({
  command: "list",
  describe: "list all todos",
  alias: "l",
  handler: function () {
    const data = loadData();
    console.log(
      chalk.green(
        "============================================================= TODO-LIST ===================================================================="
      )
    );
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const element = data[key];
        console.log(`
         ${"                                               "} ${key} - ${
          element ? "Complete" : "Incomplete"
        }
    `);
      }
    }
    console.log(
      chalk.green(
        "============================================================================================================================================="
      )
    );
  },
});

yargs.command({
  command: "add",
  describe: "add new todo",
  builder: {
    todo: {
      describe: "todo content",
      demandOption: true,
      type: "string",
    },
    status: {
      describe: "todo status",
      demandOption: false,
      type: "boolean",
      default: false,
    },
  },
  handler: function ({ todo, status }) {
    addTodo(todo, status);
    console.log(
      chalk.blue(
        "============================================================================================================================================="
      )
    );
    console.log(
      chalk.blue(
        `${"                                                      "}ADDED NEW TODO SUCCESSFULLY!`
      )
    );
    console.log(
      chalk.blue(
        "============================================================================================================================================="
      )
    );
  },
});

yargs.parse();
