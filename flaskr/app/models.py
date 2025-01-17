from roboflow import Roboflow
from ultralytics import YOLO

def load_models(app):
    app.yolo_model = YOLO(app.config['YOLO_MODEL_PATH'])
    app.seg_model = YOLO(app.config['SEG_MODEL_PATH'])

    rf = Roboflow(api_key=app.config['ROBOFLOW_API_KEY'])
    project = rf.workspace().project(app.config['ROBOFLOW_PROJECT_ID'])
    app.roboflow_model = project.version(app.config['ROBOFLOW_MODEL_VERSION']).model

    rf2 = Roboflow(api_key="5HmOkT6MocgLS0cj2L9N")
    project2 = rf2.workspace().project("teeth-segmentation-ffgh6")
    model2 = project2.version(1).model
    app.robo2_model = model2