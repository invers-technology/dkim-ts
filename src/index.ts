import { relaxedBody, relaxedHeaders } from "./dkim/canonicalization";
import { parseEmail } from "./email";
import { hashBody, hashHeaders } from "./dkim/hash";
import { getEmptySignatureDkim, getDkimPublicKey } from "./dkim/header";
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
        const { headers, dkim, body } = parseEmail(emailRaw);
        const relaxedB = relaxedBody(body);
        const hash = hashBody(relaxedB);
        const { bh, h } = dkim;
        const relaxedH = relaxedHeaders(dkim, headers);
        const rawDkim = getEmptySignatureDkim(headers);
        const hashH = hashHeaders(relaxedH, rawDkim);
        const publicKey = await getDkimPublicKey(dkim);
        console.log(rawDkim, "rawDkim");
        console.log(hashH, "hashHeaders");
        console.log(h, "h");
        console.log(hash, "hash");
        console.log(bh, "bh");
        console.log(publicKey, "publicKey");
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
