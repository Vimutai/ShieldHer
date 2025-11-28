"""
API Routes for Digital Footprint Shield
Handles score calculation, response generation, and incident storage.
"""
import json
import os
from datetime import datetime
from flask import Blueprint, request, jsonify
from .model import (
    calculate_safety_score,
    analyze_harassment_message,
    generate_response_templates
)

# Create blueprint
api_bp = Blueprint('api', __name__)

# Data storage path (simple JSON file for hackathon MVP)
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')
INCIDENTS_FILE = os.path.join(DATA_DIR, 'incidents.json')


def ensure_data_dir():
    """Ensure data directory exists"""
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR)


def load_incidents():
    """Load incidents from JSON file"""
    ensure_data_dir()
    if os.path.exists(INCIDENTS_FILE):
        with open(INCIDENTS_FILE, 'r') as f:
            return json.load(f)
    return []


def save_incidents(incidents):
    """Save incidents to JSON file"""
    ensure_data_dir()
    with open(INCIDENTS_FILE, 'w') as f:
        json.dump(incidents, f, indent=2)


@api_bp.route('/calculate-score', methods=['POST'])
def calculate_score():
    """
    Calculate safety score from assessment answers.
    
    Request body:
    {
        "answers": {
            "social_public": true,
            "location_sharing": false,
            ...
        }
    }
    
    Returns:
    {
        "overall": 65,
        "categories": {"visibility": 50, "security": 80, ...},
        "riskAreas": ["Your social media profiles are public", ...],
        "timestamp": "2024-01-15T10:30:00Z"
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'answers' not in data:
            return jsonify({'error': 'Missing answers in request body'}), 400
        
        answers = data['answers']
        result = calculate_safety_score(answers)
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@api_bp.route('/generate-responses', methods=['POST'])
def generate_responses():
    """
    Analyze harassment message and generate response templates.
    
    Request body:
    {
        "message": "The harassment message text..."
    }
    
    Returns:
    {
        "severity": "high",
        "categories": ["threats", "insults"],
        "responses": [
            {"type": "calm", "text": "...", "note": "..."},
            {"type": "legal", "text": "...", "note": "..."},
            {"type": "supportive", "text": "...", "note": "..."},
            {"type": "report", "text": "...", "note": "..."}
        ]
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'message' not in data:
            return jsonify({'error': 'Missing message in request body'}), 400
        
        message = data['message']
        
        # Analyze the message
        analysis = analyze_harassment_message(message)
        
        # Generate response templates
        responses = generate_response_templates(message, analysis)
        
        return jsonify({
            'severity': analysis['severity'],
            'categories': analysis['categories'],
            'responses': responses
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@api_bp.route('/save-incident', methods=['POST'])
def save_incident():
    """
    Save an incident record for documentation.
    
    Request body:
    {
        "type": "harassment",
        "platform": "Instagram",
        "message": "The message content...",
        "severity": "high",
        "notes": "Optional user notes"
    }
    
    Returns:
    {
        "success": true,
        "incident_id": "inc_12345",
        "message": "Incident saved successfully"
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Missing request body'}), 400
        
        # Create incident record
        incident = {
            'id': f"inc_{datetime.now().strftime('%Y%m%d%H%M%S')}",
            'type': data.get('type', 'general'),
            'platform': data.get('platform', 'unknown'),
            'message': data.get('message', ''),
            'severity': data.get('severity', 'unknown'),
            'notes': data.get('notes', ''),
            'timestamp': datetime.now().isoformat(),
        }
        
        # Load existing incidents and append
        incidents = load_incidents()
        incidents.append(incident)
        save_incidents(incidents)
        
        return jsonify({
            'success': True,
            'incident_id': incident['id'],
            'message': 'Incident saved successfully'
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@api_bp.route('/incidents', methods=['GET'])
def get_incidents():
    """
    Retrieve all saved incidents.
    
    Returns:
    {
        "incidents": [...],
        "count": 5
    }
    """
    try:
        incidents = load_incidents()
        return jsonify({
            'incidents': incidents,
            'count': len(incidents)
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@api_bp.route('/incidents/<incident_id>', methods=['DELETE'])
def delete_incident(incident_id):
    """Delete a specific incident"""
    try:
        incidents = load_incidents()
        incidents = [i for i in incidents if i['id'] != incident_id]
        save_incidents(incidents)
        
        return jsonify({
            'success': True,
            'message': f'Incident {incident_id} deleted'
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
