from flask import Blueprint, request, send_file

from .extensions import get_locations, get_point_information,\
    get_municipality_info, get_empty_zones, get_point_shape_archive, \
    get_empty_zones_archive, get_catalog, get_rectangle_information, \
    get_rectangle_shape_archive, get_plots, get_recommendations_ml

node = Blueprint('node', __name__)


@node.route('/api/catalog', methods=['GET'])
def api_catalog():
    """
    route для получения фильтров
    Подрробнее о фильтрах в ./extensions/rest_logic/filtering.py
    :return: json с фильтрами
    """
    return get_catalog()


@node.route('/api/locations', methods=['POST'])
def api_locations():
    """
    route для получения точек с информацией о них для нанесения на карту
    :return: json с точками и информациями о них
    """
    return get_locations(request.get_json(force=True, silent=True))


@node.route('/api/municipalityInfo', methods=['GET'])
def api_municipality_info():
    """
    route для получения полигонов для отрисовки слоя плотности населения Москвы
    :return: json с полигонами и необходимой информацией
    """
    return get_municipality_info()


@node.route('/api/pointInfo', methods=['POST'])
def api_point():
    """
    route для получения полигона для отрисовки аналитики по любой точке на карте
    :return: json с полигоном с необходимой информацией
    """
    return get_point_information(request.get_json(force=True, silent=True))


@node.route('/api/pointInfoFile', methods=['POST'])
def api_point_file():
    """
    route для получения полигона с аналитикой по точке в shp формате
    :return: zip архив с файлами по стандарту ESRI Shapefile
    """
    return send_file(
        get_point_shape_archive(request.get_json(force=True, silent=True)),
        as_attachment=True,
        attachment_filename='shape.zip',
        mimetype='application/zip'
    )


@node.route('/api/emptyZones', methods=['POST'])
def api_empty_zones():
    """
    route для получения мультиполигона с аналитикой по пустым зонам
    :return: json с мультиполигоном с необходимой информацией
    """
    return get_empty_zones(request.get_json(force=True, silent=True))


@node.route('/api/emptyZonesFile', methods=['POST'])
def api_empty_zones_file():
    """
    route для получения мультиполигона с аналитикой по пустым зонам в shp формате
    :return: zip архив с файлами по стандарту ESRI Shapefile
    """
    return send_file(
        get_empty_zones_archive(request.get_json(force=True, silent=True)),
        as_attachment=True,
        attachment_filename='shape.zip',
        mimetype='application/zip'
    )


@node.route('/api/rectangleInfo', methods=['POST'])
def api_rectangle():
    """
    route для получения полигона с аналитикой по области
    :return: json с полигоном и необходимой информацией
    """
    return get_rectangle_information(request.get_json(force=True, silent=True))


@node.route('/api/rectangleInfoFile', methods=['POST'])
def api_rectangle_file():
    """
    route для получения полигона с аналитикой по области в shp формате
    :return: zip архив с файлами по стандарту ESRI Shapefile
    """
    return send_file(
        get_rectangle_shape_archive(request.get_json(force=True, silent=True)),
        as_attachment=True,
        attachment_filename='shape.zip',
        mimetype='application/zip'
    )


@node.route('/api/plots', methods=['GET'])
def api_plots():
    """
    route для дашборда
    :return: json с plotly графиками с аналитикой
    """
    return get_plots()


@node.route('/api/recommendsMlSystem', methods=['GET'])
def api_recommends_ml_system():
    """
    route для получения полигона, полученного из обученной модели.
    Модель выделяет область для потенциального построения в ней спортивных объектов.

    Более подробно о процессе получения данного полигона и использовании алгоритма
    машинного обучения можно почитать в app/machine_learning/model.html
    :return: json с полигоном
    """
    return get_recommendations_ml()
