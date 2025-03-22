import logging
from flask import Flask, request, jsonify, render_template
import requests

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Replace this with your actual Gemini API key
API_KEY = "AIzaSyDdTFrIx5MWZGKPU1ZkPl6rjM-aMhbsOfE"
API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={API_KEY}"

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.json
        logging.debug("Received JSON: %s", data)  # Log incoming request

        user_input = data.get("query")
        if not user_input:
            return jsonify({"error": "No query provided"}), 400

        payload = {"contents": [{"parts": [{"text": user_input}]}]}
        response = requests.post(
            API_URL,
            headers={"Content-Type": "application/json"},
            json=payload
        )

        logging.debug("API Response Code: %s", response.status_code)
        logging.debug("API Response Text: %s", response.text)

        if response.status_code == 200:
            result = response.json()
            ai_response = (
                result.get("candidates", [{}])[0]
                .get("content", {})
                .get("parts", [{}])[0]
                .get("text", "No response generated")
            )
            return jsonify({"response": ai_response})
        else:
            return jsonify({"error": "API call failed", "details": response.text}), response.status_code

    except Exception as e:
        logging.error("Error in /chat: %s", str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)