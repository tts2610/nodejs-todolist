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

function deleteByStatus(status) {
  let data = loadData("all");
  if (status === "complete") {
    data = data.filter((item) => !item.status);
  } else if (status === "incomplete") {
    data = data.filter((item) => item.status);
  } else {
    return false;
  }
  saveData(data);
  return true;
}

function toogleTodo(id) {
  const data = loadData("all");
  data.forEach((item) => {
    if (item.id === id) {
      item.status = item.status ? false : true;
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
    status: {
      describe: "complete | incomplete",
      demandOption: false,
      type: "string",
    },
  },
  handler: function ({ id, status }) {
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
    } else if (status) {
      if (deleteByStatus(status)) {
        console.log(
          chalk.blue(
            "============================================================================================================================================="
          )
        );
        console.log(
          chalk.blue(
            `${"                                                      "}ALL "${status}" TODOS HAS BEEN REMOVED!`
          )
        );
        console.log(
          chalk.blue(
            "============================================================================================================================================="
          )
        );
      } else {
        console.log(
          chalk.red("ONLY --status= complete | incomplete | all allowed")
        );
      }
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
    console.log(
      chalk.blue(
        "============================================================================================================================================="
      )
    );
    console.log(
      chalk.blue(
        `${"                                                      "}TOGGLED ID NUMBER ${id}`
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
