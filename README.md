# Air Quality and Weather Dashboard

 This application provides real-time weather information for a specified location. 

## Features 
* Retrieves current weather conditions (temperature, humidity, etc.).
* Allows users to input a location (city)
* Displays data in a clear and user-friendly format. 
* Handles API errors gracefully. 
* Deployed on a load-balanced web server setup.

## Technologies Used 
* Frontend: HTML, CSS, JavaScript 
* APIs: 
* [RapidAPI Hub: public API Marketplace] 
* [(https://rapidapi.com/worldapi/api/open-weather13/playground/apiendpoint_d15cd885-e8e5-49e7-b94b-588c41687aa1)] 
* Web Servers: Nginx or Apache 
* Load Balancer: Nginx 

## Setup and Installation 

### Local Setup 
1. Clone the repository: `git clone [repository_url]` 
2. Navigate to the project directory: `cd air-weather-forecater` 
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

* **API Rate Limits:  
* **Load Balancer Configuration:
** Spent time learning the best practices for configuring Nginx as a load balancer. 

## Credits and Resources 
* RapidAPI Hub: public API Marketplace for providing the weather and air quality APIs. 
* [https://rapidapi.com/hub] 

## Author 

* [Owen Ganza]
