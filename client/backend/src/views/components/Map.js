import React from 'react'
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
} from 'reactstrap';

import 'toasted-notes/src/styles.css';
import mapboxgl from 'mapbox-gl'

import { getStations } from '../../../actions/stationActions';
import { connect } from 'react-redux';

//mapbox
mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

function addMarkers(stores, map) {
  /* For each feature in the GeoJSON object above: */
  stores.features.forEach(function (marker) {
    /* Create a div element for the marker. */
    var el = document.createElement('div');
    /* Assign a unique `id` to the marker. */
    el.id = "marker-" + marker.properties.id;
    /* Assign the `marker` class to each marker for styling. */
    el.className = 'marker';

    /**
     * Create a marker using the div element
     * defined above and add it to the map.
     **/
    new mapboxgl.Marker(el, { offset: [0, -23] })
      .setLngLat(marker.geometry.coordinates)
      .addTo(map);
    el.addEventListener('click', function (e) {
      /* Fly to the point */
      flyToStore(marker, map);
      /* Close all other popups and display popup for clicked store */
      createPopUp(marker, map);
      /* Highlight listing in sidebar */
      var activeItem = document.getElementsByClassName('active');
      e.stopPropagation();
      if (activeItem[0]) {
      }
      var listing = document.getElementById('listing-' + marker.properties.id);
      listing.classList.add('active');
    });
  });

}
function buildLocationList(data, map) {
  data.features.forEach(function (store, i) {
    /**
     * Create a shortcut for `store.properties`,
     * which will be used several times below.
     **/
    var prop = store.properties;
function Link()
{
  
}
    /* Add a new listing section to the sidebar. */
    var listings = document.getElementById('listings');
    var listing = listings.appendChild(document.createElement('div'));
    /* Assign a unique `id` to the listing. */
    listing.id = "listing-" + prop.id;
    /* Assign the `item` class to each listing for styling. */
    listing.className = 'item';

    /* Add the link to the individual listing created above. */
    var link = listing.appendChild(document.createElement('a'));
    link.href = '#';
    link.className = 'title';
    link.id = "link-" + prop.id;
    link.innerHTML = prop.address;
    link.addEventListener('click', function (e) {
      var clickedListing = store;
      flyToStore(clickedListing, map);
      createPopUp(clickedListing, map);

      var activeItem = document.getElementsByClassName('active');
      if (activeItem[0]) {
        activeItem[0].classList.remove('active');
      }
      this.parentElement.classList.add('active');
    });
    /* Add details to the individual listing. */
    var details = listing.appendChild(document.createElement('div'));
    details.innerHTML = prop.city;
    if (prop.phone) {
      details.innerHTML += ' · ' + prop.phoneFormatted;
    }

  });

}
function flyToStore(currentFeature, map) {
  map.flyTo({
    center: currentFeature.geometry.coordinates,
    zoom: 15
  });
}

function createPopUp(currentFeature, map) {
  var popUps = document.getElementsByClassName('mapboxgl-popup');
  /** Check if there is already a popup on the map and if so, remove it */
  if (popUps[0]) popUps[0].remove();

  var popup = new mapboxgl.Popup({ closeOnClick: false })
    .setLngLat(currentFeature.geometry.coordinates)
    .setHTML('<h3>' + currentFeature.properties.address + '</h3>' +
      '<h4>' + currentFeature.properties.address + '</h4>')
    .addTo(map);
}

function configureMap() {
  const myinstance = this;
  const map = new mapboxgl.Map({
    container: this.mapRef.current,
    style: 'mapbox://styles/mapbox/streets-v9',
    center: [lng, lat],
    zoom
  });

  stores.features.forEach(function (store, i) {
    store.properties.id = i;
  });
  map.on('load', () => {
    /* Add the data to your map as a layer */
    map.addSource('places', {
      type: 'geojson',
      data: stores
    });
    this.buildLocationList(stores, map);
    this.addMarkers(stores, map);
  });
  map.on('click', function (e) {
    /* Determine if a feature in the "locations" layer exists at that point. */
    var features = map.queryRenderedFeatures(e.point, {
      layers: ['locations']
    });

    /* If yes, then: */
    if (features.length) {
      var clickedPoint = features[0];

      /* Fly to the point */
      myinstance.flyToStore(clickedPoint, map);

      /* Close all other popups and display popup for clicked store */
      myinstance.createPopUp(clickedPoint, map);

      /* Highlight listing in sidebar (and remove highlight for all other listings) */
      var activeItem = document.getElementsByClassName('active');
      if (activeItem[0]) {
        activeItem[0].classList.remove('active');
      }
      var listing = document.getElementById('listing-' + clickedPoint.properties.id);
      listing.classList.add('active');
    }
  });
  map.on('move', () => {
    const { lng, lat } = map.getCenter();
    this.setState({ lang: lng, alt: lat });
    this.setState({
      lng: lng.toFixed(4),
      lat: lat.toFixed(4),
      zoom: map.getZoom().toFixed(2)
    });
  });

  //loadingData =  this.state.station ? true : false;

  function Map({ lng, lat, zoom, stations, getStations }) {

    const [lng, setLng] = useState(5);
    const [lat, setLat] = useState(5);
    const [zoom, setZoom] = useState(5);
    // const [station, setStation] = useState({
    //   title: "",
    //   alt: "",
    //   lang: "",
    //   numberOfBikesCapacity: 0,
    //   numberOfBikesAvailable: 0,
    //   imageData: null,
    //   selectedFile: null,
    //   etat: "Disponible",

    // });


    useEffect(() => {
      getStations();

    }, []);
    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Card>
              <CardHeader>

              </CardHeader>
              <CardBody >
                <div className='wrapper1'>
                  <div className="inline-block absolute top left mt12 ml12 bg-darken75 color-white z1 py6 px12 round-full txt-s txt-bold">
                    <div>{`Longitude: ${lng} Latitude: ${lat} Zoom: ${zoom}`}</div>
                  </div>
                  <div className="row">
                    <div className=' sidebar1'>
                      <div className='heading'>
                        <h2>Our locations</h2>
                      </div>
                      <div id='listings' className='listings'></div>
                    </div>
                    <div ref={this.mapRef} className="absolute top right  bottom map col-9" />
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }

  export default connect(mapStateToProps, { getStations })(Map);
