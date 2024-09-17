CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author TEXT,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    likes INTEGER DEFAULT 0
);

insert into blogs (author, url, title) values ('Kevin Cullen', 'www.kevin.com', 'test blog 1');
insert into blogs (author, url, title) values ('Kevin Cullen', 'www.kevin.com', 'test blog 2');

