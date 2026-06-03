/* ============================================================
 *  contact.js  –  Supabase-powered contact form
 * ============================================================
 *  SETUP:
 *  1. Run supabase-setup.sql in your Supabase SQL editor.
 *  2. Deploy the Supabase Edge Function at supabase/functions/contact.
 *  3. Replace SUPABASE_URL, SUPABASE_ANON_KEY, and TURNSTILE_SITE_KEY below.
 * ============================================================ */

/* ---------- CONFIGURE YOUR CREDENTIALS HERE ---------- */
const SUPABASE_URL      = 'https://yzydjjfxqdcjwljduqnx.supabase.co';       // e.g. https://xxxx.supabase.co
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6eWRqamZ4cWRjandsamR1cW54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1MDM5MTksImV4cCI6MjA5NjA3OTkxOX0.kbEGpQUScVLpZYjQXtLRRvI45iLSTXnYImn_LxqHQUw';  // "anon / public" key – safe to expose
const TURNSTILE_SITE_KEY = '0x4AAAAAADeVes3P7mz-7Ql3';
/* ----------------------------------------------------- */

const IS_CONFIGURED =
  SUPABASE_URL      !== 'YOUR_SUPABASE_URL' &&
  SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY';

const EDGE_FUNCTION_NAME = 'contact';
const MIN_SUBMIT_DELAY_MS = 3000;

let _turnstileWidgetId = null;
let _turnstileToken = '';

/* ==================== HELPERS ==================== */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/** Basic sanitization: trim + max length */
function sanitize(str, max = 1000) {
  return String(str ?? '').trim().slice(0, max);
}

function isConfigured(value, placeholder) {
  return value !== placeholder;
}

function swalDark(opts) {
  return Swal.fire({
    background: '#0f0a1e',
    color: '#e5e7eb',
    confirmButtonColor: '#7c3aed',
    ...opts,
  });
}

/* ==================== FORM HANDLER ==================== */
async function handleContactSubmit(e) {
  e.preventDefault();

  const btn     = document.getElementById('submit-btn');
  const btnText = document.getElementById('submit-text');
  const form    = e.target;
  const honeypot = document.getElementById('contact-company');
  const startedAtField = document.getElementById('contact-started-at');

  /* --- Collect & sanitize data --- */
  const data = {
    name:    sanitize(document.getElementById('contact-name').value),
    email:   sanitize(document.getElementById('contact-email').value, 320),
    subject: sanitize(document.getElementById('contact-subject').value),
    message: sanitize(document.getElementById('contact-message').value),
    company: sanitize(honeypot?.value || ''),
    startedAt: Number(startedAtField?.value || 0),
  };

  if (data.company) {
    swalDark({
      icon: 'warning',
      title: t('alert_validation_title'),
      text: 'Submission blocked.',
    });
    return;
  }

  const elapsed = Date.now() - data.startedAt;
  if (!Number.isFinite(data.startedAt) || elapsed < MIN_SUBMIT_DELAY_MS) {
    swalDark({
      icon: 'warning',
      title: t('alert_validation_title'),
      text: t('alert_validation_text'),
    });
    return;
  }

  /* --- Client-side validation --- */
  if (!data.name || !data.email || !data.subject || !data.message) {
    swalDark({
      icon: 'warning',
      title: t('alert_validation_title'),
      text:  t('alert_validation_text'),
    });
    return;
  }

  if (!isValidEmail(data.email)) {
    swalDark({
      icon: 'warning',
      title: t('alert_validation_title'),
      text:  t('alert_email_invalid'),
    });
    return;
  }

  /* --- Loading state --- */
  btn.disabled = true;
  btn.innerHTML = `
    <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
    </svg>
    <span>${t('contact_form_sending')}</span>
  `;

  /* --- Submit to Supabase (or demo) --- */
  try {
    if (!IS_CONFIGURED) {
      /* Demo mode – simulate network delay */
      await new Promise(r => setTimeout(r, 1400));

      await swalDark({
        icon: 'info',
        title: 'Demo Mode',
        html:
          'The form is working! To save messages, paste your <b>Supabase</b> credentials ' +
          'into <code style="color:#9d5ffa">assets/js/contact.js</code> and run ' +
          '<code style="color:#9d5ffa">supabase-setup.sql</code>.',
      });

      form.reset();
      if (startedAtField) startedAtField.value = String(Date.now());
      return;
    }

    const response = await fetch(`${SUPABASE_URL}/functions/v1/${EDGE_FUNCTION_NAME}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        company: data.company,
        startedAt: data.startedAt,
        turnstileToken: _turnstileToken,
      }),
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Edge Function not found. Deploy supabase/functions/contact before submitting the form.');
      }
      throw new Error(result.error || 'Failed to submit form');
    }

    if (_turnstileWidgetId !== null && window.turnstile) {
      window.turnstile.reset(_turnstileWidgetId);
      _turnstileToken = '';
    }

    await swalDark({
      icon: 'success',
      title: t('alert_success_title'),
      text:  t('alert_success_text'),
      timer: 4000,
      timerProgressBar: true,
      showConfirmButton: false,
    });

    form.reset();
    if (startedAtField) startedAtField.value = String(Date.now());

  } catch (err) {
    console.error('[contact] Supabase error:', err);
    swalDark({
      icon: 'error',
      title: t('alert_error_title'),
      text: err?.message || t('alert_error_text'),
    });

  } finally {
    /* Restore button */
    btn.disabled  = false;
    btn.innerHTML = `
      <i class="fa-solid fa-paper-plane"></i>
      <span id="submit-text">${t('contact_form_send')}</span>
    `;
  }
}

function initTurnstile() {
  const container = document.getElementById('turnstile-container');
  if (!container) return;
  if (!isConfigured(TURNSTILE_SITE_KEY, 'YOUR_TURNSTILE_SITE_KEY')) return;
  if (!window.turnstile) {
    setTimeout(initTurnstile, 300);
    return;
  }

  _turnstileWidgetId = window.turnstile.render(container, {
    sitekey: TURNSTILE_SITE_KEY,
    theme: 'dark',
    callback(token) {
      _turnstileToken = token;
    },
    'expired-callback'() {
      _turnstileToken = '';
    },
    'error-callback'() {
      _turnstileToken = '';
    },
  });
}

/* ==================== INIT ==================== */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const startedAtField = document.getElementById('contact-started-at');
  if (startedAtField && !startedAtField.value) {
    startedAtField.value = String(Date.now());
  }
  if (form) form.addEventListener('submit', handleContactSubmit);
  initTurnstile();
});
