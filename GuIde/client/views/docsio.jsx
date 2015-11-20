import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import GuLinkPage from './gulink-container';
import { isLoaded, docsioReload, docsioLoadLink, docsioCreateLink, docsioDeleteLink, docsioModifyLink } from '../../universal/redux/reducers/gudmarks';
import connectFetch from '../hoc/connect-fetch';

function fetchData({state, dispatch}) {
  if (!isLoaded(state, 'docsio')) {
    return dispatch(docsioLoadLink());
  }
}
@connectFetch(fetchData)
@connect(
  state => {
    return ({
      guLinks: state.docsio.get('gulinks')
    });
  },
  { docsioReload, docsioCreateLink, docsioDeleteLink, docsioModifyLink }
)
export default class DocsIO extends React.Component {
  static propTypes = {
    guLinks: PropTypes.object.isRequired,
    docsioReload: PropTypes.func.isRequired,
    docsioModifyLink: PropTypes.func.isRequired,
    docsioCreateLink: PropTypes.func.isRequired,
    docsioDeleteLink: PropTypes.func.isRequired
  }
  constructor(props, context) {
    super(props, context);
  }
  render() {
    const { guLinks } = this.props;
    return (
      <GuLinkPage category="docsio" gulinks={guLinks} creator={this.props.docsioCreateLink} deleter={this.props.docsioDeleteLink}
        reload={ this.props.docsioReload } modify={this.props.docsioModifyLink} />
    );
  }
}
