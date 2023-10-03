document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('download-form');
    const downloadLinks = document.getElementById('download-links');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const tiktokUrl = document.getElementById('tiktok-url').value;

        // Clear previous download links and errors
        downloadLinks.innerHTML = '';

        // Validate TikTok URL before sending the request
        if (!isValidTikTokUrl(tiktokUrl)) {
            downloadLinks.innerHTML = '<p>Error: Invalid TikTok URL.</p>';
            return;
        }

        // Send the TikTok URL to the server for processing
        try {
            const response = await fetch('/download', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ tiktokUrl })
            });

            if (response.ok) {
                const data = await response.json();
                downloadLinks.innerHTML = `<p>Download Link: <a href="${data.downloadLink}" target="_blank">${data.downloadLink}</a></p>`;
            } else {
                downloadLinks.innerHTML = `<p>Error: ${response.statusText}</p>`;
            }
        } catch (error) {
            console.error('Error:', error);
            downloadLinks.innerHTML = '<p>Error: Failed to connect to the server.</p>';
        }
    });

    // Function to validate TikTok URL
    function isValidTikTokUrl(url) {
        // Add your URL validation logic here
        // You can use regular expressions or other methods to validate the URL
        // Example: return /^https:\/\/www\.tiktok\.com\/@.+\/video\/\d+/.test(url);
        return true; // Replace with your validation logic
    }
});

