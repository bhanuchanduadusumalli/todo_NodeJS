const express = require("express");
const app = express();
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const dbpath = path.join(__dirname, "todoApplication.db");
let db = null;

const intializeDBandServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3001, () => {
      console.log("server running at http://localhost/3001");
    });
  } catch (e) {
    console.log(`${e.message}`);
    process.exit(1);
  }
};

intializeDBandServer();

const hasPriorityAndStatusProperty = (requestQuery) => {
  return (
    requestQuery.status !== undefined && requestQuery.priority !== undefined
  );
};

const hasPriorityProperty = (requestQuery) => {
  return requestQuery.priority !== undefined;
};

const hasStatusProperty = (requestQuery) => {
  return requestQuery.status !== undefined;
};

//get request
app.get("/todos/", async (request, response) => {
  let getTodosQuery = null;
  let { search_q = "", priority, status } = request.query;
  switch (true) {
    case hasPriorityAndStatusProperty(request.query):
      getTodosQuery = `select * from todo 
            where todo like '%${search_q}%' and
            priority='${priority}'
            and status='${status}'`;
      break;
    case hasPriorityProperty(request.query):
      getTodosQuery = `select * from todo 
            where todo like '%${search_q}%' and
            priority='${priority}'`;
      break;
    case hasStatusProperty(request.query):
      getTodosQuery = `select * from todo 
            where todo like '%${search_q}%' 
            and status='${status}'`;
      break;
    default:
      getTodosQuery = `select * from todo 
            where todo like '%${search_q}%'`;
      break;
  }

  const data = await db.all(getTodosQuery);
  response.send(data);
});

//Get request
app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const getTodo = `select * from todo where id=${todoId}`;
  const todo = await db.get(getTodo);
  response.send(todo);
});

//Post request
app.post("/todos/", async (request, response) => {
  const todoItem = request.body;
  const { id, todo, priority, status } = todoItem;
  const insertTodo = `insert into todo 
    values(${id},'${todo}','${priority}','${status}')`;
  await db.run(insertTodo);
  response.send("Todo Successfully Added");
});

//put request
app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const preTodoQuery = `select * from todo where id=${todoId}`;
  const preTodo = await db.get(preTodoQuery);
  //const { todo, priority, status } = preTodo;
  //console.log(todo, priority, status);
  const { status } = request.body;
  console.log(status);
});

//delete request
app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const deleteTodo = `delete from todo where id=${todoId}`;
  await db.run(deleteTodo);
  response.send("Todo Deleted");
});
