from .views import node

from app.views.extensions import preprocessing, create_app, generate_catalog, generate_polygons


def create_main_app(app_config=None):
    if app_config is None:
        return None

    app = create_app(app_config)

    app.register_blueprint(node)
    preprocessing()
    generate_catalog()
    generate_polygons()

    return app

