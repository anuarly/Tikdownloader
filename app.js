const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

console.log('Starting the TikTok Downloader server...');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(bodyParser.json());

app.post('/download', async (req, res) => {
    try {
        const { tiktokUrl } = req.body;
        console.log('Received TikTok URL:', tiktokUrl);

        if (!tiktokUrl) {
            return res.status(400).json({ error: 'TikTok URL is required.' });
        }

        // Fetch the TikTok video page content
        const response = await axios.get(tiktokUrl);

        // Extract the video URL using regular expressions
        const videoUrlMatch = response.data.match(/"contentUrl":"(https:\/\/[^\"]+)"/);

        if (videoUrlMatch) {
            const videoUrl = videoUrlMatch[1];
            console.log('Download URL:', videoUrl);

            // Download the video using youtube-dl
            const output = await exec(`youtube-dl -o "downloads/%(title)s.%(ext)s" ${videoUrl}`);

            // Extract the download link from the output
            const downloadLink = output.match(/https:\/\/.*\..{3}/);

            if (downloadLink) {
                res.json({ downloadLink: downloadLink[0] });
            } else {
                res.status(500).json({ error: 'Failed to download TikTok video.' });
            }
        } else {
            res.status(500).json({ error: 'Failed to extract TikTok video URL.' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
