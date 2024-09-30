const fs = require('fs');
const path = require('path');

// Path to watch.json
const watchJsonPath = path.join(__dirname, 'watch.json');

// Read and parse watch.json
const watchConfig = JSON.parse(fs.readFileSync(watchJsonPath, 'utf8'));

// Check if UPT_VER environment variable is true
if (process.env.UPT_VER === 'true') {
  watchConfig.restart.include = ["\\.js$", "\\.html$", "\\.css$"];
} else {
  watchConfig.restart.include = [];
}

// Write the updated config back to watch.json
fs.writeFileSync(watchJsonPath, JSON.stringify(watchConfig, null, 2), 'utf8');

console.log('watch.json updated based on UPT_VER');

// Exit the process to trigger a restart
process.exit();
