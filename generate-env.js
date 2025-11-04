const fs = require('fs');
const path = require('path');
require('dotenv').config();

const envDir = path.join(__dirname, './src/environments');
if (!fs.existsSync(envDir)) {
  fs.mkdirSync(envDir, { recursive: true });
}

const apiUrl = process.env.API_URL || 'http://localhost:8000';

const targetProdPath = path.join(envDir, 'environment.ts');
const targetDevPath = path.join(envDir, 'environment.development.ts');

const prodConfig = `export const environment = {
  production: true,
  API_URL: '${apiUrl}'
};`;

const devConfig = `export const environment = {
  production: false,
  API_URL: 'http://localhost:8000'
};`;

fs.writeFileSync(targetProdPath, prodConfig);
fs.writeFileSync(targetDevPath, devConfig);
