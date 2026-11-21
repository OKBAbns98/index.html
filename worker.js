// English Arena: AI evaluation proxy for Cloudflare Workers.
// Your API key stays here on the server and is never sent to visitors.
// Required settings in Cloudflare:  ANTHROPIC_API_KEY (secret)  and  ALLOWED_ORIGIN (e.g. https://okbabns98.github.io)

const MODEL = 'claude-haiku-5-5';   // change to another Claude model if you want
const API_VERSION = '2023-06-01';   // if you get a version error, check the API docs for the current value
const MAX_PROMPT_CHARS = 6000;      // longest text accepted per request
const MAX_TOKENS = 700;             // longest reply, keeps costs predictable
const LIMIT_PER_MINUTE = 5;         // basic limit per visitor (resets if the Worker restarts)

const SYSTEM = 'You are an experienced IELTS examiner and coach. Give honest, specific and encouraging feedback on IELTS practice work and English learning only. If the text is unrelated to that, reply that you can only give feedback on IELTS practice. Write plain text with no markdown and keep the answer under 300 words.';

const hits = new Map();
const json = (o, s, h) => new Response(JSON.stringify(o), { status: s, headers: { ...h, 'Content-Type': 'application/json' } });

export default {
  async fetch(req, env) {
    const allowed = (env.ALLOWED_ORIGIN || '').split(',').map(s => s.trim()).filter(Boolean);
    const origin = req.headers.get('Origin') || '';
    const ok = allowed.includes(origin);
    const cors = {
      'Access-Control-Allow-Origin': ok ? origin : (allowed[0] || ''),
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Vary': 'Origin'
    };
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (req.method !== 'POST' || !ok) return json({ error: 'Not allowed' }, 403, cors);

    const ip = req.headers.get('CF-Connecting-IP') || 'unknown';
    const now = Date.now();
    const recent = (hits.get(ip) || []).filter(t => now - t < 60000);
    if (recent.length >= LIMIT_PER_MINUTE) return json({ error: 'Too many requests' }, 429, cors);
    recent.push(now); hits.set(ip, recent);
    if (hits.size > 5000) hits.clear();

    let body;
    try { body = await req.json(); } catch { return json({ error: 'Bad request' }, 400, cors); }
    const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';
    if (!prompt || prompt.length > MAX_PROMPT_CHARS) return json({ error: 'Text is empty or too long' }, 400, cors);

    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': env.ANTHROPIC_API_KEY, 'anthropic-version': API_VERSION, 'content-type': 'application/json' },
      body: JSON.stringify({ model: MODEL, max_tokens: MAX_TOKENS, system: SYSTEM, messages: [{ role: 'user', content: prompt }] })
    });
    if (!r.ok) return json({ error: 'The AI service is unavailable right now' }, r.status === 429 ? 429 : 502, cors);
    const d = await r.json();
    const text = (d.content || []).filter(b => b.type === 'text').map(b => b.text).join('');
    return json({ text }, 200, cors);
  }
};
