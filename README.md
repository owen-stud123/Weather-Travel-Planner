# Weather & Travel Planner

A web application that provides weather forecasts and travel planning tools for any city. Get real-time weather information and book flights, hotels, and rentals all in one place.

## Features

- **Weather & Travel Planner**: Retrieve current weather conditions for any city worldwide.
- **Flight Booking**: Search and book flights to your destination.
- **Hotel Booking**: Find and reserve hotels in your chosen city.
- **Rental Booking**: Check availability for rental properties.
- **User-Friendly Interface**: Enjoy a modern, responsive design powered by Bootstrap.

## Technologies Used 
* Frontend: HTML, CSS, JavaScript 
* RapidAPI Hub: public API Marketplace for providing the weather and air quality APIs
* TripAdvisor API: For travel bookings.  
* Web Servers: Nginx or Apache 
* Load Balancer: Nginx 

## Setup and Installation 

### Local Setup 
1. Clone the repository: `git clone [https://github.com/owen-stud123/Weather-Travel-Planner.git]
2. Navigate to the project directory: `cd Weather & Travel Planner` 
3. navigate
 
### Deployment 

1. Transfer the `deployment` folder and the client and server folders to your web servers (Web01 and Web02). 
2. Run the `deploy.sh` script on each web server. This script will install dependencies and configure the web server. 
3. Configure the load balancer (Lb01) using the `nginx.conf` file provided in the `deployment/lb01` directory. 
4. Access the application through the load balancer's address. 

## API Keys 

* API keys are stored securely in the `.env` file (for backend) and are not committed to the repository. 
* If you are not using a backend, please be aware that storing api keys client side is not secure. 

## Challenges and Solutions 

* **API Rate Limits.
* **Implemented rate-limiting logic to prevent exceeding API limits.
* **Load Balancer Configuration:
* ** Spent time learning the best practices for configuring Nginx as a load balancer.

## Credits and Resources 
* RapidAPI Hub: public API Marketplace for providing the weather and air quality APIs. 
* [https://rapidapi.com/hub] OB

## Author 

* [Owen Ganza]
