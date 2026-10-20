import https from 'node:https';
import http2 from 'node:http2';

const BASE_URL = 'https://switchcast.wasmer.app';
const ROUTES = [
  '/',
  '/index.html',
  '/releases/',
  '/robots.txt',
  '/og-switchcast.png'
];

const USER_AGENTS = {
  'Normal Browser': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
  'facebookexternalhit': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
  'meta-externalagent': 'meta-externalagent/1.1 (+https://developers.facebook.com/docs/sharing/webmasters/crawler)'
};

async function testHttp1(route, uaName, uaString, extraHeaders = {}) {
  const url = `${BASE_URL}${route}`;
  return new Promise((resolve) => {
    const parsed = new URL(url);
    const req = https.request({
      hostname: parsed.hostname,
      port: 443,
      path: parsed.pathname + parsed.search,
      method: 'GET',
      headers: {
        'User-Agent': uaString,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate',
        ...extraHeaders
      }
    }, (res) => {
      let chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        const bodyBuf = Buffer.concat(chunks);
        resolve({
          url,
          uaName,
          status: res.statusCode,
          statusMessage: res.statusMessage,
          headers: res.headers,
          bodyLength: bodyBuf.length,
          bodySnippet: bodyBuf.toString('utf8').slice(0, 300)
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        url,
        uaName,
        status: 'ERROR',
        error: err.message
      });
    });

    req.end();
  });
}

async function testHttp2(route, uaName, uaString, extraHeaders = {}) {
  const url = `${BASE_URL}${route}`;
  return new Promise((resolve) => {
    try {
      const client = http2.connect(BASE_URL);
      client.on('error', (err) => {
        resolve({
          protocol: 'h2',
          url,
          uaName,
          status: 'ERROR',
          error: err.message
        });
      });

      const req = client.request({
        ':method': 'GET',
        ':path': route,
        'user-agent': uaString,
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'accept-encoding': 'gzip, deflate',
        ...extraHeaders
      });

      let chunks = [];
      let headersReceived = {};
      let statusCode = 0;

      req.on('response', (headers) => {
        statusCode = headers[':status'];
        headersReceived = headers;
      });

      req.on('data', chunk => chunks.push(chunk));
      req.on('end', () => {
        const bodyBuf = Buffer.concat(chunks);
        client.close();
        resolve({
          protocol: 'h2',
          url,
          uaName,
          status: statusCode,
          headers: headersReceived,
          bodyLength: bodyBuf.length,
          bodySnippet: bodyBuf.toString('utf8').slice(0, 300)
        });
      });

      req.on('error', (err) => {
        client.close();
        resolve({
          protocol: 'h2',
          url,
          uaName,
          status: 'ERROR',
          error: err.message
        });
      });

      req.end();
    } catch (err) {
      resolve({
        protocol: 'h2',
        url,
        uaName,
        status: 'ERROR',
        error: err.message
      });
    }
  });
}

async function run() {
  console.log('=== TASK 1: HTTP/1.1 DIAGNOSTICS ===');
  for (const route of ROUTES) {
    console.log(`\n---------------- Route: ${route} ----------------`);
    for (const [uaName, ua] of Object.entries(USER_AGENTS)) {
      const res = await testHttp1(route, uaName, ua);
      console.log(`[${uaName}] Status: ${res.status} ${res.statusMessage || ''}`);
      console.log(`  Content-Type: ${res.headers?.['content-type']}`);
      console.log(`  Content-Length: ${res.headers?.['content-length']} (received: ${res.bodyLength} bytes)`);
      if (res.headers?.location) {
        console.log(`  Location: ${res.headers.location}`);
      }
      console.log(`  Edge App Version: ${res.headers?.['x-edge-app-version-id'] || 'none'}`);
      console.log(`  Server / Date: ${res.headers?.server || 'none'} / ${res.headers?.date}`);
    }
  }

  console.log('\n=== TASK 1: HTTP/2 DIAGNOSTICS ===');
  for (const route of ['/', '/og-switchcast.png']) {
    console.log(`\n---------------- H2 Route: ${route} ----------------`);
    for (const [uaName, ua] of Object.entries(USER_AGENTS)) {
      const res = await testHttp2(route, uaName, ua);
      console.log(`[H2 - ${uaName}] Status: ${res.status}`);
      console.log(`  Content-Type: ${res.headers?.['content-type']}`);
      console.log(`  Edge App Version: ${res.headers?.['x-edge-app-version-id'] || 'none'}`);
    }
  }

  console.log('\n=== TASK 1: META CRAWLER SPECIFIC HEADERS (RANGE / FBCLID / CIPHER) ===');
  // Range header test
  const rangeRes = await testHttp1('/', 'facebookexternalhit', USER_AGENTS['facebookexternalhit'], { 'Range': 'bytes=0-524288' });
  console.log(`[Range Header bytes=0-524288] Status: ${rangeRes.status} Content-Type: ${rangeRes.headers?.['content-type']}`);

  // fbclid query param test
  const fbclidRes = await testHttp1('/?fbclid=IwZXh0bgNhZW0CMTEAcGRvZgNzcnRjBmFwcF9pZAEw', 'facebookexternalhit', USER_AGENTS['facebookexternalhit']);
  console.log(`[fbclid query param] Status: ${fbclidRes.status} Content-Type: ${fbclidRes.headers?.['content-type']}`);
}

run();
