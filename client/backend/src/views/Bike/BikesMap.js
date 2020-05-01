import React, { Component  } from 'react';
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
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
    CardText,
    CardTitle,
    CardSubtitle,
    CardImg, Label, Input, FormText, FormGroup
} from 'reactstrap';
import 'toasted-notes/src/styles.css';
import './BikesMap.css'
import mapboxgl from 'mapbox-gl'
import {addStation, editStation, getStations, setIsModifiedStationLoading} from "../../actions/stationActions";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

//note to self
//map global functions for now
// il nidham fil li5ir yidou taw
//tibdech TOGHZORLOU W T9OUL CHBIH 5AYIB AB3THOU
// FUCKING FOCUS
var map;

class BikesMap extends Component {
    mapRef = React.createRef();

    constructor(props: Props) {
        super(props);
        this.props.getStations();
        this.state = {
            lng: 5,
            lat: 34,
            zoom: 1.5,
            loaded:false,
            modal:false,
            title: "",
            file: "http://localhost:3002/assets/img/318x180.svg",
            imageData: null,
            selectedFile: null,
            etat: "Saine",
            weight: 0,
            disponibilite: "Disponible",
            type: "honda",
            stationID: 0,
            mode : "add",
            activeTab: '1',
        };
        this.toggleModal = this.toggleModal.bind(this);
    }
    //map
    flyToStore=(station,map)=> {
        map.flyTo({
            center: [station.lng,station.alt],
            zoom: 15
        });
    };
    createPopUp =(marker,map,myInstance)=> {
        var popUps = document.getElementsByClassName('mapboxgl-popup');
        /** Check if there is already a popup on the map and if so, remove it */
        if (popUps[0]) popUps[0].remove();
        var popup = new mapboxgl.Popup({ closeOnClick: false })
            .setLngLat([marker.lng,marker.alt])
            .setHTML('<h3>Sweetgreen</h3>' +
                '<image center  width="100%" height="100px" src="http://localhost:4000/'+marker.image+'" alt="Card image cap" />'+
                '<h4>' + marker.title + '</h4>'

            )
            .addTo(map);
        this.setState({

            }
        );
        setTimeout(function() {
            myInstance.toggleModal();

        }, 1000);
    };
    addMarkers=(stations,map) =>{
        var myInstance = this;
        /* For each feature in the GeoJSON object above: */
        stations.forEach(function(marker) {
            /* Create a div element for the marker. */
            var el = document.createElement('div');
            /* Assign a unique `id` to the marker. */
            el.id = "marker-" + marker.id;
            /* Assign the `marker` class to each marker for styling. */
            el.className = 'marker';

            /**
             * Create a marker using the div element
             * defined above and add it to the map.
             **/
            new mapboxgl.Marker(el, { offset: [0, -23] })
                .setLngLat([marker.lng,marker.alt])
                .addTo(map);
            el.addEventListener('click', function(e){
                /* Fly to the point */
                myInstance.flyToStore(marker,map);
                /* Close all other popups and display popup for clicked store */
                myInstance.createPopUp(marker,map,myInstance);
                /* Highlight listing in sidebar */
                var activeItem = document.getElementsByClassName('active');
                activeItem.forEach(function (active,i) {
                    active.classList.remove('active');
                });
                var listing = document.getElementById('listing-' + marker.id);
                listing.classList.add('active');
            });
        });

    };
    buildLocationList =(data,map)=> {
        var myInstance = this;
        var listings = document.getElementById('listings');
        listings.innerHTML="";
        data.forEach(function(station, i){
            /**
             * Create a shortcut for `store.properties`,
             * which will be used several times below.
             **/
            //var prop = store.properties;

            /* Add a new listing section to the sidebar. */

            var listing = listings.appendChild(document.createElement('div'));
            /* Assign a unique `id` to the listing. */
            listing.id = "listing-" + station.id;
            /* Assign the `item` class to each listing for styling. */
            listing.className = 'item';

            /* Add the link to the individual listing created above. */
            var link = listing.appendChild(document.createElement('a'));
            link.href = '#';
            link.className = 'title';
            link.id = "link-" + station.id;
            link.innerHTML = station.title;

            link.addEventListener('click', function(e){

                myInstance.flyToStore(station,map);
                var activeItem = document.getElementsByClassName('active');
                activeItem.forEach(function (active,i) {
                    active.classList.remove('active');
                });
                if (this.parentElement.classList!='active')
                    this.parentElement.classList.add('active');

            });
            /* Add details to the individual listing. */
            var details = listing.appendChild(document.createElement('div'));
            details.innerHTML = station.etat;
            if (station.etat === "Maintenance") {
                details.innerHTML += ' · ' + "+21651868365";
            }

        });

    };



    //MAP

    setActiveTab = tab=>{
        this.setState({
            activeTab : tab,
        })
    };
    handlerCancel = e => {
        this.setState({
            title: "",
            imageData: null,
            selectedFile: null,
            loaded: false,
            weight: 0,
            etat: "",
            disponibilite: "",
            type: "",
        });
        this.toggleModal();
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
        newStation.append("archived", this.state.archived);
        if (this.state.mode ==="modify"){
            this.props.editStation(newStation, this.state.id);
            // console.log(this.state.id);
        }
        else{this.props.addStation(newStation);}
        //  this.props.history.push("/stations");
    };

    toggleModal() {
        this.setState({
            modal: !this.state.modal
        });
    }

    componentDidUpdate(prevProps){
        if(prevProps.station != this.props.station){
            if (this.props.station.stations.length!=0)
            {
                var stations = this.props.station.stations;
                console.log(stations);
                stations.forEach(function(store, i){
                    store.id = i;
                });
                this.buildLocationList(stations,map);
                this.addMarkers(stations,map);
            }
        }
    }
    componentDidMount() {
        const { lng, lat, zoom } = this.state;
        var myinstance =this;
        map = new mapboxgl.Map({
            container: this.mapRef.current,
            style: 'mapbox://styles/mapbox/streets-v9',
            center: [lng, lat],
            zoom
        });

        map.on('load', ()=> {
            /* Add the data to your map as a layer */


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
                myinstance.flyToStore(clickedPoint,map);

                /* Close all other popups and display popup for clicked store */
                myinstance.createPopUp(clickedPoint,map);

                /* Highlight listing in sidebar (and remove highlight for all other listings) */
                var activeItem = document.getElementsByClassName('active');
                if (activeItem[0]) {
                    activeItem[0].classList.remove('active');
                }
                var listing = document.getElementById('listing-' + clickedPoint.id);
                listing.classList.add('active');
            }
        });
        map.on('move', () => {
            const { lng, lat } = map.getCenter();
            this.setState({lang:lng,alt:lat});
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
                            <CardHeader style={{backgroundColor: "#00853e"}}>

                            </CardHeader>
                            <CardBody style={{backgroundColor: "#add8e6"}} >
                                <div className='wrapper1'>
                                    <div  className="inline-block absolute top left mt12 ml12 bg-darken75 color-white z1 py6 px12 round-full txt-s txt-bold">
                                        <div>{`Longitude: ${lng} Latitude: ${lat} Zoom: ${zoom}`}</div>
                                    </div>
                                    <div className="row">
                                        <div className=' sidebar1'>
                                            <div className='heading'>
                                                <Button
                                                    type="submit"
                                                    className="m-2"
                                                    onClick={()=>{ this.setState({mode:"add"});this.handlerCancel();this.toggleModal()}}
                                                    style={{width:200}}
                                                    color="primary"
                                                >
                                                    <i className="fa fa-dot-circle-o"></i> Ajouter Station
                                                </Button>
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
                <Modal isOpen={this.state.modal} toggle={this.toggleModal} className="modal-lg" >
                    <ModalHeader toggle={this.toggleModal}>{this.state.mode=="add"? "ajouter Station":"Modifier station"}</ModalHeader>
                    <ModalBody >
                        <Nav tabs>
                            <NavItem>
                                <NavLink className={this.state.activeTab == '1' ? 'active' : ''} onClick={() => this.setActiveTab('1')}>
                                    Add
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink className={this.state.activeTab == '2' ? 'active' : ''} onClick={() => this.setActiveTab('2')}>
                                    All Bikes
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <TabContent activeTab={this.state.activeTab}>
                            <TabPane tabId="1">
                                <Card >
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
                                                    Titre du vélo à ajouter
                                                </FormText>
                                            </Col>

                                            <Col md="8">
                                                <Label htmlFor="text-input">Station :</Label>
                                            </Col>
                                            <Col xs="12" md="9">
                                                <Input
                                                    type="select"
                                                    name="stationID"
                                                    value={this.state.stationID}
                                                    onChange={this.handleInputChange}
                                                >
                                                    <option disabled>veuillez choisir le type</option>
                                                    <option value="Administration">Administration </option>
                                                    <option value="Etudiant"> Etudiant </option>
                                                    <option value="Clubs"> Clubs </option>
                                                </Input>
                                            </Col>


                                            <Col xs="6" md="9">
                                                <Label htmlFor="text-input">Poids :</Label>

                                                <Input
                                                    name="weight"
                                                    value={this.state.weight}
                                                    onChange={this.handleInputChange}
                                                    type="number"
                                                    // placeholder="text..."
                                                />
                                            </Col>


                                            <Col md="8">
                                                <Label htmlFor="text-input">Type :</Label>
                                            </Col>
                                            <Col xs="12" md="9">
                                                <Input
                                                    type="select"
                                                    name="type"
                                                    value={this.state.type}
                                                    onChange={this.handleInputChange}
                                                >
                                                    <option disabled>
                                                        Veuillez préciser le type du vélo
                                                    </option>
                                                    <option value="Marque 1"> Marque 1 </option>
                                                    <option value="Marque 2"> Marque 2 </option>
                                                </Input>
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
                                                        Veuillez préciser l'état du vélo
                                                    </option>
                                                    <option value="Saine"> Saine </option>
                                                    <option value="Maintenance"> Maintenance </option>
                                                </Input>
                                            </Col>


                                            <Col xs="6" md="9">
                                                <Label htmlFor="text-input">Disponibilité :</Label>

                                                <Input
                                                    name="disponibilite"
                                                    value={this.state.disponibilite}
                                                    onChange={this.handleInputChange}
                                                    type="select"
                                                    // placeholder="text..."
                                                >
                                                    <option disabled>
                                                        Veuillez préciser la disponibilité du vélo
                                                    </option>
                                                    <option value="Disponible"> Disponible </option>
                                                    <option value="Reservée"> Reservée </option>
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

                            </TabPane>
                            <TabPane tabId="2">Tab 2 Content</TabPane>
                        </TabContent>
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
    loading: state.station.loading,
    isModified: state.station.isModified
});
export default withRouter(
    connect(mapStateToProps, { addStation,getStations,    editStation,
        setIsModifiedStationLoading })(BikesMap)
);
