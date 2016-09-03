import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import GuLinkPage from './gulink-container';
import { isLoaded, docsioReload, docsioLoadLink, docsioCreateLink, docsioDeleteLink,
  docsioModifyLink, docsioMoveLink, docsioReorderLink,
} from '../../universal/redux/reducers/gudmarks';
import connectFetch from '../hoc/connect-fetch';

function fetchData({ state, dispatch }) {
  let promise;
  if (!isLoaded(state, 'docsio')) {
    promise = dispatch(docsioLoadLink());
  }
  return promise;
}
function DocsIO(props) {
  // todo building / socket.io
  const { guLinks } = props;
  return (
    <GuLinkPage category="docsio" gulinks={guLinks} onCreate={props.docsioCreateLink}
      onDelete={props.docsioDeleteLink} onReload={props.docsioReload}
      onModify={props.docsioModifyLink} onMove={props.docsioMoveLink}
      onReorder={props.docsioReorderLink}
    />
  );
}
DocsIO.propTypes = {
  guLinks: PropTypes.object.isRequired,
  docsioReload: PropTypes.func.isRequired,
  docsioMoveLink: PropTypes.func.isRequired,
  docsioReorderLink: PropTypes.func.isRequired,
  docsioModifyLink: PropTypes.func.isRequired,
  docsioCreateLink: PropTypes.func.isRequired,
  docsioDeleteLink: PropTypes.func.isRequired,
};

export default connectFetch(fetchData)(
  connect(
    state => ({
      guLinks: state.docsio.get('gulinks'),
    }),
    { docsioReload, docsioCreateLink, docsioDeleteLink, docsioModifyLink,
      docsioMoveLink, docsioReorderLink }
  )(DocsIO)
);
