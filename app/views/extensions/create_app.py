from flask import Flask
from os import getcwd, path


def create_app(app_config=None):
    templates_loc = path.join(getcwd(), 'templates')
    app = Flask(__name__, instance_relative_config=False, template_folder=templates_loc)

    if app_config is None:
        return None

    app.config.from_object(app_config)

    return app
