/**
 * Weather & Travel Planner Application
 * 
 * This script handles fetching weather data and travel options through various APIs.
 * It includes functionality for getting weather data, searching flights, hotels, and rentals.
 * 
 * Note: Replace the API_KEY with your actual key before using.
 */

// API key for RapidAPI services - to be replaced with your actual key
const API_KEY = '275dbf7aa4msh4044059aa6b2e43p1b4662jsna7154321ee38'; // Replace with your actual API key

// DOM elements
const weatherForm = document.getElementById('weatherForm');
const weatherResult = document.getElementById('weatherResult');
const travelResult = document.getElementById('travelResult');
const flightsBtn = document.getElementById('flights');
const hotelsBtn = document.getElementById('hotels');
const rentalsBtn = document.getElementById('rentals');
const loadingIndicator = document.getElementById('loadingIndicator');
const cityInput = document.getElementById('city');
const recentSearchesEl = document.getElementById('recentSearches');

// Store weather data globally for reuse
let weatherData;

// Store recent searches in local storage
let recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];

/**
 * Toggle loading indicator visibility
 * @param {boolean} state - True to show loading, false to hide
 */
const toggleLoading = (state) => {
    loadingIndicator.style.display = state ? 'block' : 'none';
};

/**
 * Display error message in result area
 * @param {string} message - Error message to display
 * @param {string} target - DOM element ID to display error in
 */
const showError = (message, target) => {
    document.getElementById(target).innerHTML = `
        <div class="alert alert-danger">
            <i class="fas fa-exclamation-circle me-2"></i>${message}
        </div>
    `;
};

/**
 * Save city to recent searches
 * @param {string} city - City name to save
 */
const saveToRecentSearches = (city) => {
    // Don't add duplicates
    if (!recentSearches.includes(city)) {
        // Add to beginning of array
        recentSearches.unshift(city);
        
        // Keep only 5 most recent
        if (recentSearches.length > 5) {
            recentSearches.pop();
        }
        
        // Save to local storage
        localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
        
        // Update UI
        displayRecentSearches();
    }
};

/**
 * Display recent searches in the UI
 */
const displayRecentSearches = () => {
    recentSearchesEl.innerHTML = '';
    recentSearches.forEach(city => {
        const item = document.createElement('a');
        item.classList.add('list-group-item', 'list-group-item-action', 'py-2');
        item.textContent = city;
        item.addEventListener('click', () => {
            cityInput.value = city;
            getWeather(city);
        });
        recentSearchesEl.appendChild(item);
    });
    
    if (recentSearches.length === 0) {
        recentSearchesEl.innerHTML = '<p class="text-muted small">No recent searches</p>';
    }
};

/**
 * Get appropriate weather icon based on weather condition
 * @param {string} condition - Weather condition description
 * @returns {string} - Font Awesome icon class
 */
const getWeatherIcon = (condition) => {
    const conditionLower = condition.toLowerCase();
    
    if (conditionLower.includes('clear')) return 'fa-sun';
    if (conditionLower.includes('cloud')) return 'fa-cloud';
    if (conditionLower.includes('rain')) return 'fa-cloud-rain';
    if (conditionLower.includes('snow')) return 'fa-snowflake';
    if (conditionLower.includes('thunder')) return 'fa-bolt';
    if (conditionLower.includes('mist') || conditionLower.includes('fog')) return 'fa-smog';
    
    // Default icon
    return 'fa-cloud-sun';
};

/**
 * Convert wind speed to descriptive terms
 * @param {number} speed - Wind speed in m/s
 * @returns {string} - Wind description
 */
const getWindDescription = (speed) => {
    if (speed < 0.5) return 'Calm';
    if (speed < 1.5) return 'Light air';
    if (speed < 3.3) return 'Light breeze';
    if (speed < 5.5) return 'Gentle breeze';
    if (speed < 7.9) return 'Moderate breeze';
    if (speed < 10.7) return 'Fresh breeze';
    if (speed < 13.8) return 'Strong breeze';
    if (speed < 17.1) return 'High wind';
    return 'Gale';
};

/**
 * Fetch and display weather data for a given city
 * @param {string} city - Name of the city to get weather for
 */
const getWeather = async (city) => {
    toggleLoading(true);
    weatherResult.innerHTML = '';
    
    try {
        const response = await fetch(`https://weatherapi-com.p.rapidapi.com/current.json?q=${encodeURIComponent(city)}`, {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '275dbf7aa4msh4044059aa6b2e43p1b4662jsna7154321ee38',
                'x-rapidapi-host': 'weatherapi-com.p.rapidapi.com'
            }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error?.message || 'Weather data not found');
        }

        // Store weather data for later use
        weatherData = data;
        
        // Save to recent searches
        saveToRecentSearches(data.location.name);
        
        // Get icon class based on condition
        const iconClass = getWeatherIcon(data.current.condition.text);
        
        // Format date from location.localtime
        const localTime = new Date(data.location.localtime);
        const formattedTime = localTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const formattedDate = localTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
        
        // Create weather display
        weatherResult.innerHTML = `
            <div class="weather-card">
                <div class="weather-header">
                    <div>
                        <h2>${data.location.name}, ${data.location.country}</h2>
                        <p>${formattedDate} | ${formattedTime}</p>
                    </div>
                    <div class="weather-temp">
                        ${data.current.temp_c}°C
                    </div>
                </div>
                
                <div class="d-flex align-items-center mt-3">
                    <i class="fas ${iconClass} weather-icon me-3"></i>
                    <h3>${data.current.condition.text}</h3>
                </div>
                
                <div class="weather-details">
                    <div class="weather-detail-item">
                        <i class="fas fa-temperature-high mb-2"></i>
                        <p class="mb-0">Feels Like</p>
                        <h5>${data.current.feelslike_c}°C</h5>
                    </div>
                    <div class="weather-detail-item">
                        <i class="fas fa-wind mb-2"></i>
                        <p class="mb-0">Wind</p>
                        <h5>${data.current.wind_kph} km/h</h5>
                        <p class="small text-white-50">${getWindDescription(data.current.wind_kph/3.6)}</p>
                    </div>
                    <div class="weather-detail-item">
                        <i class="fas fa-tint mb-2"></i>
                        <p class="mb-0">Humidity</p>
                        <h5>${data.current.humidity}%</h5>
                    </div>
                </div>
            </div>
            
            <div class="card shadow-sm">
                <div class="card-body">
                    <h5 class="card-title">Planning a trip to ${data.location.name}?</h5>
                    <p class="card-text">Use the buttons on the left to explore travel options.</p>
                </div>
            </div>
        `;
    } catch (error) {
        showError(error.message || 'Failed to fetch weather data', 'weatherResult');
    } finally {
        toggleLoading(false);
    }
};

/**
 * Search for flights between two airport codes
 */
flightsBtn.addEventListener('click', async () => {
    // First check if we have city data to suggest an airport
    let suggestedDestination = weatherData?.location?.name || '';
    
    const origin = prompt('Enter origin airport code (e.g., JFK):');
    const destination = prompt(`Enter destination airport code (e.g., LAX):`, suggestedDestination);
    
    if (!origin || !destination) {
        showError('Please provide both airport codes', 'travelResult');
        return;
    }
    
    toggleLoading(true);
    travelResult.innerHTML = '';
    
    try {
        // Calculate dates for departure (tomorrow) and return (+7 days)
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const returnDate = new Date(tomorrow);
        returnDate.setDate(returnDate.getDate() + 7);
        
        // Format dates as YYYY-MM-DD
        const formatDate = (date) => {
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        };
        
        const departureDate = formatDate(tomorrow);
        const returnDateStr = formatDate(returnDate);
        
        const params = {
            sourceAirportCode: origin,
            destinationAirportCode: destination,
            date: departureDate,
            itineraryType: 'ONE_WAY',
            sortOrder: 'ML_BEST_VALUE',
            numAdults: '1',
            numSeniors: '0',
            classOfService: 'ECONOMY',
            pageNumber: '1',
            currencyCode: 'USD'
        };
        
        const queryString = new URLSearchParams(params).toString();
        const url = `https://tripadvisor16.p.rapidapi.com/api/v1/flights/searchFlights?${queryString}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '275dbf7aa4msh4044059aa6b2e43p1b4662jsna7154321ee38',
                'x-rapidapi-host': 'tripadvisor16.p.rapidapi.com'
            }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch flights');
        }
        
        // Check if flights data exists
        if (data && data.data && data.data.flights) {
            const flights = data.data.flights;
            
            if (flights.length === 0) {
                travelResult.innerHTML = `
                    <div class="alert alert-warning">
                        <i class="fas fa-info-circle me-2"></i>No flights found from ${origin} to ${destination}.
                    </div>
                `;
                return;
            }
            
            // Display up to 5 flights
            const flightsToShow = flights.slice(0, 5);
            
            let flightsHtml = `
                <h4 class="mb-3">Flights from ${origin} to ${destination}</h4>
                <p>Departure: ${departureDate}</p>
                <div class="row">
            `;
            
            flightsToShow.forEach(flight => {
                const airline = flight.segments[0].marketingCarrier.displayName;
                const departureTime = new Date(flight.segments[0].departDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const arrivalTime = new Date(flight.segments[0].arriveDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const duration = flight.segments[0].duration;
                const price = flight.purchaseLinks[0].totalPrice;
                
                flightsHtml += `
                    <div class="col-md-6 mb-3">
                        <div class="card travel-card">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <h5 class="mb-0">${airline}</h5>
                                    <span class="badge bg-primary">$${price}</span>
                                </div>
                                <div class="d-flex justify-content-between">
                                    <div>
                                        <p class="mb-0 text-muted small">Departure</p>
                                        <p class="mb-0 fw-bold">${departureTime}</p>
                                    </div>
                                    <div class="text-center">
                                        <p class="mb-0 text-muted small">Duration</p>
                                        <p class="mb-0">${duration} min</p>
                                    </div>
                                    <div>
                                        <p class="mb-0 text-muted small">Arrival</p>
                                        <p class="mb-0 fw-bold">${arrivalTime}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="card-footer bg-white">
                                <button class="btn btn-sm btn-outline-primary w-100">Book Now</button>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            flightsHtml += `</div>`;
            travelResult.innerHTML = flightsHtml;
        } else {
            travelResult.innerHTML = `
                <div class="alert alert-warning">
                    <i class="fas fa-info-circle me-2"></i>No flight data available.
                </div>
            `;
        }
    } catch (error) {
        showError(error.message || 'Failed to fetch flight data', 'travelResult');
    } finally {
        toggleLoading(false);
    }
});

/**
 * Search for hotels in the current weather location or provided location
 */
hotelsBtn.addEventListener('click', async () => {
    // Check if weather data is available to use location coordinates
    if (!weatherData) {
        showError('Please fetch weather data first to get location coordinates.', 'travelResult');
        return;
    }

    toggleLoading(true);
    travelResult.innerHTML = '';

    try {
        // Use coordinates from the weather data
        const params = {
            latitude: weatherData.location.lat,
            longitude: weatherData.location.lon,
            pageNumber: '1',
            currencyCode: 'USD',
            checkIn: '2025-03-29', // Example check-in date
            checkOut: '2025-04-02', // Example check-out date
        };

        const queryString = new URLSearchParams(params).toString();
        const url = `https://tripadvisor16.p.rapidapi.com/api/v1/hotels/searchHotelsByLocation?${queryString}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '275dbf7aa4msh4044059aa6b2e43p1b4662jsna7154321ee38',
                'x-rapidapi-host': 'tripadvisor16.p.rapidapi.com',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch hotels');
        }

        // Check if hotels data exists
        if (data && data.data && data.data.length > 0) {
            const hotels = data.data;

            // Display up to 5 hotels
            const hotelsToShow = hotels.slice(0, 5);

            let hotelsHtml = `
                <h4 class="mb-3">Hotels in ${weatherData.location.name}</h4>
                <div class="row">
            `;

            hotelsToShow.forEach((hotel) => {
                hotelsHtml += `
                    <div class="col-md-6 mb-3">
                        <div class="card travel-card">
                            <div class="card-body">
                                <h5 class="card-title">${hotel.name || 'N/A'}</h5>
                                <p class="card-text">Price: ${hotel.price || 'N/A'}</p>
                                <p class="card-text">Rating: ${hotel.rating || 'N/A'}</p>
                                <p class="card-text">Address: ${hotel.address || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                `;
            });

            hotelsHtml += `</div>`;
            travelResult.innerHTML = hotelsHtml;
        } else {
            travelResult.innerHTML = `
                <div class="alert alert-warning">
                    <i class="fas fa-info-circle me-2"></i>No hotels found in ${weatherData.location.name}.
                </div>
            `;
        }
    } catch (error) {
        showError(error.message || 'Failed to fetch hotel data', 'travelResult');
    } finally {
        toggleLoading(false);
    }
});
