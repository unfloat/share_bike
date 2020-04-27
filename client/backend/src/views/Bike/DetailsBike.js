import React, { Component } from 'react';
import { Card, CardImg,CardBody, CardHeader, Badge, Col, Row } from 'reactstrap';
import moment from 'moment';
import { getBike } from '../../actions/bikeActions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

class detailsBike extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bike: {},
      dateDebutString: null
    };
  }


  componentDidMount() {
    this.props.getBike(this.props.match.params.id);
  }

    
  render() {
    const { bike } = this.props;

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" xl="6">
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i>
                <strong>Vélo : Image</strong>
              </CardHeader>
              <CardBody>
              <CardImg src={`http://localhost:4000/${bike.image}`} alt={bike.image} />
              </CardBody>
            </Card>
          </Col>
          <Col xs="12" xl="6">
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Vélo <small>Détails</small>
                <div className="card-header-actions">
                  <Badge>{bike.type}</Badge>
                </div>
              </CardHeader>
              <CardBody>
                <div id="exampleAccordion" data-children=".item">
                  <div className="item">
                    <h5> Titre :</h5>

                    <p className="mb-3">{bike.title}</p>
                  </div>
                  <div className="item">
                    <h5>Date Enregistrement :</h5>

                    <p className="mb-3">{bike.createdAt}</p>
                  </div>
                  <div className="item">
                    <h5> Date Debut - Date Fin :</h5>

                    <p className="mb-3">
                      Du {moment(bike.dateStart).format('MMM Do YY')} Jusqu'a{' '}
                      {moment(bike.dateEnd).format('MMM Do YY')}
                    </p>
                  </div>
                  <div className="item">
                    <h5>Description :</h5>

                    <p className="mb-3">{bike.description}</p>
                  </div>
                  <div className="item">
                    <h5>Url :</h5>

                    <p className="mb-3">{bike.url}</p>
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
  bike: state.bike.bike
});

export default withRouter(connect(mapStateToProps,{getBike})(detailsBike));
