# -*- coding: utf-8 -*-
from flask import render_template, request, session, redirect,\
        url_for, abort, flash
from datetime import datetime
from klog import app
#import model
if app.config['DEBUG'] == True:
    from db_sqlite import *

@app.route('/')
def show_posts():
#    show_posts_sql = 'select title,body,pub_time,update_time from posts order by id desc'
#    cur = g.db.execute(show_posts_sql)
#    posts = [dict(title = row[0], body = row[1], pub_time = row[2], update_time = row[3])
#            for row in cur.fetchall()]
    #TODO: per page max num, js autoscroll
    init_db()
    posts = get_all_posts()
    return render_template('show_posts.html', posts = posts)

#@app.route('/admin-post')
#def admin_post():
#    if not session.get('logged_in'):
#        return render_template('login.html')
#    return render_template('admin_post.html')
#
#@app.route('/add', methods=['POST'])
#def add_post():
#    if not session.get('logged_in'):
#        abort(401)
##    insert_posts_sql = 'insert into posts (title, body, pub_time, update_time) values (?,?,?,?)'
##    pub_time = datetime.now()
##    update_time = datetime.now()
##    g.db.execute(insert_posts_sql, [request.form['title'], request.form['body'],pub_time,update_time])
##    g.db.commit()
#    insert_post(request.form)
#    flash('New Post was successfully posted')
#    return redirect(url_for('show_posts') )

#@app.route('/update-post')
#def update_post(post_id):
#    if not session['logged_in']:
#        return render_template('login.html')
#    post = get_post_by_id(post_id)
#    return render_template('update_post.html', post = post)
#
#@app.route('/update', methods=['GET', 'POST'])
#def update(post_id):
#    if not session['logged_in']:
#        abort(401)
#    update_post_by_id(request.form, post_id)
#    flash('post %s was updated'% post)
#    return redirect(url_for('show_posts') )
@app.route('/admin-post', methods=['POST'])
def admin_post():
    if request.method == 'POST':
        if not session.get('logged_in'):
            abort(401)
        if insert_post(request.form):
            flash('New Post was successfully posted')
        #posts = get_all_posts()
        #return render_template('show_posts.html', posts = posts)
        return redirect(url_for('show_posts'))
    if not session.get('logged_in'):
        return render_template('login.html')
    #return render_template('admin_post.html', post=None)

@app.route('/update-post/<int:post_id>', methods=['GET', 'POST'])
def update_post(post_id):
    if not session['logged_in']:
        return render_template('login.html')
    if request.method == 'POST':
        update_post_by_id(request.form, post_id)
        #flash('post %s was updated' % post) # TODO
        #posts = get_all_posts()
        #return render_template('show_posts.html', posts = posts)
        return redirect(url_for('show_posts'))
    post = get_post_by_id(post_id)
    #return render_template('admin_post.html', post = post)
    return redirect(url_for('admin_post', post = post))
    
@app.route('/delete-post/<int:post_id>',methods=['POST'])
def delete_post(post_id):
    if not session['logged_in']:
        return render_template('login.html')
    delete_post_by_id(post_id)
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
            flash('You are logged in')
            return redirect(url_for('show_posts'))
    return render_template('login.html', error = error)

@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    flash('You are logged out')
    return redirect(url_for('show_posts') )
