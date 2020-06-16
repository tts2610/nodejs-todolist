const fs = require("fs");
let params = process.argv;

function loadData() {
  const buffer = fs.readFileSync("data.json");
  const data = buffer.toString();
  const obj = JSON.parse(data);
  //   console.log(obj);
  return obj;
}

function addTodo(obj) {
  const data = loadData();
  data.push(obj);
  saveData(data);
}

function saveData(data) {
  fs.writeFileSync("data.json", JSON.stringify(data));
}

if (params[2] === "list") {
  const data = loadData();
  console.log("================= TODO-LIST =================");
  data.forEach(({ todo, status }) => {
    console.log(`
        ${"   "} ${todo} - ${status ? "Done" : "Not Done"}  
    `);
  });
  console.log("=============================================");
} else if (params[2] === "add") {
  let todo = params[3] || null;
  let status = params[4] || false;
  if (todo) {
    let obj = { todo, status };
    addTodo(obj);
  } else {
    console.error("Input your todo content");
  }
}
