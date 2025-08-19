import nodemailer from "nodemailer";
export const createTransporter = () => {
  if (process.env.SMTP_OAUTH === "true") {
    return nodemailer.createTransport({
      service: "gmail",
      auth: { type: "OAuth2", user: process.env.MAIL_FROM,
        clientId: process.env.OAUTH_CLIENT_ID, clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN, accessToken: process.env.OAUTH_ACCESS_TOKEN }
    });
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 587), secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });
};
export const sendMail = async ({ to, subject, html, text }) => {
  const transporter = createTransporter();
  return transporter.sendMail({ from: process.env.MAIL_FROM, to, subject, text, html });
};
