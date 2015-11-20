import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import GuLinkPage from './gulink-container';
import { isLoaded, peopleLoadLink, peopleCreateLink, peopleDeleteLink, peopleModifyLink } from '../../universal/redux/reducers/gudmarks';
import connectFetch from '../hoc/connect-fetch';

function fetchData({state, dispatch}) {
  if (!isLoaded(state, 'people')) {
    return dispatch(peopleLoadLink());
  }
}
@connectFetch(fetchData)
@connect(
  state => {
    return ({
      guLinks: state.people.get('gulinks')
    });
  },
  { peopleCreateLink, peopleDeleteLink, peopleModifyLink }
)
export default class PeopleView extends Component {
  static propTypes = {
    guLinks: PropTypes.object.isRequired,
    selectedIndex: PropTypes.number,
    peopleModifyLink: PropTypes.func,
    peopleCreateLink: PropTypes.func,
    peopleDeleteLink: PropTypes.func
  }
  static contextTypes = {
    store: PropTypes.object.isRequired
  }
  render() {
    const { guLinks } = this.props;
    return (
      <GuLinkPage category="people" gulinks={guLinks} creator={this.props.peopleCreateLink} deleter={this.props.peopleDeleteLink}
        modify={this.props.peopleModifyLink} />
    );
  }
}
