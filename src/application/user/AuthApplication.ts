import jwt from "jsonwebtoken";
import { ENV } from "../../infrastructure/config/env";

const JWT_SECRET = ENV.JWT_SECRET;

export class AuthApplication {
  static generateToken(payload: object): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
  }
  static verifyToken(token: string): any {
    return jwt.verify(token, JWT_SECRET);
  }
}
