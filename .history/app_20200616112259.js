const fs = require("fs");
let param = process.argv[2];

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

if (param === "list") {
  const data = loadData();
  console.log("================= TODO-LIST =================");
  data.forEach(({ todo, status }) => {
    console.log(`
        ${"   "} ${todo} - ${status ? "Done" : "Not Done"}  
    `);
  });
  console.log("=============================================");
} else if (param === "add") {
  let obj = { todo: "go home", status: false };
  addTodo(obj);
}
