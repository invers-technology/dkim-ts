import Imap from "imap";
import { config } from "dotenv";
import {
  parseRawEmail,
  verifyBody,
  verifyDkimSignature,
  getDkimPublicKey,
} from "../src";

config();

const imapConfig = {
  user: process.env.EMAIL_USER as string,
  password: process.env.EMAIL_PASS as string,
  host: "imap.gmail.com",
  port: 993,
  tls: true,
  tlsOptions: { rejectUnauthorized: false },
};

const imap = new Imap(imapConfig);

imap.once("ready", () => {
  imap.openBox("INBOX", false, (err, box) => {
    if (err) {
      throw new Error("Error opening inbox");
    }
    if (!box || !box.messages || box.messages.total === 0) {
      throw new Error("No new emails");
    }

    const fetch = imap.seq.fetch(`${box.messages.total}:*`, {
      bodies: [""],
      markSeen: true,
    });

    fetch.on("message", (msg) => {
      let emailRaw = "";

      msg.on("body", (stream) => {
        stream.on("data", (chunk) => {
          emailRaw += chunk.toString("utf8");
        });
      });

      msg.on("end", async () => {
        const { canonicalizedHeaders, canonicalizedBody, dkim } =
          parseRawEmail(emailRaw);
        const isBodyVerified = verifyBody(canonicalizedBody, dkim);
        const publicKey = await getDkimPublicKey(dkim);
        const isDkimVerified = verifyDkimSignature(
          dkim,
          canonicalizedHeaders,
          publicKey,
        );
        if (!isBodyVerified) {
          throw new Error("Body is not verified");
        }
        if (!isDkimVerified) {
          throw new Error("Dkim is not verified");
        }
        console.log("Done verifying email");
      });
    });

    fetch.on("error", () => {
      throw new Error("Fetch error");
    });

    fetch.on("end", () => {
      console.log("Done fetching email");
      imap.end();
    });
  });
});

imap.connect();
