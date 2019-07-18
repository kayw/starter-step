create table if not exists posts (
	post_id integer primary key autoincrement,
/*	post_name string not null,*/
	post_title stri not null,
	post_body string not null,
	post_pub_time timestamp not null,
	post_update_time timestamp not null,
	post_comment_count int
);

create table if not exists tags (
	tag_id integer primary key autoincrement,
	tag_name varchar(200)
);

create table if not exists post_to_tag (
	post_id not null,
	/*tag_id integer primary key,*/
	tag_id not null,
	FOREIGN KEY(post_id) REFERENCES posts(post_id),
	FOREIGN KEY(tag_id) REFERENCES tags(tag_id)
);

create table if not exists comments (
	comment_id integer primary key autoincrement,
	comment_post_id int,
	comment_author varchar(100) not null,
	comment_author_email varchar(25),
	comment_author_url varchar(100),
	comment_content text not null,
	comment_date timestamp not null,
	comment_parent_id int,
	foreign key(comment_post_id) references posts
);
