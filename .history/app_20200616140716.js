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

// if (params[2] === "list") {
//   const data = loadData();
//   console.log("================= TODO-LIST =================");
//   data.forEach(({ todo, status }) => {
//     console.log(`
//         ${"   "} ${todo} - ${status ? "Done" : "Not Done"}
//     `);
//   });
//   console.log("=============================================");
// } else if (params[2] === "add") {
//   let todo = params[3] || null;
//   let status = params[4] || false;
//   if (todo) {
//     let obj = { todo, status };
//     addTodo(obj);
//     console.log("===> ADDED NEW TODO SUCCESSFULLY!");
//   } else {
//     console.log("Input your todo content");
//   }
// }

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
    data.forEach(({ todo, status }) => {
      console.log(`
        ${"                                               "} ${todo} - ${
        status ? "Done" : "Not Done"
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
  handler: function (args) {
    // let todo = args.todo || null;
    // let status = args.status || false;

    let obj = { todo: args.todo, status: args.status };
    addTodo(obj);
    console.log(chalk.blue("===> ADDED NEW TODO SUCCESSFULLY!"));
  },
});

yargs.parse();
