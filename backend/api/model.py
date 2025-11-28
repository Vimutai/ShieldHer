"""
Model / Logic Layer for Digital Footprint Shield
Contains score calculation, message analysis, and response generation.

AI INTEGRATION:
To enable AI-powered analysis, set these environment variables:
- OPENAI_API_KEY: Your OpenAI API key
- ANTHROPIC_API_KEY: Your Anthropic API key

The code will automatically use AI if keys are present,
otherwise falls back to keyword-based analysis.
"""
import os
from datetime import datetime

# Try to import AI libraries (optional)
try:
    import openai
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False

try:
    import anthropic
    ANTHROPIC_AVAILABLE = True
except ImportError:
    ANTHROPIC_AVAILABLE = False


# ============================================
# QUESTION DEFINITIONS (mirrors frontend)
# ============================================
QUESTIONS = [
    {'id': 'social_public', 'category': 'visibility', 'weight': 3, 'invert': False},
    {'id': 'location_sharing', 'category': 'location', 'weight': 4, 'invert': False},
    {'id': 'real_name', 'category': 'identity', 'weight': 2, 'invert': False},
    {'id': 'password_reuse', 'category': 'security', 'weight': 4, 'invert': False},
    {'id': 'two_factor', 'category': 'security', 'weight': 3, 'invert': True},
    {'id': 'personal_info', 'category': 'identity', 'weight': 5, 'invert': False},
    {'id': 'photo_sharing', 'category': 'location', 'weight': 3, 'invert': False},
    {'id': 'friend_lists', 'category': 'network', 'weight': 2, 'invert': False},
    {'id': 'google_yourself', 'category': 'awareness', 'weight': 2, 'invert': True},
    {'id': 'data_broker', 'category': 'awareness', 'weight': 2, 'invert': True},
]

RISK_MESSAGES = {
    'social_public': 'Your social media profiles are publicly accessible',
    'location_sharing': 'Location sharing reveals your whereabouts',
    'password_reuse': 'Password reuse puts multiple accounts at risk',
    'two_factor': 'Important accounts lack two-factor authentication',
    'personal_info': 'Personal contact info is visible online',
    'photo_sharing': 'Photos may reveal your location or routine',
}

# ============================================
# HARASSMENT PATTERNS (for keyword analysis)
# ============================================
HARASSMENT_PATTERNS = {
    'threats': {
        'keywords': ['kill', 'hurt', 'harm', 'attack', 'find you', 'coming for', 
                     'destroy', 'ruin', 'end you', 'make you pay'],
        'weight': 5
    },
    'sexual': {
        'keywords': ['sexy', 'nudes', 'naked', 'body', 'send pics', 'hot'],
        'weight': 4
    },
    'stalking': {
        'keywords': ['watching', 'following', 'know where', 'saw you', 
                     'your house', 'tracked'],
        'weight': 5
    },
    'insults': {
        'keywords': ['ugly', 'stupid', 'worthless', 'pathetic', 'loser', 
                     'disgusting', 'idiot', 'trash'],
        'weight': 2
    },
    'manipulation': {
        'keywords': ['no one will believe', 'your fault', 'you made me', 
                     'you owe me', 'you deserve', 'crazy'],
        'weight': 3
    },
    'doxxing': {
        'keywords': ['address', 'phone number', 'tell everyone', 'expose', 
                     'your family', 'your friends will know'],
        'weight': 4
    },
}


def calculate_safety_score(answers: dict) -> dict:
    """
    Calculate safety score from assessment answers.
    
    Args:
        answers: Dict mapping question_id to boolean answer
    
    Returns:
        Dict with overall score, category breakdown, and risk areas
    """
    category_scores = {}
    category_max = {}
    risk_areas = []
    
    for q in QUESTIONS:
        cat = q['category']
        if cat not in category_scores:
            category_scores[cat] = 0
            category_max[cat] = 0
        
        category_max[cat] += q['weight']
        
        answer = answers.get(q['id'])
        if answer is None:
            continue
        
        # Determine if answer is "safe"
        is_safe = answer if q['invert'] else not answer
        
        if is_safe:
            category_scores[cat] += q['weight']
        elif q['weight'] >= 3 and q['id'] in RISK_MESSAGES:
            risk_areas.append(RISK_MESSAGES[q['id']])
    
    # Calculate percentages
    categories = {}
    for cat in category_scores:
        if category_max[cat] > 0:
            categories[cat] = round((category_scores[cat] / category_max[cat]) * 100)
        else:
            categories[cat] = 100
    
    # Calculate overall
    total_score = sum(category_scores.values())
    total_max = sum(category_max.values())
    overall = round((total_score / total_max) * 100) if total_max > 0 else 50
    
    return {
        'overall': overall,
        'categories': categories,
        'riskAreas': risk_areas[:5],
        'timestamp': datetime.now().isoformat()
    }


def analyze_harassment_message(message: str) -> dict:
    """
    Analyze a message for harassment patterns.
    
    Args:
        message: The message text to analyze
    
    Returns:
        Dict with severity and detected categories
    """
    # Try AI analysis first if available
    ai_result = _try_ai_analysis(message)
    if ai_result:
        return ai_result
    
    # Fall back to keyword analysis
    return _keyword_analysis(message)


def _keyword_analysis(message: str) -> dict:
    """Keyword-based harassment analysis"""
    lower_message = message.lower()
    detected = []
    total_score = 0
    
    for category, data in HARASSMENT_PATTERNS.items():
        if any(kw in lower_message for kw in data['keywords']):
            detected.append(category)
            total_score += data['weight']
    
    # Determine severity
    if total_score >= 8:
        severity = 'severe'
    elif total_score >= 5:
        severity = 'high'
    elif total_score >= 2:
        severity = 'medium'
    else:
        severity = 'low'
    
    return {
        'severity': severity,
        'categories': detected if detected else ['general harassment'],
        'score': total_score
    }


def _try_ai_analysis(message: str) -> dict | None:
    """
    Attempt AI-powered analysis if API keys are available.
    Returns None if AI is not available.
    """
    # Try OpenAI
    openai_key = os.environ.get('OPENAI_API_KEY')
    if openai_key and OPENAI_AVAILABLE:
        try:
            return _analyze_with_openai(message, openai_key)
        except Exception as e:
            print(f"OpenAI analysis failed: {e}")
    
    # Try Anthropic
    anthropic_key = os.environ.get('ANTHROPIC_API_KEY')
    if anthropic_key and ANTHROPIC_AVAILABLE:
        try:
            return _analyze_with_anthropic(message, anthropic_key)
        except Exception as e:
            print(f"Anthropic analysis failed: {e}")
    
    return None


def _analyze_with_openai(message: str, api_key: str) -> dict:
    """
    Analyze message using OpenAI GPT.
    
    Uncomment and configure for production use.
    """
    # client = openai.OpenAI(api_key=api_key)
    # response = client.chat.completions.create(
    #     model="gpt-3.5-turbo",
    #     messages=[
    #         {
    #             "role": "system",
    #             "content": "You analyze messages for harassment. Return JSON with: severity (low/medium/high/severe), categories (array of: threats, sexual, stalking, insults, manipulation, doxxing)"
    #         },
    #         {
    #             "role": "user",
    #             "content": f"Analyze this message: {message}"
    #         }
    #     ],
    #     response_format={"type": "json_object"}
    # )
    # return json.loads(response.choices[0].message.content)
    
    # Placeholder - returns None to fall back to keyword analysis
    return None


def _analyze_with_anthropic(message: str, api_key: str) -> dict:
    """
    Analyze message using Anthropic Claude.
    
    Uncomment and configure for production use.
    """
    # client = anthropic.Anthropic(api_key=api_key)
    # response = client.messages.create(
    #     model="claude-3-haiku-20240307",
    #     max_tokens=500,
    #     messages=[
    #         {
    #             "role": "user",
    #             "content": f"Analyze this message for harassment and return JSON with severity and categories: {message}"
    #         }
    #     ]
    # )
    # return json.loads(response.content[0].text)
    
    return None


def generate_response_templates(message: str, analysis: dict) -> list:
    """
    Generate 4 response templates based on message analysis.
    
    Args:
        message: Original message
        analysis: Analysis result with severity and categories
    
    Returns:
        List of 4 response template objects
    """
    severity = analysis['severity']
    categories = analysis['categories']
    date = datetime.now().strftime('%B %d, %Y')
    
    return [
        {
            'type': 'calm',
            'text': _generate_calm_response(severity, categories),
            'note': 'Use this to maintain composure and not escalate.'
        },
        {
            'type': 'legal',
            'text': _generate_legal_response(severity, categories, date),
            'note': 'Use if you may need to involve authorities.'
        },
        {
            'type': 'supportive',
            'text': _generate_supportive_response(severity, categories),
            'note': 'Use when communicating with friends/family.'
        },
        {
            'type': 'report',
            'text': _generate_report_response(severity, categories),
            'note': 'Use as a template when reporting to the platform.'
        }
    ]


def _generate_calm_response(severity: str, categories: list) -> str:
    if severity == 'severe' or 'threats' in categories:
        return "I'm not going to engage with this type of communication. I'm documenting this message and will not respond further."
    
    if 'manipulation' in categories:
        return "I understand you're upset, but I won't accept responsibility for your behavior. I'm choosing not to continue this conversation."
    
    return "I've received your message. I don't believe this type of communication is helpful. If you'd like to have a respectful conversation, I'm open to that."


def _generate_legal_response(severity: str, categories: list, date: str) -> str:
    if severity == 'severe' or 'threats' in categories or 'stalking' in categories:
        return f"This message, received on {date}, contains concerning content that I am documenting for potential legal purposes. Continued contact of this nature may be considered harassment under applicable laws. I am retaining all evidence."
    
    return f"I am formally requesting that you cease this type of communication. This message has been documented as of {date}. Continued unwanted contact may be considered harassment."


def _generate_supportive_response(severity: str, categories: list) -> str:
    cat_str = ' and '.join(categories)
    
    if severity == 'severe':
        return f"I need to share something concerning with you. I've been receiving harassing messages that include {cat_str}. I've been documenting everything and may need support in deciding next steps."
    
    return f"I've been receiving some uncomfortable messages and wanted to share this with you. I'm handling it by not responding and documenting."


def _generate_report_response(severity: str, categories: list) -> str:
    cat_str = ', '.join(categories)
    return f"I am reporting a user for harassment. The message(s) I received contain {cat_str}. This communication was unwanted and makes me feel unsafe. I am attaching screenshots as evidence."
