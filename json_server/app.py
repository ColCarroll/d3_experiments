import random
from flask import Flask, Response
from flask_jsonpify import jsonify
import json

app = Flask(__name__)

@app.route('/data')
def random_data():
  colors = ["red", "green", "blue"]
  colors = list("abcdefghijklmnopqrstuv")
  data = [{
    "x": 10 * random.random(),
    "y": 10 * random.random(),
    "c": random.sample(colors, 1)[0],
    "size": random.randint(1, 5),
    "alpha": random.random(),
    }
    for _ in range(500)]

  return jsonify(data)

if __name__ == '__main__':
  app.run("127.0.0.1", port=5000, debug=True)
