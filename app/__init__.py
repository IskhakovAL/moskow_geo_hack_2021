from .views import node
from flask import Flask


def create_main_app(app_config=None):
    """
    Функция для создания объекта приложения
    :param app_config: конфиг для запуска приложения
    :return: объект созданного приложения
    """
    if app_config is None:
        return None

    app = Flask(__name__, instance_relative_config=False)
    app.config.from_object(app_config)

    app.register_blueprint(node)

    return app

