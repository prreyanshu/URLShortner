import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Link } from '@mui/material';

function UrlShortener() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch(`http://localhost:3000/shorten`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });
    const data = await response.json();
    setShortUrl(data.fullCode);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          URL Shortener
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Enter a URL"
            variant="outlined"
            fullWidth
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" color="primary" type="submit" fullWidth>
            Shorten
          </Button>
        </form>
        {shortUrl && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6">Short URL:</Typography>
            <Link href={shortUrl} target="_blank" rel="noopener noreferrer">
              {shortUrl}
            </Link>
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default UrlShortener;
