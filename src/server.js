const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

let balance = 50000;
let transactions = [{id:1, desc:"Initial Funding", amount:50000, type:"credit", date: new Date().toISOString()}];

app.get('/', (req,res)=>res.json({message:"Flex Bank API is LIVE", balance, endpoints:["/api/balance","/api/transactions","/api/transfer","/api/fund"]}));
app.get('/api/balance', (req,res)=>res.json({balance, accountNumber:"0123456789", bank:"Flex MFB"}));
app.get('/api/transactions', (req,res)=>res.json(transactions));
app.post('/api/transfer', (req,res)=>{
  const {to, amount}=req.body;
  if(!to || !amount) return res.status(400).json({error:"Missing to/amount"});
  if(amount>balance) return res.status(400).json({error:"Insufficient funds"});
  balance-=Number(amount);
  const tx={id:Date.now(), desc:`Transfer to ${to}`, amount:Number(amount), type:"debit", date:new Date().toISOString()};
  transactions.unshift(tx);
  res.json({message:`Sent ${amount} to ${to}`, balance, transaction:tx});
});
app.post('/api/fund', (req,res)=>{
  const {amount}=req.body;
  balance+=Number(amount);
  const tx={id:Date.now(), desc:"Wallet Funding", amount:Number(amount), type:"credit", date:new Date().toISOString()};
  transactions.unshift(tx);
  res.json({message:`Funded ${amount}`, balance});
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', ()=>console.log(`Flex Bank backend running on port ${PORT}`));