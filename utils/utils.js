/*
This Encryption algorithm will take the actual password and change The password's every char by it's next char
*/
const encryptPassword = (password) => {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ12345678901";
  let encPassword = "";

  for (let i = 0; i < password.length; i++) {
    const currentChar = password.charAt(i);
    const nextChar = chars.charAt(chars.indexOf(currentChar) + 1);

    encPassword += nextChar;
  }

  return encPassword;
};

const genToken = (email, password) => {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ12345678901!@#$%^&?|";

  let emailToken = "";
  let passwordToken = "";

  for (let i = 0; i < email.length; i++) {
    const currentChar = email[i];
    const charIx = chars.indexOf(currentChar);
    if (charIx !== -1) {
      if (charIx === chars.length - 1) charIx = -1;

      emailToken += chars.charAt(charIx + 1);
    } else {
      emailToken += currentChar;
    }
  }
  for (let i = 0; i < password.length; i++) {
    const currentChar = password[i];
    const charIx = chars.indexOf(currentChar);
    if (charIx !== -1) {
      if (charIx === chars.length - 1) charIx = -1;

      passwordToken += chars.charAt(charIx + 1);
    } else {
      passwordToken += currentChar;
    }
  }

  const combined = "TCA_" + emailToken + "__73uor_" + passwordToken;

  return combined;
};

const decToken = (token = "") => {
  if (!(token.startsWith("TCA_") && token.includes("__73uor_"))) {
    return [false, false];
  }

  const chars =
    "|?&^%$#@!10987654321ZYXWVUTSRQPONMLKJIHGFEDCBAzyxwvutsrqponmlkjihgfedcba";

  const [emailToken, passwordToken] = token
    .replace("TCA_", "")
    .split("__73uor_");

  let email = "";
  let password = "";

  for (let i = 0; i < emailToken.length; i++) {
    const currentChar = emailToken[i];
    const charIx = chars.indexOf(currentChar);
    if (charIx !== -1) {
      if (charIx === chars.length - 1) charIx = -1;

      email += chars.charAt(charIx + 1);
    } else {
      email += currentChar;
    }
  }

  for (let i = 0; i < passwordToken.length; i++) {
    const currentChar = passwordToken[i];
    const charIx = chars.indexOf(currentChar);
    if (charIx !== -1) {
      if (charIx === chars.length - 1) charIx = -1;

      password += chars.charAt(charIx + 1);
    } else {
      password += currentChar;
    }
  }

  return [email, password];
};

module.exports = {
  encryptPassword,
  genToken,
  decToken,
};
