import Imap from "imap";
import { config } from "dotenv";
import { parseEmail } from "../src/email";
import { relaxedHeaders, relaxedBody } from "../src/dkim/canonicalization";
import { verifyDkimSignature } from "../src/dkim/verification";
import { hashBody } from "../src/dkim/hash";

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

describe("IMAP", () => {
  it("should connect to the server", async () => {
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
            const { headers, body, dkim } = parseEmail(emailRaw);
            const relaxedH = relaxedHeaders(dkim, headers);
            const verified = await verifyDkimSignature(dkim, relaxedH);
            const { bh } = dkim;
            const relaxedB = relaxedBody(body);
            const bodyHash = hashBody(relaxedB);

            expect(bh).toBe(bodyHash);
            expect(verified).toBe(true);
          });
        });

        fetch.on("error", () => {
          throw new Error("Fetch error");
        });

        fetch.on("end", () => {
          console.log("Done fetching new email.");
          imap.end();
        });
      });
    });

    imap.connect();
  });
});
