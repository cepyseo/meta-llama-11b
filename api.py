from flask import Flask, request, jsonify
from openai import OpenAI
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key="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"
)

@app.route('/api', methods=['GET'])
def chat():
    prompt = request.args.get('prompt', '')
    
    if not prompt:
        return jsonify({
            "success": False,
            "error": "Prompt parametresi gerekli"
        }), 400

    try:
        completion = client.chat.completions.create(
            extra_headers={
                "HTTP-Referer": "https://apilonic.netlify.app",
                "X-Title": "ApiLonic",
            },
            model="meta-llama/llama-3.2-11b-vision-instruct:free",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )
        
        response = completion.choices[0].message.content
        
        return jsonify({
            "success": True,
            "prompt": prompt,
            "model": "meta-llama/llama-3.2-11b-vision-instruct:free",
            "language": "tr",
            "response": response
        })
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080) 