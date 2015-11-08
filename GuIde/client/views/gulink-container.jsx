import React, { Component, PropTypes } from 'react';
import { FlatButton, Toolbar, ToolbarGroup, IconButton, Dialog, TextField } from 'material-ui';
import cssifyModules from 'react-css-modules';
import PageContainer from './page-container';
const styles = require('./gulink-container.css');

@cssifyModules(styles, { allowMultiple: true })
export default class GuLinkContainer extends Component {
  static propTypes = {
    category: PropTypes.string,
    gulinks: PropTypes.object,
    selectedIndex: PropTypes.number,
    select: PropTypes.func,
    creator: PropTypes.func,
    deleter: PropTypes.func
  }

  handleLinkAdd() {
    this.refs.gulinkDialog.show();
  }

  handleLinkRemove() {
    const {category, selectedIndex, gulinks} = this.props;
    if (selectedIndex >= 0 && gulinks.size > 0) {
      this.props.deleter(selectedIndex, gulinks.get(selectedIndex).get('_id'), category);
    }
  }

  handleDialogCancel() {
    this.refs.gulinkDialog.dismiss();
  }
  handleDialogSubmit() {
    const { category, gulinks } = this.props;
    const cursor = gulinks.size > 0 ? gulinks.get(gulinks.size - 1).get('cursor') + 1 : 0;
    const gulink = {
      category: category,
      [category]: {
        _id: `${category}${cursor}`,
        cursor,
        name: this.refs.name_field.getValue(),
        link: this.refs.url_field.getValue(),
        source: this.refs.from_field.getValue()
      }
    };
    this.props.creator(gulink);
    this.refs.gulinkDialog.dismiss();
  }

  handleMouseEnter(index) {
    this.props.select(index);
  }
  render() {
    const { category, selectedIndex } = this.props;
    const gulinks = this.props.gulinks.toJS();
    const gulinkActions = [
      <FlatButton label="Cancel" key={0} secondary
      onTouchTap={::this.handleDialogCancel} />,
      <FlatButton label="Submit" key={1} primary
      onTouchTap={::this.handleDialogSubmit} />
    ];

    // https://github.com/gajus/react-css-modules/issues/50
    return (
      <PageContainer>
        <Toolbar>
          <ToolbarGroup float="left">
            <IconButton iconClassName="md-add-box" tooltip="add" tooltipPosition="bottom-left" onTouchTap={e => this.handleLinkAdd(e)}/>
            <IconButton iconClassName="md-delete" tooltip="remove" tooltipPosition="bottom-left" onTouchTap={e => this.handleLinkRemove(e)}/>
          </ToolbarGroup>
        </Toolbar>
        <ul className={styles.gulinks}>
        {
          gulinks.map((gulink, i) => {
            const focused = (i === selectedIndex);
            return (<li className={styles.gulink + (focused ? ' ' + styles['nav-focus'] : '')} key={gulink._id} onMouseEnter={ () => this.handleMouseEnter(i)}>
                    <h3 className={styles['gulink-name'] + ' ' + styles[category] }>{gulink.name}</h3>
                    {gulink.source && <span className={styles.from}>from</span>}
                    {gulink.source && <span className={styles.source}>{' ' + gulink.source}</span>}
                    <p className={styles['short-desc']}><a href={gulink.link}>{gulink.link}</a></p>
                    </li>);
          })
        }
        </ul>
        <Dialog
          ref="gulinkDialog"
          title="GuLink Setting Dialog"
          actions={gulinkActions}
          autoDetectWindowHeight
          autoScrollBodyContent>
          <TextField key={2}
            floatingLabelText="name" ref="name_field" fullWidth/>
          <TextField key={3}
            floatingLabelText="url" ref="url_field" fullWidth/>
          <TextField key={4}
            hintText="from" ref="from_field" fullWidth/>
        </Dialog>
      </PageContainer>
    );
  }
}
