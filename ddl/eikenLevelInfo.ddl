
create table eikenLevelInfo(
  id int AUTO_INCREMENT primary key, 
  category varchar(256) not null,
  level varchar(16) not null, 
  section varchar(64) not null,
  subLevel varchar(16) not null,
  display varchar(256),
  comment varchar(256)
);
