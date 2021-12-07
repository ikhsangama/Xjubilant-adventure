//small load, doesn't need extra modules instead using node
import { randomBytes } from "crypto";

export const randString = () => {
  return randomBytes(20).toString("hex");
};
