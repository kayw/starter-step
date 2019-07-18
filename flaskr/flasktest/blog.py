from __future__ import with_statement
from flask import Flask, request, session, g, redirect, url_for,\
        abort, render_template, flash
from contextlib import closing
import sqlite3
from datetime import datetime

#configuration
DATABASE='blog.db'
DEBUG=True
SECRET_KEY='\xe0\x80p|I\x0b\xd9\xff\x03\xc1\xff}\x95\x05\x96\x17\x1f\x06\xb1\xb3'
USERNAME='admin'
PASSWORD='default'
TRAP_BAD_REQUEST_ERRORS=True

app = Flask(__name__)
app.config.from_object(__name__)

def init_db():
    with closing(connect_db()) as db:
        with app.open_resource('schema.sql') as f:
            db.cursor().executescript(f.read())
        db.commit()

def connect_db():
    return sqlite3.connect(app.config['DATABASE'])

@app.before_request
def before_request():
    g.db = connect_db()

@app.teardown_request
def teardown_request(exception):
    g.db.close()

@app.route('/')
def show_posts():
    show_posts_sql = 'select title,body,pub_time,update_time from posts order by id desc'
    cur = g.db.execute(show_posts_sql)
    posts = [dict(title = row[0], body = row[1], pub_time = row[2], update_time = row[3])
            for row in cur.fetchall()]
    return render_template('show_posts.html', posts = posts)

@app.route('/add', methods=['POST'])
def add_posts():
    if not session.get('logged_in'):
        abort(401)
    insert_posts_sql = 'insert into posts (title, body, pub_time, update_time) values (?,?,?,?)'
    pub_time = datetime.now()
    update_time = datetime.now()
    g.db.execute(insert_posts_sql, [request.form['title'], request.form['body'],pub_time,update_time])
    g.db.commit()
    flash('New Post was successfully posted')
    return redirect(url_for('show_posts') )

@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        if request.form['username'] != app.config['USERNAME']:
            error = 'Invalid username'
        elif request.form['password'] != app.config['PASSWORD']:
            error = 'Invalid password'
        else:
            session['logged_in'] = True
            flash('You were logged in')
            return redirect(url_for('show_posts'))
    return render_template('login.html', error = error)

@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    flash('You were logged out')
    return redirect(url_for('show_posts') )

if __name__ == '__main__':
    init_db()
    app.run(debug = True)
