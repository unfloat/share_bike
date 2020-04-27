import React, { Component } from 'react';
import { Card, CardImg,CardBody, CardHeader, Badge, Col, Row } from 'reactstrap';
import moment from 'moment';
import { getStation } from '../../actions/stationActions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

class detailsStation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      station: {},
      dateDebutString: null
    };
  }


  componentDidMount() {
    this.props.getStation(this.props.match.params.id);
  }

    
  render() {
    const { station } = this.props;

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" xl="6">
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i>
                <strong>Evénement : Image</strong>
              </CardHeader>
              <CardBody>
              <CardImg src={`http://localhost:4000/${station.image}`} alt={station.image} />
              </CardBody>
            </Card>
          </Col>
          <Col xs="12" xl="6">
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Evénement <small>Détails</small>
                <div className="card-header-actions">
                  <Badge>{station.type}</Badge>
                </div>
              </CardHeader>
              <CardBody>
                <div id="exampleAccordion" data-children=".item">
                  <div className="item">
                    <h5> Titre :</h5>

                    <p className="mb-3">{station.title}</p>
                  </div>
                  <div className="item">
                    <h5>Date Enregistrement :</h5>

                    <p className="mb-3">{station.createdAt}</p>
                  </div>
                  <div className="item">
                    <h5> Date Debut - Date Fin :</h5>

                    <p className="mb-3">
                      Du {moment(station.dateStart).format('MMM Do YY')} Jusqu'a{' '}
                      {moment(station.dateEnd).format('MMM Do YY')}
                    </p>
                  </div>
                  <div className="item">
                    <h5>Description :</h5>

                    <p className="mb-3">{station.description}</p>
                  </div>
                  <div className="item">
                    <h5>Url :</h5>

                    <p className="mb-3">{station.url}</p>
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

const mapStateToProps = state => ({
  station: state.station.station
});

export default withRouter(connect(mapStateToProps,{getStation})(detailsStation));
