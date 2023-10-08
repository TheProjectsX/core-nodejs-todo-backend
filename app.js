const http = require("http");
const {
  signUpUser,
  logInUser,
  getAllTodos,
  saveTodoData,
  updateTodoData,
  deleteTodoData,
} = require("./routeHandlers/routeHandlers");

const hostname = "127.0.0.1";
const port = 3000;

const server = http.createServer((req, res) => {
  if (req.url === "/auth/signup") {
    signUpUser(req, res);
  } else if (req.url === "/auth/login") {
    logInUser(req, res);
  } else if (req.url === "/todo/getAllTodos") {
    getAllTodos(req, res);
  } else if (req.url === "/todo/writeTodo") {
    saveTodoData(req, res);
  } else if (req.url.startsWith("/todo/updateTodo")) {
    updateTodoData(req, res);
  } else if (req.url.startsWith("/todo/deleteTodo")) {
    deleteTodoData(req, res);
  } else {
    res.statusCode = 404;
    res.end();
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
