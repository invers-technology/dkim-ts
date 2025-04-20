import { relaxedBody, relaxedHeaders } from "./dkim/canonicalization";
import { parseEmail } from "./email";
import { hashHeaders, hashBody } from "./dkim/hash";
import { getEmptySignatureDkim, parseDkim } from "./dkim/header";
import { imap } from "./imap";
import { verifyDkimSignature } from "./dkim/verification";

export { parseEmail };

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
        const rawDkim = getEmptySignatureDkim(headers);
        const hashH = hashHeaders(relaxedH, rawDkim);
        const verified = await verifyDkimSignature(dkim, hashH);
        const { bh } = dkim;
        const relaxedB = relaxedBody(body);
        const bodyHash = hashBody(relaxedB);
        console.log("relaxedHeaders\n", relaxedH);
        console.log("relaxedHeaders\n", Buffer.from(relaxedH));
        // console.log("relaxedBody", relaxedB);
        // console.log("hashHeaders", hashH);
        // console.log("bodyHash", bodyHash);
        // console.log("verified", bh === bodyHash);
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
