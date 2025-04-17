import { hashBody } from "./email";
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
        console.log(emailRaw, "emailRaw");
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
