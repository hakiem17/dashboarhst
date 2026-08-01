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

export default defineConfig({
  plugins: [react(), openaiProxyPlugin()],
  server: {
    port: 3000,
    open: false
  }
});
