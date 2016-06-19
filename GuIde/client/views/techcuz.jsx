import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import GuLinkPage from './gulink-container';
import { isLoaded, techcuzLoadLink, techcuzCreateLink, techcuzDeleteLink, techcuzModifyLink,
  techcuzReorderLink, techcuzMoveLink } from '../../universal/redux/reducers/gudmarks';
import connectFetch from '../hoc/connect-fetch';

function fetchData({ state, dispatch }) {
  const promises = [];
  if (!isLoaded(state, 'techcuz')) {
    promises.push(dispatch(techcuzLoadLink()));
  }
  return Promise.all(promises);
}
@connectFetch(fetchData)
@connect(
  state => ({
    guLinks: state.techcuz.get('gulinks'),
  }),
  { techcuzCreateLink, techcuzDeleteLink, techcuzModifyLink,
    techcuzReorderLink, techcuzMoveLink }
)
export default class TechcuzView extends Component {
  static propTypes = {
    guLinks: PropTypes.object.isRequired,
    selectedIndex: PropTypes.number,
    techcuzReorderLink: PropTypes.func.isRequired,
    techcuzMoveLink: PropTypes.func.isRequired,
    techcuzModifyLink: PropTypes.func.isRequired,
    techcuzCreateLink: PropTypes.func.isRequired,
    techcuzDeleteLink: PropTypes.func.isRequired,
  }
  static contextTypes = {
    store: PropTypes.object.isRequired,
  }
  render() {
    const { guLinks } = this.props;
    return (
      <GuLinkPage category="techcuz" gulinks={guLinks} onCreate={this.props.techcuzCreateLink}
        onDelete={this.props.techcuzDeleteLink} onModify={this.props.techcuzModifyLink}
        onMove={this.props.techcuzMoveLink} onReorder={this.props.techcuzReorderLink}
      />
    );
  }
}
