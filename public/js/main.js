
document.addEventListener('DOMContentLoaded', function() {
  generateQRCode("web5://credentials/issuance?url=http://localhost:3000/issue-credential");
});

function sayHello() {
    alert('Hello from the frontend!');
  }

function generateQRCode(text) {
  new QRCode(document.getElementById("qrcode"), text);
}