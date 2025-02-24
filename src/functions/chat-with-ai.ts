
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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

    // Get AI response
    const responseData = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
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
      throw new Error('Failed to get AI response: ' + await responseData.text());
    }

    const textResponse = await responseData.json();
    const aiMessage = textResponse.choices[0].message.content;

    // Get voice response
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
      throw new Error('Failed to generate speech: ' + await speechResponse.text());
    }

    const audioBlob = await speechResponse.blob();
    const audioBase64 = await blobToBase64(audioBlob);

    return new Response(JSON.stringify({
      message: aiMessage,
      audio: audioBase64,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chat-with-ai function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function blobToBase64(blob: Blob): Promise<string> {
  const buffer = await blob.arrayBuffer();
  const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
  return `data:audio/mp3;base64,${base64}`;
}
