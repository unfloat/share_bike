import React, { Component  } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
} from 'reactstrap';
import 'toasted-notes/src/styles.css';
import './Dashboard.css'
import mapboxgl from 'mapbox-gl'
mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';
function addMarkers(stores,map) {
  /* For each feature in the GeoJSON object above: */
  stores.features.forEach(function(marker) {
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
    el.addEventListener('click', function(e){
      /* Fly to the point */
      flyToStore(marker,map);
      /* Close all other popups and display popup for clicked store */
      createPopUp(marker,map);
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
function buildLocationList(data,map) {
  data.features.forEach(function(store, i){
    /**
     * Create a shortcut for `store.properties`,
     * which will be used several times below.
     **/
    var prop = store.properties;

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
    link.addEventListener('click', function(e){
      var clickedListing = store;
      flyToStore(clickedListing,map);
      createPopUp(clickedListing,map);

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
function flyToStore(currentFeature,map) {
  map.flyTo({
    center: currentFeature.geometry.coordinates,
    zoom: 15
  });
}

function createPopUp(currentFeature,map) {
  var popUps = document.getElementsByClassName('mapboxgl-popup');
  /** Check if there is already a popup on the map and if so, remove it */
  if (popUps[0]) popUps[0].remove();

  var popup = new mapboxgl.Popup({ closeOnClick: false })
      .setLngLat(currentFeature.geometry.coordinates)
      .setHTML('<h3>Sweetgreen</h3>' +
          '<h4>' + currentFeature.properties.address + '</h4>')
      .addTo(map);
}
class Dashboard extends Component {
  mapRef = React.createRef();

  constructor(props: Props) {
    super(props);
    this.state = {
      lng: 5,
      lat: 34,
      zoom: 1.5
    };
  }

  componentDidMount() {
    const { lng, lat, zoom } = this.state;

    const map = new mapboxgl.Map({
      container: this.mapRef.current,
      style: 'mapbox://styles/mapbox/streets-v9',
      center: [lng, lat],
      zoom
    });
    var stores = {
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [
              -77.034084142948,
              38.909671288923
            ]
          },
          "properties": {
            "phoneFormatted": "(202) 234-7336",
            "phone": "2022347336",
            "address": "1471 P St NW",
            "city": "Washington DC",
            "country": "United States",
            "crossStreet": "at 15th St NW",
            "postalCode": "20005",
            "state": "D.C."
          }
        },
        {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [
              -77.049766,
              38.900772
            ]
          },
          "properties": {
            "phoneFormatted": "(202) 507-8357",
            "phone": "2025078357",
            "address": "2221 I St NW",
            "city": "Washington DC",
            "country": "United States",
            "crossStreet": "at 22nd St NW",
            "postalCode": "20037",
            "state": "D.C."
          }
        },
        {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [
              -77.043929,
              38.910525
            ]
          },
          "properties": {
            "phoneFormatted": "(202) 387-9338",
            "phone": "2023879338",
            "address": "1512 Connecticut Ave NW",
            "city": "Washington DC",
            "country": "United States",
            "crossStreet": "at Dupont Circle",
            "postalCode": "20036",
            "state": "D.C."
          }
        },
        {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [
              -77.0672,
              38.90516896
            ]
          },
          "properties": {
            "phoneFormatted": "(202) 337-9338",
            "phone": "2023379338",
            "address": "3333 M St NW",
            "city": "Washington DC",
            "country": "United States",
            "crossStreet": "at 34th St NW",
            "postalCode": "20007",
            "state": "D.C."
          }
        },
        {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [
              -77.002583742142,
              38.887041080933
            ]
          },
          "properties": {
            "phoneFormatted": "(202) 547-9338",
            "phone": "2025479338",
            "address": "221 Pennsylvania Ave SE",
            "city": "Washington DC",
            "country": "United States",
            "crossStreet": "btwn 2nd & 3rd Sts. SE",
            "postalCode": "20003",
            "state": "D.C."
          }
        },
        {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [
              -76.933492720127,
              38.99225245786
            ]
          },
          "properties": {
            "address": "8204 Baltimore Ave",
            "city": "College Park",
            "country": "United States",
            "postalCode": "20740",
            "state": "MD"
          }
        },
        {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [
              -77.097083330154,
              38.980979
            ]
          },
          "properties": {
            "phoneFormatted": "(301) 654-7336",
            "phone": "3016547336",
            "address": "4831 Bethesda Ave",
            "cc": "US",
            "city": "Bethesda",
            "country": "United States",
            "postalCode": "20814",
            "state": "MD"
          }
        },
        {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [
              -77.359425054188,
              38.958058116661
            ]
          },
          "properties": {
            "phoneFormatted": "(571) 203-0082",
            "phone": "5712030082",
            "address": "11935 Democracy Dr",
            "city": "Reston",
            "country": "United States",
            "crossStreet": "btw Explorer & Library",
            "postalCode": "20190",
            "state": "VA"
          }
        },
        {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [
              -77.10853099823,
              38.880100922392
            ]
          },
          "properties": {
            "phoneFormatted": "(703) 522-2016",
            "phone": "7035222016",
            "address": "4075 Wilson Blvd",
            "city": "Arlington",
            "country": "United States",
            "crossStreet": "at N Randolph St.",
            "postalCode": "22203",
            "state": "VA"
          }
        },
        {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [
              -75.28784,
              40.008008
            ]
          },
          "properties": {
            "phoneFormatted": "(610) 642-9400",
            "phone": "6106429400",
            "address": "68 Coulter Ave",
            "city": "Ardmore",
            "country": "United States",
            "postalCode": "19003",
            "state": "PA"
          }
        },
        {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [
              -75.20121216774,
              39.954030175164
            ]
          },
          "properties": {
            "phoneFormatted": "(215) 386-1365",
            "phone": "2153861365",
            "address": "3925 Walnut St",
            "city": "Philadelphia",
            "country": "United States",
            "postalCode": "19104",
            "state": "PA"
          }
        },
        {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [
              -77.043959498405,
              38.903883387232
            ]
          },
          "properties": {
            "phoneFormatted": "(202) 331-3355",
            "phone": "2023313355",
            "address": "1901 L St. NW",
            "city": "Washington DC",
            "country": "United States",
            "crossStreet": "at 19th St",
            "postalCode": "20036",
            "state": "D.C."
          }
        }
      ]
    };
    stores.features.forEach(function(store, i){
      store.properties.id = i;
    });
    map.on('load', ()=> {
      /* Add the data to your map as a layer */
      map.addSource('places', {
        type: 'geojson',
        data: stores
      });
      buildLocationList(stores,map);
      addMarkers(stores,map);
    });
    map.on('click', function(e) {
      /* Determine if a feature in the "locations" layer exists at that point. */
      var features = map.queryRenderedFeatures(e.point, {
        layers: ['locations']
      });

      /* If yes, then: */
      if (features.length) {
        var clickedPoint = features[0];

        /* Fly to the point */
        flyToStore(clickedPoint,map);

        /* Close all other popups and display popup for clicked store */
        createPopUp(clickedPoint,map);

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

      this.setState({
        lng: lng.toFixed(4),
        lat: lat.toFixed(4),
        zoom: map.getZoom().toFixed(2)
      });
    });
  }
  render() {
    const { lng, lat, zoom } = this.state;


    return (
        <div className="animated fadeIn">
          <Row>
            <Col>
              <Card>
                <CardHeader>

                </CardHeader>
                <CardBody >
                  <div className='wrapper1'>
                    <div  className="inline-block absolute top left mt12 ml12 bg-darken75 color-white z1 py6 px12 round-full txt-s txt-bold">
                      <div>{`Longitude: ${lng} Latitude: ${lat} Zoom: ${zoom}`}</div>
                    </div>
                    <div className="row">
                      <div className=' sidebar1'>
                        <div className='heading'>
                          <h2>Our locations</h2>
                        </div>
                        <div id='listings' className='listings'></div>
                      </div>
                      <div  ref={this.mapRef} className="absolute top right  bottom map col-9" />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
    );
  }
}

export default Dashboard;
