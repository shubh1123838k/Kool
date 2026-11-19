import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { validateContactNote } from './src/utils/portfolioLogic.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

interface StoredNote {
  id: string;
  name: string;
  email: string;
  message: string;
  receivedAt: string;
}

const submittedNotes: StoredNote[] = [];

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '64kb' }));

  app.post('/api/contact', (req, res) => {
    const body = req.body ?? {};
    // Honeypot check: silently accept bots without storing
    if (typeof body.website === 'string' && body.website.trim().length > 0) {
      res.status(200).json({ ok: true });
      return;
    }

    const validation = validateContactNote({
      name: typeof body.name === 'string' ? body.name : '',
      email: typeof body.email === 'string' ? body.email : '',
      message: typeof body.message === 'string' ? body.message : '',
    });

    if (!validation.valid) {
      res.status(400).json({ error: validation.error });
      return;
    }

    const entry: StoredNote = {
      id: `note_${Date.now()}`,
      name: validation.cleaned.name,
      email: validation.cleaned.email,
      message: validation.cleaned.message,
      receivedAt: new Date().toISOString(),
    };
    submittedNotes.push(entry);

    res.status(200).json({
      ok: true,
      id: entry.id,
      receivedAt: entry.receivedAt,
    });
  });

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  if (process.env.NODE_ENV === 'production') {
    const distDir = path.resolve(__dirname, 'dist');
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
    app.use('*', async (req, res, next) => {
      try {
        const templatePath = path.resolve(__dirname, 'index.html');
        let template = fs.readFileSync(templatePath, 'utf-8');
        template = await vite.transformIndexHtml(req.originalUrl, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (err) {
        next(err);
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
