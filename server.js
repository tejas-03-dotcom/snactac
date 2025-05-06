const express = require('express');
const axios = require('axios');
const cors = require('cors');
const csv = require('csv-parser'); // To parse the sheet data
const stream = require('stream');

const app = express();
app.use(cors());

const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1I2IYkbevbWQS7AOJdmbLxBKNq7vKXjKlPWAKMR7RVqI/export?format=csv&gid=0';

app.get('/api/option-chain', async (req, res) => {
    try {
        const response = await axios.get(SHEET_CSV_URL, { responseType: 'stream' });

        const results = [];
        response.data
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                res.json(results);
            });
    } catch (error) {
        console.error('Error reading Google Sheet:', error);
        res.status(500).json({ error: 'Failed to read from Google Sheet' });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
