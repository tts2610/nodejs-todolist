const fs = require("fs");
const yargs = require("yargs");
const chalk = require("chalk");
let params = process.argv;

function loadData(complete, incomplete) {
  try {
    const buffer = fs.readFileSync("data.json");
    const data = buffer.toString();
    const obj = JSON.parse(data);
    if (complete && !incomplete) {
      return obj.filter((x) => x.status);
    } else if (incomplete && !complete) {
      return obj.filter((x) => !x.status);
    } else {
      return obj;
    }
  } catch (error) {
    return {};
  }
}

function addTodo(obj) {
  const data = loadData();
  data.push(obj);
  saveData(data);
}

function saveData(data) {
  fs.writeFileSync("data.json", JSON.stringify(data));
}

function deleteTodo(id) {
  const data = loadData();
  data.splice(id, 1);
  saveData(data);
}

function deleteAll() {
  saveData([]);
}

yargs.command({
  command: "list",
  describe: "list all todos",
  alias: "l",
  builder: {
    complete: {
      describe: "filter complete todos",
      demandOption: false,
      type: "boolean",
      default: false,
    },
    incomplete: {
      describe: "filter incomplete todos",
      demandOption: false,
      type: "boolean",
      default: false,
    },
  },
  handler: function ({ complete, incomplete }) {
    const data = loadData(complete, incomplete);
    console.log(
      chalk.green(
        "============================================================= TODO-LIST ===================================================================="
      )
    );
    data.forEach(({ todo, status }) => {
      console.log(`
        ${"                                               "} ${todo} - ${
        status ? "Complete" : "Incomplete"
      }
    `);
    });
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
    let data = loadData();
    let obj = { data.length-1, todo, status };
    addTodo(obj);
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

yargs.command({
  command: "delete",
  describe: "delete todos",
  builder: {
    id: {
      describe: "id of todo",
      demandOption: false,
      type: "int",
    },
  },
  handler: function ({ id }) {
    if (id) {
      deleteTodo(id);
    } else {
      deleteAll();
    }
  },
});

yargs.parse();
