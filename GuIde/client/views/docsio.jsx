import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import GuLinkPage from './gulink-container';
import { docsioCreateLink, docsioDeleteLink, docsioSelectLink } from '../../universal/redux/reducers/gudmarks';
@connect(
  state => {
    return ({
      selectedIndex: state.docsio.get('selectedIndex'),
      guLinks: state.docsio.get('gulinks')
    });
  },
  { docsioCreateLink, docsioDeleteLink, docsioSelectLink }
)
export default class DocsIO extends React.Component {
  static propTypes = {
    guLinks: PropTypes.object.isRequired,
    selectedIndex: PropTypes.number,
    docsioSelectLink: PropTypes.func,
    docsioCreateLink: PropTypes.func,
    docsioDeleteLink: PropTypes.func
  }
  constructor(props, context) {
    super(props, context);
  }
  render () {
    const { selectedIndex, guLinks } = this.props;
    return (
      <GuLinkPage category="docsio" gulinks={guLinks} selectedIndex={selectedIndex} creator={this.props.docsioCreateLink} deleter={this.props.docsioDeleteLink}
        select={this.props.docsioSelectLink} />
    );
  }
}
