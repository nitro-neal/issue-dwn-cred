import express from "express";
import { join } from "path";

import { PresentationExchange, VerifiableCredential } from "@web5/credentials";
import { DidKeyMethod } from "@web5/dids";

const issuerDid = await DidKeyMethod.create();

class DuffCredential {
  constructor(firstName) {
    this.firstName = firstName;
  }
}

const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static(join(process.cwd(), "public")));

app.get("/", (req, res) => {
  res.render("home", { title: "TBD Issuer" });
});

app.get("/issuer", (req, res) => {
  res.render("issuer", { title: "TBD Issuer" });
});

app.post("/issue-credential", async (req, res) => {
  try {
    const subjectDids = JSON.parse(req.body.subjectDids);

    const promises = subjectDids.map(async (subjectDid) => {
      const vc = await VerifiableCredential.create({
        type: "TBDCredential",
        issuer: issuerDid.did,
        subject: subjectDid,
        data: new DuffCredential("Biell"),
      });

      return vc.sign({ did: issuerDid });
    });

    const vcJwts = await Promise.all(promises);
    res.json({ vcJwts: vcJwts });
  } catch (e) {
    console.error(e);
  }
});

app.post("/presentation-submission", async (req, res) => {
  try {
    const presentationSubmission = JSON.parse(req.body.presentationSubmission);
    PresentationExchange.validateSubmission({ presentationSubmission });
    VerifiableCredential.parseJwt({
      vcJwt: presentationSubmission.verifiableCredential[0],
    });
    // TODO: save the presentation submission and somehow "attach" it to a session with the device
    res.status(200).send("Presentation Submission Received");
  } catch (e) {
    console.error(e);
  }
});

// OTHER
// app.get("/debug", async (req, res) => {
//   const firstNameVcJwt =
//     "eyJ0eXAiOiJKV1QiLCJhbGciOiJFZERTQSIsImtpZCI6ImRpZDprZXk6ejZNa3NheE5VNGl1ZHlYRm5KaVJpSll1ZXZLM0pKbzhoMVZYR0M4c0Jzb0JOV0J6I3o2TWtzYXhOVTRpdWR5WEZuSmlSaUpZdWV2SzNKSm84aDFWWEdDOHNCc29CTldCeiJ9.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiRmlyc3ROYW1lIl0sImlkIjoidXJuOnV1aWQ6MTQyYzUzOTAtNDVlMC00MjQ2LWI4ZGYtMDM4M2YyMTc3Njg4IiwiaXNzdWVyIjoiZGlkOmtleTp6Nk1rc2F4TlU0aXVkeVhGbkppUmlKWXVldkszSkpvOGgxVlhHQzhzQnNvQk5XQnoiLCJpc3N1YW5jZURhdGUiOiIyMDI0LTAxLTEyVDIzOjIxOjA5WiIsImNyZWRlbnRpYWxTdWJqZWN0Ijp7ImlkIjoiZGlkOmtleTp6Nk1rc2F4TlU0aXVkeVhGbkppUmlKWXVldkszSkpvOGgxVlhHQzhzQnNvQk5XQnoiLCJmaXJzdE5hbWUiOiJTYXRvc2hpIn19LCJpc3MiOiJkaWQ6a2V5Ono2TWtzYXhOVTRpdWR5WEZuSmlSaUpZdWV2SzNKSm84aDFWWEdDOHNCc29CTldCeiIsInN1YiI6ImRpZDprZXk6ejZNa3NheE5VNGl1ZHlYRm5KaVJpSll1ZXZLM0pKbzhoMVZYR0M4c0Jzb0JOV0J6In0.1qwiaiBXZJszwhChYI4V4H_ad_tLq9YsfE4pcStyjJwXjyH7UKp0OodXtoJaLP1cbV27KyNBaI0ntoTgTJelBw";

//   const firstNamePresentationDefinition = {
//     id: "firstname-retrieval-pd",
//     name: "FirstName Retrieval Process",
//     purpose: "Retrieve the first name from credential data",
//     input_descriptors: [
//       {
//         id: "firstname-field",
//         purpose: "Extract first name for identification",
//         constraints: {
//           fields: [
//             {
//               path: ["$.credentialSubject.firstName"],
//             },
//           ],
//         },
//       },
//     ],
//   };

//   // **Wallet Side**
//   // 1. calls `requestCredentials` to get presentationDefinition
//   // 2. PresentationExchange.selectCredentials to get credentials that match presentation definition
//   const credsThatMatchPd = PresentationExchange.selectCredentials({
//     presentationDefinition: firstNamePresentationDefinition,
//     vcJwts: [firstNameVcJwt],
//   });
//   console.log("Creds that match pd:");
//   console.log(credsThatMatchPd);

//   // 3. create presentationSubmission
//   const presentationResult =
//     PresentationExchange.createPresentationFromCredentials({
//       presentationDefinition: firstNamePresentationDefinition,
//       vcJwts: credsThatMatchPd,
//     });
//   console.log("Presentation Submission:");
//   console.log(presentationResult);

//   // 4. calls `submitsCredentials` and gives presentationSubmission

//   // **Issuer Side**
//   // 1. validates the submission
//   const isValid = PresentationExchange.validateSubmission({
//     presentationSubmission: presentationResult.presentationSubmission,
//   });
//   console.log(isValid);
//   console.log("Presentation Submission is valid");

//   // 2. validates it is a correct submission against the given presentation definition
//   const evaluationResults = PresentationExchange.evaluatePresentation({
//     presentationDefinition: firstNamePresentationDefinition,
//     presentation: presentationResult.presentation,
//   });
//   console.log(evaluationResults);
//   console.log("Pd is Valid vs Presentation");

//   // 3. Issuer is satisfied and maybe does more processing, gets the subjects did
//   const subjectDid = VerifiableCredential.parseJwt({
//     vcJwt: presentationResult.presentation.verifiableCredential[0],
//   }).subject;

//   // 4. Issuer issues KnownCustomer credential
//   const knownCustomerVc = await VerifiableCredential.create({
//     type: "KnownCusomter",
//     issuer: issuerDid.did,
//     subject: subjectDid,
//     data: { knownCusomter: true },
//   });

//   // const verifiedEmployeeVc = await VerifiableCredential.create({
//   //   type: "VerifiedEmployee",
//   //   issuer: issuerDid.did,
//   //   subject: issuerDid.did,
//   //   data: { verifiedEmployee: "Block" }
//   // });

//   // 5. Issuer signs known customer credential
//   const knownCustomerVcJwt = await knownCustomerVc.sign({ did: issuerDid });

//   console.log("KnownCusomter VC Jwt:\n");
//   console.log(knownCustomerVcJwt);

//   res.json({
//     firstNameVcJwt,
//     firstNamePresentationDefinition,
//     presentationResult,
//     knownCustomerVcJwt,
//   });`
// });

app.post("/log", (req, res) => {
  console.log("Client side log:", req.body);
  res.status(200).send("Log received");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
