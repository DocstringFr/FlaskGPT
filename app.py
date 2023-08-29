import openai
from flask import Flask, render_template, request, Response
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
app.config["TEMPLATES_AUTO_RELOAD"] = True

openai.api_key = os.getenv('OPENAI_API_KEY')


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/prompt', methods=['POST', 'GET'])
def prompt():
    messages = request.json['messages']
    conversation = []
    for i, message in enumerate(messages):
        conversation.append({
            "role": "user" if i % 2 == 0 else "assistant", "content": message
        })

    def event_stream():
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=conversation,
            stream=True
        )

        for line in response:
            text = line.choices[0].delta.get('content', '')
            if len(text):
                yield text

    return Response(event_stream(), mimetype='text/event-stream')


if __name__ == "__main__":
    app.run(debug=True, host='127.0.0.1', port=5000)
