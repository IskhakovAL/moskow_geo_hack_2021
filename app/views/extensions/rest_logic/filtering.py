def filtering_objects(form):
    """
    Функция для создания запроса фильтрации данных по 6 основным фильтрам при выполнении аналитики
    и наложении слоев
    :param form: форма из POST запроса с 6 основными фильтрами
    :return: часть SQL-запроса для фильтрации данных, либо пустую строку
    """

    name_to_id = {
        # наименование спортивного объекта
        'sportsFacility': 'object_id',
        # ведомственная принадлежность
        'departmentalAffiliation': 'organization_id',
        # перечень спортивных зон
        'sportsZonesList': 'zones_name_id',
        # тип спортивных зон (крытые спортивные зоны, открытые спортивные зоны,
        # бассейны)
        'sportsZonesTypes': 'zones_type_id',
        # вид спортивных услуг
        'sportsServices': 'sport_type_id',
        # доступность
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
