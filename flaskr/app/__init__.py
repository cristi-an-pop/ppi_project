from flask import Flask
from .routes import main
from .models import load_models

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')

    load_models(app)

    app.register_blueprint(main)

    return app