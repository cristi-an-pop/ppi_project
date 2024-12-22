from roboflow import Roboflow
from ultralytics import YOLO

def load_models(app):
    app.yolo_model = YOLO(app.config['YOLO_MODEL_PATH'])

    rf = Roboflow(api_key=app.config['ROBOFLOW_API_KEY'])
    project = rf.workspace().project(app.config['ROBOFLOW_PROJECT_ID'])
    app.roboflow_model = project.version(app.config['ROBOFLOW_MODEL_VERSION']).model