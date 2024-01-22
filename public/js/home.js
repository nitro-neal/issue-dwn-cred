document.addEventListener("DOMContentLoaded", function () {
  generateQRCode(
    "web5://credentials/issuance?url=http://localhost:3000/issue-credential"
  );
});

function generateQRCode(text) {
  // @ts-expect-error globally imported
  // eslint-disable-next-line no-undef
  new QRCode(document.getElementById("qrcode"), text);
}

// bind to global var
window["generateQRCode"] = generateQRCode;
