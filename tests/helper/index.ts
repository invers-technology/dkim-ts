import fs from "fs";

export const emailRaw = fs.readFileSync("tests/helper/example.eml", "utf8");
export const emailRaw2 = fs.readFileSync("tests/helper/example2.eml", "utf8");
