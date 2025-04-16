# Imports
import flask
from flask import request, send_from_directory, abort
from flask_compress import Compress
from werkzeug.middleware.proxy_fix import ProxyFix

# Config & Setup
app = flask.Flask(__name__, static_folder='static')
Compress(app)
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_port=1)
app.config.update(
    SESSION_COOKIE_SECURE=True,
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE='Lax',
    CACHE_TYPE='SimpleCache',
    CACHE_DEFAULT_TIMEOUT=60
)

# Serve Block
@app.before_request
def block_sensitive_files():
    forbidden_extensions = ('.git', '.env', '.bak', '.swp')
    forbidden_prefixes = ('.',)

    path = request.path.lower()
    if any(path.endswith(ext) for ext in forbidden_extensions) or any(path.lstrip('/').startswith(p) for p in forbidden_prefixes):
        abort(403)

@app.after_request
def set_headers(response):
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['Content-Security-Policy'] = "default-src 'self'; script-src 'self'; style-src 'self'; frame-ancestors 'none';"
    return response

@app.errorhandler(500)
def internal_server_error(e):
    return send_from_directory(app.static_folder, 'error/500.html'), 500

@app.errorhandler(403)
def forbidden(e):
    return send_from_directory(app.static_folder, 'error/403.html'), 403

@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, 'error/404.html'), 404

@app.route('/', methods=['GET'])
def main():
    return send_from_directory(app.static_folder, 'index.html')

# App Start
if __name__ == '__main__':
    app.run(debug=False, host='127.0.0.1', port=3000, threaded=True)