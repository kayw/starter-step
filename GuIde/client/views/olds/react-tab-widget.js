import React from 'React';

const TabWidget = React.createClass({
  propTypes: {
    activeIndex: React.PropTypes.number
  },

  getInitialState() {
    return {
      activeTabId: 0//this.props.activeIndex
    }
  },

  handleTabClick(index) {
    this.setState({activeTabId: index});
  },
  render() {
    return <div id="tab-widget">
    <TabsSwitcher tabs={this.props.Tabs} activeID={this.state.activeTabId} onTabClick={this.handleTabClick} />
    <TabPanels tabs={this.props.Tabs} activeID={this.state.activeTabId}  />
    </div>
  }
});

/*
  http://stackoverflow.com/questions/17551688/how-to-create-a-closeable-tab-in-angularjs-ui-bootstrap
  http://jsfiddle.net/alfrescian/ZE9cE/
  
  http://stackoverflow.com/questions/25336124/reactjs-how-to-modify-child-state-or-props-from-parent
  http://jsfiddle.net/claudeprecourt/283msa50/1/
  
  http://stackoverflow.com/questions/20872632/react-js-composing-components-to-create-tabs
  http://jsfiddle.net/NV/5YRG9
*/
const TabsSwitcher = React.createClass({

  handleClick(index) {
    this.props.onTabClick(index);
  },

  render() {
    var activeID = this.props.activeID;
    var items = this.props.tabs.map(function(tab, i) {
      return <li href="" className={'tab' + 
        (activeID === i ? ' selected' : '')} onClick={this.handleClick.bind(this, i)}>
      {tab.title}
      <div onClick={this.onRemoveTab}>x</div>
      </li>;
    }.bind(this));
    return (
      <ul>
      {items}
      </ul> );
  }
});

const TabPanels = React.createClass({
  render() {
    var activeID = this.props.activeID;
    var items = this.props.tabs.map(function(tab, i) {
      return <div className={'tab-panel' + 
        (activeID === i ? ' selected' : '')} >
      {tab.content}
      </div>;
    }.bind(this));
    return <div>{items}</div>;
  }
});
