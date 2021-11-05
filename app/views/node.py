from flask import Blueprint, request, send_file

from .extensions import generate_resp, get_catalog, get_locations, get_point_information,\
    get_point_shape_archive

node = Blueprint('node', __name__)


@node.route('/api/version', methods=['GET'])
def api_version():
    resp = {
        'version': '2.0.0',
        'server_status': 'working'
    }
    return generate_resp('ok', 'Success', resp)


@node.route('/api/catalog', methods=['GET'])
def api_catalog():
    return get_catalog()


@node.route('/api/locations/<string:uid>', methods=['POST'])
def api_locations(uid):
    return get_locations(request.get_json(force=True, silent=True), uid)


@node.route('/api/pointInfo/<string:uid>', methods=['POST'])
def api_point(uid):
    return get_point_information(request.get_json(force=True, silent=True), uid)


@node.route('/api/pointInfoFile/<string:uid>', methods=['POST'])
def api_point_file(uid):
    return send_file(
        get_point_shape_archive(request.get_json(force=True, silent=True), uid),
        as_attachment=True,
        attachment_filename='shape.zip',
        mimetype='application/zip'
    )
