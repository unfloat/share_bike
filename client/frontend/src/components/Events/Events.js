import React, { useEffect } from 'react';
import { Grid, Segment, Loader } from 'semantic-ui-react';
import { getLatestEvents } from '../../actions/eventActions';
import EventItem from './EventItem';
import { connect } from 'react-redux';

function Events({ loading, events, getLatestEvents }) {
  useEffect(() => {
    getLatestEvents();
  }, []);
  return (
    <>
      <Segment vertical>
        <Grid container stackable textAlign="center" columns={3}>
          {loading ? (
            <Loader active />
          ) : (
            events.slice(0,3).map((event) => <EventItem key={event._id} event={event} />)
          )}
        </Grid>
      </Segment>
    </>
  );
}

const mapStateToProps = (state) => ({
  errors: state.errors,
  events: state.event.events,
  loading: state.event.loading,
});

export default connect(mapStateToProps, { getLatestEvents })(Events);
