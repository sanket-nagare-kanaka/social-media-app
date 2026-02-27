"""Google Gemini AI client for content moderation and risk scoring."""

import json
from functools import lru_cache
import google.generativeai as genai
from app.config import get_settings


@lru_cache()
def _configure_gemini():
    """Configure the Gemini SDK with API key."""
    settings = get_settings()
    genai.configure(api_key=settings.GEMINI_API_KEY)
    return genai.GenerativeModel(settings.GEMINI_MODEL)


async def score_content_toxicity(content: str) -> dict:
    """
    Score content for toxicity using Gemini AI.

    Returns:
        {
            "toxicity_score": float (0.0-1.0),
            "categories": {
                "hate_speech": float,
                "spam": float,
                "harassment": float,
                "misinformation": float,
                "nsfw": float,
            },
            "flagged": bool,
            "reason": str | None,
        }
    """
    model = _configure_gemini()

    prompt = f"""Analyze the following user-generated content for toxicity and safety risks.
Return a JSON object with exactly this structure:
{{
    "toxicity_score": <float 0.0-1.0, overall toxicity level>,
    "categories": {{
        "hate_speech": <float 0.0-1.0>,
        "spam": <float 0.0-1.0>,
        "harassment": <float 0.0-1.0>,
        "misinformation": <float 0.0-1.0>,
        "nsfw": <float 0.0-1.0>
    }},
    "flagged": <bool, true if toxicity_score > 0.85>,
    "reason": <string or null, brief explanation if flagged>
}}

Content to analyze:
\"\"\"
{content}
\"\"\"

Return ONLY the JSON object, no additional text."""

    try:
        response = model.generate_content(prompt)
        result = json.loads(response.text.strip().strip("```json").strip("```"))
        return result
    except Exception as e:
        # Return safe default on error
        return {
            "toxicity_score": 0.0,
            "categories": {
                "hate_speech": 0.0,
                "spam": 0.0,
                "harassment": 0.0,
                "misinformation": 0.0,
                "nsfw": 0.0,
            },
            "flagged": False,
            "reason": f"AI scoring unavailable: {str(e)}",
        }
