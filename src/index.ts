import { relaxedBody } from "./dkim/canonicalization";
import { hashBody, parseEmail } from "./email";
import { imap } from "./imap";

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

    const fetch = imap.seq.fetch(`${1}:*`, {
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
        const { headers, dkim, body } = parseEmail(emailRaw);
        const relaxed = relaxedBody(body);
        const hash = hashBody(relaxed);
        const { bh } = dkim;

        console.log(hash, "hash");
        console.log(bh, "bh");
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
