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
    console.log('API isteği gönderiliyor...');
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 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',
        'HTTP-Referer': 'https://apilonic.netlify.app',
        'X-Title': 'ApiLonic'
      },
      body: JSON.stringify({
        model: "meta-llama/llama-2-70b-chat",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    const data = await response.json();
    console.log('API yanıtı:', JSON.stringify(data));

    if (!response.ok) {
      console.error('API hata detayı:', JSON.stringify(data));
      throw new Error(JSON.stringify(data.error || data));
    }

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Beklenmeyen API yanıtı:', JSON.stringify(data));
      throw new Error('API yanıtı geçersiz format');
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        prompt: prompt,
        model: "meta-llama/llama-2-70b-chat",
        language: "tr",
        response: data.choices[0].message.content
      })
    };
  } catch (error) {
    console.error('Hata detayı:', {
      message: error.message,
      stack: error.stack,
      error: error
    });

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message,
        details: JSON.stringify(error)
      })
    };
  }
}; 