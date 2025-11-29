# api/routes.py - Add to your existing routes
from flask import Blueprint, request, jsonify
import logging

api_bp = Blueprint('api', __name__)

# Add this new endpoint to your existing routes
@api_bp.route('/analyze-evidence', methods=['POST'])
def analyze_evidence():
    """
    Analyze harassment evidence and suggest responses
    Expects: { "evidence": [{ "source": "twitter", "count": 3, "timestamp": "07:47:24" }, ...] }
    Returns: Analysis with severity and recommended responses
    """
    try:
        data = request.get_json()
        
        if not data or 'evidence' not in data:
            return jsonify({'error': 'Evidence data is required'}), 400
        
        evidence_log = data['evidence']
        
        # Analyze the evidence
        analysis_result = analyze_evidence_data(evidence_log)
        
        return jsonify(analysis_result)
        
    except Exception as e:
        logging.error(f"Analysis error: {str(e)}")
        return jsonify({'error': 'Analysis failed'}), 500

def analyze_evidence_data(evidence_log):
    """Analyze evidence patterns and suggest responses"""
    twitter_count = 0
    unknown_count = 0
    total_comments = 0
    sources = set()
    
    # Analyze the evidence
    for entry in evidence_log:
        count = entry.get('count', 0)
        source = entry.get('source', 'unknown')
        
        total_comments += count
        sources.add(source)
        
        if source == 'twitter':
            twitter_count += count
        elif source == 'unknown':
            unknown_count += count
    
    # Determine severity based on patterns
    severity = calculate_severity(total_comments, len(sources), twitter_count, unknown_count)
    
    # Get recommended responses based on severity
    recommended_responses = get_recommended_responses(severity)
    
    return {
        'severity': severity,
        'summary': generate_summary(total_comments, sources, twitter_count, unknown_count),
        'autoSelected': recommended_responses,
        'analysis': {
            'totalComments': total_comments,
            'uniqueSources': len(sources),
            'sourcesDetected': list(sources)
        }
    }

def calculate_severity(total_comments, unique_sources, twitter_count, unknown_count):
    """Calculate severity level based on evidence patterns"""
    if total_comments > 10 or unique_sources >= 3:
        return 'High'
    elif total_comments > 5 or (twitter_count > 0 and unknown_count > 0):
        return 'Medium'
    else:
        return 'Low'

def get_recommended_responses(severity):
    """Get recommended response templates based on severity"""
    responses = {
        'High': [
            'Document Evidence',
            'Firm Response Template',
            'Block User',
            'Report to Platform'
        ],
        'Medium': [
            'Calm Response Template 1',
            'Set Boundaries',
            'Document Evidence'
        ],
        'Low': [
            'Calm Response Template 1',
            'Ignore and Monitor'
        ]
    }
    return responses.get(severity, [])

def generate_summary(total_comments, sources, twitter_count, unknown_count):
    """Generate analysis summary"""
    source_desc = []
    if twitter_count > 0:
        source_desc.append(f"{twitter_count} Twitter comments")
    if unknown_count > 0:
        source_desc.append(f"{unknown_count} unknown source comments")
    
    sources_text = " and ".join(source_desc)
    return f"Found {total_comments} total comments from {sources_text} across {len(sources)} sources."