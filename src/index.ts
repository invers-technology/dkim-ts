import { parseEmail } from "./email";
import { imap } from "./imap";
import { hashBody } from "./email";
import { getHeaders } from "./parser";

export * from "./rsa";
export { imap };

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
        const { headers, body } = parseEmail(emailRaw);
        const dkimSignature = getHeaders(headers, "dkim-signature");
        const bodyHash = hashBody(body);
        console.log(bodyHash, "bodyHash");
        console.log(dkimSignature, "dkimSignature");
      });
    });

    fetch.on("error", () => {
      throw new Error("Fetch error");
    });

    fetch.on("end", () => {
      console.log("Done fetching new email.");
    });
  });
});

imap.connect();
