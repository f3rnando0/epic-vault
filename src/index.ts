import path from "path";
import { ExtendedClient } from "./app/structs/ExtendedBaseClient";
import fs from "fs";

export const client = new ExtendedClient();

fs.readdirSync(path.join(__dirname, "app/commands")).map((local) => {
  fs.readdirSync(path.join(__dirname, "app/commands", local))
    .filter((fileName) => fileName.endsWith(".ts") || fileName.endsWith(".js"))
    .map((fileName) => {
      console.log(fileName);
    });
});

client.start();
