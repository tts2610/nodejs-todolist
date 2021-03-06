const fs = require("fs");
let param = process.argv[2];

function loadData() {
  const buffer = fs.readFileSync("data.json");
  const data = buffer.toString();
  const obj = JSON.parse(data);
  //   console.log(obj);
  return obj;
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
  console.log("adding");
}
