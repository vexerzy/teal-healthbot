
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get("OPENAI_API_KEY");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    
    if (!message) {
      throw new Error("Message input is missing.");
    }

    // Get AI Response
    const responseData = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { 
            role: 'system', 
            content: 'You are an experienced medical doctor providing healthcare advice. Keep responses clear, professional, and focused on evidence-based medicine. Always encourage users to seek in-person medical care when appropriate.' 
          },
          { role: 'user', content: message }
        ],
      }),
    });

    if (!responseData.ok) {
      throw new Error(`Failed to get AI response: ${await responseData.text()}`);
    }

    const textResponse = await responseData.json();
    const aiMessage = textResponse.choices[0].message.content;

    // Get AI Speech Response
    const speechResponse = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        voice: 'alloy',
        input: aiMessage,
      }),
    });

    if (!speechResponse.ok) {
      throw new Error(`Failed to generate speech: ${await speechResponse.text()}`);
    }

    const audioBuffer = await speechResponse.arrayBuffer();
    const audioBase64 = arrayBufferToBase64(audioBuffer);

    return new Response(JSON.stringify({
      message: aiMessage,
      audio: `data:audio/mp3;base64,${audioBase64}`,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
