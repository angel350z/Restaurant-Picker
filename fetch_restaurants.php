<?php
// Enable error reporting for debugging purposes
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Check if latitude, longitude, and radius are set
if (isset($_GET['lat']) && isset($_GET['lon']) && isset($_GET['radius'])) {
    $latitude = $_GET['lat'];
    $longitude = $_GET['lon'];
    $radius = $_GET['radius'] * 1609; // Convert miles to meters

    // Your Google Places or Yelp API key
    $apiKey = 'AIzaSyDpnC4b2DzKEe06fKa4DIYsRAS_E7VCdXQ';

    // API URL for Google Places API
    $url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=$latitude,$longitude&radius=$radius&type=restaurant&key=$apiKey";

    // Fetch API data
    $response = file_get_contents($url);
    
    if ($response === FALSE) {
        // If the API request fails, send an error message in JSON format
        echo json_encode(['error' => 'Failed to fetch data from API.']);
        exit;
    }

    // Decode the API response into an associative array
    $restaurants = json_decode($response, true);

    // Check if the 'results' key exists in the response
    if (isset($restaurants['results'])) {
        // Extract the restaurant names
        $restaurantNames = array_map(function($restaurant) {
            return [
                'name' => $restaurant['name']
            ];
        }, $restaurants['results']);

        // Send the restaurant names back as JSON
        header('Content-Type: application/json');
        echo json_encode($restaurantNames);
    } else {
        // Send error message if no results are found
        echo json_encode(['error' => 'No restaurants found or an API error occurred.']);
    }
} else {
    // Send error message if latitude, longitude, or radius are missing
    echo json_encode(['error' => 'Invalid request. Please provide lat, lon, and radius.']);
}
?>
