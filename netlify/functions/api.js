const fetch = require('node-fetch');

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
    console.log('İstek başlıyor - Prompt:', prompt);
    
    const requestBody = {
      model: "mistralai/mistral-7b-instruct",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    };

    console.log('Request body:', JSON.stringify(requestBody));

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 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',
        'HTTP-Referer': 'https://apilonic.netlify.app',
        'X-Title': 'ApiLonic'
      },
      body: JSON.stringify(requestBody)
    });

    console.log('API Status:', response.status);
    console.log('API Status Text:', response.statusText);

    const data = await response.json();
    console.log('API Response Data:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      throw new Error(data.error?.message || JSON.stringify(data));
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        prompt: prompt,
        model: "mistralai/mistral-7b-instruct",
        language: "tr",
        response: data.choices[0].message.content
      })
    };
  } catch (error) {
    console.error('Hata oluştu:', {
      message: error.message,
      stack: error.stack
    });

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