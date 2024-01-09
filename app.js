import express from "express";
import { join } from "path";

import { VerifiableCredential, PresentationExchange } from "@web5/credentials";
import { DidKeyMethod } from "@web5/dids";

const issuerDid = await DidKeyMethod.create();

class TBDCredential {
  constructor(userName) {
    this.userName = userName;
  }
}

class AcmeCredential {
  constructor(firstName, lastName, dob, address) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.dob = dob;
    this.address = address;
  }
}

const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static(join(process.cwd(), "public")));
app.use(express.urlencoded({ extended: true }));

// ISSUER 1
app.get("/", (req, res) => {
  res.render("index", { title: "TBDIssuer" });
});

app.get("/issue-credential", (req, res) => {
  res.render("issuecred", { title: "TBDIssuer - Issue Cred" });
});

app.post("/issue-credential", async (req, res) => {
  const subjectDid = req.body.subjectDid;

  const vc = await VerifiableCredential.create({
    type: "TBDCredential",
    issuer: issuerDid.did,
    subject: subjectDid,
    data: new TBDCredential("Biell"),
  });
  const signedVcJwt = await vc.sign({ did: issuerDid });

  res.json({ vcJwt: signedVcJwt });
});

// ISSUER 2
app.get("/issuer-2", (req, res) => {
  res.render("issuer2Home");
});

app.get("/issue-credential-2", (req, res) => {
  res.render("issuer2Form");
});

app.post("/issue-credential-2", async (req, res) => {

  console.log("INSIDE")
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const dob = req.body.dob;
  const address = req.body.address;

  //TODO: Get Correct Did for subject
  const vc = await VerifiableCredential.create({
    type: "AcmeCredential",
    issuer: issuerDid.did,
    subject: issuerDid.did,
    data: new AcmeCredential(firstName, lastName, dob, address)
  });

  const signedVcJwt = await vc.sign({ did: issuerDid });

  res.json({ vcJwt: signedVcJwt });
});

// OTHER
app.post("/log", (req) => {
  console.log("Client side log:", req.body);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
