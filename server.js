const https = require('https');
const fs = require('fs');
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const certPath = './.cert/cert.crt';
const keyPath = './.cert/cert.key';

const cert = fs.readFileSync(certPath);
const key = fs.readFileSync(keyPath);
const httpsOptions = { cert, key };

const app = next({ dev: process.env.NODE_ENV !== 'production' });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(3021, () => {
    console.log('> Ready on https://localhost:3021');
  });

  https.createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(3020, () => {
    console.log(`> Ready on ${process.env.NEXT_PUBLIC_NEXT_API_URL}`);
  });
});