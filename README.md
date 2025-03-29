# Weather & Travel Planner

This is a web application that provides real-time weather forecasts and integrated travel planning tools. Get instant weather information for any city worldwide and seamlessly book flights, hotels, and vacation rentals all in one place.

## 🌟 Features

- **Weather Forecasting**: Get current weather conditions for any city with temperature, humidity, wind speed, and more
- **Flight Search**: Find and compare flights between destinations with pricing and schedule information
- **Hotel Booking**: Browse available hotels with ratings, reviews, and pricing details
- **Vacation Rentals**: Discover rental properties with amenities and availability calendars
- **Recent Search History**: Quickly access your most recently searched locations
- **Responsive Design**: Enjoy a seamless experience across desktop and mobile devices

## 🛠️ Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **UI Framework**: Bootstrap 5
- **Icons**: Font Awesome 6
- **API Integration**:
  - [WeatherAPI.com](https://www.weatherapi.com/) for weather data
  - [TripAdvisor API](https://www.tripadvisor.com/developers) for travel bookings
- **Deployment**: Load-balanced deployment with Nginx

## 🚀 Setup and Installation

### Prerequisites

- Basic knowledge of web development
- API keys for WeatherAPI.com and TripAdvisor (via RapidAPI)
- A web browser
- For deployment: Two Ubuntu servers and an Nginx server for load balancing

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

### Production Deployment with Load Balancing

#### Server Setup (Web Servers)

1. Provision two Ubuntu servers (web-server-1 and web-server-2)

2. On each web server, install Nginx:
   ```bash
   sudo apt update
   sudo apt install nginx -y
   ```

3. Deploy the application files to each server:
   ```bash
   # Create the application directory
   sudo mkdir -p /var/www/weather-app
   
   # Copy application files to the server
   scp -r templates/* user@web-server-ip:/var/www/weather-app/
   ```

4. Create an Nginx server block configuration on each web server:
   ```bash
   sudo nano /etc/nginx/sites-available/weather-app
   ```

5. Add the following configuration:
   ```nginx
   server {
       listen 80;
       server_name web-server-1.example.com; # Use your domain or IP
       
       root /var/www/weather-app;
       index index.html;
       
       location / {
           try_files $uri $uri/ =404;
       }
       
       # Add CORS headers for API requests
       location /api/ {
           add_header 'Access-Control-Allow-Origin' '*';
           add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
           add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range';
       }
       
       # Log configuration
       access_log /var/log/nginx/weather-app-access.log;
       error_log /var/log/nginx/weather-app-error.log;
   }
   ```

6. Enable the server block and restart Nginx:
   ```bash
   sudo ln -s /etc/nginx/sites-available/weather-app /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

7. Secure API keys by creating environment variables or using server-side proxying:
   ```bash
   # Create a secure API key file
   echo "API_KEY=your_rapidapi_key" > /var/www/weather-app/.env.weather.secure
   chmod 600 /var/www/weather-app/.env.weather.secure
   ```

#### Load Balancer Setup

1. Provision another Ubuntu server for the load balancer (lb-server)

2. Install Nginx on the load balancer:
   ```bash
   sudo apt update
   sudo apt install nginx -y
   ```

3. Create a new configuration file for the load balancer:
   ```bash
   sudo nano /etc/nginx/sites-available/lb-weather-app
   ```

4. Add the following configuration to set up the load balancer:
   ```nginx
   # Define the upstream servers (web server instances)
   upstream weather_app_backend {
       # Use IP hash method to ensure users always hit the same server
       # This helps maintain session consistency
       ip_hash;
       
       # List your web server instances here with their IPs and ports
       server web-server-1-ip:80 weight=1 max_fails=3 fail_timeout=30s;
       server web-server-2-ip:80 weight=1 max_fails=3 fail_timeout=30s;
       
       # Uncomment for health checks (if your Nginx version supports it)
       # health_check interval=10 fails=3 passes=2;
   }
   
   server {
       listen 80;
       server_name weather-app.example.com; # Your production domain
       
       # Handle favicon requests
       location = /favicon.ico {
           access_log off;
           log_not_found off;
       }
       
       # Proxy all requests to the backend servers
       location / {
           proxy_pass http://weather_app_backend;
           proxy_http_version 1.1;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           
           # Timeouts
           proxy_connect_timeout 10;
           proxy_send_timeout 30;
           proxy_read_timeout 30;
           
           # Enable WebSockets if needed
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_cache_bypass $http_upgrade;
       }
       
       # Enable gzip compression for better performance
       gzip on;
       gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
       
       # Log configuration
       access_log /var/log/nginx/lb-access.log;
       error_log /var/log/nginx/lb-error.log;
   }
   ```

5. Enable the load balancer configuration and restart Nginx:
   ```bash
   sudo ln -s /etc/nginx/sites-available/lb-weather-app /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

6. Configure SSL/TLS with Let's Encrypt (recommended for production):
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   sudo certbot --nginx -d weather-app.example.com
   ```

#### Testing the Load Balancer

1. Verify both web servers are running:
   ```bash
   curl http://web-server-1-ip
   curl http://web-server-2-ip
   ```

2. Test the load balancer:
   ```bash
   curl http://load-balancer-ip
   ```

3. Implement server health monitoring by adding a health check file:
   ```bash
   # On each web server
   echo "OK" > /var/www/weather-app/health.txt
   ```

4. Verify load balancing with a simple test script:
   ```bash
   # Save as test-lb.sh
   #!/bin/bash
   
   for i in {1..20}; do
     curl -s http://load-balancer-ip | grep -o "Server: web-server-[12]"
     sleep 1
   done
   ```

5. Monitor the access logs on both web servers to confirm traffic distribution:
   ```bash
   sudo tail -f /var/log/nginx/weather-app-access.log
   ```

6. Test failure scenarios by temporarily stopping Nginx on one server:
   ```bash
   sudo systemctl stop nginx
   ```
   
   Then verify that all requests are now routed to the remaining server.

## 📝 API Usage

### Weather API

The application uses the WeatherAPI.com service through RapidAPI to fetch current weather conditions:

```javascript
// Example API call
fetch(`https://weatherapi-com.p.rapidapi.com/current.json?q=${city}`, {
    method: 'GET',
    headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': 'weatherapi-com.p.rapidapi.com'
    }
})
```

### TripAdvisor API

The application uses TripAdvisor's API for flights, hotels, and rentals:

```javascript
// Example hotels API call
fetch(`https://tripadvisor16.p.rapidapi.com/api/v1/hotels/searchHotelsByLocation?${queryString}`, {
    method: 'GET',
    headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': 'tripadvisor16.p.rapidapi.com'
    }
})
```

## 🛡️ Privacy & Security

- API keys are stored in restricted `.env.weather.secure` files with limited permissions
- The `.gitignore` file prevents sensitive files from being committed to the repository

## 👥 Author

- [Owen Ganza](https://github.com/owen-stud123)

## 🙏 Acknowledgments

- [RapidAPI](https://rapidapi.com/hub) for providing access to various APIs
- [Bootstrap](https://getbootstrap.com/) for the responsive design framework
- [Font Awesome](https://fontawesome.com/) for the icons used throughout the application
