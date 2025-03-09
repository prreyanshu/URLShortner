const urlModel = require('../models/urlModel');

exports.shortenUrl = async (req, res) => {
  const { url } = req.body;
  if (!validUrl.isUri(url)) {
    return res.status(401).json('Invalid URL');
  }
  const existingUrl = await urlModel.findOne({ originalUrl: url });
  if (existingUrl) {
    return res.json(existingUrl);
  }
  const shortCode = shortId.generate();
  const newUrl = new urlModel({ originalUrl: url, shortCode });
  const savedUrl = await newUrl.save();
  res.json(savedUrl);
};

exports.redirectUrl = async (req, res) => {
  const shortCode = req.params.shortCode;
  const url = await urlModel.findOne({ shortCode });
  if (!url) {
    return res.status(404).json('No URL found');
  }
  res.redirect(url.originalUrl);
};
