$headers=@{}
$headers.Add("x-rapidapi-key", "a419c4e183mshd579c3b0521e74cp192608jsndc0b5c923c55")
$headers.Add("x-rapidapi-host", "open-weather13.p.rapidapi.com")
$response = Invoke-WebRequest -Uri 'https://open-weather13.p.rapidapi.com/city/landon/EN' -Method GET -Headers $headers