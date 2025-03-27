$headers=@{}
$headers.Add("x-rapidapi-key': 'a419c4e183mshd579c3b0521e74cp192608jsndc0b5c923c55")
$headers.Add("x-rapidapi-host': 'tripadvisor16.p.rapidapi.com")
$response = Invoke-WebRequest -Uri 'https://tripadvisor16.p.rapidapi.com/api/v1/flights/searchFlights' -Method GET -Headers $headers
