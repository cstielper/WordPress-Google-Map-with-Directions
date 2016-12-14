// VARIABLES
// IDs of HTML elements to hold the map and our responses
var myMap = 'map-canvas';
var directionsForm = 'get-directions';
var mapResponses = 'response-panel';

// Google Maps API Key
var apiKey = 'ADD_YOUR_GOOGLE_MAPS_API_KEY';

// Path to JSON Data with Latitude and Longitude
var apiPath = '/THE_PATH_YOU_WANT_TO_USE/wp-json/acf/v2/options/';

var directionsDisplay;
var directionsService;

// Check to see if there is an HTML element on our page to load the map into.
// If there is, call the Google Maps API with our API key and a callback function
document.addEventListener('DOMContentLoaded', function() {
	if (document.getElementById(myMap)) {
		var lang;
		if (document.querySelector('html').lang) {
			lang = document.querySelector('html').lang;
		} else {
			lang = 'en';
		}

		var map_js_file = document.createElement('script');
		map_js_file.type = 'text/javascript';
		map_js_file.src = 'https://maps.googleapis.com/maps/api/js?key=' + apiKey + '&callback=callback&language=' + lang;
		document.getElementsByTagName('body')[0].appendChild(map_js_file);
	}
});

// Buid the Map
function initMap(myMap, lat, lng) {
	var bounds = new google.maps.LatLngBounds();
	var map = new google.maps.Map(document.getElementById(myMap), {
		maxZoom: 18,
		mapTypeControl: false,
		scrollwheel: false,
		panControl: false,
		rotateControl: false,
		streetViewControl: false,
		zoomControlOptions: {
			position: google.maps.ControlPosition.RIGHT_BOTTOM
		},
	});

	var marker = new google.maps.Marker({
		position: {lat: lat, lng: lng},
		map: map,
	});

	bounds.extend(marker.getPosition());
	map.fitBounds(bounds);

	directionsDisplay = new google.maps.DirectionsRenderer();
	directionsDisplay.setMap(map);
}

function callback() {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(){
		if (xhr.readyState === 4 && xhr.status === 200) {
			var obj = JSON.parse(xhr.responseText);
			document.getElementById('map-canvas').innerHTML = '';
			var lat = Number(obj.acf.latitude);
			var lng = Number(obj.acf.longitude);
			initMap(myMap, lat, lng);
		} else {
			document.getElementById('map-canvas').innerHTML = 'Error Loading Data';
		}
	};

	xhr.open('GET', apiPath, true);
	xhr.send();
	document.getElementById('map-canvas').innerHTML = 'Loading map...';
	
	directionsService = new google.maps.DirectionsService();
}

// Directions
function calcRoute() {
	var start = document.getElementById('start').value;
	var end = document.getElementById('end').value;
	var request = {
		origin: start,
		destination: end,
		travelMode: 'DRIVING'
	};

	if(start === '') {
		document.getElementById(mapResponses).innerHTML = "Please enter a starting address.";
		document.getElementById(mapResponses).classList.add('error');
		document.getElementById(mapResponses).classList.add('active');
	} else {
		directionsDisplay.setPanel(document.getElementById(mapResponses));
		directionsService.route(request, function(result, status) {
			document.getElementById(mapResponses).classList.remove('error');
			document.getElementById(mapResponses).classList.remove('active');
			if (status === 'OK') {
				document.getElementById(mapResponses).classList.add('active');
				document.getElementById(mapResponses).innerHTML = '';
				directionsDisplay.setDirections(result);
			} else {
				document.getElementById(mapResponses).innerHTML = "We're sorry, but an error occurred: <strong><em>" + status + "</em></strong>.<br>Please check your starting address and try again.";
				document.getElementById(mapResponses).classList.add('error');
				document.getElementById(mapResponses).classList.add('active');
			}
		});
	}
}

document.getElementById(directionsForm).addEventListener('submit', function(event) {
	calcRoute();
	event.preventDefault();
});