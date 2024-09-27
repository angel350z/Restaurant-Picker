document.getElementById('getLocationBtn').addEventListener('click', () => {
    if (navigator.geolocation) {
        // Request precise location with high accuracy
        navigator.geolocation.getCurrentPosition(showPosition, showError, { enableHighAccuracy: true });
    } else {
        alert('Geolocation is not supported by this browser. Attempting IP-based location...');
        // Fallback to IP-based geolocation
        fetchIpLocation();
    }
});

function showPosition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const radius = document.getElementById('radius').value;

    // Fetch restaurants based on precise location
    fetch(`../fetch_restaurants.php?lat=${lat}&lon=${lon}&radius=${radius}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                displayRestaurants(data);
            }
        })
        .catch(error => {
            console.error('Error fetching restaurants:', error);
        });
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert('User denied the request for Geolocation.');
            break;
        case error.POSITION_UNAVAILABLE:
            alert('Location information is unavailable. Attempting IP-based location...');
            fetchIpLocation(); // Fallback to IP-based geolocation if location is unavailable
            break;
        case error.TIMEOUT:
            alert('The request to get user location timed out. Attempting IP-based location...');
            fetchIpLocation(); // Fallback to IP-based geolocation if it times out
            break;
        case error.UNKNOWN_ERROR:
            alert('An unknown error occurred.');
            break;
    }
}

// Fallback to IP-based geolocation
function fetchIpLocation() {
    fetch('https://ipapi.co/json/') // External IP-based geolocation service
        .then(response => response.json())
        .then(data => {
            const lat = data.latitude;
            const lon = data.longitude;
            const radius = document.getElementById('radius').value;
            
            // Use IP-based latitude and longitude
            fetch(`./fetch_restaurants.php?lat=${lat}&lon=${lon}&radius=${radius}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error("HTTP error " + response.status);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.error) {
                        alert(data.error);
                    } else {
                        displayRestaurants(data);
                    }
                })
                .catch(error => {
                    console.error('Error fetching restaurants:', error);
                });
        })
        .catch(err => {
            console.error('Error fetching IP-based location:', err);
            alert('Unable to determine your location via IP.');
        });
}


function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert('User denied the request for Geolocation.');
            break;
        case error.POSITION_UNAVAILABLE:
            alert('Location information is unavailable.');
            break;
        case error.TIMEOUT:
            alert('The request to get user location timed out.');
            break;
        case error.UNKNOWN_ERROR:
            alert('An unknown error occurred.');
            break;
    }
}


function displayRestaurants(restaurants) {
    let resultDiv = document.getElementById('restaurantResult');
    resultDiv.innerHTML = ''; // Clear previous results

    if (restaurants.length > 0) {
        let table = document.createElement('table');
        table.classList.add('restaurant-table');

        let thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>Restaurant Name</th>
            </tr>
        `;
        table.appendChild(thead);

        let tbody = document.createElement('tbody');
        restaurants.forEach(restaurant => {
            let row = document.createElement('tr');

            // Create a clickable link for the restaurant
            let link = document.createElement('a');
            link.href = restaurant.url; // Use the URL from the API response
            link.target = '_blank'; // Open in a new tab
            link.innerText = restaurant.name; // Display restaurant name

            // Append link to the cell
            let cell = document.createElement('td');
            cell.appendChild(link);
            row.appendChild(cell);

            tbody.appendChild(row);
        });
        table.appendChild(tbody);

        resultDiv.appendChild(table);

        // Show random button after displaying restaurants
        document.getElementById('randomRestaurantBtn').style.display = 'inline-block';
    } else {
        resultDiv.innerHTML = '<p>No restaurants found in this area.</p>';
        document.getElementById('randomRestaurantBtn').style.display = 'none';
    }
}

document.getElementById('randomRestaurantBtn').addEventListener('click', () => {
    const restaurants = document.querySelectorAll('#restaurantResult table tbody tr');
    if (restaurants.length > 0) {
        // Show the dice container
        const diceContainer = document.getElementById('diceContainer');
        diceContainer.style.display = 'flex'; // Show the dice
        diceContainer.innerHTML = '🎲'; // Display a dice emoji
        diceContainer.classList.add('rolling'); // Add rolling class for animation

        setTimeout(() => {
            // Remove the dice animation
            diceContainer.classList.remove('rolling');
            const randomIndex = Math.floor(Math.random() * restaurants.length);
            const selectedRestaurant = restaurants[randomIndex].innerText; // Get the selected restaurant name
            const selectedRestaurantUrl = restaurants[randomIndex].querySelector('a').href; // Get the selected restaurant URL

            // Hide the table and show selected restaurant
            document.getElementById('restaurantResult').innerHTML = '';
            document.getElementById('randomRestaurantBtn').style.display = 'none';
            document.getElementById('selectedRestaurant').innerHTML = `You should try:&nbsp; <a href="${selectedRestaurantUrl}" target="_blank">${selectedRestaurant}</a>`;
            document.getElementById('selectedRestaurant').style.display = 'flex';
        }, 1500); // Duration of dice roll animation
    } else {
        alert('No restaurants available.');
    }
});

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert('User denied the request for Geolocation.');
            break;
        case error.POSITION_UNAVAILABLE:
            alert('Location information is unavailable.');
            break;
        case error.TIMEOUT:
            alert('The request to get user location timed out.');
            break;
        case error.UNKNOWN_ERROR:
            alert('An unknown error occurred.');
            break;
    }
}
