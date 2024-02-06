// @ts-nocheck
import { mockKycPresentationDefinition } from "./mocks/presentationDefinition.js";
import { sendLogServerSide } from "./utils/logger.js";

const attachedCredentials = new Map();

/**********************************************************
 *                                                        *
 *            listeners for events from native app        *
 *                                                        *
 **********************************************************/

/** The user has selected a credential to attach in the native app */
document.addEventListener("AttachCredentialToWebView", async function (event) {
  // The JWT of the credential.
  const credential = event.detail.credential;
  // The requirement that the credential is fulfilling.
  const requiredCredential = event.detail.requiredCredential;

  // we can in theory parse the credential but no need to do it yet
  // const parsedCredential = VerifiableCredential.parseJwt({
  //   vcJwt: credential,
  // });

  document.getElementById(`${requiredCredential}`).style.display = "none";
  document.getElementById(`${requiredCredential}Attached`).style.display =
    "flex";

  // send success to native app
  const fromWebViewVCResponse = JSON.stringify({
    type: "VC_ATTACH_SUCCESS",
    payload: credential,
  });
  window.ReactNativeWebView.postMessage(fromWebViewVCResponse);

  // 1. make sure the credential is valid, signed, and meets requirements?
  // doSomething();
  attachedCredentials.set(requiredCredential, credential);

  updateNextButtonVisibility();
});

/** The user has selected their DIDs from the native app */
document.addEventListener("DidsProvidedToWebView", async function (event) {
  try {
    const subjectDids = event.detail;

    // issue the final VC
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

    // and send it to the native app
    const fromWebViewVCResponse = JSON.stringify({
      type: "VC_FROM_WEBVIEW",
      payload: data,
    });
    window.ReactNativeWebView.postMessage(fromWebViewVCResponse);
  } catch (e) {
    await sendLogServerSide(e.message);
  }
});

/**********************************************************
 *                                                        *
 * client side event handlers                             *
 *                                                        *
 **********************************************************/
async function requestDid() {
  try {
    const fromWebViewMessage = JSON.stringify({
      type: "SELECT_DIDS",
      payload: null,
    });
    window.ReactNativeWebView.postMessage(fromWebViewMessage);
  } catch (e) {
    await sendLogServerSide(e.message);
  }
}

/**
 * @param {string} requiredCredential
 */
async function attachCredential(requiredCredential) {
  try {
    const fromWebViewMessage = JSON.stringify({
      type: "ATTACH_CREDENTIAL",
      payload: {
        requiredCredential,
        presentationDefinition: mockKycPresentationDefinition,
      },
    });
    window.ReactNativeWebView.postMessage(fromWebViewMessage);
  } catch (e) {
    await sendLogServerSide(e.message);
  }
}

/**
 * @param {string} requiredCredential
 */
async function detachCredential(requiredCredential) {
  attachedCredentials.delete(requiredCredential);

  document.getElementById(`${requiredCredential}`).style.display = "flex";
  document.getElementById(`${requiredCredential}Attached`).style.display =
    "none";

  updateNextButtonVisibility(requiredCredential);
}

/**********************************************************
 *                                                        *
 * helpers                                                *
 *                                                        *
 **********************************************************/
const updateNextButtonVisibility = () => {
  if (attachedCredentials.size == 2) {
    document.getElementById("issueDidsButton").disabled = false;
  } else {
    document.getElementById("issueDidsButton").disabled = true;
  }
};

/**********************************************************
 *                                                        *
 * bind event handlers to window                          *
 *                                                        *
 **********************************************************/
window["attachCredential"] = attachCredential;
window["detachCredential"] = detachCredential;
window["requestDid"] = requestDid;
