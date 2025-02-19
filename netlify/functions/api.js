const fetch = require('node-fetch');
require('dotenv').config();

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

  // API anahtarını kontrol et
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.error('API anahtarı bulunamadı!');
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: "API anahtarı yapılandırması eksik"
      })
    };
  }

  const prompt = event.queryStringParameters?.prompt;
  console.log('Gelen istek parametreleri:', event.queryStringParameters);

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
      model: "google/gemma-2-9b-it:free",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 800,
      stream: false
    };

    console.log('Request body:', JSON.stringify(requestBody));

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://apilonic.netlify.app',
        'X-Title': 'Api Lonic'
      },
      body: JSON.stringify(requestBody)
    });

    console.log('API Status:', response.status);
    console.log('API Status Text:', response.statusText);
    console.log('Response Headers:', JSON.stringify(Object.fromEntries([...response.headers]), null, 2));

    const data = await response.json();
    console.log('API Response Data:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('API Error Response:', data);
      throw new Error(data.error?.message || JSON.stringify(data));
    }

    if (!data.choices?.[0]?.message?.content) {
      console.error('Invalid API Response Format:', data);
      throw new Error('API yanıtı geçersiz format');
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        prompt: prompt,
        model: "google/gemma-2-9b-it:free",
        language: "tr",
        response: data.choices[0].message.content
      })
    };
  } catch (error) {
    console.error('Hata oluştu:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message,
        errorType: error.name,
        errorCode: error.code
      })
    };
  }
}; 