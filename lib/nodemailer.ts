import nodemailer, { Transporter } from "nodemailer";

const globalForNodemailer = globalThis as unknown as {
  transporter: Transporter | undefined;
};

export const transporter =
  globalForNodemailer.transporter ??
  nodemailer.createTransport({
    auth: {
      pass: process.env.GMAIL_APP_PASSWORD,
      user: process.env.GMAIL_USER,
    },
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
  });

if (process.env.NODE_ENV !== "production") {
  globalForNodemailer.transporter = transporter;
}
