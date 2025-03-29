# Weather & Travel Planner

This is a web application that provides real-time weather forecasts and integrated travel planning tools. Get instant weather information for any city or country worldwide and seamlessly book flights, hotels, and vacation rentals all in one place.

![Weather & Travel Planner Demo](Screenshot 2025-03-30 000929)

##  Features

- **Weather Forecasting**: Get current weather conditions for any city with temperature, humidity, wind speed, and more
- **Flight Search**: Find and compare flights between destinations with pricing and schedule information
- **Hotel Booking**: Browse available hotels with ratings, reviews, and pricing details
- **Vacation Rentals**: Discover rental properties with amenities and availability calendars
- **Recent Search History**: Quickly access your most recently searched locations
- **Responsive Design**: Enjoy a seamless experience across desktop and mobile devices

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **UI Framework**: Bootstrap 5
- **Icons**: Font Awesome 6
- **API Integration**:
  - [WeatherAPI.com](https://www.weatherapi.com/) for weather data
  - [TripAdvisor API](https://www.tripadvisor.com/developers) for travel bookings
- **Deployment**: Static hosting with Nginx or Apache

##  Setup and Installation

### Prerequisites

- Basic knowledge of web development
- API keys for WeatherAPI.com and TripAdvisor (via RapidAPI)
- A web browser

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/owen-stud123/Weather-Travel-Planner.git
   ```

2. Navigate to the project directory:
   ```bash
   cd Weather-Travel-Planner
   ```

3. Open `templates/main.js` and replace the API key with your own:
   ```javascript
   const API_KEY = 'YOUR_RAPIDAPI_KEY';
   ```

4. Open `templates/index.html` in your web browser or use a local development server:
   ```bash
   npx serve templates
   ```

### Production Deployment

1. Transfer the files to your web server's document root
2. Configure your web server (Nginx or Apache) to serve the files
3. For load balancing, see the configuration example in `deployment/lb01/nginx.conf`

##  API Usage

### Weather API

The application uses the WeatherAPI.com service through RapidAPI to fetch current weather conditions:

### TripAdvisor API

The application uses TripAdvisor's API for flights, hotels, and rentals:

##  Privacy & Security

- API keys are stored securely and not committed to the repository

##  Challenges and Solutions

- **API Rate Limits**: Implemented caching and user throttling to prevent exceeding limits
- **Responsive Design**: Used Bootstrap's grid system and media queries for mobile optimization
- **Load Balancer Configuration**: Configured Nginx for high availability and performance

##  Author

- [Owen Ganza](https://github.com/owen-stud123)

##  Acknowledgments

- [RapidAPI](https://rapidapi.com/hub) for providing access to various APIs
- [Bootstrap](https://getbootstrap.com/) for the responsive design framework
- [Font Awesome](https://fontawesome.com/) for the icons used throughout the application
