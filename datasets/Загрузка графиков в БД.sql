create view plot1 as
select availability_name, count(distinct latitude)
from "Objects" o
group by availability_name;

create view plot2 as
select "NAME_AO", sum(people)
from "Moscow" m
group by "NAME_AO";

create view plot3 as
select zones_type, count(latitude) as cnt
from (
  select zones_type, latitude
  from "Objects" o
  group by zones_type, latitude
) as a
where zones_type <> 'Неизвестно'
group by zones_type
order by cnt desc
limit 13;

create view plot4 as
select sport_type, count(latitude) as cnt
from (
  select sport_type, latitude
  from "Objects" o
  group by sport_type, latitude
) as a
where sport_type <> 'Неизвестно'
group by sport_type
order by cnt desc
limit 13;

create view plot5 as
select sport_type, avg(area) as med
from (
  select sport_type, latitude, area
  from "Objects" o
  group by sport_type, latitude, area
) as a
where sport_type <> 'Неизвестно'
group by sport_type
order by med desc
limit 13;

create view plot6 as
select zones_type, avg(area) as med
from (
  select zones_type, latitude, area
  from "Objects" o
  group by zones_type, latitude, area
) as a
where zones_type <> 'Неизвестно'
group by zones_type
order by med desc
limit 13;