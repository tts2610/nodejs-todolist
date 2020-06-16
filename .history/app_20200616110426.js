const fs = require("fs");
let params = process.argv;

function loadData() {
  const buffer = fs.readFileSync("data.json");
  console.log(buffer);
  return [];
}

if (params[2] === "list") {
  console.log("listing");
}
