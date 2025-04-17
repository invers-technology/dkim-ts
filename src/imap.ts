import Imap from "imap";
import { config } from "dotenv";

config();

const imapConfig = {
  user: process.env.EMAIL_USER as string,
  password: process.env.EMAIL_PASS as string,
  host: "imap.gmail.com",
  port: 993,
  tls: true,
  tlsOptions: { rejectUnauthorized: false },
};

export const imap = new Imap(imapConfig);
