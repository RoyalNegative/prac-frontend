const apiUrl = "https://pracc-0dcdba945892.herokuapp.com/api/some-endpoint";


fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    console.log('Data from backend:', data);
  })
  .catch(error => console.error('Error fetching data:', error));
