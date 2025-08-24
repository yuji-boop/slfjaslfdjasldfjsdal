import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const { slug = [] } = req.query as { slug?: string | string[] };
  const method = req.method || 'GET';
  const payload = req.body || null;
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({ ok: true, method, slug, payload });
}


