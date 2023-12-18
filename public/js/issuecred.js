import { sendLogServerSide } from "./utils/logger.js";

// responses from native app
document.addEventListener("DidResponse", function (event) {
  sendLogServerSide(event.detail);
  document.getElementById("didResponse").innerText = event.detail;
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

function issueCred() {
  fetch("/issue-credential", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // You can send data in the body if needed
    // body: JSON.stringify({ key: 'value' })
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
}

window.requestDid = requestDid;
window.issueCred = issueCred;
