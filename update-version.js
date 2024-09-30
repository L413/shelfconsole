const fs = require('fs');
const path = require('path');

// Check if UPT_VER environment variable is true
if (process.env.UPT_VER === 'true') {
  // Path to package.json
  const packageJsonPath = path.join(__dirname, 'package.json');

  // Read and parse package.json
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  // Split version and increment the patch number
  const [major, minor, patch] = packageJson.version.split('.').map(Number);
  const newVersion = `${major}.${minor}.${patch + 1}`;

  // Update the version in package.json
  packageJson.version = newVersion;

  // Write the updated version back to package.json
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');

  // Log the updated version to verify
  console.log(`Version updated to ${packageJson.version}`);
} else {
  console.log('Version update skipped. Set UPT_VER=true to update.');
}