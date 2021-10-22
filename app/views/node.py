from flask import Blueprint, render_template, request

from .extensions import generate_resp, generate_main_map, get_catalog, generate_locations

node = Blueprint('node', __name__)


@node.route('/api/version', methods=['GET'])
def api_version():
    resp = {
        'version': '2.0.0',
        'server_status': 'working'
    }
    return generate_resp('ok', 'Success', resp)


@node.route('/api/map', methods=['POST'])
def api_map():
    return generate_main_map(request.form)._repr_html_()


@node.route('/api/catalog', methods=['GET'])
def api_catalog():
    return get_catalog()


@node.route('/api/locations', methods=['POST'])
def api_locations():
    return generate_locations(request.form)
