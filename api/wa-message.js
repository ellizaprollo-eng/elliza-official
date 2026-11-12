// Sends a website chat message straight to Elliza's WhatsApp through CallMeBot (owner's request, 2026-11-12).
// Needs the Vercel project setting CALLMEBOT_APIKEY (from Elliza's one-time CallMeBot activation, never in the code).
// Without it the route answers 503 and the chat falls back to opening WhatsApp, so no visitor message is lost.
const PHONE = '+639306614307';
const ALLOWED_ORIGIN = /^(https:\/\/(elliza-digital|elliza-prollo)(-[a-z0-9-]+)?\.vercel\.app|http:\/\/localhost(:\d+)?)$/;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const recent = new Map(); // shortcut: per-instance memory, so the limit is best effort; use a store (KV) if spam ever gets through

const clean = (v, max) => String(v == null ? '' : v).replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, '').trim().slice(0, max);

async function readJson(req) {
  const b = req.body;
  if (b && typeof b === 'object' && !Buffer.isBuffer(b)) return b;
  let raw = typeof b === 'string' ? b : Buffer.isBuffer(b) ? b.toString('utf8') : '';
  if (!raw) {
    raw = await new Promise((resolve) => {
      let data = '';
      req.on('data', (c) => { data += c; if (data.length > 10000) req.destroy(); });
      req.on('end', () => resolve(data));
      req.on('error', () => resolve(''));
    });
  }
  try { return JSON.parse(raw || '{}'); } catch { return {}; }
}

function tooMany(ip) {
  const now = Date.now();
  const list = (recent.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  list.push(now);
  recent.set(ip, list);
  return list.length > MAX_PER_WINDOW;
}

const handler = async (req, res) => {
  const reply = (code, body) => {
    res.statusCode = code;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-store');
    res.end(JSON.stringify(body));
  };
  if (req.method !== 'POST') return reply(405, { ok: false });
  const origin = req.headers.origin || '';
  if (!ALLOWED_ORIGIN.test(origin)) return reply(403, { ok: false });

  const body = await readJson(req);
  if (body.website) return reply(200, { ok: true }); // honeypot field filled: a bot, pretend it worked
  const name = clean(body.name, 80);
  const phone = clean(body.phone, 30);
  const message = clean(body.message, 1000);
  const page = clean(body.page, 120).replace(/[^\w/.-]/g, '');
  if (name.length < 2 || !/^\+?[0-9 ()-]{7,20}$/.test(phone) || message.length < 2) return reply(400, { ok: false, reason: 'invalid' });
  if (!(Number(body.elapsed) >= 1500)) return reply(400, { ok: false, reason: 'too-fast' }); // filled in under 1.5 s: a bot

  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (tooMany(ip)) return reply(429, { ok: false, reason: 'slow-down' });

  const key = String(process.env.CALLMEBOT_APIKEY || '').trim();
  if (!key) return reply(503, { ok: false, reason: 'not-configured' });

  const text = `New message from your website (elliza-digital.vercel.app${page || '/'})\n\nName: ${name}\nWhatsApp: ${phone}\n\n${message}`;
  const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(PHONE)}&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(key)}`;
  try {
    const r = await fetch(url, { signal: AbortSignal.timeout(12000) });
    const out = await r.text();
    if (!r.ok || /invalid|error|wrong|not allowed|exceeded/i.test(out)) return reply(502, { ok: false, reason: 'send-failed' });
    return reply(200, { ok: true });
  } catch {
    return reply(502, { ok: false, reason: 'send-failed' });
  }
};

module.exports = handler;
module.exports.clean = clean; // exported for the self-check in the session scratchpad
