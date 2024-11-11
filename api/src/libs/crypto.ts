import { User } from "../database/schemas/users";
import { returnSecret } from "./aws";
import crypto from "crypto";

const createToken = () => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < 128; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const generatePassword = (
  length = 12,
  characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$"
) => {
  // Define the character sets
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = "~!@-#$";

  // Get one character from each category
  const guaranteedChars = [
    lowercase[Math.floor(Math.random() * lowercase.length)],
    uppercase[Math.floor(Math.random() * uppercase.length)],
    numbers[Math.floor(Math.random() * numbers.length)],
    symbols[Math.floor(Math.random() * symbols.length)],
  ];

  // Generate the rest of the password
  const remainingLength = length - guaranteedChars.length;
  const randomChars = Array.from(
    crypto.randomFillSync(new Uint32Array(remainingLength))
  ).map((x) => characters[x % characters.length]);

  // Combine and shuffle
  const allChars = guaranteedChars.concat(randomChars);
  return allChars.sort(() => 0.5 - Math.random()).join("");
};

const encrypt = (val, password?) => {
  return new Promise<any>(async (response) => {
    const secret = await returnSecret("secret");
    const key = crypto
      .createHash("sha256")
      .update(String(secret))
      .digest("base64")
      .substr(0, 32);
    if (password === undefined) {
      password = key;
    }
    let iv = crypto.randomBytes(8).toString("hex");
    let pwd = crypto
      .createHash("sha256")
      .update(String(password))
      .digest("base64")
      .substr(0, 32);
    let cipher = crypto.createCipheriv("aes-256-cbc", pwd, iv);
    let encrypted = cipher.update(val, "utf8", "hex");
    encrypted += cipher.final("hex");
    response(iv.toString() + "*" + encrypted);
  });
};

const decrypt = (encrypted, password?) => {
  return new Promise<any>(async (response) => {
    const secret = await returnSecret("secret");
    const key = crypto
      .createHash("sha256")
      .update(String(secret))
      .digest("base64")
      .substr(0, 32);
    if (password === undefined) {
      password = key;
    }
    try {
      let parts = encrypted.split("*");
      let pwd = crypto
        .createHash("sha256")
        .update(String(password))
        .digest("base64")
        .substr(0, 32);
      let decipher = crypto.createDecipheriv("aes-256-cbc", pwd, parts[0]);
      let decrypted = decipher.update(parts[1], "hex", "utf8");
      response(decrypted + decipher.final("utf8"));
    } catch (e) {
      console.log("Error while decrypting:", e);
      response(false);
    }
  });
};

const hash = (text) => {
  let buf = Buffer.from(text);
  var sha = crypto.createHash("sha256").update(buf).digest();
  return sha.toString("hex");
};

const validateSession = async (req) => {
  if (req.headers.authorization !== undefined) {
    const bearer = req.headers.authorization.split(" ")[1];
    if (bearer !== undefined) {
      try {
        const encrypted =
          bearer.replace("0x", "").substr(0, 16) +
          "*" +
          bearer.replace("0x", "").substr(16);
        const decrypted = await decrypt(encrypted);
        const jwt = JSON.parse(decrypted);
        if (jwt !== false && jwt.email !== undefined) {
          const user = await User.findOne({ email: jwt.email });
          if (user !== null) {
            return user;
          } else {
            return false;
          }
        } else {
          return false;
        }
      } catch (e) {
        return false;
      }
    } else {
      return false;
    }
  } else {
    return false;
  }
};

function validatePassword(password: string): boolean {
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*]/.test(password);

  return (
    password.length >= minLength &&
    hasUppercase &&
    hasLowercase &&
    hasNumber &&
    hasSpecialChar
  );
}

export {
  encrypt,
  decrypt,
  hash,
  createToken,
  generatePassword,
  validateSession,
  validatePassword,
};
