
create table eikenWords(
id bigint auto_increment primary key,
seq bigint,
levelID int not null,
enWord varchar(256) not null, 
jpWord varchar(256) not null,
enExample text,
jpExample text);
