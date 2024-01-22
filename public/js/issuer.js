import { sendLogServerSide } from "./utils/logger.js";

// response from native app
document.addEventListener("DidResponse", async function (event) {
  try {
    // @ts-expect-error custom event
    const subjectDids = event.detail;
    await sendLogServerSide("Received DidResponse listener event");
    await sendLogServerSide(subjectDids);

    const response = await fetch("/issue-credential", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subjectDids,
      }),
    });
    const data = await response.json();

    // send VC_RESPONSE to native app
    const fromWebViewVCResponse = JSON.stringify({
      type: "VC_RESPONSE",
      payload: data,
    });
    await sendLogServerSide(fromWebViewVCResponse);
    window.ReactNativeWebView.postMessage(fromWebViewVCResponse);
  } catch (e) {
    await sendLogServerSide(e.message);
  }
});

// response from native app
document.addEventListener("PresentationSubmission", async function (event) {
  // @ts-expect-error custom event
  const presentationSubmission = event.detail;
  await sendLogServerSide("Received PresentationSubmission listener event");
  await sendLogServerSide(presentationSubmission);

  const button = document.getElementById("issueDidsButton");
  button.classList.remove("disabled");

  await fetch("/presentation-submission", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      presentationSubmission,
    }),
  });
});

// client side JS
async function requestDid() {
  try {
    const fromWebViewMessage = JSON.stringify({
      type: "DID_REQUEST",
      payload: null,
    });
    await sendLogServerSide(fromWebViewMessage);
    window.ReactNativeWebView.postMessage(fromWebViewMessage);
  } catch (e) {
    await sendLogServerSide(e.message);
  }
}

// client side JS
async function requestCredentials() {
  try {
    const pd = {
      id: "firstname-retrieval-pd",
      name: "FirstName Retrieval Process",
      purpose: "Retrieve the first name from credential data",
      input_descriptors: [
        {
          id: "firstname-field",
          purpose: "Extract first name for identification",
          constraints: {
            fields: [
              {
                path: ["$.credentialSubject.firstName"],
              },
            ],
          },
        },
      ],
    };
    const fromWebViewMessage = JSON.stringify({
      type: "PRESENTATION_DEFINITION_RESPONSE",
      payload: pd,
    });
    await sendLogServerSide(fromWebViewMessage);
    window.ReactNativeWebView.postMessage(fromWebViewMessage);
  } catch (e) {
    await sendLogServerSide(e.message);
  }
}

// bind to global var
window["requestCredentials"] = requestCredentials;
window["requestDid"] = requestDid;
