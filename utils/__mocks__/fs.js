'use strict';

//var fsMock = jest.genMockFromModule('fs');
var _mockedFileInfo = {};
function __setMockFiles(mockInfo) {
    _mockedFileInfo = mockInfo;
};

function statSync(path) {
    return {
        isDirectory: function() {
            if (path in _mockedFileInfo) {
                return _mockedFileInfo[path].type === 'directory';
            }
            return false;
        };
    }
};
//fsMock.statSync.mockImplementation(statSync);
//fsMock.__setMockFiles  = __setMockFiles;
//module.exports = fsMock;
exports.__setMockFiles = __setMockFiles;
exports.statSync = statSync;
