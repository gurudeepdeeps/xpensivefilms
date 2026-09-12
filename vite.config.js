import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import nodemailer from 'nodemailer'

// Pre-load .env into process.env so imported modules see credentials
const loadedEnv = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), '');
Object.assign(process.env, loadedEnv);

import portfolioHandler from './api/portfolio.js';
import commentsHandler from './api/comments.js';

function adaptHandler(handler) {
  return (req, res) => {
    const urlObj = new URL(req.url, `http://${req.headers.host}`);
    req.query = Object.fromEntries(urlObj.searchParams.entries());

    let bodyStr = '';
    req.on('data', chunk => { bodyStr += chunk.toString(); });
    req.on('end', async () => {
      try {
        req.body = bodyStr ? JSON.parse(bodyStr) : {};
      } catch {
        req.body = {};
      }

      res.status = (code) => {
        res.statusCode = code;
        return res;
      };
      res.json = (data) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));
        return res;
      };

      try {
        await handler(req, res);
      } catch (err) {
        console.error('Local API Handler Error:', err);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
  };
}

// Vite plugin to serve all /api/* endpoints in local dev mode
function localApiPlugin() {
  let env = {};
  return {
    name: 'local-api-plugin',
    configResolved(config) {
      env = loadEnv(config.mode, process.cwd(), '');
      Object.assign(process.env, env);
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url.startsWith('/api/portfolio')) {
          return adaptHandler(portfolioHandler)(req, res);
        }
        if (req.url.startsWith('/api/comments')) {
          return adaptHandler(commentsHandler)(req, res);
        }
        if (req.url === '/api/contact' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk.toString(); });
          req.on('end', async () => {
            try {
              const { name, email, message, type } = JSON.parse(body || '{}');

              const smtpHost = env.SMTP_HOST || process.env.SMTP_HOST || 'smtp.gmail.com';
              const smtpPort = parseInt(env.SMTP_PORT || process.env.SMTP_PORT || '465', 10);
              const smtpUser = env.SMTP_USER || process.env.SMTP_USER || 'xpensivefilms.co@gmail.com';
              const smtpPass = (env.SMTP_PASS || process.env.SMTP_PASS || '').replace(/\s+/g, '');

              const transporter = nodemailer.createTransport({
                host: smtpHost,
                port: smtpPort,
                secure: smtpPort === 465,
                auth: { user: smtpUser, pass: smtpPass }
              });

              const isNotify = type === 'maintenance_notify';
              const clientName = name || (isNotify ? 'Site Visitor' : 'Anonymous Client');

              const adminHtml = `
                <div style="background:#07080d; color:#fff; padding:30px; font-family:sans-serif;">
                  <h2 style="color:#a78bfa;">XPENSIVE FILMS - ${isNotify ? 'MAINTENANCE ALERT SUBSCRIPTION' : 'NEW PORTFOLIO INQUIRY'}</h2>
                  <p><strong>From:</strong> ${clientName} (&lt;${email}&gt;)</p>
                  <p><strong>Message:</strong></p>
                  <blockquote style="background:#131422; border-left:4px solid #a855f7; padding:15px; color:#e2e8f0;">
                    ${message || 'User requested to be notified when site maintenance completes.'}
                  </blockquote>
                </div>
              `;

              await transporter.sendMail({
                from: `"Xpensive Films System" <${smtpUser}>`,
                to: 'xpensivefilms.co@gmail.com',
                replyTo: email,
                subject: isNotify ? `🔔 Back-Online Notification Request from ${email}` : `🎬 New Message from ${clientName}`,
                html: adminHtml
              });

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, message: 'Mail delivered via Nodemailer SMTP' }));
            } catch (err) {
              console.error("Local Dev SMTP Error:", err);
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, message: err.message }));
            }
          });
        } else {
          next();
        }
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), localApiPlugin()],
  server: {
    host: true, // Exposes Network URL (e.g. http://192.168.1.X:5173) for mobile testing
    port: 5173,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1000,
  },
})
