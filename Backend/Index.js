const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');   
const shortId = require('shortid');
const validUrl = require('valid-url');
const urlModel = require('./models/models');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connected successfully"))
    .catch(err => console.error("MongoDB connection error:", err));

app.use(cors()); // Enable CORS
app.use(express.json());

app.post('/shorten', async (req, res) => {
  const { url } = req.body;
  if (!validUrl.isUri(url)) {
    return res.status(401).json('Invalid URL');
  }
  const existingUrl = await urlModel.findOne({ originalUrl: url });
  if (existingUrl) {
    return res.json({
      ...existingUrl.toObject(),
      fullCode: `${req.protocol}://${req.get('host')}/${existingUrl.shortCode}`
    });
  }
  const shortCode = shortId.generate();
  const newUrl = new urlModel({ originalUrl: url, shortCode });
  const savedUrl = await newUrl.save();
  res.json({
    ...savedUrl.toObject(),
    fullCode: `${req.protocol}://${req.get('host')}/${savedUrl.shortCode}`
  });
});

app.get('/:shortCode', async (req, res) => {
  const shortCode = req.params.shortCode;
  const url = await urlModel.findOne({ shortCode });
  if (!url) {
    return res.status(404).json('No URL found');
  }
  res.redirect(url.originalUrl);
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
