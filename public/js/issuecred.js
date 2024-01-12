import { sendLogServerSide } from "./utils/logger.js";

// responses from native app
document.addEventListener("DidResponse", function (event) {
  sendLogServerSide(event.detail);
  const subjectDids = event.detail;

  fetch("/issue-credential", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      subjectDids,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      const fromWebViewVCResponse = JSON.stringify({
        type: "VC_RESPONSE",
        payload: data,
      });
      sendLogServerSide(fromWebViewVCResponse);
      window.ReactNativeWebView.postMessage(fromWebViewVCResponse);
    })
    .catch((error) => {
      throw error;
    });
});

// client side JS
function requestDid() {
  const fromWebViewMessage = JSON.stringify({
    type: "DID_REQUEST",
    payload: null,
  });
  sendLogServerSide(fromWebViewMessage);
  window.ReactNativeWebView.postMessage(fromWebViewMessage);
}

window.requestDid = requestDid;
