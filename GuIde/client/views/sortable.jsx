import React, { PropTypes } from 'react';
import ReactDom from 'react-dom';

export default class Sortable extends React.Component {
  static propTypes = {
    children: PropTypes.array
  }
  componentDidMount() {
    this.props.children.map((child) => {
      const enode = ReactDom.findDOMNode(this.refs[`item-${child.props.key}`]);
      enode.addEventListener('dragstart', ::this.handleDragStart);
      enode.addEventListener('dragover', ::this.handleDragOver);
      enode.addEventListener('drop', ::this.handleDrop);
      enode.ondragstart = this.handleDragStart;
    });
  }
  handleDragStart() {
    // console.log('handleDragStart');
  }
  handleDragOver() {
  }
  handleDrop() {
  }
  render() {
    // http://stackoverflow.com/questions/29568721/getting-dom-node-from-react-child-element
    return (<div>
            {
              React.Children.map(this.props.children, (child) =>
                React.cloneElement(child, {
                  ref: `item-${child.props.key}`
                })
              )
            }
            </div>);
  }
}
