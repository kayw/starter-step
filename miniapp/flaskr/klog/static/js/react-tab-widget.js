/** @jsx React DOM **/
//
var TabWidget = React.createClass({
    propTypes: {
        activeIndex: React.PropTypes.number
    },

    getInitialState: function(){
        return {
            activeTabId: 0//this.props.activeIndex
        }
    },

    handleTabClick: function(index) {
        this.setState({activeTabId: index});
    },
    render: function(){
        return <div id="tab-widget">
            <TabsSwitcher tabs={this.props.Tabs} activeID={this.state.activeTabId} onTabClick={this.handleTabClick} />
            <TabPanels tabs={this.props.Tabs} activeID={this.state.activeTabId}  />
            </div>
    }
});

//http://stackoverflow.com/questions/17551688/how-to-create-a-closeable-tab-in-angularjs-ui-bootstrap
//http://jsfiddle.net/alfrescian/ZE9cE/
//
//http://stackoverflow.com/questions/25336124/reactjs-how-to-modify-child-state-or-props-from-parent
//http://jsfiddle.net/claudeprecourt/283msa50/1/
//
//http://stackoverflow.com/questions/20872632/react-js-composing-components-to-create-tabs
//http://jsfiddle.net/NV/5YRG9/
var TabsSwitcher = React.createClass({

    handleClick: function(index) {
        this.props.onTabClick(index);
    },

    render: function() {
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

var TabPanels = React.createClass({
    render: function() {
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
