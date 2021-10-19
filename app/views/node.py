from flask import Blueprint, render_template

from .extensions import generate_resp, generate_main_map

node = Blueprint('node', __name__)


@node.route('/api/version', methods=['GET'])
def api_version():
    resp = {
        'version': '2.0.0',
        'server_status': 'working'
    }
    return generate_resp('ok', 'Success', resp)


@node.route('/api/map', methods=['GET'])
def api_map():

    return render_template('index.html', map=generate_main_map()._repr_html_())
