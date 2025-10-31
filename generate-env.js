const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, './src/environments/environment.ts');
const targetDevPath = path.join(__dirname, './src/environments/environment.development.ts');

const envConfig = `
export const environment = {
  production: true,
  apiUrl: '${process.env.API_URL}'
};
`;

const envDevConfig = `
export const environment = {
  production: false,
  apiUrl: '${process.env.API_URL}'
};
`;

fs.writeFileSync(targetPath, envConfig);
fs.writeFileSync(targetDevPath, envDevConfig);
