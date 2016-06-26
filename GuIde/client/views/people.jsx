import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import GuLinkPage from './gulink-container';
import { isLoaded, peopleLoadLink, peopleCreateLink, peopleDeleteLink, peopleModifyLink,
  peopleMoveLink, peopleReorderLink } from '../../universal/redux/reducers/gudmarks';
import connectFetch from '../hoc/connect-fetch';

function fetchData({ state, dispatch }) {
  let promise;
  if (!isLoaded(state, 'people')) {
    promise = dispatch(peopleLoadLink());
  }
  return promise;
}

function PeopleView(props) {
  const { guLinks } = props;
  return (
    <GuLinkPage category="people" gulinks={guLinks} onCreate={props.peopleCreateLink}
      onDelete={props.peopleDeleteLink} onModify={props.peopleModifyLink}
      onMove={props.peopleMoveLink} onReorder={props.peopleReorderLink}
    />
  );
}

PeopleView.propTypes = {
  guLinks: PropTypes.object.isRequired,
  peopleMoveLink: PropTypes.func.isRequired,
  peopleReorderLink: PropTypes.func.isRequired,
  peopleModifyLink: PropTypes.func.isRequired,
  peopleCreateLink: PropTypes.func.isRequired,
  peopleDeleteLink: PropTypes.func.isRequired,
};

export default connectFetch(fetchData)(
  connect(
    state => ({
      guLinks: state.people.get('gulinks'),
    }),
    { peopleCreateLink, peopleDeleteLink, peopleModifyLink, peopleMoveLink, peopleReorderLink }
  )(PeopleView)
);
