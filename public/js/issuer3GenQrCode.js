document.addEventListener("DOMContentLoaded", function () {
  generateQRCode(
    "web5://credentials/issuance?url=http://localhost:3000/issue-credential-3"
  );
});

function generateQRCode(text) {
  new QRCode(document.getElementById("qrcode"), text);
}

window.generateQRCode = generateQRCode;
