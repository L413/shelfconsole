// Import the required modules
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto'); // To generate secure random tokens
const http = require('http');
const WebSocket = require('ws'); // WebSocket library

// Create an instance of an Express application
const app = express();
const server = http.createServer(app); // Create an HTTP server with Express
const wss = new WebSocket.Server({ server }); // Create a WebSocket server

// Define a port number
const PORT = process.env.PORT || 3000;

// Middleware to serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // To handle JSON bodies

let validTokens = new Set(); // Set to keep track of valid tokens

// Function to get the latest version from package.json
function getVersion() {
  const packageJsonPath = path.join(__dirname, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  return packageJson.version;
}

// Endpoint to get the version number
app.get('/version', (req, res) => {
  const version = getVersion();
  res.json({ version });
});

// Route to serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Proxy route to bypass CORS
app.get('/shorten', async (req, res) => {
  const url = req.query.url;
  const apiUrl = `https://is.gd/create.php?format=simple&url=${encodeURIComponent(url)}`;

  try {
    const response = await fetch(apiUrl);
    const shortenedUrl = await response.text();
    res.send(shortenedUrl); // Send back the shortened URL
  } catch (error) {
    console.error('Error shortening the URL:', error);
    res.status(500).send('Error shortening the URL');
  }
});

// Route to fetch camera data
app.get('/cameras', async (req, res) => {
  try {
    const response = await fetch('https://webcams.nyctmc.org/api/cameras');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).send('Error fetching data');
  }
});

// Route to check the admin password and issue a token
app.post('/check-password', (req, res) => {
  const { password } = req.body;

  if (password === process.env.ADMIN_PASSWORD) {
    const token = crypto.randomBytes(64).toString('hex');
    validTokens.add(token);
    res.json({ message: 'Access granted', token });
  } else {
    res.status(401).json({ message: 'Access denied' });
  }
});

// Route to serve admin.js securely
app.get('/get-admin-script', (req, res) => {
  const token = req.headers['authorization'];

  if (validTokens.has(token)) {
    const adminScriptPath = path.join(__dirname, 'savedata/admin.js');
    res.sendFile(adminScriptPath);
  } else {
    res.status(403).send('Unauthorized');
  }
});

// Graceful shutdown function with reset capability
function gracefulShutdown(shutdownTime) {
  console.log('Received shutdown signal, closing server...');
  server.close(() => {
    console.log('Server closed');
    setTimeout(() => {
      process.env.NODE_ENV = 'live'; // Reset environment variable
      console.log('Server environment set to live');
    }, shutdownTime);
  });

  // Force shutdown after the same timeout if server doesn't close
  setTimeout(() => {
    console.error('Forcing server shutdown');
    process.exit(1);
  }, shutdownTime);
}

// Shutdown endpoint
app.post('/shutdown', (req, res) => {
  const token = req.headers['authorization'];
  const shutdownTime = parseInt(req.body.shutdownTime, 10) || 10000; // Default to 10 seconds if not provided

  if (validTokens.has(token)) {
    process.env.NODE_ENV = 'shutdown'; // Set environment variable
    res.send('Shutting down the server...');
    console.log('Shutdown initiated...');
    gracefulShutdown(shutdownTime);
  } else {
    res.status(403).send('Unauthorized');
  }
});

// Listen for termination signals
process.on('SIGTERM', () => gracefulShutdown(10000)); // Default shutdown time
process.on('SIGINT', () => gracefulShutdown(10000)); // Default shutdown time

const clients = []; // Store connected clients

app.get('/clients-num', (req, res) => {
  const r = clients.length
  res.json(r);
});

wss.on('connection', (ws) => {
  clients.push(ws); // Add new client to the array
  console.log('Client connected. Total: ' + clients.length);
  
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data); // Parse the incoming message

      // Check if the auth token from the message is valid
      if (validTokens.has(message.auth)) {
        // Broadcast the content to all clients
        clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(message.content); // Send only the content part
          }
        });
      } else {
        console.log('Invalid token in message; message not sent.');
        // Do not send any message to clients if the auth is invalid
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected. Total: ' + clients.length);
    // Remove the client from the array
    clients.splice(clients.indexOf(ws), 1);
  });
});

// Log file path
const logFilePath = path.join(__dirname, 'server.log');

// Function to append to the log file
function logToFile(message) {
  const logEntry = `${new Date().toISOString()} - ${message}\n`;
  fs.appendFileSync(logFilePath, logEntry);
}

// Override console.log to also log to the file
const originalConsoleLog = console.log;
console.log = (...args) => {
  originalConsoleLog(...args);  // Still log to the console
  logToFile(args.join(' '));    // Log to file
};

// Override console.error to also log to the file
const originalConsoleError = console.error;
console.error = (...args) => {
  originalConsoleError(...args);  // Still log to the console
  logToFile(`ERROR: ${args.join(' ')}`);  // Log to file
};

// Middleware to check the token
function verifyToken(req, res, next) {
  const token = req.query.token || req.headers['x-access-token'] || req.headers['authorization'];

  if (validTokens.has(token)) {
    next();  // Token is valid, proceed
  } else {
    res.status(403).send('Access denied: Invalid or missing token');
  }
}

// Route to serve log file contents (secured by token)
app.get('/logs', verifyToken, (req, res) => {
  try {
    const logs = fs.readFileSync(logFilePath, 'utf-8').split('\n');
    const numLogs = parseInt(req.query.n, 10) || logs.length; // Get 'n' from query, default to all logs
    const lastLogs = logs.slice(-numLogs); // Return only the last 'n' logs
    res.type('text/plain').send(lastLogs.join('\n'));
  } catch (error) {
    res.status(500).send('Error reading log file');
  }
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
