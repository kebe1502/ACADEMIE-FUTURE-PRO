const BLOCKED_HOSTS = new Set(['localhost', '127.0.0.1', '0.0.0.0', '::1', '[::1]']);

function isPrivateOrBlockedHostname(hostname) {
  const lower = hostname.toLowerCase();
  if (BLOCKED_HOSTS.has(lower) || lower.endsWith('.local')) {
    return true;
  }
  if (/^10\./.test(lower) || /^192\.168\./.test(lower) || /^169\.254\./.test(lower)) {
    return true;
  }
  const match172 = lower.match(/^172\.(\d+)\./);
  if (match172) {
    const secondOctet = Number(match172[1]);
    if (secondOctet >= 16 && secondOctet <= 31) {
      return true;
    }
  }
  return false;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  try {
    const rawUrl = req.query?.url;
    const targetUrl = Array.isArray(rawUrl) ? rawUrl[0] : rawUrl;

    if (!targetUrl || typeof targetUrl !== 'string') {
      res.status(400).send('Missing url parameter');
      return;
    }

    const parsed = new URL(targetUrl);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      res.status(400).send('Invalid protocol');
      return;
    }

    if (isPrivateOrBlockedHostname(parsed.hostname)) {
      res.status(403).send('Forbidden host');
      return;
    }

    const upstreamRes = await fetch(parsed.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; VercelImageProxy/1.0)',
      },
    });

    if (!upstreamRes.ok) {
      res.status(upstreamRes.status).send('Upstream error');
      return;
    }

    const contentType = upstreamRes.headers.get('content-type') || 'image/jpeg';
    if (!contentType.toLowerCase().startsWith('image/')) {
      res.status(415).send('Unsupported media type');
      return;
    }

    const arrayBuffer = await upstreamRes.arrayBuffer();
    res.setHeader('Content-Type', contentType);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
    res.status(200).send(Buffer.from(arrayBuffer));
  } catch {
    res.status(502).send('Proxy image error');
  }
}
