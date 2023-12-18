import express from "express";
import { join } from "path";

import { VerifiableCredential, PresentationExchange } from "@web5/credentials";
import { DidKeyMethod } from "@web5/dids";

const issuerDid = await DidKeyMethod.create();
const subjectDid = await DidKeyMethod.create();

class TBDCredential {
  constructor(userName) {
    this.userName = userName;
  }
}

const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static(join(process.cwd(), "public")));

app.get("/", (req, res) => {
  res.render("index", { title: "TBDIssuer" });
});

app.get("/issue-credential", (req, res) => {
  res.render("issuecred", { title: "TBDIssuer - Issue Cred" });
});

app.post("/issue-credential", async (req, res) => {
  // TODO: Get subject name from request body
  const vc = await VerifiableCredential.create({
    type: "TBDCredential",
    issuer: issuerDid.did,
    subject: subjectDid.did,
    data: new TBDCredential("Biell"),
  });

  const signedVcJwt = await vc.sign({ did: issuerDid });

  res.json({ vcJwt: signedVcJwt });
});

// logging
app.post("/log", (req) => {
  console.log("Client side log:", req.body);
});

// error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start the server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
