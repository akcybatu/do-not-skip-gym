const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const server = http.createServer((req, res) => {
  // Serve the reset password HTML file
  if (req.url === '/' || req.url.startsWith('/#')) {
    const filePath = path.join(__dirname, 'reset-password.html');
    
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error loading page');
        return;
      }
      
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`Password reset server running at http://localhost:${PORT}`);
  console.log('✅ Supabase Site URL should be set to: http://localhost:3000');
  console.log('📱 Ready to handle password reset requests!');
});
