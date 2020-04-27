import React from 'react';
import { Grid, Image, Header  } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

function EventItem({ event }) {
  const { description } = event;
  return (
    <Grid.Column>
      <Image
        centered
        circular
        size="small"
        src={`http://localhost:4000/${event.image}`}
      />
      <Header as="h1">{event.title}</Header>
      <p>
        {description.substr(0, 99)}{' '}
        {description.length &&  description.length > 100 && '...'}
      </p>
      <Link to={`/event/${event._id}`}>View details &raquo;</Link>
    </Grid.Column>
  );
}

export default EventItem;
