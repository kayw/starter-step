import React from 'React';
const SaviourApp = React.createClass({

    getInitialState: function() {
        return {
            //http://jsfiddle.net/NV/5YRG9/
            tabs: [{
            title: 'Untitled', content: ''
            }],
            activeTabIndex: 0,
            treeNodes:{}
        };
    },
    handleFileClick: function(fileNode) {
    },

    componentDidMount: function() {
        /*$.get(this.props.url, function(project) {
            if (this.isMount) {
                this.setState({
                    tabs: project.LastOpenFiles,
                    treeNodes: project.FileHierarchy
                });
            }
        }.bind(this));*/
       this.setState({
           tabs:[{
               title: 'first t', content: 'first content'
           }, {
               title: 'second t', content: 'second content'
           }],
           treeNodes: {
               "id": 1,
               "name": "proj",
               "children": [{
                   "id": 2,
                   "name": "file1"
               }, {
                   "id": 3,
                   "name": "dir",
                   "children": [{
                       "id": 4,
                       "name": "file2"
                   }, {
                       "id": 5,
                       "name": "file3"
                   }]
               }, {
                   "id": 6,
                   "name": "file4"
               }]
           }
       });
                
    },
/*
    renderTreeDfs: function(childNode) {
        var child = renderTreeChildren(childNode.children);
        return (<TreeView>
               child
              </TreeView>
               ); 
    },
    renderTreeChildren: function(childrenNode) {
        var children = [];
        for (int i = 0; i < childrenNode.length; ++i) {
            var childNode = renderTreeDfs(childNode[i]);
            children.push(childNode);
        }
        return children;
    },*/
    render: function(){
        /*var fileTabs = (<Tab>untitled</Tab>);
        var fileContents = (<TabPanel></TabPanel>);
        var selIdx = -1;
        if (this.state.tabs.length > 0) {
            fileTabs = this.state.tabs.map(function(tabFile, tabIdx) {
                if (tabFile.selected) {
                    //assert(selIdx === -1);
                    selIdx = tabIdx;
                }
                return (<Tab>tabFile.name</Tab>);
            });
            fileContents = this.state.tabs.map(function(tabFile) {
                return (<TabPanel>tabFile.content</TabPanel>);
            });
        }
        var rootLabel = '';
         is it dfs to the treeview nodes??
        var childrenTreeView;
        if (this.state.treeNodes.length > 0) {
            var root = this.state.treeNodes[0];
            rootLabel = root.name;
            childrenTreeView = renderTreeChildren(root.children);
        }*/
        return (
            <div>
                <TabWidget Tabs={this.state.tabs} activeIndex={this.state.activeTabIndex} />
                <TreeView onClick= {this.handleFileClick.bind(this/*, fileNode*/)} data= {this.state.treeNodes} />
             </div>
               );
    }
});
React.render(<SaviourApp url='/project' />, document.getElementById('saviour-container'));
