import requests # working program
import json



API_KEY = "AIzaSyArC3cmRYt_KRZ2GUb2wyz2mem3L0LsIDw"  # Replace with your actual API key
url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={API_KEY}"

headers = {
    "Content-Type": "application/json"
}

def ask_gemini(question):
    data = {
        "contents": [
            {
                "parts": [{"text": question}]
            }
        ]
    }

    response = requests.post(url, headers=headers, data=json.dumps(data))

    if response.status_code == 200:
        result = response.json()
        try:
            return result["candidates"][0]["content"]["parts"][0]["text"]
        except (KeyError, IndexError):
            return "🤖: No response received."
    else:
        return f"❌ Error {response.status_code}: {response.text}"

print("💬 Chat with Gemini! Type 'exit' to end.\n")

while True:
    user_input = input("👤 You: ")
    if user_input.lower() in ["exit", "quit"]:
        print("👋 Chat ended.")
        break

    reply = ask_gemini(user_input)
    print(f"🤖 Gemini: {reply}\n")
