import Web3 from 'web3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Blockchain setup
const web3 = new Web3(process.env.BLOCKCHAIN_RPC);
const azrAbi = JSON.parse(fs.readFileSync(path.join(__dirname, '../../artifacts/contracts/AZR.sol/AZR.json'))).abi;
const azrAddress = process.env.AZR_CONTRACT_ADDRESS;
const privateKey = process.env.BLOCKCHAIN_PRIVATE_KEY;
const ceoAddress = process.env.CEO_ADDRESS;
const lunoZarAddress = process.env.LUNO_ZAR_ADDRESS;
const paystackKey = process.env.PAYSTACK_SECRET_KEY;

// Email service setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const contract = new web3.eth.Contract(azrAbi, azrAddress);
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
web3.eth.accounts.wallet.add(account);

// Utility: Send email confirmation
async function sendWithdrawalEmail(to, amount, txHash, zarTxId) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject: 'Azora Founder Withdrawal Complete',
    text: `You have successfully withdrawn ${amount} AZR (TX: ${txHash}). ZAR sent: ${zarTxId}.`,
  };
  await transporter.sendMail(mailOptions);
  return true;
}

// Utility: Simulate conversion (update to use real exchange rate API for production)
function azrToZar(azrAmount) {
  // Example: 1 AZR = 10 ZAR (replace with real rate)
  return azrAmount * 10;
}

// Withdraw ZAR using Paystack
async function withdrawZarViaPaystack(zarAmount, bankAccount) {
  try {
    const res = await axios.post(
      'https://api.paystack.co/transfer',
      {
        source: 'balance',
        amount: zarAmount * 100, // Paystack expects kobo
        recipient: bankAccount,
        reason: 'Founder withdrawal from Azora',
      },
      {
        headers: {
          Authorization: `Bearer ${paystackKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return res.data.data.transfer_code || res.data.data.id;
  } catch (err) {
    throw new Error('Paystack withdrawal failed: ' + err.response?.data?.message || err.message);
  }
}

// Main founder withdrawal logic
export default async function founderWithdraw({ founderEmail, withdrawAmountAZR, bankAccount }) {
  // Step 1: Mint (or use) AZR for withdrawal
  try {
    const amountWei = web3.utils.toWei(withdrawAmountAZR.toString(), 'ether');
    const mintTx = contract.methods.mint(ceoAddress, amountWei);
    const mintGas = await mintTx.estimateGas({ from: ceoAddress });
    const mintData = mintTx.encodeABI();
    const mintTxObj = {
      to: azrAddress,
      data: mintData,
      gas: mintGas,
      from: ceoAddress,
    };
    const signedMintTx = await web3.eth.accounts.signTransaction(mintTxObj, privateKey);
    const mintReceipt = await web3.eth.sendSignedTransaction(signedMintTx.rawTransaction);
    
    // Step 2: Burn AZR to simulate withdrawal (optional; shows supply decrease)
    const burnTx = contract.methods.burn(amountWei);
    const burnGas = await burnTx.estimateGas({ from: ceoAddress });
    const burnData = burnTx.encodeABI();
    const burnTxObj = {
      to: azrAddress,
      data: burnData,
      gas: burnGas,
      from: ceoAddress,
    };
    const signedBurnTx = await web3.eth.accounts.signTransaction(burnTxObj, privateKey);
    const burnReceipt = await web3.eth.sendSignedTransaction(signedBurnTx.rawTransaction);

    // Step 3: Off-ramp (ZAR payout)
    const zarAmount = azrToZar(withdrawAmountAZR);
    const zarTxId = await withdrawZarViaPaystack(zarAmount, bankAccount);

    // Step 4: Send confirmation email
    await sendWithdrawalEmail(founderEmail, withdrawAmountAZR, mintReceipt.transactionHash, zarTxId);

    return {
      status: 'success',
      minted: withdrawAmountAZR,
      zarAmount,
      mintTx: mintReceipt.transactionHash,
      burnTx: burnReceipt.transactionHash,
      zarTxId,
    };
  } catch (err) {
    return { status: 'error', error: err.message };
  }
}

// Example usage (remove in production, call via API instead!)
// (async () => {
//   const result = await founderWithdraw({
//     founderEmail: 'sizwe.ngwenya@azora.world',
//     withdrawAmountAZR: 50000,
//     bankAccount: 'your_paystack_recipient_code'
//   });
//   console.log(result);
// })();