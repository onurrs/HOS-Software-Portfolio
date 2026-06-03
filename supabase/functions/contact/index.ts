const corsHeaders = {
  'Access-Control-Allow-Origin': Deno.env.get('ALLOWED_ORIGIN') ?? '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

type ContactPayload = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  company?: string;
  startedAt?: number;
  turnstileToken?: string;
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
}

function sanitize(value: unknown, max = 1000) {
  return String(value ?? '').trim().slice(0, max);
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function verifyTurnstile(token: string, ip?: string | null) {
  const secret = Deno.env.get('TURNSTILE_SECRET_KEY');
  if (!secret) return { ok: true };

  if (!token) {
    return { ok: false, error: 'Missing Turnstile token' };
  }

  const form = new FormData();
  form.append('secret', secret);
  form.append('response', token);
  if (ip) form.append('remoteip', ip);

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: form,
  });

  const result = await response.json();
  return { ok: Boolean(result.success), error: result['error-codes']?.join(', ') || 'Turnstile verification failed' };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !serviceRoleKey) {
    return json({ error: 'Server is not configured' }, 500);
  }

  let body: ContactPayload;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const company = sanitize(body.company, 120);
  const startedAt = Number(body.startedAt || 0);
  const turnstileToken = sanitize(body.turnstileToken, 5000);
  const elapsed = Date.now() - startedAt;

  if (company) {
    return json({ error: 'Spam detected' }, 400);
  }

  if (!Number.isFinite(startedAt) || elapsed < 3000) {
    return json({ error: 'Submission too fast' }, 400);
  }

  const data = {
    name: sanitize(body.name, 120),
    email: sanitize(body.email, 320),
    subject: sanitize(body.subject, 200),
    message: sanitize(body.message, 4000),
  };

  if (!data.name || !data.email || !data.message || !isValidEmail(data.email)) {
    return json({ error: 'Validation failed' }, 400);
  }

  const turnstile = await verifyTurnstile(turnstileToken, req.headers.get('x-forwarded-for'));
  if (!turnstile.ok) {
    return json({ error: turnstile.error }, 400);
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/contacts`, {
    method: 'POST',
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return json({ error: errorText || 'Failed to save message' }, 500);
  }

  return json({ ok: true });
});
