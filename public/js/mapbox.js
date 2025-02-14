// console.log('Hello from the clien tside');

export const displayMap = (locations) => {
  function loadGoogleMapsScript(apiKey) {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
    script.async = true;
    document.head.appendChild(script);
  }

  function initMap() {
    const locations = JSON.parse(
      document.getElementById('map').dataset.locations,
    );
    const map = new google.maps.Map(document.getElementById('map'), {
      zoom: 5,
      gestureHandling: 'none',
      center: locations.length
        ? { lat: locations[0].coordinates[1], lng: locations[0].coordinates[0] }
        : { lat: 0, lng: 0 },
    });

    locations.forEach((loc) => {
      new google.maps.Marker({
        position: { lat: loc.coordinates[1], lng: loc.coordinates[0] },
        map,
        title: loc.description,
      });
    });
  }

  window.onload = () => {
    loadGoogleMapsScript('AIzaSyBXZIlPoT_0ObR-7vLdiT7owDLMvUbYad8');
  };
};
