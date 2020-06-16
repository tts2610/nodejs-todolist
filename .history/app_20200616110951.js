const fs = require("fs");
let params = process.argv;

function loadData() {
  const buffer = fs.readFileSync("data.json");
  const data = buffer.toString();
  const obj = JSON.parse(data);
  //   console.log(obj);
  return obj;
}

if (params[2] === "list") {
  const data = loadData();
  data.forEach(({ todo, status }) => {
    console.log(`
        todo: ${todo} - ${status ? "Done" : "Not done"}  
    `);
  });
}
