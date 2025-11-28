"""
Digital Footprint Shield - Flask Backend (Optional)
A minimal API server for enhanced functionality.

The frontend works fully without this backend.
Use this backend when you want:
- Server-side score calculation
- Persistent incident storage
- AI-powered analysis (with API keys)

Run with: flask run
"""
import os
from flask import Flask
from flask_cors import CORS
from api.routes import api_bp

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for frontend communication
CORS(app, origins=['http://localhost:5173', 'http://127.0.0.1:5173'])

# Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-change-in-production')
app.config['JSON_SORT_KEYS'] = False

# Register API blueprint
app.register_blueprint(api_bp, url_prefix='/api')


@app.route('/')
def index():
    """Health check endpoint"""
    return {
        'status': 'ok',
        'app': 'Digital Footprint Shield API',
        'version': '1.0.0',
        'endpoints': [
            'POST /api/calculate-score',
            'POST /api/generate-responses',
            'POST /api/save-incident',
            'GET /api/incidents',
        ]
    }


@app.errorhandler(404)
def not_found(e):
    return {'error': 'Endpoint not found'}, 404


@app.errorhandler(500)
def server_error(e):
    return {'error': 'Internal server error'}, 500


if __name__ == '__main__':
    # Development server
    app.run(debug=True, port=5000)
