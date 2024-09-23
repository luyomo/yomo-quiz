
create table eikenHistory(
id bigint primary key auto_increment, 
userAddress varchar(256) not null,
eikenWordID bigint,
answer bool,
timeTaken bigint,
createTS timestamp
);
