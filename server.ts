import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import net from 'node:net';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const isProduction = process.env.NODE_ENV === 'production';

function isPrivateOrBlockedHost(hostname: string): boolean {
  const lower = hostname.toLowerCase();
  if (
    lower === 'localhost' ||
    lower === 'ip6-localhost' ||
    lower.endsWith('.localhost') ||
    lower.endsWith('.local') ||
    lower.endsWith('.internal')
  ) {
    return true;
  }

  const ipVersion = net.isIP(lower);
  if (ipVersion === 4) {
    const parts = lower.split('.').map(Number);
    if (parts[0] === 10 || parts[0] === 127 || parts[0] === 0) return true;
    if (parts[0] === 169 && parts[1] === 254) return true;
    if (parts[0] === 192 && parts[1] === 168) return true;
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
  } else if (ipVersion === 6) {
    if (lower === '::1' || lower === '::' || lower.startsWith('fc') || lower.startsWith('fd') || lower.startsWith('fe80')) {
      return true;
    }
  }
  return false;
}

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#0*39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(Number(num)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .trim();
}

function extractMetaTag(html: string, keys: string[]): string {
  const metaMatches = html.match(/<meta\b[^>]*>/gi) || [];
  for (const tag of metaMatches) {
    const attrMap: Record<string, string> = {};
    const attrRegex = /([a-zA-Z0-9_:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g;
    let m: RegExpExecArray | null;
    while ((m = attrRegex.exec(tag)) !== null) {
      const k = m[1].toLowerCase();
      const v = m[2] ?? m[3] ?? m[4] ?? '';
      attrMap[k] = v;
    }
    const nameOrProp = (attrMap['property'] || attrMap['name'] || attrMap['itemprop'] || '').toLowerCase();
    if (nameOrProp && keys.includes(nameOrProp) && attrMap['content']) {
      return decodeHtmlEntities(attrMap['content']);
    }
  }
  return '';
}

function extractTitleTag(html: string): string {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m ? decodeHtmlEntities(m[1].replace(/\s+/g, ' ')) : '';
}

function resolveRemoteUrl(raw: string, baseUrl: string): string {
  if (!raw) return '';
  try {
    const resolved = new URL(raw, baseUrl);
    if (resolved.protocol === 'http:' || resolved.protocol === 'https:') {
      return resolved.href;
    }
  } catch {
    // ignore invalid url
  }
  return '';
}

function extractYoutubeVideoId(targetUrl: URL): string {
  const host = targetUrl.hostname.toLowerCase();
  let videoId = '';
  if (host === 'youtu.be') {
    videoId = targetUrl.pathname.slice(1).split('/')[0] || '';
  } else if (host === 'youtube.com' || host.endsWith('.youtube.com')) {
    const parts = targetUrl.pathname.split('/').filter(Boolean);
    if (parts[0] === 'shorts' || parts[0] === 'live' || parts[0] === 'embed' || parts[0] === 'v') {
      videoId = parts[1] || '';
    } else {
      videoId = targetUrl.searchParams.get('v') || '';
    }
  }
  return videoId && /^[a-zA-Z0-9_-]{6,20}$/.test(videoId) ? videoId : '';
}

function extractYoutubeFallback(targetUrl: URL): { imageUrl?: string; title?: string } | null {
  const videoId = extractYoutubeVideoId(targetUrl);
  if (!videoId) return null;
  return {
    imageUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    title: 'YouTube video',
  };
}

async function fetchYoutubeOembedPreview(rawUrl: string, targetUrl: URL, fallbackDomain: string) {
  const videoId = extractYoutubeVideoId(targetUrl);
  if (!videoId) return null;
  const fallbackImage = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  const canonicalWatchUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const cleanDomain = fallbackDomain === 'youtu.be' ? 'youtube.com' : fallbackDomain || 'youtube.com';

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5500);
  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(canonicalWatchUrl)}&format=json`;
    const resp = await fetch(oembedUrl, {
      method: 'GET',
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    if (resp.ok) {
      const data = (await resp.json()) as {
        title?: string;
        author_name?: string;
        thumbnail_url?: string;
      };
      return {
        url: rawUrl,
        domain: cleanDomain,
        title: (data.title || 'YouTube video').trim(),
        description: data.author_name ? `${data.author_name} · YouTube` : '',
        imageUrl: data.thumbnail_url || fallbackImage,
        embeddable: true,
      };
    }

    // oEmbed returned non-200 (401/403 = embedding disabled, 404 = unavailable/restricted)
    const oembedRestricted = resp.status === 401 || resp.status === 403;
    const watchResp = await fetch(canonicalWatchUrl, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'uz,ru;q=0.9,en;q=0.8',
      },
    });
    if (watchResp.ok) {
      const html = (await watchResp.text()).slice(0, 400_000);
      const rawTitle =
        extractMetaTag(html, ['og:title', 'twitter:title']) ||
        extractTitleTag(html).replace(/\s*-\s*YouTube$/i, '').trim() ||
        'YouTube video';
      const desc = extractMetaTag(html, ['og:description', 'twitter:description', 'description']);
      const rawImg = extractMetaTag(html, ['og:image', 'twitter:image']);
      const isPlayableMatch = html.match(/"isPlayableInEmbed"\s*:\s*(true|false)/i);
      const detectedEmbeddable = oembedRestricted
        ? false
        : isPlayableMatch
        ? isPlayableMatch[1].toLowerCase() === 'true'
        : false;
      return {
        url: rawUrl,
        domain: cleanDomain,
        title: rawTitle,
        description: desc,
        imageUrl: resolveRemoteUrl(rawImg, canonicalWatchUrl) || fallbackImage,
        embeddable: detectedEmbeddable,
      };
    }

    return {
      url: rawUrl,
      domain: cleanDomain,
      title: 'YouTube video',
      description: '',
      imageUrl: fallbackImage,
      embeddable: false,
    };
  } catch {
    // fallback below
  } finally {
    clearTimeout(timeout);
  }

  return {
    url: rawUrl,
    domain: cleanDomain,
    title: 'YouTube video',
    description: '',
    imageUrl: fallbackImage,
    embeddable: false,
  };
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Lightweight external link metadata parser (images are NEVER stored or cached on our server)
  app.get('/api/link-preview', async (req, res) => {
    const rawUrl = typeof req.query.url === 'string' ? req.query.url.trim() : '';
    if (!rawUrl) {
      res.status(400).json({ error: 'URL kiritilmadi' });
      return;
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(rawUrl);
    } catch {
      res.status(400).json({ error: "Noto'g'ri havola" });
      return;
    }

    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      res.status(400).json({ error: 'Faqat http/https havolalar qo‘llab-quvvatlanadi' });
      return;
    }

    if (isPrivateOrBlockedHost(parsedUrl.hostname)) {
      res.status(400).json({ error: 'Ushbu manzilga ruxsat yo‘q' });
      return;
    }

    const domain = parsedUrl.hostname.replace(/^www\./i, '');
    const ytPreview = await fetchYoutubeOembedPreview(parsedUrl.href, parsedUrl, domain);
    if (ytPreview) {
      res.json(ytPreview);
      return;
    }

    const directImagePattern = /\.(png|jpe?g|webp|gif|avif|svg)(\?.*)?$/i;
    if (directImagePattern.test(parsedUrl.pathname)) {
      res.json({
        url: parsedUrl.href,
        domain,
        title: decodeURIComponent(parsedUrl.pathname.split('/').pop() || domain),
        description: '',
        imageUrl: parsedUrl.href,
      });
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6500);

    try {
      const response = await fetch(parsedUrl.href, {
        method: 'GET',
        redirect: 'follow',
        signal: controller.signal,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (compatible; LinkPreviewBot/1.0; +https://example.com)',
          Accept: 'text/html,application/xhtml+xml,image/*;q=0.9,*/*;q=0.8',
          'Accept-Language': 'uz,ru;q=0.9,en;q=0.8',
        },
      });

      const finalUrlStr = response.url || parsedUrl.href;
      let finalUrl = parsedUrl;
      try {
        finalUrl = new URL(finalUrlStr);
      } catch {
        finalUrl = parsedUrl;
      }

      if (isPrivateOrBlockedHost(finalUrl.hostname)) {
        res.status(400).json({ error: 'Ushbu manzilga ruxsat yo‘q' });
        return;
      }

      const contentType = (response.headers.get('content-type') || '').toLowerCase();
      const finalDomain = finalUrl.hostname.replace(/^www\./i, '');

      // If the URL directly serves an image (even without file extension)
      if (contentType.startsWith('image/')) {
        res.json({
          url: parsedUrl.href,
          domain: finalDomain,
          title: finalDomain,
          description: '',
          imageUrl: finalUrl.href,
        });
        return;
      }

      if (!contentType.includes('text/html') && !contentType.includes('application/xhtml')) {
        const yt = extractYoutubeFallback(finalUrl);
        res.json({
          url: parsedUrl.href,
          domain: finalDomain,
          title: yt?.title || finalDomain,
          description: '',
          imageUrl: yt?.imageUrl || '',
        });
        return;
      }

      // Read up to ~400KB of HTML to extract OpenGraph / Twitter meta tags quickly
      const reader = response.body?.getReader();
      let html = '';
      if (reader) {
        const decoder = new TextDecoder('utf-8', { fatal: false });
        let bytesRead = 0;
        const maxBytes = 400_000;
        while (bytesRead < maxBytes) {
          const { done, value } = await reader.read();
          if (done || !value) break;
          bytesRead += value.byteLength;
          html += decoder.decode(value, { stream: true });
          if (/<\/head>/i.test(html)) break;
        }
        try {
          await reader.cancel();
        } catch {
          // ignore
        }
      } else {
        html = (await response.text()).slice(0, 400_000);
      }

      const ogTitle =
        extractMetaTag(html, ['og:title', 'twitter:title']) ||
        extractTitleTag(html) ||
        finalDomain;
      const ogDesc = extractMetaTag(html, ['og:description', 'twitter:description', 'description']);
      const rawImage = extractMetaTag(html, [
        'og:image:secure_url',
        'og:image',
        'twitter:image:src',
        'twitter:image',
        'image',
      ]);

      let imageUrl = resolveRemoteUrl(rawImage, finalUrl.href);
      if (!imageUrl) {
        const yt = extractYoutubeFallback(finalUrl);
        if (yt?.imageUrl) imageUrl = yt.imageUrl;
      }

      res.json({
        url: parsedUrl.href,
        domain: domain || finalDomain,
        title: ogTitle,
        description: ogDesc,
        imageUrl,
      });
    } catch {
      const yt = extractYoutubeFallback(parsedUrl);
      res.json({
        url: parsedUrl.href,
        domain,
        title: yt?.title || domain,
        description: '',
        imageUrl: yt?.imageUrl || '',
      });
    } finally {
      clearTimeout(timeout);
    }
  });

  if (isProduction) {
    const distDir = path.join(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
