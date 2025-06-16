import os
import sys
import json
import traceback
from openai import OpenAI
from typing import List
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Verify API key is present
api_key = os.getenv('OPENAI_API_KEY')
if not api_key:
    print(json.dumps({"error": "OPENAI_API_KEY not found in environment variables"}))
    sys.exit(1)

try:
    client = OpenAI(api_key=api_key)
except Exception as e:
    print(json.dumps({"error": f"Failed to initialize OpenAI client: {str(e)}"}))
    sys.exit(1)

def generate_keywords(seed_keyword: str) -> List[str]:
    """Generate related keywords based on a seed keyword."""
    try:
        prompt = f"Suggest 5 related keywords for '{seed_keyword}'. Return only the keywords, one per line."
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful SEO assistant."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=100
        )
        
        keywords = response.choices[0].message.content.strip().split('\n')
        return [k.strip() for k in keywords if k.strip()]
    except Exception as e:
        print(json.dumps({"error": f"Error generating keywords: {str(e)}"}))
        sys.exit(1)

def generate_titles(keyword: str) -> List[str]:
    """Generate SEO-optimized titles based on a keyword."""
    prompt = f"Generate 3 SEO-optimized titles for '{keyword}'. Make them professional and engaging. Return only the titles, one per line."
    
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a professional SEO content writer."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        max_tokens=150
    )
    
    titles = response.choices[0].message.content.strip().split('\n')
    return [t.strip() for t in titles if t.strip()]

def generate_topics(title: str) -> List[str]:
    """Generate topic ideas based on a title."""
    prompt = f"Generate 2 detailed topic ideas for the title: '{title}'. Make them specific and actionable. Return only the topics, one per line."
    
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a professional content strategist."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        max_tokens=200
    )
    
    topics = response.choices[0].message.content.strip().split('\n')
    return [t.strip() for t in topics if t.strip()]

def generate_content(topic: str) -> str:
    """Generate SEO-optimized content based on a topic."""
    prompt = f"Write a short, SEO-optimized piece of content (100-200 words) about: '{topic}'. Make it professional and engaging."
    
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a professional content writer specializing in SEO."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        max_tokens=300
    )
    
    return response.choices[0].message.content.strip()

def calculate_seo_score(content: str, keyword: str) -> float:
    """Calculate a basic SEO score based on keyword presence and content length."""
    content_lower = content.lower()
    keyword_lower = keyword.lower()
    
    # Check keyword presence
    keyword_count = content_lower.count(keyword_lower)
    keyword_score = min(keyword_count * 0.2, 0.5)  # Max 0.5 points for keyword presence
    
    # Check content length (100-200 words is ideal)
    word_count = len(content.split())
    length_score = 0
    if 100 <= word_count <= 200:
        length_score = 0.5  # Perfect length
    elif 80 <= word_count < 100 or 200 < word_count <= 250:
        length_score = 0.3  # Acceptable length
    else:
        length_score = 0.1  # Too short or too long
    
    return round(keyword_score + length_score, 2)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Missing arguments"}))
        sys.exit(1)

    command = sys.argv[1]
    input_text = sys.argv[2]

    try:
        if command == "generate_keywords":
            result = generate_keywords(input_text)
            print(json.dumps({"keywords": result}))
        elif command == "generate_titles":
            result = generate_titles(input_text)
            print(json.dumps({"titles": result}))
        elif command == "generate_topics":
            result = generate_topics(input_text)
            print(json.dumps({"topics": result}))
        elif command == "generate_content":
            result = generate_content(input_text)
            print(json.dumps({"content": result}))
        else:
            print(json.dumps({"error": f"Unknown command: {command}"}))
            sys.exit(1)
    except Exception as e:
        error_msg = f"Error in {command}: {str(e)}\n{traceback.format_exc()}"
        print(json.dumps({"error": error_msg}))
        sys.exit(1) 