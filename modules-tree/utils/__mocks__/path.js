'use strict';
var pathMock = jest.genMockFromModule('path');
function resolve(d, f) {
    return d+ '/' + f;
};
function relative(d1, d2) {
};
pathMock.resolve.mockImplementation(resolve);
pathMock.relative.mockImplementation(relative);
module.exports = pathMock;
