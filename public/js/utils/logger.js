export function sendLogServerSide(message) {
  fetch("/log", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: message }),
  }).catch((error) => console.error("Error:", error));
}
