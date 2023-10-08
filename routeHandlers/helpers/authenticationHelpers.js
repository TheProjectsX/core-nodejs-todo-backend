// Custom Imports
const { updateFile, readFile } = require("../../dataHandler/dataHandler");
const { encryptPassword, genToken } = require("../../utils/utils");

// Global Data which can be updated
let RegisteredUserData = undefined;

// Const Variables
const UserDetailsPath = __dirname + "/../../userData/userDetails.json";

// Save User Sign Up Data
const createUser = async (userData) => {
  const requiredFields = ["name", "email", "phone", "password"];
  if (
    !requiredFields.every((element) =>
      Object.keys(userData).includes(element)
    ) ||
    userData["name"].length < 10 ||
    userData["email"].length < 10 ||
    userData["password"].length < 6
  ) {
    return {
      statusCode: 400,
      success: false,
      message: "Inavalid Request",
    };
  }

  if (RegisteredUserData === undefined) {
    const response = await readFile(UserDetailsPath, "array");
    RegisteredUserData = response["data"];
  }

  if (RegisteredUserData.some((obj) => obj["email"] === userData["email"])) {
    return {
      statusCode: 409,
      success: false,
      message: "User with the same Email Already Exists!",
    };
  }

  const plainPassword = userData["password"];
  const encPassword = encryptPassword(userData["password"]);
  userData["password"] = encPassword;
  const status = await updateFile(UserDetailsPath, userData, "array");
  if (status.success) {
    readFile(UserDetailsPath, "array").then((data) => {
      if (data.success) {
        RegisteredUserData = data["data"];
      }
    });
  }

  return {
    statusCode: status.success ? 200 : 400,
    ...status,
    message: "User created Successully!",
    userData: {
      ...userData,
      password: undefined,
    },
    token: genToken(userData["email"], plainPassword),
  };
};

// Get Login Data
const getLogin = async (userData) => {
  const requiredFields = ["email", "password"];
  if (
    !requiredFields.every((element) =>
      Object.keys(userData).includes(element)
    ) ||
    userData["email"].length < 11 ||
    userData["password"].length < 6
  ) {
    return {
      statusCode: 400,
      success: false,
      message: "Inavalid Request",
    };
  }

  if (RegisteredUserData === undefined) {
    const response = await readFile(UserDetailsPath, "array");
    RegisteredUserData = response["data"];
  }

  const inputedEmail = userData["email"];
  const inputedPassword = encryptPassword(userData["password"]);
  for (let i = 0; i < RegisteredUserData.length; i++) {
    const currentUser = RegisteredUserData[i];
    if (currentUser["email"] === inputedEmail) {
      if (currentUser["password"] === inputedPassword) {
        return {
          statusCode: 200,
          success: true,
          message: "Login Successfull!",
          userData: {
            ...currentUser,
            password: undefined,
          },
          token: genToken(userData["email"], userData["password"]),
        };
      }
    }
  }

  return {
    statusCode: 404,
    success: false,
    message: "Bad Credentials",
  };
};

module.exports = {
  createUser,
  getLogin,
};
