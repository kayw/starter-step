import React, { Component, PropTypes } from 'react';
import update from 'react/lib/update';
import { FlatButton, Toolbar, IconButton, Dialog, TextField } from 'material-ui';
import cssifyModules from 'react-css-modules';
import { DragDropContext as dragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import GuLinkItem from './gulink-item';
const styles = require('./gulink-container.css');

@dragDropContext(HTML5Backend)
@cssifyModules(styles)
export default class GuLinkContainer extends Component {
  static propTypes = {
    category: PropTypes.string.isRequired,
    onCreate: PropTypes.func.isRequired,
    onModify: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onMove: PropTypes.func.isRequired,
    onReorder: PropTypes.func.isRequired,
    gulinks: PropTypes.object.isRequired,
    onReload: PropTypes.func
  }

  state = {
    openDialog: false,
    linksBundle: [''],
    selectedIndex: -1
  }
  handleLinkAdd = () => {
    this.setState({ openDialog: true });
  }

  handleLinkRemove = (i) => {
    const { category, gulinks } = this.props;
    if (gulinks.size > 0) {
      this.props.onDelete(i, gulinks.get(i).get('_id'), category);
    }
  }

  handleLinkModify = () => {
    this.setState({ openDialog: true });
  }

  handleDialogCancel = () => {
    this.setState({ openDialog: false, selectedIndex: -1, linksBundle: [''] });
  }
  handleDialogSubmit() {
    const { category, gulinks } = this.props;
    const links = [];
    this.state.linksBundle.forEach(lb => {
      if (!!lb && lb.slice(0, 4) !== 'http') {
        links.push(`https://${lb}`);
      } else {
        links.push(lb);
      }
    });
    if (this.state.selectedIndex < 0) {
      const gulink = {
        category,
        [category]: {
          _id: gulinks.size,
          name: this.refs.name_field.getValue(),
          links,
          source: this.refs.from_field.getValue()
        }
      };
      this.props.onCreate(gulink);
    } else {
      const gulink = {
        category,
        [category]: {
          _id: gulinks.get(this.state.selectedIndex).get('_id'),
          name: this.refs.name_field.getValue(),
          links,
          source: this.refs.from_field.getValue()
        }
      };
      this.props.onModify(this.state.selectedIndex, gulink);
    }
    this.setState({ openDialog: false, selectedIndex: -1, linksBundle: [''] });
  }

  handleMouseEnter = (gulink, index) => {
    this.setState({ selectedIndex: index, linksBundle: gulink.links || [''] });
  }
  handleMouseLeave = () => {
    if (!this.state.openDialog) {
      this.setState({ selectedIndex: -1, linksBundle: [''] });
    }
  }
  handleLinkBundleChange = (idx) => (ev) => {
    this.setState(update(this.state, {
      linksBundle: {
        [idx]: {
          $set: ev.target.value
        }
      }
    }));
  }
  handleLinkBundleRemove = (idx) => () => {
    this.setState(update(this.state, {
      linksBundle: {
        $splice: [
          [idx, 2]
        ]
      }
    }));
  }
  handleLinkBundleAdd = () => {
    this.setState(update(this.state, {
      linksBundle: {
        $push: ['', '']
      }
    }));
  }
  handleReorder = () => {
    /*
     * TODO cache previous order and only pass changed id orders
     * update in then
     */
    this.props.onReorder(this.props.category,
      this.props.gulinks.map(gulink => ({
        _id: gulink.get('_id'),
        order: gulink.get('order')
      })));
  }

  render() {
    const { category } = this.props;
    const gulinks = this.props.gulinks.toJS();
    const currGulink = (this.state.selectedIndex !== -1 && gulinks.length > 0)
      ? gulinks[this.state.selectedIndex] : {};
    const gulinkActions = [
      <FlatButton label="Cancel" key="fb1" secondary onTouchTap={this.handleDialogCancel} />,
      <FlatButton label="Submit" key="fb2" primary onTouchTap={::this.handleDialogSubmit} />
    ];

    // https://github.com/gajus/react-css-modules/issues/50
    return (
      <div>
        <Toolbar>
            <IconButton iconClassName="md-add-box" onTouchTap={ this.handleLinkAdd } />
            <span styleName="toolbar-text">添加书签</span>
        </Toolbar>
        <ul styleName="gulinks">
        {
          gulinks.map((gulink, i) => {
            const focused = i === this.state.selectedIndex;
            return (
              <GuLinkItem key={gulink._id} focused={focused} category={category} gulink={gulink}
                onHandleMouseEnter={this.handleMouseEnter}
                onHandleMouseLeave={this.handleMouseLeave}
                onHandleLinkModify={this.handleLinkModify}
                onHandleLinkRemove={this.handleLinkRemove}
                onReorder={this.handleReorder}
                onMove={this.props.onMove}
                onReload={this.props.onReload}
                index={i}
              />);
          })
        }
        </ul>
        <Dialog title="GuLink Setting Dialog" actions={gulinkActions}
          open={this.state.openDialog} autoDetectWindowHeight autoScrollBodyContent
        >
          <TextField key="dtf1" floatingLabelText="name" ref="name_field"
            defaultValue={currGulink.name} fullWidth
          />
          <TextField key="dtf2" hintText="from" ref="from_field"
            defaultValue={currGulink.source} fullWidth
          />
          {
          this.state.linksBundle.map((lb, idx) => {
            if (idx & 1) { // it's odd
              return null;
            }
            const oddlb = this.state.linksBundle[idx + 1];
            return (<div key={ 4 + idx }>
              <div styleName="url-input">
                <TextField floatingLabelText="url" value={lb}
                  onChange={this.handleLinkBundleChange(idx)}
                />
              </div>
              <div styleName="url-input">
                <TextField value={oddlb}
                  onChange={this.handleLinkBundleChange(idx + 1)}
                />
              </div>
              {
                idx !== 0 &&
                <span styleName="url-action" onClick={this.handleLinkBundleRemove(idx)}>
                  <i className="md-remove"></i>
                </span>
              }
              <span styleName="url-action" onClick={this.handleLinkBundleAdd}>
                <i className="md-add"></i>
              </span>
            </div>);
          })
          }
        </Dialog>
      </div>
    );
  }
}
