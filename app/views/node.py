from flask import Blueprint, request, send_file

from .extensions import get_locations, get_point_information,\
    get_municipality_info, get_empty_zones, get_point_shape_archive, \
    get_empty_zones_archive, get_catalog, get_rectangle_information, \
    get_rectangle_shape_archive

node = Blueprint('node', __name__)


@node.route('/api/catalog', methods=['GET'])
def api_catalog():
    return get_catalog()


@node.route('/api/locations', methods=['POST'])
def api_locations():
    return get_locations(request.get_json(force=True, silent=True))


@node.route('/api/municipalityInfo', methods=['GET'])
def api_municipality_info():
    return get_municipality_info()


@node.route('/api/pointInfo', methods=['POST'])
def api_point():
    return get_point_information(request.get_json(force=True, silent=True))


@node.route('/api/pointInfoFile', methods=['POST'])
def api_point_file():
    return send_file(
        get_point_shape_archive(request.get_json(force=True, silent=True)),
        as_attachment=True,
        attachment_filename='shape.zip',
        mimetype='application/zip'
    )


@node.route('/api/emptyZones', methods=['POST'])
def api_empty_zones():
    return get_empty_zones(request.get_json(force=True, silent=True))


@node.route('/api/emptyZonesFile', methods=['POST'])
def api_empty_zones_file():
    return send_file(
        get_empty_zones_archive(request.get_json(force=True, silent=True)),
        as_attachment=True,
        attachment_filename='shape.zip',
        mimetype='application/zip'
    )


@node.route('/api/rectangleInfo', methods=['POST'])
def api_rectangle():
    return get_rectangle_information(request.get_json(force=True, silent=True))


@node.route('/api/rectangleInfoFile', methods=['POST'])
def api_rectangle_file():
    return send_file(
        get_rectangle_shape_archive(request.get_json(force=True, silent=True)),
        as_attachment=True,
        attachment_filename='shape.zip',
        mimetype='application/zip'
    )


# @node.route('/api/plots', methods=['GET'])
# def api_plots():
#     return get_plots()
