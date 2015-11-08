import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import GuLinkPage from './gulink-container';
import { techcuzCreateLink, techcuzDeleteLink, techcuzSelectLink } from '../../universal/redux/reducers/gudmarks';

@connect(
  state => {
    return ({
      selectedIndex: state.techcuz.get('selectedIndex'),
      guLinks: state.techcuz.get('gulinks')
    });
  },
  { techcuzCreateLink, techcuzDeleteLink, techcuzSelectLink }
)
export default class TechcuzView extends Component {
  static propTypes = {
    guLinks: PropTypes.object.isRequired,
    selectedIndex: PropTypes.number,
    techcuzSelectLink: PropTypes.func,
    techcuzCreateLink: PropTypes.func,
    techcuzDeleteLink: PropTypes.func
  }
  static contextTypes = {
    store: PropTypes.object.isRequired
  }
  render() {
    const { selectedIndex, guLinks } = this.props;
    return (
      <GuLinkPage category="techcuz" gulinks={guLinks} selectedIndex={selectedIndex} creator={this.props.techcuzCreateLink} deleter={this.props.techcuzDeleteLink}
        select={this.props.techcuzSelectLink} />
    );
  }
}
