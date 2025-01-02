const apiUrl = "https://pracc-0dcdba945892.herokuapp.com"; // Backend base URL

// Fetch the root endpoint (optional test)
fetch(apiUrl)
  .then(response => response.text()) // Use text() as backend sends plain text
  .then(data => {
    if(data === ""){
      return; // No need to log empty response
    }
    else{
      console.log("Root Endpoint Data:", data);
      document.getElementById("text").textContent = data;
    }
  })
  .catch(error => console.error("Error fetching root endpoint:", error));




