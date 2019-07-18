# -*- coding: utf-8 -*-
import os
from klog import app, db_sqlite
import unittest
from datetime import datetime
import tempfile
class KlogTestCase(unittest.TestCase):
    def setUp(self):
        app.config.from_object('klog.conf.TestConf')
        self.db_fd, app.config['DATABASE'] = tempfile.mkstemp()
        self.app = app.test_client()
        db_sqlite.init_db()

    def tearDown(self):
        os.close(self.db_fd)
        os.unlink(app.config['DATABASE'])

    def testEmptyDB(self):
        rv = self.app.get('/')
        assert 'No entries here so far' in rv.data

    def login(self, username, password):
        return self.app.post('/login', data=dict(
            username=username,
            password=password
            ), follow_redirects=True)

    def logout(self):
        return self.app.get('/logout', follow_redirects=True)

    def testLoginout(self):
        rv = self.login('admin', '')
        assert 'You are logged in' in rv.data
        rv = self.logout()
        assert 'You are logged out' in rv.data
        rv = self.login('adminx', '')
        assert 'Invalid username' in rv.data
        rv = self.login('admin', 'defaultx')
        assert 'Invalid password' in rv.data

    def test_messages(self):
        self.login('admin', '')
        rv = self.app.post('/admin-post', data=dict(
            post_title='<Hello>',
            post_body ='<strong>HTML</strong> allowed here',
            tags='abc'
        ), follow_redirects=True)
        assert 'No entries here so far' not in rv.data
        assert '&lt;Hello&gt;' in rv.data
        assert '<strong>HTML</strong> allowed here' in rv.data

        rv = self.app.post('/update-post/1', data=dict(
            post_title='<Hello>',
            post_body = '<strong>HTML</strong> not allowed',
            tags='def'
            ), follow_redirects=True)
        assert '<strong>HTML</strong> allowed here' not in rv.data
        assert '<strong>HTML</strong> not allowed' in rv.data
        assert "tags: \n\t\ta,\n\t      \n\t\tb,\n\t      \n\t\tc," not in rv.data
        assert "tags: \n\t\td,\n\t      \n\t\te,\n\t      \n\t\tf," in rv.data

        self.app.post('/admin-post', data=dict(
            post_title='<World>',
            post_body='what\'s the time',
            tags='ghi'
            ), follow_redirects=True)
        rv = self.app.post('/delete-post/1',
                 follow_redirects=True)
        #assert 'No entries here so far' in rv.data
        assert "what's the time" in rv.data
        assert "<strong>HTML</strong> not allowed" not in rv.data

if __name__ == '__main__':
    unittest.main()
