create table if not exists posts (
	id integer primary key autoincrement,
	title stri not null,
	body string not null,
	pub_time timestamp not null,
	update_time timestamp not null
)
