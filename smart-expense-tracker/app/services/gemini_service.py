from PIL import Image
import google.generativeai as genai
import json
from dotenv import load_dotenv
import os

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


model = genai.GenerativeModel("gemini-2.5-flash")

def parse_receipt(image_path):

    image = Image.open(image_path)

    prompt = """
    Extract merchant, amount, category and purchase date from this receipt.

    Return ONLY valid JSON.

    Example:
    {
        "merchant": "",
        "amount": 0,
        "category": "",
        "purchase_date": ""
    }
    """

    response = model.generate_content([prompt, image])

    cleaned_response = (
        response.text
        .replace("```json", "")
        .replace("```", "")
        .strip()
    )

    return json.loads(cleaned_response)