from openai import OpenAI
import base64
import os

#client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def extract_receipt_data(image_path):
    return {
        "store_name": "Demo Store",
        "date": "2026-06-05",
        "total": 100,
        "items": []
    }
   