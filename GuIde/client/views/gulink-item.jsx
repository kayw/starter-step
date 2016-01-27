import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';
import cssifyModules from 'react-css-modules';
import { DragSource as dragSource, DropTarget as dropTarget } from 'react-dnd';
const styles = require('./gulink-item.css');
const GULINK_TYPE = new Symbol('gulink');

const gulinkSource = {
  beginDrag(props) {
    return {
      id: props.id,
      index: props.index
    };
  }
};

const gulinkTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Determine rectangle on screen
    const hoverBoundingRect = ReactDom.findDOMNode(component).getBoundingClientRect();
    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    // Determine mouse position
    const clientOffset = monitor.getClientOffset();
    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;
    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    // Time to actually perform the action
    props.moveCard(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  }
};

@dropTarget(GULINK_TYPE, gulinkTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))
@dragSource(GULINK_TYPE, gulinkSource, (connect, monitor) => ({
  connectDropSource: connect.dropSource(),
  isDragging: monitor.isDragging
}))
@cssifyModules(styles, { allowMultiple: true })
export default class GuLinkItem extends Component {
  static propTypes = {
    isDragging: PropTypes.bool.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    focused: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    handleMouseEnter: PropTypes.func.isRequired,
    handleMouseLeave: PropTypes.func.isRequired,
    handleLinkModify: PropTypes.func.isRequired,
    handleLinkRemove: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    move: PropTypes.func.isRequired,
    reorder: PropTypes.func.isRequired,
    reload: PropTypes.func.isRequired,
    gulink: PropTypes.object.isRequired
  }
  constructor(props, context) {
    super(props, context);
  }
  handleBackendReload(gulink) {
    this.props.reload(this.props.category, gulink.name);
  }

  render() {
    const { focused, index, isDragging, connectDragSource, connectDropTarget } = this.props;
    const gulink = this.props.gulink;
    return connectDragSource(connectDropTarget(<li styleName={'gulink' + (focused ? ' ' + 'nav-focus' : '') + (isDragging ? ' invisible' : '')} key={gulink._id}
            onMouseEnter={() => this.props.handleMouseEnter(gulink, index)} onMouseLeave={ () => this.props.handleMouseLeave() }>
              <h3 styleName="gulink-name category">{gulink.name}</h3>
              {gulink.source && <span styleName="from">from</span>}
              {gulink.source && <span styleName="source">{' ' + gulink.source}</span>}
              <div styleName="gulink-actions">
              <span styleName="gulink-action" onClick={ () => this.props.handleLinkModify() }><i className="md-mode-edit"></i></span>
              { this.props.reload && <span styleName="gulink-action"
                onClick={ () => this.handleBackendReload(gulink) }><i className="md-sync"></i></span> }
              <span styleName="gulink-action" onClick={ () => this.props.handleLinkRemove(index) }><i className="md-delete"></i></span>
              </div>
              <div>
              {
                gulink.links.map(
                  (link, idx) =>
                  <p key={'g' + idx} styleName="short-desc"><a href={link} target="_blank">{link}</a></p>)
              }
              </div>
            </li>));
  }
}
