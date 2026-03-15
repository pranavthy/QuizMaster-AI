import os
import json
import requests

def get_topic_suggestions(query):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return []

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
    
    prompt = f'Provide exactly 5 distinct, highly relevant quiz subject suggestions starting with or related to "{query}". Return ONLY a JSON array of strings, exactly like: ["Topic 1", "Topic 2"]. No markdown.'

    data = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.5}
    }

    try:
        response = requests.post(url, headers={"Content-Type": "application/json"}, json=data, timeout=5, verify=False)
        response_json = response.json()
        content_text = response_json['candidates'][0]['content']['parts'][0]['text'].strip()
        
        if content_text.startswith("```json"):
            content_text = content_text[7:]
        elif content_text.startswith("```"):
            content_text = content_text[3:]
        if content_text.endswith("```"):
            content_text = content_text[:-3]

        suggestions = json.loads(content_text.strip())
        if isinstance(suggestions, list):
            return suggestions[:5]
    except Exception:
        pass
    
    return []

def generate_quiz_questions(topic, difficulty, num_questions, question_types=None, learning_goal="Practice"):
    if question_types is None:
        question_types = ["mcq"]

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise Exception("Gemini API key is missing from .env file.")

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
    
    # Determine type instructions
    type_instruction = ""
    if "mcq" in question_types and "tf" in question_types:
        type_instruction = "- Mix Multiple Choice questions (exactly 4 choices) and True/False questions (exactly 2 choices: 'True' or 'False')."
    elif "tf" in question_types:
        type_instruction = "- Each question MUST be a True/False statement with exactly 2 choices: 'True' and 'False'."
    else:
        type_instruction = "- Each question must have exactly 4 answer choices."
        
    # Determine goal instructions
    goal_instruction = ""
    if learning_goal == "Interview Prep":
        goal_instruction = "- Focus on deep understanding, tricky edge cases, real-world application, and common technical interview questions."
    elif learning_goal == "Exam Revision":
        goal_instruction = "- Focus on comprehensive syllabus coverage, academic rigor, definitions, and core theoretical concepts."
    else:
        goal_instruction = "- Keep questions engaging, factual, and educational for general practice."
        

    prompt = f"""You are a professional quiz master. Generate a challenging quiz about "{topic}".

Requirements:
- Number of questions: {num_questions}
- Difficulty level: {difficulty}
{type_instruction}
{goal_instruction}
- Exactly one choice must be correct (is_correct: true)
- Questions must be specific, factual, and educational - NOT generic placeholders
- Make questions varied and interesting, testing real knowledge about {topic}

Return ONLY a valid JSON object with NO markdown, NO extra text. Just the raw JSON:
{{
  "title": "A specific, catchy title about {topic}",
  "questions": [
    {{
      "text": "A specific, factual question about {topic}",
      "choices": [
        {{"text": "Correct answer", "is_correct": true}},
        {{"text": "Wrong answer 1", "is_correct": false}},
        {{"text": "Wrong answer 2", "is_correct": false}},
        {{"text": "Wrong answer 3", "is_correct": false}}
      ]
    }}
  ]
}}"""

    data = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.7,
        }
    }

    response = requests.post(url, headers={"Content-Type": "application/json"}, json=data, timeout=30, verify=False)
    
    if response.status_code != 200:
        error_body = response.json()
        error_msg = error_body.get("error", {}).get("message", response.text)
        raise Exception(f"Gemini API Error: {error_msg}")
        
    response_json = response.json()
    
    try:
        content_text = response_json['candidates'][0]['content']['parts'][0]['text']
    except (KeyError, IndexError) as e:
        raise Exception(f"Unexpected API response format: {response_json}")
    
    # Strip any accidental markdown formatting
    content_text = content_text.strip()
    if content_text.startswith("```json"):
        content_text = content_text[7:]
    elif content_text.startswith("```"):
        content_text = content_text[3:]
    if content_text.endswith("```"):
        content_text = content_text[:-3]
    
    quiz_data = json.loads(content_text.strip())
    
    # Validate the parsed data has the expected structure
    if "questions" not in quiz_data or not quiz_data["questions"]:
        raise Exception("AI returned an empty or invalid quiz structure.")
    
    return quiz_data
