/*
This file contains Route Handlers
*/

const url = require("url");

const { createUser, getLogin } = require("./helpers/authenticationHelpers");
const {
  saveTodo,
  readTodo,
  updateTodo,
  deleteTodo,
} = require("./helpers/todoHelpers");

// Signup Route
const signUpUser = (req, res) => {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.end("Method not Allowed!");
    return;
  }

  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString(); // Accumulate the request body
  });

  req.on("end", async () => {
    const parsedBody = JSON.parse(body);

    const responseStatus = await createUser(parsedBody);
    if (responseStatus.success) {
      res.setHeader("token", responseStatus["token"]);
    }
    res.statusCode = responseStatus["statusCode"];
    res.end(
      JSON.stringify({
        ...responseStatus,
        statusCode: undefined,
      })
    );
  });
};

// Login Route
const logInUser = (req, res) => {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.end("Method not Allowed!");
    return;
  }

  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString(); // Accumulate the request body
  });

  req.on("end", async () => {
    const parsedBody = JSON.parse(body);

    const responseStatus = await getLogin(parsedBody);
    if (responseStatus.success) {
      res.setHeader("token", responseStatus["token"]);
    }
    res.statusCode = responseStatus["statusCode"];
    res.end(JSON.stringify({ ...responseStatus, statusCode: undefined }));
  });
};

// Get all TODO Data
const getAllTodos = async (req, res) => {
  if (req.method !== "GET") {
    res.statusCode = 405;
    res.end("Method not Allowed!");
    return;
  }
  const token = req.headers.token;
  const responseStatus = await readTodo(token);

  res.statusCode = responseStatus["statusCode"];
  res.end(JSON.stringify({ ...responseStatus, statusCode: undefined }));
};

// Save TODO Data
const saveTodoData = (req, res) => {
  if (req.method !== "PUT") {
    res.statusCode = 405;
    res.end("Method not Allowed!");
    return;
  }

  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString(); // Accumulate the request body
  });

  req.on("end", async () => {
    if (body === "") body = "{}";
    const parsedBody = JSON.parse(body);

    const responseStatus = await saveTodo(parsedBody, req.headers.token);
    res.statusCode = responseStatus["statusCode"];
    res.end(JSON.stringify({ ...responseStatus, statusCode: undefined }));
  });
};

// Update TODO Data
const updateTodoData = (req, res) => {
  if (req.method !== "PUT") {
    res.statusCode = 405;
    res.end("Method not Allowed!");
    return;
  }

  const todoKey = url.parse(req.url, true)["query"]["id"];

  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString(); // Accumulate the request body
  });

  req.on("end", async () => {
    if (body === "") body = "{}";
    const parsedBody = JSON.parse(body);

    const responseStatus = await updateTodo(
      todoKey,
      parsedBody,
      req.headers.token
    );
    res.statusCode = responseStatus["statusCode"];
    res.end(JSON.stringify({ ...responseStatus, statusCode: undefined }));
  });
};

// Delete Todo Data
const deleteTodoData = async (req, res) => {
  if (req.method !== "DELETE") {
    res.statusCode = 405;
    res.end("Method not Allowed!");
    return;
  }

  const todoKey = url.parse(req.url, true)["query"]["id"];

  const token = req.headers.token;
  const responseStatus = await deleteTodo(todoKey, token);

  res.statusCode = responseStatus["statusCode"];
  res.end(JSON.stringify({ ...responseStatus, statusCode: undefined }));
};

module.exports = {
  signUpUser,
  logInUser,
  getAllTodos,
  saveTodoData,
  updateTodoData,
  deleteTodoData,
};
