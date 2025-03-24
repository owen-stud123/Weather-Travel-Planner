async function fetchWeatherData(location, apiKey) {
  const url = 'https://open-weather13.p.rapidapi.com/city/landon/EN';
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': 'a419c4e183mshd579c3b0521e74cp192608jsndc0b5c923c55',
      'x-rapidapi-host': 'open-weather13.p.rapidapi.com'
    }
  };
  try {
    const response = await fetch(url,options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
}