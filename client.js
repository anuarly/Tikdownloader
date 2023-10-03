document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('download-form');
    const downloadLinks = document.getElementById('download-links');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const tiktokUrl = document.getElementById('tiktok-url').value;

        // Send the TikTok URL to the server for processing
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
    });
});
