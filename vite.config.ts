import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { defineConfig, Plugin } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function musicApiPlugin(): Plugin {
  return {
    name: 'music-api-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.method === 'POST' && req.url === '/api/upload-music') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const { filename, base64, title } = JSON.parse(body);
              if (!base64) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Falta base64' }));
                return;
              }
              const ext = path.extname(filename || '') || '.mp3';
              const cleanName = 'custom-music' + ext;
              const musicDir = path.resolve(__dirname, 'public/music');
              if (!fs.existsSync(musicDir)) {
                fs.mkdirSync(musicDir, { recursive: true });
              }
              const targetPath = path.join(musicDir, cleanName);

              const base64Data = base64.replace(/^data:[^;]+;base64,/, '');
              const buffer = Buffer.from(base64Data, 'base64');
              fs.writeFileSync(targetPath, buffer);

              const configPath = path.resolve(__dirname, 'public/invitation-config.json');
              const configData = {
                selectedTrackId: 'custom',
                customTrackUrl: '/music/' + cleanName,
                customTrackTitle: title || 'Canción Personalizada',
                updatedAt: new Date().toISOString()
              };
              fs.writeFileSync(configPath, JSON.stringify(configData, null, 2));

              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  success: true,
                  url: '/music/' + cleanName,
                  title: configData.customTrackTitle
                })
              );
            } catch (err: any) {
              console.error('Error al subir música:', err);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        if (req.method === 'POST' && req.url === '/api/save-music-selection') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const { trackId, customTrackUrl, customTrackTitle } = JSON.parse(body);
              const configPath = path.resolve(__dirname, 'public/invitation-config.json');
              const configData = {
                selectedTrackId: trackId,
                customTrackUrl: customTrackUrl || '',
                customTrackTitle: customTrackTitle || '',
                updatedAt: new Date().toISOString()
              };
              fs.writeFileSync(configPath, JSON.stringify(configData, null, 2));

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, config: configData }));
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        next();
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), musicApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
