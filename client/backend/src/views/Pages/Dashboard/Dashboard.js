import React, { Component  } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  CardTitle,
  CardImg, Label, Input, FormText, FormGroup
} from 'reactstrap';
import 'toasted-notes/src/styles.css';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import CanvasJSReact from '../../../assets/canvasjs.react';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;





class Dashboard extends Component {
  mapRef = React.createRef();

  constructor(props: Props) {
    super(props);
    this.state = {

    };
  }
  //map


  //MAP






  componentDidMount() {

  }
  render() {
    const options2 = {
      animationEnabled: true,
      exportEnabled: true,
      theme: "dark2", // "light1", "dark1", "dark2"
      title:{
        text: "Trip Expenses"
      },
      data: [{
        type: "pie",
        indexLabel: "{label}: {y}%",
        startAngle: -90,
        dataPoints: [
          { y: 20, label: "Airfare" },
          { y: 24, label: "Food & Drinks" },
          { y: 20, label: "Accomodation" },
          { y: 14, label: "Transportation" },
          { y: 12, label: "Activities" },
          { y: 10, label: "Misc" }
        ]
      }]
    };



    const options = {
      animationEnabled: true,
      exportEnabled: true,
      theme: "light2", //"light1", "dark1", "dark2"
      title:{
        text: "Simple Column Chart with Index Labels"
      },
      data: [{
        type: "column", //change type to bar, line, area, pie, etc
        //indexLabel: "{y}", //Shows y value on all Data Points
        indexLabelFontColor: "#5A5757",
        indexLabelPlacement: "outside",
        dataPoints: [
          { x: 10, y: 71 },
          { x: 20, y: 55 },
          { x: 30, y: 50 },
          { x: 40, y: 65 },
          { x: 50, y: 71 },
          { x: 60, y: 68 },
          { x: 70, y: 38 },
          { x: 80, y: 92, indexLabel: "Highest" },
          { x: 90, y: 54 },
          { x: 100, y: 60 },
          { x: 110, y: 21 },
          { x: 120, y: 49 },
          { x: 130, y: 36 }
        ]
      }]
    };
    return (
        <div className="animated fadeIn">
          <Row>
            <Col>
              <Card>
                <CardHeader style={{backgroundColor: "#00853e"}}>
                  <h2>ShareBike Dashboard</h2>
                </CardHeader>
                <CardBody  >
                  <div className='col-11'>
                    <CanvasJSChart options = {options}
                         onRef={ref => this.chart = ref}
                    />
                    <br/>
                    <CanvasJSChart options = {options2}
                        /* onRef={ref => this.chart = ref} */
                    />
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
  user: state.auth.user,
  errors: state.errors,
});
export default withRouter(
    connect(mapStateToProps,)(Dashboard)
);
