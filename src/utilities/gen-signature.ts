import jwt from "jsonwebtoken";

export function generateSign(payload: any, secret: string) {
  return jwt.sign(payload, secret);
}
