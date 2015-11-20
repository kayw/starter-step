import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import GuLinkPage from './gulink-container';
import { isLoaded, techcuzLoadLink, techcuzCreateLink, techcuzDeleteLink, techcuzModifyLink } from '../../universal/redux/reducers/gudmarks';
import connectFetch from '../hoc/connect-fetch';

function fetchData({state, dispatch}) {
  const promises = [];
  if (!isLoaded(state, 'techcuz')) {
    promises.push(dispatch(techcuzLoadLink()));
  }
  return Promise.all(promises);
}
@connectFetch(fetchData)
@connect(
  state => {
    return ({
      guLinks: state.techcuz.get('gulinks')
    });
  },
  { techcuzCreateLink, techcuzDeleteLink, techcuzModifyLink }
)
export default class TechcuzView extends Component {
  static propTypes = {
    guLinks: PropTypes.object.isRequired,
    selectedIndex: PropTypes.number,
    techcuzModifyLink: PropTypes.func.isRequired,
    techcuzCreateLink: PropTypes.func.isRequired,
    techcuzDeleteLink: PropTypes.func.isRequired
  }
  static contextTypes = {
    store: PropTypes.object.isRequired
  }
  render() {
    const { guLinks } = this.props;
    return (
      <GuLinkPage category="techcuz" gulinks={guLinks} creator={this.props.techcuzCreateLink} deleter={this.props.techcuzDeleteLink}
        modify={this.props.techcuzModifyLink} />
    );
  }
}
