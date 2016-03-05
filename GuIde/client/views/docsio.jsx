import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import GuLinkPage from './gulink-container';
import { isLoaded, docsioReload, docsioLoadLink, docsioCreateLink, docsioDeleteLink,
  docsioModifyLink, docsioMoveLink, docsioReorderLink
} from '../../universal/redux/reducers/gudmarks';
import connectFetch from '../hoc/connect-fetch';

function fetchData({ state, dispatch }) {
  let promise;
  if (!isLoaded(state, 'docsio')) {
    promise = dispatch(docsioLoadLink());
  }
  return promise;
}
@connectFetch(fetchData)
@connect(
  state => ({
    guLinks: state.docsio.get('gulinks')
  }),
  { docsioReload, docsioCreateLink, docsioDeleteLink, docsioModifyLink,
    docsioMoveLink, docsioReorderLink }
)
export default class DocsIO extends React.Component {
  static propTypes = {
    guLinks: PropTypes.object.isRequired,
    docsioReload: PropTypes.func.isRequired,
    docsioMoveLink: PropTypes.func.isRequired,
    docsioReorderLink: PropTypes.func.isRequired,
    docsioModifyLink: PropTypes.func.isRequired,
    docsioCreateLink: PropTypes.func.isRequired,
    docsioDeleteLink: PropTypes.func.isRequired
  }
  render() {
    const { guLinks } = this.props;
    return (
      <GuLinkPage category="docsio" gulinks={guLinks} onCreate={this.props.docsioCreateLink}
        onDelete={this.props.docsioDeleteLink} onReload={ this.props.docsioReload }
        onModify={this.props.docsioModifyLink} onMove={this.props.docsioMoveLink}
        onReorder={this.props.docsioReorderLink}
      />
    );
  }
}
