function issueCred() {
    fetch('/issue-credential', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // You can send data in the body if needed
      // body: JSON.stringify({ key: 'value' })
    })
    .then(response => response.json())
    .then(data => {
      // Display or process the credential data
      document.getElementById('issuedCred').innerText = JSON.stringify(data, null, 2);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }