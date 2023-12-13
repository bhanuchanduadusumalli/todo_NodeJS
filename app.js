const express = require("express");
const app = express();
app.use(express.json());
const path = require("path");
const { open } = require("sqlite");
const { sqlite3 } = require("sqlite3");
const dbpath = path.join(__dirname, "todoApplication.db");
let db = null;

const intializeDBandServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server running at http://localhost:3000");
    });
  } catch (e) {
    console.log(`${e.message}`);
    process.exit(1);
  }
};

intializeDBandServer();
