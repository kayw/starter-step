# -*- coding: utf-8 -*-
from __future__ import with_statement
import sqlite3
from flask import g
from fixed_offset_tz import FixedTimeZoneOffset
from datetime import datetime,timedelta
from contextlib import closing
from klog import app

TZCHINA = FixedTimeZoneOffset("China/Shanghai", timedelta(hours = 8))
def init_db():
    with closing(connect_db()) as db:
        with app.open_resource(app.config['SQLITE_SCHEMA']) as f:
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

def get_all_posts():
    show_posts_sql = 'select post_id,post_title,post_body,post_pub_time,\
            post_update_time from posts order by post_id desc'
    posts = query_db(show_posts_sql)
    for post in posts:
        #post.update(tags = get_tags_to_post(post.post_id))
        post['tags'] = get_tags_to_post(post['post_id'])
    return posts

def get_tags_to_post(post_id):
    get_tags_by_post_sql = 'select tag_name from tags as t, post_to_tag as\
            ptt where ptt.post_id = ? and ptt.tag_id = t.tag_id'
    cur = g.db.execute(get_tags_by_post_sql, (post_id,) )
    values = [value for row in cur.fetchall() for value in row] 
    return values

def insert_post(post):
    if not(post['post_title'] and post['post_body'] and post['tags']):
        return False
    insert_posts_sql = 'insert into posts (post_title, post_body,\
            post_pub_time, post_update_time) values (?,?,?,?)'
    pub_time = datetime.now(TZCHINA)
    update_time = datetime.now(TZCHINA)
    cursor = g.db.execute(insert_posts_sql, [post['post_title'], post['post_body'],\
            pub_time,update_time])
    last_post_id = cursor.lastrowid
    insert_tags(post['tags'], last_post_id)
    g.db.commit()
    #select max(id) from tags
    #select max(id) from posts
    return True

def insert_tags(tags, post_id):
    for tag in tags:
        insert_tag_sql = 'insert into tags (tag_name) values (?)'
        cursor = g.db.execute(insert_tag_sql, tag)
        last_tag_id = cursor.lastrowid
        insert_post_to_tag_sql = 'insert into post_to_tag (post_id, tag_id) values(?,?)'
        g.db.execute(insert_post_to_tag_sql, (post_id, last_tag_id))
        #g.db.commit()

def get_post_by_id(post_id):
    get_post_sql = 'select post_title, post_body, post_pub_time,\
            post_update_time from posts where post_id = (?)'
    post = query_db(get_post_sql, """*args =""" (post_id,), one = True)
    post.update(tags =  get_tags_to_post(post_id))

def update_post_by_id(post, post_id):
    post_update_time = datetime.now(TZCHINA)
    update_post_sql = 'update posts set post_title = (?), post_body = (?),\
            post_update_time = (?) where post_id = (?)'
    g.db.execute(update_post_sql, [post['post_title'], post['post_body'],\
            post_update_time, post_id])
    update_tags_to_post(post,post_id)
    g.db.commit()

def update_tags_to_post(post, post_id):
    """
    get_tagid_sql = 'select tag_id from post_to_tag where post_id = (?)'
    updat_tag_sql = 'update tags set tag_name = (?) where tag_id = (?)'
    delete_tagid_sql = 'delete tag_id from post_to_tag where'
    delete_tags_sql = 'delete tags from tags where tag_id = (?)'
    insert_tags(post['tags'], post.post_id)
    tags = get_all_tags(post_id)
    existed: none
    deleted: delete p2t
    added: inset to tags(not existed existed) inset to post_to_tag
    """
    tags = get_tags_to_post(post_id)
    need_delete = filter(lambda x : x not in post['tags'], tags)
                 #filter(set(post['tags']).__contains__, tags)
    new_add = filter(lambda x : x not in tags, post['tags'])
    for needdel in need_delete:
        get_tagid_sql = 'select tag_id from tags where tag_name = (?)'
        tagid = query_db(get_tagid_sql, (needdel,), one = True)
        delete_p2t_sql = 'delete from post_to_tag where tag_id = (?)'
        g.db.execute(delete_p2t_sql, (tagid['tag_id'],) )
    for na in new_add:
        insert_tags(na, post_id)
    
def delete_post_by_id(post_id):
    delete_post_sql = 'delete from posts where post_id = ?'
    g.db.execute(delete_post_sql, (post_id,) )
    delete_tag_to_post_sql = 'delete from post_to_tag where post_id = ?'
    g.db.execute(delete_tag_to_post_sql, (post_id,) )
    g.db.commit()

def query_db(query, args=(), one=False):
    cur = g.db.execute(query, args)
    rv = [dict((cur.description[idx][0], value)
        for idx, value in enumerate(row)) for row in cur.fetchall()]
    return (rv[0] if rv else None) if one else rv  # if else ternary operator
