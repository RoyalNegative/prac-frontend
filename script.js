const apiUrl = "https://pracc-0dcdba945892.herokuapp.com/";


fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    console.log('Data from backend:', data);
  })
  .catch(error => console.error('Error fetching data:', error));
