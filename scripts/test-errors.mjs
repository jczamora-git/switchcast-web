import https from 'node:https';

async function fetchRoute(path, method = 'GET', headers = {}) {
  return new Promise((resolve) => {
    const req = https.request({
      hostname: 'switchcast.wasmer.app',
      port: 443,
      path,
      method,
      headers: {
        'Host': 'switchcast.wasmer.app',
        'User-Agent': 'Mozilla/5.0',
        ...headers
      }
    }, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          statusMessage: res.statusMessage,
          headers: res.headers,
          body: data
        });
      });
    });
    req.on('error', (e) => resolve({ error: e.message }));
    req.end();
  });
}

async function main() {
  console.log('--- 404 Test ---');
  const res404 = await fetchRoute('/does-not-exist');
  console.log('Status:', res404.status, res404.statusMessage);
  console.log('Body:', res404.body);

  console.log('\n--- Malformed Host Header Test ---');
  const resBadHost = await fetchRoute('/', 'GET', { 'Host': 'switchcast.wasmer.app:443' });
  console.log('Status with :443 in Host:', resBadHost.status);

  console.log('\n--- HEAD Request Test ---');
  const resHead = await fetchRoute('/', 'HEAD');
  console.log('Status HEAD:', resHead.status);

  console.log('\n--- Wasmer Edge App Versions & Headers ---');
  const resRoot = await fetchRoute('/');
  console.log('Headers:', resRoot.headers);
}

main();
