const http = require('http');

const req = http.request(
  {
    hostname: 'localhost',
    port: 3000,
    path: '/chat',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  },
  (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    
    res.on('data', (chunk) => {
      console.log(`CHUNK ARRIVED [${new Date().toISOString()}]:`, chunk.toString());
    });
    
    res.on('end', () => {
      console.log('No more data in response.');
    });
  }
);

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.write(JSON.stringify({ message: 'Write a poem about the ocean.' }));
req.end();
