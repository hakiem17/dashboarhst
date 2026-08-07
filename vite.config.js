import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Custom plugin to handle /api/chat → OpenAI proxy (keeps API key server-side)
function openaiProxyPlugin() {
  let apiKey = '';

  return {
    name: 'openai-proxy',
    configResolved(config) {
      // Load env in dev
      const env = loadEnv(config.mode, process.cwd(), '');
      apiKey = env.VITE_OPENAI_API_KEY || '';
    },
    configureServer(server) {
      server.middlewares.use('/api/chat', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        // Read request body
        let body = '';
        for await (const chunk of req) {
          body += chunk;
        }

        try {
          const { messages } = JSON.parse(body);

          const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model: 'gpt-4o-mini',
              messages,
              temperature: 0.7,
              max_tokens: 1024,
            }),
          });

          if (!openaiRes.ok) {
            const errText = await openaiRes.text();
            res.statusCode = openaiRes.status;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: `OpenAI API error: ${openaiRes.status}`, details: errText }));
            return;
          }

          const data = await openaiRes.json();
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
        } catch (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err.message }));
        }
      });
    },
  };
}

// Custom plugin to serve /api/dtsen-files, /api/dtsen-upload, and static dtsencsv files
function dtsenFilesPlugin() {
  return {
    name: 'dtsen-files-plugin',
    configureServer(server) {
      // List files in dtsencsv
      server.middlewares.use('/api/dtsen-files', async (req, res) => {
        try {
          const fs = await import('fs');
          const path = await import('path');
          const dtsenDir = path.join(process.cwd(), 'dtsencsv');

          if (!fs.existsSync(dtsenDir)) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ files: [] }));
            return;
          }

          const fileNames = fs.readdirSync(dtsenDir);
          const files = fileNames.map(name => {
            const filePath = path.join(dtsenDir, name);
            const stat = fs.statSync(filePath);
            return {
              name,
              sizeBytes: stat.size,
              mtime: stat.mtime,
              isCsv: name.endsWith('.csv')
            };
          });

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ files }));
        } catch (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err.message }));
        }
      });

      // Upload CSV file into dtsencsv
      server.middlewares.use('/api/dtsen-upload', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        let body = '';
        for await (const chunk of req) {
          body += chunk;
        }

        try {
          const fs = await import('fs');
          const path = await import('path');
          const { fileName, content } = JSON.parse(body);

          if (!fileName || !content) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Missing fileName or content' }));
            return;
          }

          const dtsenDir = path.join(process.cwd(), 'dtsencsv');
          if (!fs.existsSync(dtsenDir)) {
            fs.mkdirSync(dtsenDir, { recursive: true });
          }

          const safeFileName = path.basename(fileName);
          const targetPath = path.join(dtsenDir, safeFileName);
          fs.writeFileSync(targetPath, content, 'utf-8');

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true, fileName: safeFileName, bytesWritten: content.length }));
        } catch (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err.message }));
        }
      });

      // Serve raw /dtsencsv files for dev client fetching
      server.middlewares.use('/dtsencsv', async (req, res, next) => {
        try {
          const fs = await import('fs');
          const path = await import('path');
          const filePath = path.join(process.cwd(), 'dtsencsv', decodeURIComponent(req.url.replace(/^\//, '')));

          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            fs.createReadStream(filePath).pipe(res);
            return;
          }
        } catch (e) {
          // fall through
        }
        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), openaiProxyPlugin(), dtsenFilesPlugin()],
  server: {
    port: 3000,
    open: false
  }
});

