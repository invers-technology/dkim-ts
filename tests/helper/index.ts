import fs from "fs";

export const emailRaw = fs.readFileSync("tests/helper/example.eml", "utf8");
