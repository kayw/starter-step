import React from 'react';
import {
  renderIntoDocument, createRenderer, scryRenderedDOMComponentsWithTag,
  scryRenderedDOMComponentsWithClass, Simulate
} from 'react-addons-test-utils';
import { expect } from 'chai';
import { List as listify } from 'immutable';
import GulinkContainer from '../gulink-container';
const injectTapEventPlugin = require("react-tap-event-plugin")
injectTapEventPlugin()

// http://chaijs.com/api/bdd/
// http://sinonjs.org/

function shallowRender(component) {
  const renderer = createRenderer();
  renderer.render(component);
  return renderer.getRenderOutput();
}
describe('Gulink View', () => {
  let props_;
  let shallowRendered_;
  let rendered_;
  beforeEach(() => {
    props_ = {
      category: 'techcuz',
      onCreate: () => {},
      onModify: () => {},
      onDelete: () => {},
      onMove: () => {},
      onReorder: () => {},
      gulinks: listify([{
        _id: 'r',
        order: 1,
        name: 'react',
        links: listify([]),
      }, {
        _id: 'a',
        order: 2,
        name: 'angular',
        links: listify([]),
      }, {
        _id: 'e',
        order: 3,
        name: 'ember',
        links: listify([]),
      }])
    };
    shallowRendered_ = shallowRender(<GulinkContainer {...props_} />);
    rendered_ = renderIntoDocument(<GulinkContainer {...props_} />);
  });
  it('should have three links', () => {
    const LIs = scryRenderedDOMComponentsWithTag(rendered_, 'li');
    expect(LIs).to.have.lengthOf(3);
  });
  it('should selectIndex be 2 when enter second links', () => {
    const LIs = scryRenderedDOMComponentsWithTag(rendered_, 'li');
    Simulate.mouseEnter(LIs[1]);
    expect(rendered_.getDecoratedComponentInstance().state.selectedIndex).to.equal(1);
  });
  it('should selectIndex be -1 when leave second links', () => {
    const LIs = scryRenderedDOMComponentsWithTag(rendered_, 'li');
    Simulate.mouseLeave(LIs[1]);
    expect(rendered_.getDecoratedComponentInstance().state.selectedIndex).to.equal(-1);
  });
  it('should show dialog when add clicked', () => {
    const addBtn = scryRenderedDOMComponentsWithTag(rendered_, 'button')[0];
    // https://github.com/zilverline/react-tap-event-plugin/issues/10
    Simulate.touchTap(addBtn)
    console.log(rendered_.refs.child.state);
    expect(rendered_.getDecoratedComponentInstance().state.openDialog).to.be.true;
  });
});
