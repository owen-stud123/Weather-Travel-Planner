from flask import Flask, render_template, request, jsonify
import requests
import os

def get_weather_data(city):
    API_KEY = os.getenv("X-RapidAPI-Key")  # Ensure API key is stored securely
    BASE_URL = "https://open-weather13.p.rapidapi.com/city/landon/EN"
    params = {
        "q": city,
        "appid": API_KEY,
        "units": "metric"
    }
    response = requests.get(BASE_URL, params=params)
    return response.json()

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/weather', methods=['POST'])
def weather():
    city = request.form.get('city')
    if not city:
        return jsonify({"error": "Please enter a city name."}), 400
    
    weather_data = get_weather_data(city)
    if weather_data.get("cod") != 200:
        return jsonify({"error": "City not found or API issue."}), 404
    
    return jsonify({
        "city": weather_data["name"],
        "temperature": weather_data["main"]["temp"],
        "humidity": weather_data["main"]["humidity"],
        "weather": weather_data["weather"][0]["description"],
        "wind_speed": weather_data["wind"]["speed"]
    })

if __name__ == '__main__':
    app.run(debug=True)
