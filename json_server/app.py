import random
from flask import Flask, jsonify, Response
import json

app = Flask(__name__)

@app.route('/data')
def random_data():
  colors = ["red", "green", "blue"]
  data = [{
    "x": 10 * random.random(),
    "y": 10 * random.random(),
    "c": random.sample(colors, 1)[0],
    "size": random.randint(1,5)
    }
    for _ in range(10)]

  return Response("JSON_CALLBACK({:s});".format(
    json.dumps(data)), mimetype='application/json')

if __name__ == '__main__':
  app.run("127.0.0.1", port=5000, debug=True)
