export {};

type ReqPayload = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  company?: string;
  startedAt?: number;
  turnstileToken?: string;
};

type EdgeRuntime = typeof globalThis & {
  Deno: {
    env: {
      get(key: string): string | undefined;
    };
    serve: (handler: (req: Request) => Promise<Response> | Response) => void;
  };
};

const runtime = globalThis as EdgeRuntime;

const corsHeaders = {
  'Access-Control-Allow-Origin': runtime.Deno.env.get('ALLOWED_ORIGIN') ?? '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const MIN_SUBMIT_DELAY_MS = 3000;

console.info('server started');

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
  const secret = runtime.Deno.env.get('TURNSTILE_SECRET_KEY');
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
  return {
    ok: Boolean(result.success),
    error: result['error-codes']?.join(', ') || 'Turnstile verification failed',
  };
}

async function saveContactMessage(payload: Required<Pick<ReqPayload, 'name' | 'email' | 'subject' | 'message'>>) {
  const supabaseUrl = runtime.Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = runtime.Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !serviceRoleKey) {
    return { ok: false, error: 'Server is not configured' };
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/contacts`, {
    method: 'POST',
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return { ok: false, error: errorText || 'Failed to save message' };
  }

  return { ok: true };
}

runtime.Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  let body: ReqPayload;
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

  if (!Number.isFinite(startedAt) || elapsed < MIN_SUBMIT_DELAY_MS) {
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

  const result = await saveContactMessage(data);
  if (!result.ok) {
    return json({ error: result.error }, 500);
  }

  return json({ ok: true });
});
