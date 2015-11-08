import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import GuLinkPage from './gulink-container';
import { peopleCreateLink, peopleDeleteLink, peopleSelectLink } from '../../universal/redux/reducers/gudmarks';

@connect(
  state => {
    return ({
      selectedIndex: state.people.get('selectedIndex'),
      guLinks: state.people.get('gulinks')
    });
  },
  { peopleCreateLink, peopleDeleteLink, peopleSelectLink }
)
export default class PeopleView extends Component {
  static propTypes = {
    guLinks: PropTypes.object.isRequired,
    selectedIndex: PropTypes.number,
    peopleSelectLink: PropTypes.func,
    peopleCreateLink: PropTypes.func,
    peopleDeleteLink: PropTypes.func
  }
  static contextTypes = {
    store: PropTypes.object.isRequired
  }
  render() {
    const { selectedIndex, guLinks } = this.props;
    return (
      <GuLinkPage category="people" gulinks={guLinks} selectedIndex={selectedIndex} creator={this.props.peopleCreateLink} deleter={this.props.peopleDeleteLink}
        select={this.props.peopleSelectLink} />
    );
  }
}
