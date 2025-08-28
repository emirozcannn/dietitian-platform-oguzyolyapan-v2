// Supabase Edge Function for sending emails via Mailgun
// Deploy this to your Supabase project as an Edge Function

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { to, from, subject, html, text, domain, apiKey } = await req.json()

    console.log('Sending email:', { to, from, subject, domain })

    // Mailgun API call
    const formData = new FormData()
    formData.append('from', from)
    formData.append('to', to)
    formData.append('subject', subject)
    if (html) formData.append('html', html)
    if (text) formData.append('text', text)

    const response = await fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`api:${apiKey}`)}`,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Mailgun API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    console.log('Email sent successfully:', data)

    return new Response(
      JSON.stringify({
        success: true,
        messageId: data.id,
        message: 'Email sent successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Email sending error:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})

/* To deploy this Edge Function:
1. Install Supabase CLI: npm install -g supabase
2. Login: supabase login
3. Link your project: supabase link --project-ref your-project-ref
4. Deploy: supabase functions deploy send-email
*/
