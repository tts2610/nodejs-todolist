const fs = require("fs");
const yargs = require("yargs");
const chalk = require("chalk");
let params = process.argv;

function loadData(status) {
  try {
    const buffer = fs.readFileSync("data.json");
    const data = buffer.toString();
    const obj = JSON.parse(data);
    if (status === "complete") {
      return obj.filter((x) => x.status);
    } else if (status === "incomplete") {
      return obj.filter((x) => !x.status);
    } else if (status === "all") {
      return obj;
    } else {
      console.log(
        chalk.red("ONLY --status= complete | incomplete | all allowed")
      );
      return [];
    }
  } catch (error) {
    return [];
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
  data.splice(id - 1, 1);
  saveData(data);
}

function deleteAll() {
  saveData([]);
}

function toogleTodo(id) {
  const data = loadData();
  data.forEach((item) => {
    if (item.id === id) {
      item.status = item.status ? !item.status : item.status;
    }
  });
  saveData(data);
}

yargs.command({
  command: "list",
  describe: "list all todos",
  alias: "l",
  builder: {
    status: {
      describe: "complete | incomplete | all",
      demandOption: false,
      type: "string",
      default: "all",
    },
  },
  handler: function ({ status }) {
    const data = loadData(status);
    console.log(
      chalk.green(
        "============================================================= TODO-LIST ===================================================================="
      )
    );
    data.forEach(({ id, todo, status }) => {
      console.log(`
        ${"                                               "} ${id}. ${todo} - ${
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
    let obj = { id: data.length + 1, todo, status };
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
      console.log(
        chalk.blue(
          "============================================================================================================================================="
        )
      );
      console.log(
        chalk.blue(
          `${"                                                      "}REMOVED TODO NUMBER ${id} SUCCESSFULLY!`
        )
      );
      console.log(
        chalk.blue(
          "============================================================================================================================================="
        )
      );
    } else {
      deleteAll();
      console.log(
        chalk.blue(
          "============================================================================================================================================="
        )
      );
      console.log(
        chalk.blue(
          `${"                                                      "}ALL TODOS HAS BEEN REMOVED!`
        )
      );
      console.log(
        chalk.blue(
          "============================================================================================================================================="
        )
      );
    }
  },
});

yargs.command({
  command: "toggle",
  describe: "toggle todos",
  builder: {
    id: {
      describe: "id of todo",
      demandOption: false,
      type: "int",
    },
  },
  handler: function ({ id }) {
    toogleTodo(id);
  },
});

yargs.parse();
