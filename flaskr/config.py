import os

class Config:
    ROBOFLOW_API_KEY = os.getenv("ROBOFLOW_API_KEY", "5HmOkT6MocgLS0cj2L9N")
    ROBOFLOW_PROJECT_ID = os.getenv("ROBOFLOW_PROJECT_ID", "teeth-segmentation-qbm71-keaeh")
    ROBOFLOW_MODEL_VERSION = os.getenv("ROBOFLOW_MODEL_VERSION", "1")
    YOLO_MODEL_PATH = os.getenv("YOLO_MODEL_PATH", "models/best.pt")
    SEG_MODEL_PATH = os.getenv("SEG_MODEL_PATH", "models/best_seg.pt")
    PORT = os.getenv("PORT", 5123)
    