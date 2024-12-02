import jwt from "jsonwebtoken";

type UserPayload = {
  id: number;
};

export function generateJWT(user: UserPayload) {
  const token = jwt.sign(user, process.env.JWT_SECRET!, { expiresIn: "30d" });
  return token;
}
