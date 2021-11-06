def filtering_objects(form):

    name_to_id = {
        'sportsFacility': 'object_id',
        'departmentalAffiliation': 'organization_id',
        'sportsZonesList': 'zones_name_id',
        'sportsZonesTypes': 'zones_type_id',
        'sportsServices': 'sport_type_id',
        'availability': 'availability_id'
    }

    statements = []

    if form:
        for name in name_to_id.keys():
            if form.get(name):
                statements.append(
                    '{} in {}'.format(
                        name_to_id.get(name), '({})'.format(', '.join(str(val) for val in form.get(name)))
                    )
                )

    filters = ' and '.join(statements)
    return filters
