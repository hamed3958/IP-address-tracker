// var mymap = L.map('mapid').setView([51.505, -0.09], 13);

// L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
//   attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
//   maxZoom: 18,
//   id: 'mapbox/streets-v11',
//   tileSize: 512,
//   zoomOffset: -1,
//   accessToken: 'your.mapbox.access.token'
// }).addTo(mymap);

// var marker = L.marker([51.5, -0.09]).addTo(mymap);

// let id = document.getElementById("ip");
// let locaction = document.getElementById("location");
// let time = document.getElementById("time");
// let isp = document.getElementById("isp");

// let getId = document.getElementById("getId");
// let btn = document.getElementById("btn");




const COMMON_ENDPOINT = 'https://geo.ipify.org/api/v2/country,city?apiKey=at_SmSbOtgWwErIMnQPlRBIpxTh4OWX3&ipAddress=8.8.8.8';

document.addEventListener('DOMContentLoaded', () => {
	setUpPage();
	document.querySelector('form').onsubmit = handleSubmit;
});

function handleSubmit(e) {
	e.preventDefault();

	const mapContainer = document.getElementById('map');
	mapContainer.innerHTML = '<h1 class="loading-text">Loading...</h1>';

	const input = document.getElementById("getIp");

	const ipRegExp = RegExp(`(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}`);
	const domainRegExp = RegExp(`^((?!-)[A-Za-z0-9-]{1,63}(?<!-)\\.)+[A-Za-z]{2,6}$`);

	/* check whether input is an ip-address or a domain-name or an invalid input */
	if (ipRegExp.test(input.value)) {
		setUpPage('ipAddress', input.value);
	}
	else if (domainRegExp.test(input.value)) {
		setUpPage('domain', input.value);
	}
	else {
		alert('Please enter a domain name or an ip address.');
	}
}


async function fetchData(queryType, queryValue) {

	/* If no queries passed, then it's the initial setup after page loads */
	const requestString = !queryType
		? COMMON_ENDPOINT : `${COMMON_ENDPOINT}&${queryType}=${queryValue}`;

	return await
		fetch(requestString)
			.then(checkResponse)
			.then(data => data)

			.catch(err => {
				console.error(err);
				alert('Something went wrong. Please check the console for more info.');
			});
}

async function checkResponse(res) {
	if (res.ok)
		return res.json();

	/* throw the error */
	const err = await res.json();
	throw new Error(err.messages);
};

async function setUpPage(queryType, queryValue) {
	const data = await fetchData(queryType, queryValue);

	displayUserInfo(data);
	setMap(data.location.lat, data.location.lng);
}

function displayUserInfo(data) {
	// const [ IP, Location, TimeZone, ISP ] = document.getElementsByClassName('data-value');

	let ip = document.getElementById("ip");
	let Location = document.getElementById("location");
	let time = document.getElementById("time");
	let isp = document.getElementById("isp");


	ip.innerText = data.ip;
	Location.innerText = `${data.location.city}, ${data.location.country}`;
	time.innerText = "UTC " + data.location.timezone;
	isp.innerText = data.isp;
}

let map, marker;

function setMap(lat, lng) {
	/* reset map when it's to be refreshed for the queried ipAddress/domain */
//  if (map) {
// 	 	map.remove();
// 	 	map = undefined;
// 	 	document.getElementById('map').innerHTML = '';
// 	}

	map = L.map('map').setView([lat, lng], 1);

	L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=noyxLecga2786hVyQyaF', {
    attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
}).addTo(map);
	// const tileAttribution =
	// 	`<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>`;

	// L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=noyxLecga2786hVyQyaF', {
	// 	attribution: tileAttribution
	// }).addTo(map);


	let markerIcon = L.icon({
		iconUrl: './images/icon-location.svg',
	})

	marker = L.marker([lat, lng], { icon: markerIcon }).addTo(map);
}





