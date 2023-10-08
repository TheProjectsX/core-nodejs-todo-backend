const {
  updateFile,
  readFile,
  writeFile,
} = require("../../dataHandler/dataHandler");
const { decToken } = require("../../utils/utils");
const { getLogin } = require("./authenticationHelpers");

// TODO Folder Path
const TodoPath = __dirname + "/../../todo-data/";

// Check Authentication
const checkAuth = async (token) => {
  if (token === undefined) {
    return {
      statusCode: 401,
      success: false,
      message: "Authentication Failed!",
    };
  }

  let [email, password] = decToken(token);
  if (!(email && password)) {
    return {
      statusCode: 401,
      success: false,
      message: "Authentication Failed!",
    };
  }

  const authTest = await getLogin({ email, password });
  if (!authTest.success) {
    return {
      statusCode: 401,
      success: false,
      message: "Authentication Failed!",
    };
  }

  return {
    success: true,
    email: email,
  };
};

// Read All Todo
const readTodo = async (token) => {
  const authResponse = await checkAuth(token);
  let email;
  if (!authResponse.success) {
    return authResponse;
  } else {
    email = authResponse["email"];
  }

  const todoData = await readFile(TodoPath + email + ".json", "array");
  if (todoData.success) {
    return {
      statusCode: 200,
      success: true,
      message: "TODO parsed Successfully!",
      data: todoData["data"],
    };
  } else {
    return {
      statusCode: 200,
      success: true,
      message: "No TODOs Available!",
      data: [],
    };
  }
};

// Save TODO Data: title, desc, time (autogen)
const saveTodo = async (todoData, token) => {
  const requiredFields = ["title", "description"];

  const authResponse = await checkAuth(token);
  let email;
  if (!authResponse.success) {
    return authResponse;
  } else {
    email = authResponse["email"];
  }

  if (
    !requiredFields.every((element) =>
      Object.keys(todoData).includes(element)
    ) ||
    todoData["title"].length === 0 ||
    todoData["description"].length === 0
  ) {
    return {
      statusCode: 400,
      success: false,
      message: "Inavalid Request",
    };
  }

  // Update the Data
  const currentTime = Date.now();
  const todoAddResponse = await updateFile(
    TodoPath + email + ".json",
    { ...todoData, createdAt: currentTime },
    "array"
  );

  if (todoAddResponse.success) {
    return {
      statusCode: 200,
      success: true,
      message: "Todo Added Successfully",
      todoKey: currentTime,
    };
  } else {
    return {
      statusCode: 500,
      success: false,
      message: "Internal Server Error",
    };
  }
};

// Update todo Data
const updateTodo = async (todoKey, todoData, token) => {
  const requiredFields = ["title", "description"];

  const authResponse = await checkAuth(token);
  let email;
  if (!authResponse.success) {
    return authResponse;
  } else {
    email = authResponse["email"];
  }

  if (
    !requiredFields.some((element) => Object.keys(todoData).includes(element))
  ) {
    return {
      statusCode: 400,
      success: false,
      message: "Inavalid Request",
    };
  }

  const userTodoRes = await readFile(TodoPath + email + ".json", "array");
  if (!userTodoRes.success) {
    return {
      statusCode: 404,
      success: false,
      message: "TODO Not Found",
    };
  }
  const userTodoData = userTodoRes["data"];

  let todoFound = false;
  for (let i = 0; i < userTodoData.length; i++) {
    const currentTodoKey = userTodoData[i]["createdAt"].toString();

    if (currentTodoKey === todoKey) {
      Object.keys(todoData).forEach((key) => {
        userTodoData[i][key] = todoData[key];
      });
      todoFound = true;
      break;
    }
  }

  if (todoFound === false) {
    return {
      statusCode: 404,
      success: false,
      message: "TODO Not Found!",
    };
  }

  const writeResponse = await writeFile(
    TodoPath + email + ".json",
    JSON.stringify(userTodoData)
  );

  if (writeResponse.success) {
    return {
      statusCode: 200,
      success: true,
      message: "TODO Updated Successfully",
    };
  } else {
    return {
      statusbar: 500,
      success: false,
      message: "Internal Server Error",
    };
  }
};

// Delete Todo Data
const deleteTodo = async (todoKey, token) => {
  const authResponse = await checkAuth(token);
  let email;
  if (!authResponse.success) {
    return authResponse;
  } else {
    email = authResponse["email"];
  }

  const userTodoRes = await readFile(TodoPath + email + ".json", "array");
  if (!userTodoRes.success) {
    return {
      statusCode: 404,
      success: false,
      message: "TODO Not Found",
    };
  }
  const userTodoData = userTodoRes["data"];

  let todoFound = false;
  const newData = userTodoData.filter((item) => {
    if (item["createdAt"].toString() === todoKey) {
      todoFound = true;
      return false;
    } else {
      return true;
    }
  });

  if (todoFound === false) {
    return {
      statusCode: 404,
      success: false,
      message: "TODO Not Found!",
    };
  }

  const writeResponse = await writeFile(
    TodoPath + email + ".json",
    JSON.stringify(newData)
  );

  if (writeResponse.success) {
    return {
      statusCode: 200,
      success: true,
      message: "TODO Deleted Successfully",
    };
  } else {
    return {
      statusbar: 500,
      success: false,
      message: "Internal Server Error",
    };
  }
};

module.exports = {
  readTodo,
  saveTodo,
  updateTodo,
  deleteTodo,
};
