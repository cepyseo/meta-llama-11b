const { OpenAI } = require('openai');

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: "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",
  defaultHeaders: {
    "HTTP-Referer": "https://apilonic.netlify.app",
    "X-Title": "ApiLonic"
  }
});

exports.handler = async function(event, context) {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // Handle OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  const prompt = event.queryStringParameters.prompt;

  if (!prompt) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        success: false,
        error: "Prompt parametresi gerekli"
      })
    };
  }

  try {
    const completion = await client.chat.completions.create({
      model: "meta-llama/llama-3.2-11b-vision-instruct:free",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        prompt: prompt,
        model: "meta-llama/llama-3.2-11b-vision-instruct:free",
        language: "tr",
        response: completion.choices[0].message.content
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
}; 