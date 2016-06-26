import React, { PropTypes } from 'react';
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
function TechcuzView(props) {
  const { guLinks } = props;
  return (
    <GuLinkPage category="techcuz" gulinks={guLinks} onCreate={props.techcuzCreateLink}
      onDelete={props.techcuzDeleteLink} onModify={props.techcuzModifyLink}
      onMove={props.techcuzMoveLink} onReorder={props.techcuzReorderLink}
    />
  );
}

TechcuzView.propTypes = {
  guLinks: PropTypes.object.isRequired,
  selectedIndex: PropTypes.number,
  techcuzReorderLink: PropTypes.func.isRequired,
  techcuzMoveLink: PropTypes.func.isRequired,
  techcuzModifyLink: PropTypes.func.isRequired,
  techcuzCreateLink: PropTypes.func.isRequired,
  techcuzDeleteLink: PropTypes.func.isRequired,
};

export default connectFetch(fetchData)(
  connect(
    state => ({
      guLinks: state.techcuz.get('gulinks'),
    }),
    { techcuzCreateLink, techcuzDeleteLink, techcuzModifyLink,
      techcuzReorderLink, techcuzMoveLink }
  )(TechcuzView)
);
