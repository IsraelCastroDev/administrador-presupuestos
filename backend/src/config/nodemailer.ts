import "dotenv/config";
import nodemailer from "nodemailer";

const config = () => {
  return {
    host: process.env.EMAIL_HOST!,
    port: Number(process.env.EMAIL_PORT!),
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASS!,
    },
  };
};

export const transport = nodemailer.createTransport(config());
