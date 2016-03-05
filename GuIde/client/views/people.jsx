import React, { Component, PropTypes } from 'react';
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
@connectFetch(fetchData)
@connect(
  state => ({
    guLinks: state.people.get('gulinks')
  }),
  { peopleCreateLink, peopleDeleteLink, peopleModifyLink, peopleMoveLink, peopleReorderLink }
)
export default class PeopleView extends Component {
  static propTypes = {
    guLinks: PropTypes.object.isRequired,
    peopleMoveLink: PropTypes.func.isRequired,
    peopleReorderLink: PropTypes.func.isRequired,
    peopleModifyLink: PropTypes.func.isRequired,
    peopleCreateLink: PropTypes.func.isRequired,
    peopleDeleteLink: PropTypes.func.isRequired
  }
  static contextTypes = {
    store: PropTypes.object.isRequired
  }
  render() {
    const { guLinks } = this.props;
    return (
      <GuLinkPage category="people" gulinks={guLinks} onCreate={this.props.peopleCreateLink}
        onDelete={this.props.peopleDeleteLink} onModify={this.props.peopleModifyLink}
        onMove={this.props.peopleMoveLink} onReorder={this.props.peopleReorderLink}
      />
    );
  }
}
