import React from 'react';
import { Container } from 'semantic-ui-react';
import Carousel from '../components/Carousel/Carousel';
import Events from '../components/Events/Events';
import Info from '../components/Info';
import Map from '../components/Map';

function Homepage() {
  return (
    <div className="App">
      <Carousel />
      <Container>
        <Events />
        <Info />
        <Map />
      </Container>
    </div>
  );
}

export default Homepage;
