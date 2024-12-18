//nome do banco de dados é Tapioca

create table foods (
	id integer primary key,
	name varchar,
	price real
)

create table filing (
	id integer,
	id_food integer,
	name varchar,
	price real,
	primary key (id, id_food),
	foreign key (id_food) references foods (id)
)

create table sales (
	id serial primary key,
	id_food integer,
	cpf varchar,
	sale_date date,
	description varchar(100),
	price real,
	foreign key (id_food) references foods (id)
)

insert into foods values(1, 'tapioca', 3.50);
insert into foods values(2, 'cuzcuz', 4.50);
insert into foods values(3, 'sanduiche', 4.50);

insert into filing values(1, 1, 'queijo', 0.80);
insert into filing values(2, 1, 'presunto', 0.60);
insert into filing values(3, 1, 'carne', 1.50);
insert into filing values(4, 1, 'frango', 1.00);
insert into filings values(1, 2, 'queijo', 0.80);
insert into filings values(3, 2, 'carne', 1.50);
insert into filings values(1, 3, 'queijo', 0.80);

