// This isn't necessary but it keeps the editor from thinking L and carto are typos
/* global L, carto */

// const map = L.map('map').setView([40.7128, 74.0060], 8);


var map = L.map('map', {
    center: L.latLng(40.758700379161006, -73.95652770996094),
    zoom: 13
});

// Add base layer
L.tileLayer('https://api.mapbox.com/styles/v1/ryez/cjdp4xca903ua2rnwvcln7ee0/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicnlleiIsImEiOiJjajl6eW5laDQyMWJyMnFucmJteHhlZnFiIn0.1mxSh4ahOUyf073K_eDdvQ', {
  // attribution: 'Stamen',
  maxZoom: 20
}).addTo(map);

// Initialize Carto
const client = new carto.Client({
  apiKey: 'apikey',
  username: 'zupar972'
});

// Initialze source data
const source = new carto.source.SQL('SELECT * FROM zupar972.nypd_motor_vehicle_collisions');

// Create style for the data
const style = new carto.style.CartoCSS(`
  #layer {
    marker-fill: red;
    marker-opacity: .05;
    marker-width: 5;
    marker-allow-overlap: true;
  }
`);

// Add style to the data
const layer = new carto.layer.Layer(source, style);

// Add the data to the map as a layer
client.addLayer(layer);
client.getLeafletLayer().addTo(map);

/*
 * Listen for changes on the layer picker
 */

// Step 1: Find the dropdown by class. If you are using a different class, change this.
var element = document.querySelector('.layer-picker');

// Step 2: Add an event listener to the dropdown. We will run some code whenever the dropdown changes.
element.addEventListener('change', function (e) {
  // The value of the dropdown is in e.target.value when it changes
  var lifeStage = e.target.value;
  
  // Step 3: Decide on the SQL query to use and set it on the datasource
  if (lifeStage === 'all') {
    // If the value is "all" then we show all of the features, unfiltered
    source.setQuery("SELECT * FROM zupar972.nypd_motor_vehicle_collisions");
  }
  else {
    // Else the value must be set to a life stage. Use it in an SQL query that will filter to that life stage.
    source.setQuery("SELECT * FROM zupar972.nypd_motor_vehicle_collisions WHERE number_of_persons_injured" + ">" + "'" + lifeStage*1 + "'");
  }
  
  // Sometimes it helps to log messages, here we log the lifestage. You can see this if you open developer tools and look at the console.
  console.log('Dropdown changed to "' + lifeStage + '"');
});