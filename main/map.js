let selectedLocation = null;

function initMap() {
const center = { lat: 51.1694, lng: 71.4491 };
const map = new google.maps.Map(document.getElementById("map"), {
    center: center,
    zoom: 12,
});

const marker = new google.maps.Marker({
    position: center,
    map: map,
    title: "Delivery Location",
});

map.addListener("click", (event) => {
    const clickedLocation = event.latLng;

    if (selectedLocation) {
    selectedLocation.setMap(null);
    }

    selectedLocation = new google.maps.Marker({
    position: clickedLocation,
    map: map,
    title: "Selected Location",
    });

    const geocoder = new google.maps.Geocoder();
    geocoder
    .geocode({ location: clickedLocation })
    .then((response) => {
        if (response.results[0]) {
        const address = response.results[0].formatted_address;
        document.getElementById("selected-location").innerHTML = `
            Selected Location: <br/>
            Address: ${address}
        `;
        } else {
        document.getElementById("selected-location").innerHTML =
            "No address found!";
        }
    })
    .catch((e) => {
        console.log("Geocoder failed due to: " + e);
    });
});
}