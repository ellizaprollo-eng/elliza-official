// Checks the samples password and sets the unlock cookie (owner's request, 2026-10-03).
// The password lives only in the Vercel project setting SAMPLES_PASSWORD, never in the code.
const crypto = require('crypto');

const SAFE_NEXT = /^\/(assets|projects|case-study|certifications|testimonials)\/[A-Za-z0-9/_.-]+$/;
const UNLOCK_PAGE = '/unlock';
const sha = (s) => crypto.createHash('sha256').update(String(s)).digest();

// Read the posted form whether or not the runtime already parsed it.
async function readForm(req) {
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
  return Object.fromEntries(new URLSearchParams(raw));
}

module.exports = async (req, res) => {
  const go = (location) => {
    res.statusCode = 303;
    res.setHeader('Location', location);
    res.setHeader('Cache-Control', 'no-store');
    res.end();
  };
  if (req.method !== 'POST') return go(UNLOCK_PAGE);

  const body = await readForm(req);
  const password = String(body.password || '').trim().slice(0, 200);
  const asked = String(body.next || '');
  const next = SAFE_NEXT.test(asked) && !asked.includes('..') ? asked : '/';
  const expected = (process.env.SAMPLES_PASSWORD || '').trim();

  const ok = expected.length > 0 && crypto.timingSafeEqual(sha(password), sha(expected));
  if (!ok) {
    await new Promise((r) => setTimeout(r, 800)); // slows down guessing
    return go(`${UNLOCK_PAGE}?wrong=1&next=${encodeURIComponent(next)}`);
  }
  const token = crypto.createHash('sha256').update('wovie-samples:' + expected).digest('hex');
  res.setHeader('Set-Cookie', `wp_unlock=${token}; Path=/; Max-Age=43200; HttpOnly; Secure; SameSite=Lax`);
  return go(next);
};
