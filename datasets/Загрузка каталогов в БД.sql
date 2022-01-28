create view sportsFacility as select object_id as id, object_name as name
from "Objects"
group by id, name;

create view departmentalAffiliation as select organization_id as id, organization_name as name
from "Objects"
group by id, name;

create view sportsZonesList as select zones_name_id as id, zones_name as name
from "Objects"
group by id, name;

create view sportsZonesTypes as select zones_type_id as id, zones_type as name
from "Objects"
group by id, name;

create view sportsServices as select sport_type_id as id, sport_type as name
from "Objects"
group by id, name;

create view availability as select availability_id as id, availability_name as name
from "Objects"
group by id, name;