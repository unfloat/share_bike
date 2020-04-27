import React from 'react';
import { Button, Container, Header, Segment } from 'semantic-ui-react';

function CarouselItem({ slider }) {
  return (
    <Segment inverted vertical textAlign="center">
      <Container text className="active">
        <Header inverted as="h1">
          {slider.title}
        </Header>
        <p>{slider.description}</p>
        <Button primary size="huge">
          {slider.btnName}
        </Button>
      </Container>
    </Segment>
  );
}

export default CarouselItem;
