import requests

url = 'http://127.0.0.1:5000/segment2'
image_path = '2.jpg'

with open(image_path, 'rb') as img_file:
    files = {'image': img_file}
    response = requests.post(url, files=files)

print(response)