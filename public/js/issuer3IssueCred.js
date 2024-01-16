import { sendLogServerSide } from "./utils/logger.js";

// responses from native app
document.addEventListener("DidResponse", function (event) {
  sendLogServerSide(event.detail);
  const subjectDid = event.detail;

  fetch("/issue-credential-3", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      subjectDid,
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

function requestCredentials() {
  const pd = {
    'id': 'firstname-retrieval-pd',
    'name': 'FirstName Retrieval Process',
    'purpose': 'Retrieve the first name from credential data',
    'input_descriptors': [
        {
            'id': 'firstname-field',
            'purpose': 'Extract first name for identification',
            'constraints': {
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

  const fromWebViewMessage = JSON.stringify({
    type: "REQUEST_CREDENTIALS",
    payload: pd,
  });
  sendLogServerSide(fromWebViewMessage);
  window.ReactNativeWebView.postMessage(fromWebViewMessage);
}


window.requestDid = requestDid;
window.requestCredentials = requestCredentials;