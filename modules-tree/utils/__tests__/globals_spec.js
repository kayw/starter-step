'use strict';

jest.dontMock('../globals.js');
describe('GlobalUtils', function() {
    describe('EnumerateFileCallback', function() {

        beforeEach(function() {
            //var MOCK_FILE_INFO = {
            //    '/path/to/file1.js': {
            //        type: 'file',
            //        content: 'console.log("file1 contents");'
            //    },

            //    '/path/to/file2.txt': {
            //        type: 'file',
            //        content: "file2 contents"
            //    },
            //    'f1': {
            //        type: 'file',
            //        content: ''
            //    },
            //    'd1': {
            //        type: 'directory',
            //        content: ''
            //    },
            //    'f3.js': {
            //        type: 'file',
            //        content: ''
            //    },
            //    'd2': {
            //        type: 'direcotry',
            //        content: ''
            //    }
            //};
            // Set up some mocked out file info before each test
            //require('fs').__setMockFiles(MOCK_FILE_INFO);
            // fixme: jest 0.45 manual mocks not work on nodejs 0.10
            // https://github.com/facebook/jest/issues/375
        });

        it('includes all files in the directory in the summary', function() {
            var g = require('../globals.js');
            var files = [ 'public', 'gulpfile.js', 'bower_components', 'package.json'];
            var fileNodes = [];
            g.onFileEnumerated(null, files, '.', fileNodes);
            expect(fileNodes[1].name).toEqual('public');
        });
    });
});
