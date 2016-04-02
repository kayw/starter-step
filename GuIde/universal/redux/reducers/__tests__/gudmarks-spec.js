import { expect } from 'chai';
import { techcuz, techcuzActionType } from '../gudmarks';
import { fromJS, Map as immutifyMap, List as listify } from 'immutable';

// http://redux.js.org/docs/recipes/WritingTests.html
describe('gudmark reducer', () => {
  it('MOVE should update order', () => {
    const beforeMoveState = fromJS({
      loaded: false,
      gulinks: [{
        _id: '11',
        order: 1,
        links: [],
        source: 'react',
        name: 'reactjs'
      }, {
        _id: '22',
        order: 2,
        links: [],
        source: 'angular',
        name: 'angular.js'
      }, {
        _id: '33',
        order: 3,
        links: [],
        source: 'ember',
        name: 'ember.js'
      }]
    });
    const action = {
      type: techcuzActionType.MOVE,
      data: {
        originIndex: 1,
        atIndex: 2
      }
    };
    const gulinks = techcuz(beforeMoveState, action).get('gulinks');
    console.log(gulinks.toJS())
    expect(gulinks.get(2).get('order')).to.equal(3);
    expect(gulinks.get(2).get('name')).to.equal('angular.js');
  });
});
