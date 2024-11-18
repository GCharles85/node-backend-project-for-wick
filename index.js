const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const app = express();
const port = 4000;

/* -------- CORS Support -------- */
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

app.get('/fetch-rss', (req, res) => {
  const rssFeedUrl = 'https://www.womenshealthmag.com/rss/all.xml';
  const outputFile = 'rss_feed.xml';

  // Use wget to fetch the RSS feed
  exec(`/usr/bin/wget -O ${outputFile} ${rssFeedUrl}`, (error, stdout, stderr) => {
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
      console.log(data);
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

app.listen(port, '0.0.0.0',() => {
  console.log(`Server running on http://localhost:${port}`);
});
