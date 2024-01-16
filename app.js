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

class DuffCredential {
  constructor(firstName) {
    this.firstName = firstName;
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
  const subjectDids = JSON.parse(req.body.subjectDids);

  const promises = subjectDids.map(async (subjectDid) => {
    const vc = await VerifiableCredential.create({
      type: "TBDCredential",
      issuer: issuerDid.did,
      subject: subjectDid,
      data: new TBDCredential("Biell"),
    });
    return vc.sign({ did: issuerDid });
  });

  const vcJwts = await Promise.all(promises);
  res.json({ vcJwts: vcJwts });
});

// ISSUER 2
app.get("/issuer-2", (req, res) => {
  res.render("issuer2Home");
});

app.get("/issue-credential-2", (req, res) => {
  res.render("issuer2Form");
});

app.post("/issue-credential-2", async (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const dob = req.body.dob;
  const address = req.body.address;

  //TODO: Get Correct Did for subject
  const vc = await VerifiableCredential.create({
    type: "AcmeCredential",
    issuer: issuerDid.did,
    subject: issuerDid.did,
    data: new AcmeCredential(firstName, lastName, dob, address),
  });

  const signedVcJwt = await vc.sign({ did: issuerDid });

  res.json({ vcJwt: signedVcJwt });
});


// ISSUER 3
app.get("/issuer-3", (req, res) => {
  res.render("issuer3Home");
});

app.get("/issue-credential-3", (req, res) => {
  res.render("issuer3Form");
});

app.post("/issue-credential-3", async (req, res) => {
  // TODO: Get presentationSubmission from Submits Credentials call from wallet
  const presentationSubmission = {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://identity.foundation/presentation-exchange/submission/v1"
    ],
    "type": [
      "VerifiablePresentation",
      "PresentationSubmission"
    ],
    "presentation_submission": {
      "id": "hY3W-NLImT77YAR4Sxapm",
      "definition_id": "firstname-retrieval-pd",
      "descriptor_map": [
        {
          "id": "firstname-field",
          "format": "jwt_vc",
          "path": "$.verifiableCredential[0]"
        }
      ]
    },
    "verifiableCredential": [
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJFZERTQSIsImtpZCI6ImRpZDprZXk6ejZNa3JTd0c3UGY5S21qVXhqMjJXOG1tYzRRVDk1TEJ1Mzd3UVRuNGFZNTNZTHJ2I3o2TWtyU3dHN1BmOUttalV4ajIyVzhtbWM0UVQ5NUxCdTM3d1FUbjRhWTUzWUxydiJ9.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiRmlyc3ROYW1lIl0sImlkIjoidXJuOnV1aWQ6YTQxOWMzZTYtZmVlNC00YzgxLWI1Y2EtZTUyYTgwMWJkMWE5IiwiaXNzdWVyIjoiZGlkOmtleTp6Nk1rclN3RzdQZjlLbWpVeGoyMlc4bW1jNFFUOTVMQnUzN3dRVG40YVk1M1lMcnYiLCJpc3N1YW5jZURhdGUiOiIyMDI0LTAxLTE2VDE3OjAxOjM2WiIsImNyZWRlbnRpYWxTdWJqZWN0Ijp7ImlkIjoiZGlkOmtleTp6Nk1rclN3RzdQZjlLbWpVeGoyMlc4bW1jNFFUOTVMQnUzN3dRVG40YVk1M1lMcnYiLCJmaXJzdE5hbWUiOiJTYXRvc2hpIn19LCJpc3MiOiJkaWQ6a2V5Ono2TWtyU3dHN1BmOUttalV4ajIyVzhtbWM0UVQ5NUxCdTM3d1FUbjRhWTUzWUxydiIsInN1YiI6ImRpZDprZXk6ejZNa3JTd0c3UGY5S21qVXhqMjJXOG1tYzRRVDk1TEJ1Mzd3UVRuNGFZNTNZTHJ2In0.NX5qu4wJdU7Y9Wxr3ywSOJkgp8P4BYFK5V-dSLdC-nkJjoN4IeQf7s8vjGPgZYuMNYnSgnWNy3P5cpmQECIfCA"
    ]
  }


  // TODO: More validation
  PresentationExchange.validateSubmission({ presentationSubmission })

  const parsedVc = VerifiableCredential.parseJwt({vcJwt: presentationSubmission.verifiableCredential[0]})
  const parsedFirstName = parsedVc.vcDataModel.credentialSubject['firstName']

  

  //TODO: Get Correct Did for subject
  const vc = await VerifiableCredential.create({
    type: "DuffCredential",
    issuer: issuerDid.did,
    subject: issuerDid.did,
    data: new DuffCredential(parsedFirstName)
  });

  const signedVcJwt = await vc.sign({ did: issuerDid });

  res.json({ vcJwt: signedVcJwt });
});

// OTHER
app.get("/debug", async (req, res) => {
  const firstNameVcJwt = "eyJ0eXAiOiJKV1QiLCJhbGciOiJFZERTQSIsImtpZCI6ImRpZDprZXk6ejZNa3NheE5VNGl1ZHlYRm5KaVJpSll1ZXZLM0pKbzhoMVZYR0M4c0Jzb0JOV0J6I3o2TWtzYXhOVTRpdWR5WEZuSmlSaUpZdWV2SzNKSm84aDFWWEdDOHNCc29CTldCeiJ9.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiRmlyc3ROYW1lIl0sImlkIjoidXJuOnV1aWQ6MTQyYzUzOTAtNDVlMC00MjQ2LWI4ZGYtMDM4M2YyMTc3Njg4IiwiaXNzdWVyIjoiZGlkOmtleTp6Nk1rc2F4TlU0aXVkeVhGbkppUmlKWXVldkszSkpvOGgxVlhHQzhzQnNvQk5XQnoiLCJpc3N1YW5jZURhdGUiOiIyMDI0LTAxLTEyVDIzOjIxOjA5WiIsImNyZWRlbnRpYWxTdWJqZWN0Ijp7ImlkIjoiZGlkOmtleTp6Nk1rc2F4TlU0aXVkeVhGbkppUmlKWXVldkszSkpvOGgxVlhHQzhzQnNvQk5XQnoiLCJmaXJzdE5hbWUiOiJTYXRvc2hpIn19LCJpc3MiOiJkaWQ6a2V5Ono2TWtzYXhOVTRpdWR5WEZuSmlSaUpZdWV2SzNKSm84aDFWWEdDOHNCc29CTldCeiIsInN1YiI6ImRpZDprZXk6ejZNa3NheE5VNGl1ZHlYRm5KaVJpSll1ZXZLM0pKbzhoMVZYR0M4c0Jzb0JOV0J6In0.1qwiaiBXZJszwhChYI4V4H_ad_tLq9YsfE4pcStyjJwXjyH7UKp0OodXtoJaLP1cbV27KyNBaI0ntoTgTJelBw"

  const firstNamePresentationDefinition = {
    'id'                : 'firstname-retrieval-pd',
    'name'              : 'FirstName Retrieval Process',
    'purpose'           : 'Retrieve the first name from credential data',
    'input_descriptors' : [
      {
        'id'          : 'firstname-field',
        'purpose'     : 'Extract first name for identification',
        'constraints' : {
          'fields': [
            {
              'path': [
                '$.credentialSubject.firstName',
              ]
            }
          ]
        }
      }
    ]
  };

  // **Wallet Side**
  // 1. calls `requestCredentials` to get presentationDefinition
  // 2. PresentationExchange.selectCredentials to get credentials that match presentation definition
  const credsThatMatchPd = PresentationExchange.selectCredentials({presentationDefinition: firstNamePresentationDefinition, vcJwts: [firstNameVcJwt]});
  console.log("Creds that match pd:")
  console.log(credsThatMatchPd)

  // 3. create presentationSubmission
  const presentationResult = PresentationExchange.createPresentationFromCredentials({presentationDefinition: firstNamePresentationDefinition, vcJwts: credsThatMatchPd});
  console.log("Presentation Submission:")
  console.log(presentationResult)

  // 4. calls `submitsCredentials` and gives presentationSubmission

  // **Issuer Side**
  // 1. validates the submission
  const isValid = PresentationExchange.validateSubmission({ presentationSubmission: presentationResult.presentationSubmission })
  console.log("Presentation Submission is valid")

  // 2. validates it is a correct submission against the given presentation definition
  const evaluationResults = PresentationExchange.evaluatePresentation({ presentationDefinition:firstNamePresentationDefinition, presentation: presentationResult.presentation })
  console.log("Pd is Valid vs Presentation")

  // 3. Issuer is satisfied and maybe does more processing, gets the subjects did
  const subjectDid = VerifiableCredential.parseJwt({vcJwt: presentationResult.presentation.verifiableCredential[0]}).subject

  // 4. Issuer issues KnownCustomer credential
  const knownCustomerVc = await VerifiableCredential.create({
    type: "KnownCusomter",
    issuer: issuerDid.did,
    subject: subjectDid,
    data: { knownCusomter: true }
  });

  // const verifiedEmployeeVc = await VerifiableCredential.create({
  //   type: "VerifiedEmployee",
  //   issuer: issuerDid.did,
  //   subject: issuerDid.did,
  //   data: { verifiedEmployee: "Block" }
  // });

  // 5. Issuer signs known customer credential
  const knownCustomerVcJwt = await knownCustomerVc.sign({ did: issuerDid });

  console.log("KnownCusomter VC Jwt:\n")
  console.log(knownCustomerVcJwt)


  res.json({ firstNameVcJwt, firstNamePresentationDefinition, presentationResult, knownCustomerVcJwt });
});

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
