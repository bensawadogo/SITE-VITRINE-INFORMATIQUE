/* Sveltia CMS — Authentification GitHub (étape 1/2 : redirection vers GitHub)
   Endpoint Vercel : GET /api/auth?provider=github&scope=...
   Compatible avec le flux OAuth de Sveltia CMS (successeur de Decap/Netlify CMS). */
const crypto = require('crypto');

const ALLOWED_SCOPES = ['repo', 'public_repo', 'user', 'read:user', 'user:email'];

function getScope(requested) {
  const scopes = (requested || '')
    .split(/[\s,]+/)
    .filter(Boolean)
    .filter((s) => ALLOWED_SCOPES.includes(s));
  return scopes.length ? [...new Set(scopes)].join(',') : 'repo,user';
}

module.exports = async (req, res) => {
  const provider = req.query.provider || 'github';
  const scope = getScope(req.query.scope);
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return res.status(500).json({ error: 'GITHUB_CLIENT_ID non configuré — voir docs/INSTALLATION_ADMIN.md' });
  }

  // Jeton anti-CSRF conservé dans un cookie HttpOnly (format attendu par OAuth Decap/Sveltia)
  const random = Math.random().toString(36).slice(2);
  const hash = crypto.randomBytes(16).toString('hex');
  const csrf = `${random}_${hash}`;

  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const redirectUri = `${proto}://${host}/api/auth/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope,
    state: csrf,
    provider,
  });
  const url = `https://github.com/login/oauth/authorize?${params.toString()}`;

  res.setHeader('Set-Cookie', `csrf-token=${csrf}; Path=/; HttpOnly; SameSite=None; Secure; Max-Age=600`);
  res.redirect(302, url);
};