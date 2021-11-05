from .views import node
from flask import Flask

from app.views.extensions import preprocessing


def create_main_app(app_config=None):
    if app_config is None:
        return None

    app = Flask(__name__, instance_relative_config=False)
    app.config.from_object(app_config)

    app.register_blueprint(node)
    preprocessing()

    return app

