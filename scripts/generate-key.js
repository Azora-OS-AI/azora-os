import { Web3 } from 'web3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const web3 = new Web3();

async function generatePrivateKey() {
  const account = web3.eth.accounts.create();
  console.log('New Private Key:', account.privateKey);
  console.log('New Address:', account.address);

  // Update .env
  const envPath = path.join(__dirname, '../.env');
  let envContent = fs.readFileSync(envPath, 'utf8');
  envContent = envContent.replace(/PRIVATE_KEY=.*/, `PRIVATE_KEY=${account.privateKey}`);
  envContent = envContent.replace(/CEO_ADDRESS=.*/, `CEO_ADDRESS=${account.address}`);
  fs.writeFileSync(envPath, envContent);

  console.log('.env updated with new private key and address.');
}

generatePrivateKey();