/* Sveltia CMS — Authentification GitHub (étape 2/2 : échange du code contre un jeton)
   Endpoint Vercel : GET /api/auth/callback?provider=github&code=...&state=...
   Retourne une page HTML qui postMessage le jeton à la fenêtre d'origine (Sveltia/Decap). */
function outputHTML(data) {
  let body;
  if (data.token && !data.error) {
    body = [
      'const data = ' + JSON.stringify({ token: data.token, provider: 'github' }).replace(/</g, '\\u003c') + ';',
      'window.opener.postMessage("authorization:github:success:" + JSON.stringify(data), "*");',
      'window.close();'
    ].join('\n');
  } else {
    body = [
      'const message = "authorization:github:error:" + ' + JSON.stringify(data.error || 'Erreur inconnue').replace(/</g, '\\u003c') + ';',
      'window.opener.postMessage(message, "*");',
      'window.close();'
    ].join('\n');
  }
  return '<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><title>Connexion…</title></head><body><script>' +
    body + '</' + 'script></body></html>';
}

module.exports = async (req, res) => {
  const provider = req.query.provider || 'github';
  const code = req.query.code;
  const state = req.query.state;

  // Vérification CSRF : le state doit correspondre au cookie posé à l'étape 1
  const cookie = req.headers.cookie || '';
  const match = cookie.match(/(?:^|;\s*)csrf-token=([^;]+)/);
  const csrf = match ? decodeURIComponent(match[1]) : null;
  if (!code || !state) {
    return res.status(400).send(outputHTML({ error: 'Code d’autorisation manquant. Veuillez réessayer.' }));
  }
  if (!csrf || state !== csrf) {
    return res.status(403).send(outputHTML({ error: 'Vérification de sécurité échouée. Veuillez reprendre la connexion.' }));
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return res.status(500).send(outputHTML({ error: 'Client OAuth non configuré — voir docs/INSTALLATION_ADMIN.md' }));
  }

  let response;
  try {
    response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, client_id: clientId, client_secret: clientSecret }),
    });
  } catch (e) {
    return res.status(502).send(outputHTML({ error: 'Impossible de joindre GitHub. Veuillez réessayer.' }));
  }

  let data;
  try {
    data = await response.json();
  } catch (e) {
    return res.status(502).send(outputHTML({ error: 'Réponse invalide de GitHub. Veuillez réessayer.' }));
  }

  if (!data.access_token) {
    return res.status(401).send(outputHTML({ error: data.error_description || data.error || 'Autorisation refusée par GitHub.' }));
  }

  res.send(outputHTML({ token: data.access_token, provider }));
};