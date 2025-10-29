const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // optional, if serving frontend from backend

// Logging endpoint for recording claims
app.post('/log', (req, res) => {
    const { network, userAddress, txHash } = req.body;
    if(!network || !userAddress || !txHash){
        return res.status(400).json({success:false, error:'Missing fields'});
    }
    const logEntry = `${new Date().toISOString()} | ${network} | ${userAddress} | ${txHash}\n`;
    fs.appendFile('claims.log', logEntry, err => {
        if(err){
            console.error(err);
            return res.status(500).json({success:false, error:'Failed to log'});
        }
        res.json({success:true});
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
