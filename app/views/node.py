from flask import Blueprint, request

from .extensions import generate_resp, get_catalog, generate_locations, get_polygons, generate_circles

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


@node.route('/api/locations', methods=['POST'])
def api_locations():
    return generate_locations(request.get_json(force=True, silent=True))


@node.route('/api/population', methods=['GET'])
def api_population():
    return get_polygons()


@node.route('/api/circles', methods=['POST'])
def api_circles():
    return generate_circles(request.get_json(force=True, silent=True))
