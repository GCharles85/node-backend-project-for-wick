const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const app = express();
const port = 3000;

app.get('/fetch-rss', (req, res) => {
  const rssFeedUrl = 'https://www.womenshealthmag.com/rss/all.xml';
  const outputFile = 'rss_feed.xml';

  // Use wget to fetch the RSS feed
  exec(`wget -O ${outputFile} ${rssFeedUrl}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing wget: ${error}`);
      res.status(500).send('Error fetching RSS feed');
      return;
    }

    // Read the fetched file and send its contents
    fs.readFile(outputFile, 'utf8', (readError, data) => {
      if (readError) {
        console.error(`Error reading file: ${readError}`);
        res.status(500).send('Error reading RSS feed');
        return;
      }

      res.send(data);

      // Optionally delete the file after reading
      fs.unlink(outputFile, (unlinkError) => {
        if (unlinkError) {
          console.error(`Error deleting file: ${unlinkError}`);
        }
      });
    });
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
