const apiUrl = "https://pracc-0dcdba945892.herokuapp.com"; // Backend base URL

// Fetch the root endpoint (optional test)
fetch(apiUrl)
  .then(response => response.text()) // Use text() as backend sends plain text
  .then(data => {
    console.log("Root Endpoint Data:", data);
  })
  .catch(error => console.error("Error fetching root endpoint:", error));

// Fetch the /api/message endpoint
const text = document.getElementById("text");

fetch("/api/message") 
  .then(response => response.text()) // Use text() since backend sends plain text
  .then(data => {
    text.innerText = data; // Update the HTML element with the response text
  })
  .catch(error => {
    console.error("Error fetching /api/message:", error);
    text.innerText = "Failed to load message."; // Display error message in the UI
  });

