
create table userEikenLevel(
userAddress varchar(256) not null, 
levelId bigint,
questionType varchar(32),
primary key(userAddress , levelId , questionType )
);
