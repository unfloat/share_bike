import React, { Component } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col, InputGroup,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  CardText,
  CardTitle,
  CardSubtitle,
  CardImg, Label, Input, FormText, FormGroup
} from 'reactstrap';
import 'toasted-notes/src/styles.css';
import './Dashboard.css'
import mapboxgl from 'mapbox-gl'
import stores from './constants'
import { addStation, getStations } from "../../../actions/stationActions";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

//note to self
//map global functions for now
// il nidham fil li5ir yidou taw
//tibdech TOGHZORLOU W T9OUL CHBIH 5AYIB AB3THOU
// FUCKING FOCUS
var map;

class Dashboard extends Component {
  mapRef = React.createRef();

  constructor(props: Props) {
    super(props);

    this.state = {
      lng: 5,
      lat: 34,
      zoom: 1.5,
      loaded: false,
      modal: false,
      file: "./assets/img/318x180.svg",
      title: "",
      alt: "",
      lang: "",
      numberOfBikesCapacity: 0,
      numberOfBikesAvailable: 0,
      imageData: null,
      selectedFile: null,
      etat: "Disponible",
      mode: "add",
      stations: [],


    };
    this.toggleModal = this.toggleModal.bind(this);
  }
  //map
  flyToStore = (currentFeature, map) => {
    map.flyTo({
      center: currentFeature.geometry.coordinates,
      zoom: 15
    });
  };
  createPopUp = (currentFeature, map, myInstance) => {
    var popUps = document.getElementsByClassName('mapboxgl-popup');
    /** Check if there is already a popup on the map and if so, remove it */
    if (popUps[0]) popUps[0].remove();
    var popup = new mapboxgl.Popup({ closeOnClick: false })
      .setLngLat(currentFeature.geometry.coordinates)
      .setHTML('<h3>Sweetgreen</h3>' +
        '<image center  width="100%" height="100px" src="./assets/img/318x180.svg" alt="Card image cap" />' +
        '<h4>' + currentFeature.properties.address + '</h4>'

      )
      .addTo(map);
    this.setState({
      title: currentFeature.properties.address, //change mba3d ma tkamil olfa
      mode: "modify"
    }
    );
    setTimeout(function () {
      myInstance.toggleModal();

    }, 1000);
  };
  addMarkers = (stores, map) => {
    var myInstance = this;
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
        myInstance.flyToStore(marker, map);
        /* Close all other popups and display popup for clicked store */
        myInstance.createPopUp(marker, map, myInstance);
        /* Highlight listing in sidebar */
        var activeItem = document.getElementsByClassName('active');
        e.stopPropagation();
        if (activeItem[0]) {
        }
        var listing = document.getElementById('listing-' + marker.properties.id);
        listing.classList.add('active');
      });
    });

  };
  buildLocationList = (data, map) => {
    var myInstance = this;
    data.features.forEach(function (store, i) {
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

      link.addEventListener('click', function (e) {

        var clickedListing = store;
        myInstance.flyToStore(clickedListing, map);

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

  };

  //MAP
  handlerCancel = e => {
    this.setState({
      title: "",
      imageData: null,
      selectedFile: null,
      loaded: false,
      numberOfBikesCapacity: 0,
      numberOfBikesAvailable: 0,
      etat: ""
    });
  };

  handleInputChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  fileSelectedHandler = event => {
    this.setState({
      selectedFile: event.target.files[0],
      loaded: true,
      file: URL.createObjectURL(event.target.files[0]),
    });
  };
  handleSubmit = event => {
    const newStation = new FormData();
    if (this.state.loaded) {
      newStation.append(
        "imageData",
        this.state.selectedFile,
        this.state.selectedFile.name
      );
    }
    newStation.append("title", this.state.title);
    newStation.append("alt", this.state.alt);
    newStation.append("lng", this.state.lang);
    newStation.append(
      "numberOfBikesCapacity",
      this.state.numberOfBikesCapacity
    );
    newStation.append(
      "numberOfBikesAvailable",
      this.state.numberOfBikesAvailable
    );

    newStation.append("etat", this.state.etat);
    newStation.append("user", this.props.user.id);
    newStation.append("archived", false);
    this.props.addStation(newStation);
    this.props.history.push("/stations");
  };
  toggleModal() {
    this.setState({
      modal: !this.state.modal
    });
  }

  componentDidUpdate(prevProps) {
    const { stations } = this.props.station;
    const { prevStations } = prevProps.station;

    console.log("componentDidUpdate" +stations + "prevProps.station" + prevStations);

    if (prevProps.station != this.props.station) {
      stores.features.forEach(function (store, i) {
        store.properties.id = i;
      });
      this.buildLocationList(stores, map);
      this.addMarkers(stores, map);
    }
  }
  async componentDidMount() {
    await this.props.getStations();

    const { stations } = this.props.station;

    console.log("componentDidMount" + stations);
    const { lng, lat, zoom } = this.state;
    var myinstance = this;
    map = new mapboxgl.Map({
      container: this.mapRef.current,
      style: 'mapbox://styles/mapbox/streets-v9',
      center: [lng, lat],
      zoom
    });

    map.on('load', () => {
      /* Add the data to your map as a layer */
      // here
      console.log("map.onload" + stations);

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
  }
  render() {
    const { lng, lat, zoom } = this.state;


    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Card>
              <CardHeader style={{ backgroundColor: "#00853e" }}>

              </CardHeader>
              <CardBody style={{ backgroundColor: "#add8e6" }} >
                <div className='wrapper1'>
                  <div className="inline-block absolute top left mt12 ml12 bg-darken75 color-white z1 py6 px12 round-full txt-s txt-bold">
                    <div>{`Longitude: ${lng} Latitude: ${lat} Zoom: ${zoom}`}</div>
                  </div>
                  <div className="row">
                    <div className=' sidebar1'>
                      <div className='heading'>
                        <Button
                          type="submit"
                          className="m-2"
                          onClick={() => { this.setState({ mode: "add" }); this.handlerCancel(); this.toggleModal() }}
                          style={{ width: 200 }}
                          color="primary"
                        >
                          <i className="fa fa-dot-circle-o"></i> Ajouter Station
                          </Button>
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
        <Modal isOpen={this.state.modal} toggle={this.toggleModal} className="modal-lg" >
          <ModalHeader toggle={this.toggleModal}>{this.state.mode == "add" ? "ajouter Station" : "Modifier station"}</ModalHeader>
          <ModalBody>
            <Card>
              <CardImg top width="100%" src={this.state.file} alt="Card image cap" />
              <CardBody>
                <CardTitle>Card title</CardTitle>
                <FormGroup row>
                  <Col md="8">
                    <Label htmlFor="text-input">Titre :</Label>
                  </Col>
                  <Col xs="12" md="9">
                    <Input
                      type="text"
                      name="title"
                      value={this.state.title}
                      onChange={this.handleInputChange}
                      placeholder="Titre..."
                    />
                    <FormText color="muted">
                      Titre de la station à ajouter
                      </FormText>
                  </Col>

                  <Col md="8">
                    <Label htmlFor="text-input">Location : </Label>
                  </Col>
                  <Col xs="6" md="9">
                    <Input
                      type="text"
                      name="alt"
                      value={this.state.alt}
                      onChange={this.handleInputChange}
                      placeholder="Altitude..."
                    />
                  </Col>
                  <Col xs="6" md="9">
                    <Input
                      type="text"
                      name="lng"
                      value={this.state.lang}
                      onChange={this.handleInputChange}
                      placeholder="Longitude..."
                    />
                  </Col>

                  <Col xs="6" md="9">
                    <Label htmlFor="text-input">Capacité :</Label>

                    <Input
                      name="numberOfBikesCapacity"
                      value={this.state.numberOfBikesCapacity}
                      onChange={this.handleInputChange}
                      type="number"
                    // placeholder="text..."
                    />
                  </Col>

                  <Col xs="6" md="9">
                    <Label htmlFor="text-input">Disponibilité :</Label>

                    <Input
                      name="numberOfBikesAvailable"
                      value={this.state.numberOfBikesAvailable}
                      onChange={this.handleInputChange}
                      type="number"
                    // placeholder="text..."
                    />
                  </Col>

                  <Col md="8">
                    <Label htmlFor="text-input">Etat :</Label>
                  </Col>
                  <Col xs="12" md="9">
                    <Input
                      type="select"
                      name="etat"
                      value={this.state.etat}
                      onChange={this.handleInputChange}
                    >
                      <option disabled>
                        Veuillez préciser l'état de la station
                        </option>
                      <option value="Disponible"> Disponible </option>
                      <option value="Maintenance"> Maintenance </option>
                      <option value="Non Disponible"> Non Disponible </option>
                    </Input>
                  </Col>

                  <Col md="8">
                    <Label htmlFor="text-input">Image :</Label>
                  </Col>
                  <Col xs="12" md="9">
                    <Input
                      type="file"
                      name="type"
                      onChange={this.fileSelectedHandler}
                    />
                  </Col>
                </FormGroup>
              </CardBody>
            </Card>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.handleSubmit}>Submit</Button>{' '}
            <Button color="secondary" onClick={this.handlerCancel}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>

    );
  }
}
const mapStateToProps = state => ({
  user: state.auth.user,
  errors: state.errors,
  station: state.station,
  loading: state.station.loading
});
export default withRouter(
  connect(mapStateToProps, { addStation, getStations })(Dashboard)
);
