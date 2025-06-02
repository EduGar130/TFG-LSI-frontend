const fs = require('fs');
const path = './src/environments/environment.prod.ts';

const apiUrl = process.env.API_URL || 'http://localhost:8080/api';

const content = `
export const environment = {
  production: true,
  apiUrl: '${apiUrl}'
};
`;

fs.writeFileSync(path, content);
console.log(`[✔] environment.prod.ts generado con API_URL: ${apiUrl}`);
