import openai
from flask import Flask, render_template, request, render_template_string

app = Flask(__name__)
app.config["TEMPLATES_AUTO_RELOAD"] = True

openai.api_key = "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"


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/result', methods=['POST'])
def result():

    messages = [{
        "role": "user", "content": request.form['prompt']
    }]

    print(messages)

    result = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=messages)

    output = result.choices[0].message.content

    return render_template_string(output)


if __name__ == "__main__":
    app.run(debug=True)
