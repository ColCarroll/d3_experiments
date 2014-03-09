import random
from flask import Flask
from flask_jsonpify import jsonify
from sklearn import datasets

app = Flask(__name__)

@app.route('/data')
def random_data():
  colors = list("colin")
  data = [{
    "x": 20 * random.random(),
    "y": 20 * random.random(),
    "c": random.sample(colors, 1)[0],
    "size": random.randint(1, 5),
    "alpha": random.random(),
    }
    for _ in range(50)]

  return jsonify(data)

@app.route('/iris')
def iris_data():
    iris = datasets.load_iris()
    features = iris.feature_names
    return jsonify([dict(zip(features, j) + [("target", iris.target_names[iris.target[idx]])]) for idx, j in enumerate(iris.data)])

if __name__ == '__main__':
  app.run("127.0.0.1", port=5000, debug=True)
