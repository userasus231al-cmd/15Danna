import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { defineConfig, Plugin } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function globalApiPlugin(): Plugin {
  return {
    name: 'global-api-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        
        // 1. UPLOAD MUSIC
        if (req.method === 'POST' && req.url === '/api/upload-music') {
          let body = '';
          req.on('data', (chunk) => { body += chunk; });
          req.on('end', () => {
            try {
              const { filename, base64, title } = JSON.parse(body);
              if (!base64) throw new Error('Falta base64');
              const ext = path.extname(filename || '') || '.mp3';
              const cleanName = 'custom-music' + ext;
              const musicDir = path.resolve(__dirname, 'public/music');
              if (!fs.existsSync(musicDir)) fs.mkdirSync(musicDir, { recursive: true });
              
              const targetPath = path.join(musicDir, cleanName);
              const base64Data = base64.replace(/^data:[^;]+;base64,/, '');
              fs.writeFileSync(targetPath, Buffer.from(base64Data, 'base64'));
              
              const configPath = path.resolve(__dirname, 'public/invitation-config.json');
              let existingData = {};
              if (fs.existsSync(configPath)) {
                existingData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
              }
              const configData = {
                ...existingData,
                selectedTrackId: 'custom',
                customTrackUrl: '/music/' + cleanName,
                customTrackTitle: title || 'Canción Personalizada',
                updatedAt: new Date().toISOString()
              };
              fs.writeFileSync(configPath, JSON.stringify(configData, null, 2));
              
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, url: '/music/' + cleanName, title: configData.customTrackTitle }));
            } catch (err: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        // 2. SAVE CONFIG (Music or Full)
        if (req.method === 'POST' && (req.url === '/api/save-music-selection' || req.url === '/api/save-invitation-config')) {
          let body = '';
          req.on('data', (chunk) => { body += chunk; });
          req.on('end', () => {
            try {
              const data = JSON.parse(body);
              const configPath = path.resolve(__dirname, 'public/invitation-config.json');
              let existingData = {};
              if (fs.existsSync(configPath)) {
                try { existingData = JSON.parse(fs.readFileSync(configPath, 'utf8')); } catch(e) {}
              }
              const configData = {
                ...existingData,
                ...data, // merge all fields provided
                updatedAt: new Date().toISOString()
              };
              fs.writeFileSync(configPath, JSON.stringify(configData, null, 2));
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, config: configData }));
            } catch (err: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        // 3. UPLOAD PHOTO
        if (req.method === 'POST' && req.url === '/api/upload-photo') {
          let body = '';
          // increase limit for large base64
          req.on('data', (chunk) => { body += chunk; });
          req.on('end', () => {
            try {
              const { filename, base64 } = JSON.parse(body);
              if (!base64) throw new Error('Falta base64');
              const ext = path.extname(filename || '') || '.jpg';
              const cleanName = 'photo-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5) + ext;
              const photoDir = path.resolve(__dirname, 'public/photos');
              if (!fs.existsSync(photoDir)) fs.mkdirSync(photoDir, { recursive: true });
              
              const targetPath = path.join(photoDir, cleanName);
              const base64Data = base64.replace(/^data:[^;]+;base64,/, '');
              fs.writeFileSync(targetPath, Buffer.from(base64Data, 'base64'));
              
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, url: '/photos/' + cleanName }));
            } catch (err: any) {
              console.error(err);
              res.statusCode = 500;
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
    plugins: [react(), tailwindcss(), globalApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
