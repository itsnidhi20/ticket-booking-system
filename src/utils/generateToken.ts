import jwt from "jsonwebtoken";

export const generateToken = (payload: object, expiresIn = "1d") => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn });
};
