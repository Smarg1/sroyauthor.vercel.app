import flask

app = flask.Flask(__name__)

if __name__ == '__main__':
    app.run(debug=False,host='127.0.0.1',port=3000)