/**
 * Weather & Travel Planner Application
 * 
 * This script handles fetching weather data and travel options through various APIs.
 * It includes functionality for getting weather data, searching flights, hotels, and rentals.
 * 
 * API Usage:
 * - WeatherAPI.com for current weather conditions
 * - TripAdvisor API for flights, hotels, and rentals
 */

// API key for RapidAPI services - replace with your actual key in production
const API_KEY = '275dbf7aa4msh4044059aa6b2e43p1b4662jsna7154321ee38'; 

// DOM elements
const weatherForm = document.getElementById('weatherForm');
const weatherBtn = document.getElementById('weather');
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

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    // Display any saved recent searches
    displayRecentSearches();
    
    // Set up event handlers
    if (weatherForm) {
        weatherForm.addEventListener('submit', handleFormSubmit);
    }
    
    if (weatherBtn) {
        weatherBtn.addEventListener('click', handleWeatherButtonClick);
    }
    
    // Add event listener for rentals button
    if (rentalsBtn) {
        rentalsBtn.addEventListener('click', handleRentalsSearch);
    }
});

/**
 * Handle form submission event
 * @param {Event} e - Form submit event
 */
function handleFormSubmit(e) {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
        getWeather(city);
    }
}

/**
 * Handle weather button click event
 */
function handleWeatherButtonClick() {
    const city = cityInput.value.trim();
    if (city) {
        getWeather(city);
    } else {
        showError('Please enter a city name first', 'weatherResult');
    }
}

/**
 * Toggle loading indicator visibility
 * @param {boolean} state - True to show loading, false to hide
 */
const toggleLoading = (state) => {
    if (loadingIndicator) {
        loadingIndicator.style.display = state ? 'block' : 'none';
    }
};

/**
 * Display error message in result area
 * @param {string} message - Error message to display
 * @param {string} target - DOM element ID to display error in
 */
const showError = (message, target) => {
    const element = document.getElementById(target);
    if (element) {
        element.innerHTML = `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-circle me-2"></i>${message}
            </div>
        `;
    }
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
    if (!recentSearchesEl) return;
    
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
    
    if (conditionLower.includes('sunny') || conditionLower.includes('clear')) return 'fa-sun';
    if (conditionLower.includes('partly cloudy')) return 'fa-cloud-sun';
    if (conditionLower.includes('cloud')) return 'fa-cloud';
    if (conditionLower.includes('overcast')) return 'fa-cloud';
    if (conditionLower.includes('drizzle')) return 'fa-cloud-rain';
    if (conditionLower.includes('rain')) return 'fa-cloud-showers-heavy';
    if (conditionLower.includes('snow')) return 'fa-snowflake';
    if (conditionLower.includes('sleet')) return 'fa-snowflake';
    if (conditionLower.includes('thunder')) return 'fa-bolt';
    if (conditionLower.includes('fog') || conditionLower.includes('mist')) return 'fa-smog';
    
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
 * Format a date object to a readable string
 * @param {Date} date - Date object
 * @returns {string} - Formatted date string
 */
const formatDate = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

/**
 * Fetch and display weather data for a given city
 * @param {string} city - Name of the city to get weather for
 */
const getWeather = async (city) => {
    toggleLoading(true);
    if (weatherResult) weatherResult.innerHTML = '';
    if (travelResult) travelResult.innerHTML = ''; // Clear any previous travel results
    
    try {
        const response = await fetch(`https://weatherapi-com.p.rapidapi.com/current.json?q=${encodeURIComponent(city)}`, {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '275dbf7aa4msh4044059aa6b2e43p1b4662jsna7154321ee38',
                'x-rapidapi-host': 'weatherapi-com.p.rapidapi.com'
            }
        });
        
        // Check for HTTP errors
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        // Parse the JSON response
        const data = await response.json();
        
        // Check for error in response
        if (data.error) {
            throw new Error(data.error.message || 'Weather data not found');
        }

        // Store weather data for later use with other features
        weatherData = data;
        
        // Save to recent searches
        saveToRecentSearches(data.location.name);
        
        // Get icon class based on condition
        const iconClass = getWeatherIcon(data.current.condition.text);
        
        // Format date from location.localtime
        const localTime = new Date(data.location.localtime);
        const formattedTime = localTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const formattedDate = localTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
        
        // Create weather display with improved UI
        if (weatherResult) {
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
        }
    } catch (error) {
        showError(error.message || 'Failed to fetch weather data. Please check the city name and try again.', 'weatherResult');
        console.error('Weather API Error:', error);
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
    if (!origin) {
        showError('Origin airport code is required', 'travelResult');
        return;
    }
    
    const destination = prompt(`Enter destination airport code (e.g., LAX):`, suggestedDestination);
    if (!destination) {
        showError('Destination airport code is required', 'travelResult');
        return;
    }
    
    toggleLoading(true);
    if (travelResult) travelResult.innerHTML = '';
    
    try {
        // Calculate dates for departure (tomorrow) and return (+7 days)
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const returnDate = new Date(tomorrow);
        returnDate.setDate(returnDate.getDate() + 7);
        
        const departureDate = formatDate(tomorrow);
        const returnDateStr = formatDate(returnDate);
        
        // Build API request parameters
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
        
        // Check for HTTP errors
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Check if flights data exists and display results
        if (data && data.data && data.data.flights && data.data.flights.length > 0) {
            const flights = data.data.flights;
            
            // Display up to 5 flights
            const flightsToShow = flights.slice(0, 5);
            
            let flightsHtml = `
                <h4 class="mb-3">Flights from ${origin} to ${destination}</h4>
                <p>Departure: ${departureDate}</p>
                <div class="row">
            `;
            
            flightsToShow.forEach(flight => {
                // Extract flight details safely with optional chaining
                const airline = flight.segments[0]?.marketingCarrier?.displayName || 'Unknown Airline';
                const departureTime = flight.segments[0]?.departDateTime ? 
                    new Date(flight.segments[0].departDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A';
                const arrivalTime = flight.segments[0]?.arriveDateTime ? 
                    new Date(flight.segments[0].arriveDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A';
                const duration = flight.segments[0]?.duration || 'N/A';
                const price = flight.purchaseLinks && flight.purchaseLinks[0]?.totalPrice || 'N/A';
                
                flightsHtml += `
                    <div class="col-md-6 mb-3">
                        <div class="card travel-card h-100">
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
            
            if (travelResult) {
                travelResult.innerHTML = flightsHtml;
            }
        } else {
            if (travelResult) {
                travelResult.innerHTML = `
                    <div class="alert alert-warning">
                        <i class="fas fa-info-circle me-2"></i>No flights found from ${origin} to ${destination}.
                    </div>
                `;
            }
        }
    } catch (error) {
        showError(error.message || 'Failed to fetch flight data. Please check your inputs and try again.', 'travelResult');
        console.error('Flights API Error:', error);
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
    if (travelResult) travelResult.innerHTML = '';

    try {
        // Calculate check-in and check-out dates (3 days from now, and 7 days from now)
        const checkInDate = new Date();
        checkInDate.setDate(checkInDate.getDate() + 3);
        const checkOutDate = new Date(checkInDate);
        checkOutDate.setDate(checkOutDate.getDate() + 4);
        
        // Use coordinates from the weather data
        const params = {
            latitude: weatherData.location.lat,
            longitude: weatherData.location.lon,
            pageNumber: '1',
            currencyCode: 'USD',
            checkIn: formatDate(checkInDate),
            checkOut: formatDate(checkOutDate),
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

        // Check if the HTTP response is successful
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Check if hotels data exists
        if (data && data.data && data.data.length > 0) {
            const hotels = data.data;

            // Display up to 6 hotels
            const hotelsToShow = hotels.slice(0, 6);

            let hotelsHtml = `
                <h4 class="mb-3">Hotels in ${weatherData.location.name}</h4>
                <p>Check-in: ${formatDate(checkInDate)} | Check-out: ${formatDate(checkOutDate)}</p>
                <div class="row">
            `;

            hotelsToShow.forEach((hotel) => {
                // Extract hotel data safely with optional chaining
                const name = hotel.title || 'Unknown Hotel';
                const price = hotel.priceForDisplay || 'Price not available';
                const rating = hotel.bubbleRating?.rating || 'No rating';
                const reviewCount = hotel.bubbleRating?.count || '0';
                const imageUrl = hotel.cardPhotos?.[0]?.sizes?.urlTemplate?.replace('{width}', '300') || '';
                
                hotelsHtml += `
                    <div class="col-md-4 mb-3">
                        <div class="card travel-card h-100">
                            ${imageUrl ? `<img src="${imageUrl}" class="card-img-top" alt="${name}">` : ''}
                            <div class="card-body">
                                <h5 class="card-title">${name}</h5>
                                <p class="card-text mb-2">
                                    <span class="badge bg-success">${rating}/5</span>
                                    <small class="text-muted">(${reviewCount} reviews)</small>
                                </p>
                                <p class="card-text text-primary fw-bold">${price}</p>
                            </div>
                            <div class="card-footer bg-white">
                                <button class="btn btn-sm btn-outline-primary w-100">Book Now</button>
                            </div>
                        </div>
                    </div>
                `;
            });

            hotelsHtml += `</div>`;
            
            if (travelResult) {
                travelResult.innerHTML = hotelsHtml;
            }
        } else {
            if (travelResult) {
                travelResult.innerHTML = `
                    <div class="alert alert-warning">
                        <i class="fas fa-info-circle me-2"></i>No hotels found in ${weatherData.location.name}.
                    </div>
                `;
            }
        }
    } catch (error) {
        showError(error.message || 'Failed to fetch hotel data. Please try again later.', 'travelResult');
        console.error('Hotels API Error:', error);
    } finally {
        toggleLoading(false);
    }
});

/**
 * Handle rental search for a given location
 * Uses the weather data coordinates to find rental properties nearby
 */
async function handleRentalsSearch() {  // Added 'async' keyword here
    // Check if weather data is available to use location coordinates
    if (!weatherData) {
        showError('Please fetch weather data first to get location coordinates.', 'travelResult');
        return;
    }

    toggleLoading(true);
    if (travelResult) travelResult.innerHTML = '';

    try {
        // Calculate check-in and check-out dates (next week, 5-day stay)
        const checkInDate = new Date();
        checkInDate.setDate(checkInDate.getDate() + 7); // Check in next week
        const checkOutDate = new Date(checkInDate);
        checkOutDate.setDate(checkOutDate.getDate() + 5); // 5-day stay
        
        // Use coordinates from the weather data
        const params = {
            geoId: weatherData.location.region?.id || '0', // TripAdvisor requires geoId
            latitude: weatherData.location.lat,
            longitude: weatherData.location.lon,
            checkIn: formatDate(checkInDate),
            checkOut: formatDate(checkOutDate),
            adults: '2',
            rooms: '1',
            currencyCode: 'USD',
            apiKey: API_KEY
        };

        const queryString = new URLSearchParams(params).toString();
        const url = `https://tripadvisor16.p.rapidapi.com/api/v1/rentals/searchLocation?${queryString}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'x-rapidapi-key': API_KEY,
                'x-rapidapi-host': 'tripadvisor16.p.rapidapi.com'
            }
        });

        // Check if the HTTP response is successful
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Check if rentals data exists and has results
        if (data && data.data && data.data.data && data.data.data.length > 0) {
            const rentals = data.data.data;

            // Display up to 6 rentals
            const rentalsToShow = rentals.slice(0, 6);

            let rentalsHtml = `
                <h4 class="mb-3">Vacation Rentals in ${weatherData.location.name}</h4>
                <p>Check-in: ${formatDate(checkInDate)} | Check-out: ${formatDate(checkOutDate)}</p>
                <div class="row">
            `;

            rentalsToShow.forEach((rental) => {
                // Extract rental data safely with optional chaining
                const name = rental.title || 'Vacation Rental';
                const price = rental.priceForDisplay || rental.priceInfo?.displayPrice || 'Price not available';
                const imageUrl = rental.photos?.[0]?.urlTemplate?.replace('{width}', '300') || '';
                const bedrooms = rental.roomType?.beds || 'N/A';
                const bathrooms = rental.roomType?.bathrooms || 'N/A';
                const rating = rental.bubbleRating?.rating || 'No rating';
                const reviewCount = rental.bubbleRating?.count || '0';
                
                rentalsHtml += `
                    <div class="col-md-4 mb-3">
                        <div class="card travel-card h-100">
                            ${imageUrl ? `<img src="${imageUrl}" class="card-img-top" alt="${name}">` : ''}
                            <div class="card-body">
                                <h5 class="card-title">${name}</h5>
                                <div class="d-flex justify-content-between mb-2">
                                    <span class="badge bg-secondary">${bedrooms} BR / ${bathrooms} BA</span>
                                    <span class="badge bg-success">${rating}/5</span>
                                </div>
                                <p class="text-muted small">${reviewCount} reviews</p>
                                <p class="text-primary fw-bold">${price}</p>
                            </div>
                            <div class="card-footer bg-white">
                                <button class="btn btn-sm btn-outline-primary w-100">Book Now</button>
                            </div>
                        </div>
                    </div>
                `;
            });

            rentalsHtml += `</div>`;
            
            if (travelResult) {
                travelResult.innerHTML = rentalsHtml;
            }
        } else {
            if (travelResult) {
                travelResult.innerHTML = `
                    <div class="alert alert-warning">
                        <i class="fas fa-info-circle me-2"></i>No vacation rentals found in ${weatherData.location.name}.
                    </div>
                `;
            }
        }
    } catch (error) {
        showError(error.message || 'Failed to fetch rental data. Please try again later.', 'travelResult');
        console.error('Rentals API Error:', error);
    } finally {
        toggleLoading(false);
    }
}

