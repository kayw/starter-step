import React, { Component, PropTypes } from 'react';
import { FlatButton, Toolbar, IconButton, Dialog, TextField } from 'material-ui';
import cssifyModules from 'react-css-modules';
import PageContainer from './page-container';
const styles = require('./gulink-container.css');

@cssifyModules(styles, { allowMultiple: true })
export default class GuLinkContainer extends Component {
  static propTypes = {
    category: PropTypes.string.isRequired,
    creator: PropTypes.func.isRequired,
    modify: PropTypes.func.isRequired,
    deleter: PropTypes.func.isRequired,
    reload: PropTypes.func,
    gulinks: PropTypes.object
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      openDialog: false,
      linksBundle: [''],
      selectedIndex: -1
    };
  }
  handleLinkAdd() {
    this.setState({ openDialog: true });
  }

  handleLinkRemove(i) {
    const {category, gulinks} = this.props;
    if (gulinks.size > 0) {
      this.props.deleter(i, gulinks.get(i).get('_id'), category);
    }
  }

  handleLinkModify() {
    this.setState({ openDialog: true });
  }

  handleBackendReload(gulink) {
    this.props.reload(this.props.category, gulink.name);
  }

  handleDialogCancel() {
    this.setState({ openDialog: false, selectedIndex: -1, linksBundle: [''] });
  }
  handleDialogSubmit() {
    const { category, gulinks } = this.props;
    const links = [];
    this.state.linksBundle.forEach((lb) => {
      if (!!lb && lb.slice(0, 4) !== 'http') {
        links.push('https://' + lb);
      } else {
        links.push(lb);
      }
    });
    if (this.state.selectedIndex < 0) {
      const cursor = gulinks.size > 0 ? gulinks.get(gulinks.size - 1).get('cursor') + 1 : 0;
      const gulink = {
        category: category,
        [category]: {
          _id: `${category}${cursor}`,
          cursor,
          name: this.refs.name_field.getValue(),
          links,
          source: this.refs.from_field.getValue()
        }
      };
      this.props.creator(gulink);
    } else {
      const gulink = {
        category: category,
        [category]: {
          _id: gulinks.get(this.state.selectedIndex).get('_id'),
          name: this.refs.name_field.getValue(),
          links,
          source: this.refs.from_field.getValue()
        }
      };
      this.props.modify(this.state.selectedIndex, gulink);
    }
    this.setState({ openDialog: false, selectedIndex: -1, linksBundle: [''] });
  }

  handleMouseEnter(gulink, index) {
    this.setState({ ...this.state, selectedIndex: index, linksBundle: gulink.links || [''] });
  }
  handleMouseLeave() {
    if (!this.refs.gulinkDialog.isOpen()) {
      this.setState({ ...this.state, selectedIndex: -1, linksBundle: [''] });
    }
  }
  handleLinkBundleChange(ev, idx) {
    this.state.linksBundle[idx] = ev.target.value;
    this.setState(this.state);
  }
  handleLinkBundleRemove(idx) {
    this.state.linksBundle.splice(idx, 2);
    this.setState(this.state);
  }
  handleLinkBundleAdd() {
    this.state.linksBundle.push('', '');
    this.setState(this.state);
  }
  render() {
    const { category } = this.props;
    const gulinks = this.props.gulinks.toJS();
    const currGulink = (this.state.selectedIndex !== -1 && gulinks.length > 0)
      ? gulinks[this.state.selectedIndex] : {};
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
            <IconButton iconClassName="md-add-box" onTouchTap={e => this.handleLinkAdd(e)} />
            <span className={styles['icon-button-text']}>添加书签</span>
        </Toolbar>
        <ul className={styles.gulinks}>
        {
          gulinks.map((gulink, i) => {
            const focused = i === this.state.selectedIndex;
            return (<li className={styles.gulink + (focused ? ' ' + styles['nav-focus'] : '')} key={gulink._id}
                    onMouseEnter={() => this.handleMouseEnter(gulink, i)} onMouseLeave={ () => this.handleMouseLeave() }>
                    <h3 className={styles['gulink-name'] + ' ' + styles[category] }>{gulink.name}</h3>
                    {gulink.source && <span className={styles.from}>from</span>}
                    {gulink.source && <span className={styles.source}>{' ' + gulink.source}</span>}
                    <div className={ styles['gulink-actions'] }>
                      <span className={ styles['gulink-action'] } onClick={ () => this.handleLinkModify() }><i className="md-mode-edit"></i></span>
                      { this.props.reload && <span className={ styles['gulink-action'] }
                        onClick={ () => this.handleBackendReload(gulink) }><i className="md-sync"></i></span> }
                      <span className={ styles['gulink-action'] } onClick={ () => this.handleLinkRemove(i) }><i className="md-delete"></i></span>
                    </div>
                    <div>
                    {
                    gulink.links.map(
                      (link, idx) =>
                      <p key={'g' + idx} className={styles['short-desc']}><a href={link}>{link}</a></p>)
                    }
                    </div>
                    </li>);
          })
        }
        </ul>
        <Dialog
          ref="gulinkDialog"
          title="GuLink Setting Dialog"
          actions={gulinkActions}
          open={this.state.openDialog}
          autoDetectWindowHeight
          autoScrollBodyContent>
          <TextField key={2}
            floatingLabelText="name" ref="name_field" defaultValue={ currGulink.name } fullWidth/>
          <TextField key={3}
            hintText="from" ref="from_field" defaultValue={ currGulink.source } fullWidth/>
          {
          this.state.linksBundle.map((lb, idx) => {
            if (idx & 1) { // it's odd
              return null;
            }
            const oddlb = this.state.linksBundle[idx + 1];
            return (<div key={ 4 + idx }>
              <div className={ styles['url-input'] }>
                <TextField floatingLabelText="url" value={ lb } onChange={ (ev) => this.handleLinkBundleChange(ev, idx) } />
              </div>
              <div className={ styles['url-input'] }>
                <TextField value={ oddlb } onChange={ (ev) => this.handleLinkBundleChange(ev, idx + 1) } />
              </div>
              { idx !== 0 && <span className={ styles['url-action'] } onClick={ () => this.handleLinkBundleRemove(idx) }><i className="md-remove"></i></span> }
              <span className={ styles['url-action'] } onClick={ () => this.handleLinkBundleAdd() }><i className="md-add"></i></span>
            </div>);
          })
          }
        </Dialog>
      </PageContainer>
    );
  }
}
