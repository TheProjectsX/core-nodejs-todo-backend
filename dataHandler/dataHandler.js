/*
This file contains File CRUD
*/

const fs = require("fs");

// Read Data from File: FilePath is Required. Object format is optional
const readFile = async (filePath, type = "string") => {
  try {
    let data = fs.readFileSync(filePath, "utf8");
    if (type === "object" || type === "array") {
      data = JSON.parse(data);
    }

    return {
      success: true,
      data,
    };
  } catch (e) {
    return {
      success: false,
      message: "Internal Server Error",
      data: type === "string" ? "" : type === "array" ? [] : {},
    };
  }
};

// Write Data to File: FilePath and Data are Required
const writeFile = async (filePath, dataToWrite) => {
  try {
    fs.writeFileSync(filePath, dataToWrite, "utf8");
    return { success: true };
  } catch (e) {
    console.log(e);
    return { success: false };
  }
};

// Update Data to File: FilePath and New Data are Required. Type format is Optional
const updateFile = async (filePath, dataToUpdate, type = "string") => {
  const oldData = await readFile(filePath, type);

  let newData;
  if (type === "string") {
    newData = oldData["data"] + dataToUpdate;
  } else if (type === "object") {
    newData = JSON.stringify({ ...oldData["data"], ...dataToUpdate });
  } else if (type === "array") {
    newData = JSON.stringify([...oldData["data"], dataToUpdate]);
  }

  const writeRes = await writeFile(filePath, newData);

  return writeRes;
};

// Delete a File
const deleteFile = async (filePath) => {
  try {
    fs.unlinkSync(filePath);
    return { success: true };
  } catch (e) {
    return { success: false };
  }
};

module.exports = {
  readFile,
  writeFile,
  updateFile,
  deleteFile,
};
